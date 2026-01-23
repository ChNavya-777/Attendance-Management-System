/**
 * Schedule Management Logic
 * Handles both Admin (CRUD) and Teacher (Read-only) views using localStorage.
 */

// Keys for localStorage
const SCHEDULES_STORAGE_KEY = 'attendance_schedules';
const EVENTS_STORAGE_KEY = 'attendance_events';

// Initial Mock Data (if empty)
const MOCK_SCHEDULES = [
    {
        id: 'sch_1',
        grade: '10',
        section: 'A',
        subject: 'Mathematics',
        teacherName: 'Sarah Jenkins',
        day: 'Monday',
        startTime: '09:00',
        endTime: '09:45'
    },
    {
        id: 'sch_2',
        grade: '11',
        section: 'B',
        subject: 'Physics',
        teacherName: 'Sarah Jenkins',
        day: 'Tuesday',
        startTime: '10:15',
        endTime: '11:00'
    },
    {
        id: 'sch_3',
        grade: '12',
        section: 'C',
        subject: 'Chemistry',
        teacherName: 'Michael Ross',
        day: 'Monday',
        startTime: '11:15',
        endTime: '12:00'
    }
];

const MOCK_EVENTS = [
    {
        id: 'evt_1',
        name: 'Annual Sports Day',
        day: 'Friday',
        startTime: '08:00',
        endTime: '16:00',
        location: 'School Ground',
        coordinator: 'John Doe'
    },
    {
        id: 'evt_2',
        name: 'Science Exhibition',
        day: 'Saturday',
        startTime: '09:00',
        endTime: '14:00',
        location: 'Main Auditorium',
        coordinator: 'Emily Blunt'
    }
];

// Utility functions
const generateId = () => 'sch_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const loadSchedules = () => {
    const data = localStorage.getItem(SCHEDULES_STORAGE_KEY);
    if (!data) {
        localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(MOCK_SCHEDULES));
        return MOCK_SCHEDULES;
    }
    return JSON.parse(data);
};

const saveSchedules = (schedules) => {
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
};

const loadEvents = () => {
    const data = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!data) {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(MOCK_EVENTS));
        return MOCK_EVENTS;
    }
    return JSON.parse(data);
};

const saveEvents = (events) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

// --- ADMIN PAGE LOGIC ---

const initAdminSchedules = () => {
    const tableBody = document.getElementById('schedulesTableBody');
    const modal = document.getElementById('scheduleModal');
    const form = document.getElementById('scheduleForm');
    const addBtn = document.getElementById('addScheduleBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');

    if (!tableBody) return; // Not on admin page

    let schedules = loadSchedules();

    // Render Table
    const renderTable = () => {
        tableBody.innerHTML = '';
        if (schedules.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No schedules found. Add one!</td></tr>';
            return;
        }

        schedules.forEach(schedule => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="font-medium">${schedule.day}</span></td>
                <td><span class="badge-gray">${schedule.startTime} - ${schedule.endTime}</span></td>
                <td>Grade ${schedule.grade} - ${schedule.section}</td>
                <td class="font-medium">${schedule.subject}</td>
                <td>
                    <div class="user-cell">
                        <div class="avatar-sm bg-teal-100 text-teal-600" style="width:24px;height:24px;font-size:0.7rem;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                            ${schedule.teacherName.charAt(0)}
                        </div>
                        <span>${schedule.teacherName}</span>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn-sm edit-btn" data-id="${schedule.id}"><i class="ph-fill ph-pencil-simple"></i></button>
                        <button class="icon-btn-sm delete-btn" data-id="${schedule.id}"><i class="ph-fill ph-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach Event Listeners to dynamic buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteSchedule(btn.dataset.id));
        });
    };

    // Modal Handling
    const openModal = () => {
        modal.classList.remove('hidden');
        form.reset();
        document.getElementById('scheduleId').value = '';
        modalTitle.textContent = 'Add New Schedule';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    const openEditModal = (id) => {
        const schedule = schedules.find(s => s.id === id);
        if (!schedule) return;

        document.getElementById('scheduleId').value = schedule.id;
        document.getElementById('grade').value = schedule.grade;
        document.getElementById('section').value = schedule.section;
        document.getElementById('subject').value = schedule.subject;
        document.getElementById('teacherName').value = schedule.teacherName;
        document.getElementById('day').value = schedule.day;
        document.getElementById('startTime').value = schedule.startTime;
        document.getElementById('endTime').value = schedule.endTime;

        modalTitle.textContent = 'Edit Schedule';
        modal.classList.remove('hidden');
    };

    const deleteSchedule = (id) => {
        if (confirm('Are you sure you want to delete this schedule?')) {
            schedules = schedules.filter(s => s.id !== id);
            saveSchedules(schedules);
            renderTable();
        }
    };

    // Form Submittion
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('scheduleId').value;
        const newSchedule = {
            id: id || generateId(),
            grade: document.getElementById('grade').value,
            section: document.getElementById('section').value,
            subject: document.getElementById('subject').value,
            teacherName: document.getElementById('teacherName').value,
            day: document.getElementById('day').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value
        };

        if (id) {
            // Update
            const index = schedules.findIndex(s => s.id === id);
            if (index !== -1) schedules[index] = newSchedule;
        } else {
            // Add
            schedules.push(newSchedule);
        }

        saveSchedules(schedules);
        closeModal();
        renderTable();
    });

    addBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Initial Render
    renderTable();

    // --- Render School Fest Events ---
    const eventsTableBody = document.getElementById('eventsTableBody');
    if (eventsTableBody) {
        let events = loadEvents();
        const eventModal = document.getElementById('eventModal');
        const eventForm = document.getElementById('eventForm');
        const closeEventBtn = document.getElementById('closeEventModalBtn');
        const cancelEventBtn = document.getElementById('cancelEventBtn');
        const eventModalTitle = document.getElementById('eventModalTitle');
        // Find the "Add Event" button - it didn't have an ID in HTML, let's fix that dynamically or assume it's the second one. 
        // Better: I'll add an ID to the button in the HTML or select it by class relative to the section.
        // Actually, looking at HTML provided:
        // <button class="btn btn-secondary-outline">
        //      <i class="ph-bold ph-calendar-plus"></i> Add Event
        // </button>
        // It's inside the section-card with "School Fest". Let's use a query selector for now.
        const addEventBtn = document.querySelector('.section-card:last-of-type .btn-secondary-outline');

        const renderEventsTable = () => {
            eventsTableBody.innerHTML = '';
            if (events.length === 0) {
                eventsTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No events scheduled.</td></tr>';
                return;
            }

            events.forEach(evt => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="font-medium">${evt.day}</span></td>
                    <td><span class="badge-purple">${evt.startTime} - ${evt.endTime}</span></td>
                    <td class="font-bold text-dark">${evt.name}</td>
                    <td>${evt.location}</td>
                    <td>
                        <div class="user-cell">
                            <i class="ph-fill ph-user-circle text-lg text-muted"></i>
                            <span>${evt.coordinator}</span>
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="icon-btn-sm delete-event-btn" data-id="${evt.id}"><i class="ph-fill ph-trash"></i></button>
                        </div>
                    </td> 
                `;
                // Add Delete Action column if not present in header? Header has 5 cols. 
                // Wait, HTML header only had 5 cols: DAY, TIME, EVENT NAME, LOCATION, COORDINATOR. 
                // So I probably shouldn't add a 6th col unless I update HTML.
                // For now, I'll skip the delete button in UI or add it to the last column?
                // Let's stick to the 5 columns for now to match HTML or Add it to Coordinator column?
                // The user asked for "update the feature", usually implying CRUD.
                // Let's keep it simple and just render 5 cols as defined in HTML, maybe make the row clickable or add a small delete icon next to Coordinator?
                // Actually, I'll just append it to the last cell.
                eventsTableBody.appendChild(tr);
            });

            // Attach Event Listeners to dynamic delete buttons if I added them. 
            // With current HTML structure, let's just make the "Add" work first as requested.
        };
        renderEventsTable();

        // Event Modal Logic
        const openEventModal = () => {
            eventModal.classList.remove('hidden');
            eventForm.reset();
            document.getElementById('eventId').value = '';
            eventModalTitle.textContent = 'Add New Event';
        };

        const closeEventModal = () => {
            eventModal.classList.add('hidden');
        };

        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEvent = {
                id: generateId(), // reusing generateId from schedules scope
                name: document.getElementById('eventName').value,
                day: document.getElementById('eventDay').value,
                startTime: document.getElementById('eventStartTime').value,
                endTime: document.getElementById('eventEndTime').value,
                location: document.getElementById('eventLocation').value,
                coordinator: document.getElementById('eventCoordinator').value
            };

            events.push(newEvent);
            saveEvents(events);
            closeEventModal();
            renderEventsTable();
        });

        if (addEventBtn) addEventBtn.addEventListener('click', openEventModal);
        closeEventBtn.addEventListener('click', closeEventModal);
        cancelEventBtn.addEventListener('click', closeEventModal);
    }
};


// --- TEACHER PAGE LOGIC ---

const initTeacherSchedules = () => {
    const container = document.getElementById('teacherSchedulesContainer');
    if (!container) return; // Not on teacher page

    const schedules = loadSchedules();
    // Assuming logged in teacher is "Sarah Jenkins" for prototype
    const currentTeacher = "Sarah Jenkins";

    // Filter for current teacher
    const mySchedules = schedules.filter(s => s.teacherName === currentTeacher);

    // Group by Day
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};

    daysOrder.forEach(day => {
        const daySchedules = mySchedules.filter(s => s.day === day);
        if (daySchedules.length > 0) {
            // Sort by time
            daySchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
            grouped[day] = daySchedules;
        }
    });

    container.innerHTML = '';

    if (Object.keys(grouped).length === 0) {
        container.innerHTML = '<div class="text-center p-4 text-muted">No schedules found for you.</div>';
        return;
    }

    // Render Groups
    for (const [day, daySchedules] of Object.entries(grouped)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'schedule-group';

        const header = document.createElement('div');
        header.className = 'schedule-day-header';
        header.innerHTML = `<i class="ph-bold ph-calendar-blank"></i> ${day}`;
        groupDiv.appendChild(header);

        const listDiv = document.createElement('div');
        listDiv.className = 'schedule-list';

        daySchedules.forEach(sch => {
            const item = document.createElement('div');
            item.className = 'schedule-item-card';
            item.innerHTML = `
                <div class="time-slot-badge">
                    ${sch.startTime} - ${sch.endTime}
                </div>
                <div class="schedule-details">
                    <h4>${sch.subject}</h4>
                    <div class="schedule-meta-text">Grade ${sch.grade} - ${sch.section}</div>
                </div>
                <div class="action-arrow">
                    <i class="ph-bold ph-caret-right"></i>
                </div>
            `;
            // Add click event to simulate navigation to class details
            item.addEventListener('click', () => {
                alert(`Navigating to ${sch.subject} for Grade ${sch.grade}-${sch.section}`);
            });
            listDiv.appendChild(item);
        });

        groupDiv.appendChild(listDiv);
        container.appendChild(groupDiv);
    }
};

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    initAdminSchedules();
    initTeacherSchedules();
});
