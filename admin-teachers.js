document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const tableBody = document.getElementById('teachersTableBody');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('teacherModal');
    const form = document.getElementById('teacherForm');
    const addBtn = document.getElementById('addTeacherBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');

    // Form Inputs
    const teacherIdInput = document.getElementById('teacherId');
    const teacherNameInput = document.getElementById('teacherName');
    const teacherSubjectInput = document.getElementById('teacherSubject');
    const teacherEmailInput = document.getElementById('teacherEmail');
    const teacherStatusInput = document.getElementById('teacherStatus');
    const editTeacherIdInput = document.getElementById('editTeacherId');

    // === State Management ===
    // Use 'teachers_data' as the key for admin management
    let teachers = JSON.parse(localStorage.getItem('teachers_data')) || [
        { id: 'EMP-101', name: 'Sarah Jenkins', subject: 'Mathematics', email: 'sarah.j@school.edu', status: 'Active' },
        { id: 'EMP-102', name: 'Michael Ross', subject: 'Physics', email: 'michael.r@school.edu', status: 'Active' },
        { id: 'EMP-103', name: 'Emily Blunt', subject: 'English Literature', email: 'emily.b@school.edu', status: 'On Leave' },
        { id: 'EMP-104', name: 'David Kim', subject: 'History', email: 'david.k@school.edu', status: 'Active' },
        { id: 'EMP-105', name: 'Rachel Green', subject: 'Biology', email: 'rachel.g@school.edu', status: 'Active' }
    ];

    // Save to localStorage
    const saveTeachers = () => {
        localStorage.setItem('teachers_data', JSON.stringify(teachers));
    };

    // === Render ===
    const renderTeachers = (filterText = '') => {
        tableBody.innerHTML = '';

        const filtered = teachers.filter(t =>
            t.name.toLowerCase().includes(filterText.toLowerCase()) ||
            t.id.toLowerCase().includes(filterText.toLowerCase()) ||
            t.subject.toLowerCase().includes(filterText.toLowerCase()) ||
            t.email.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No teachers found.</td></tr>`;
            return;
        }

        filtered.forEach(teacher => {
            const tr = document.createElement('tr');

            // Status Badge Logic
            let statusClass = 'text-teal-600 bg-teal-50';
            let statusDot = 'online';

            if (teacher.status === 'Inactive') {
                statusClass = 'text-red-500 bg-red-50';
                statusDot = 'offline';
            } else if (teacher.status === 'On Leave') {
                statusClass = 'text-yellow-600 bg-yellow-50';
                statusDot = 'away'; // we can style away similarly if needed
            }

            // Inline style for 'away' dot if not defined in CSS yet
            const dotStyle = teacher.status === 'On Leave' ? 'background-color: #fbbf24;' : '';

            tr.innerHTML = `
                <td class="font-mono text-sm">${teacher.id}</td>
                <td>
                    <div class="user-cell">
                        <div class="avatar-sm text-avatar bg-indigo-100 text-indigo-600">${getInitials(teacher.name)}</div>
                        <span class="font-medium">${teacher.name}</span>
                    </div>
                </td>
                <td><span class="badge-gray">${teacher.subject}</span></td>
                <td class="text-muted text-sm">${teacher.email}</td>
                <td>
                    <span class="badge ${statusClass}">
                        <span class="status-dot ${statusDot}" style="${dotStyle}"></span> ${teacher.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn-sm edit-btn" data-id="${teacher.id}" title="Edit Teacher">
                            <i class="ph-bold ph-pencil-simple"></i>
                        </button>
                        <button class="icon-btn-sm text-red-600 delete-btn" data-id="${teacher.id}" title="Delete Teacher">
                            <i class="ph-bold ph-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        attachEventListeners();
    };

    const attachEventListeners = () => {
        // Edit Listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openEditModal(id);
            });
        });

        // Delete Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this teacher?')) {
                    deleteTeacher(id);
                }
            });
        });
    };

    // === Utilities ===
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // === Actions ===
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const isEdit = editTeacherIdInput.value !== '';

        const teacherData = {
            id: teacherIdInput.value,
            name: teacherNameInput.value,
            subject: teacherSubjectInput.value,
            email: teacherEmailInput.value,
            status: teacherStatusInput.value
        };

        if (isEdit) {
            // Update existing
            const index = teachers.findIndex(t => t.id === editTeacherIdInput.value);
            if (index !== -1) {
                teachers[index] = teacherData;
            }
        } else {
            // Add new
            // Check for duplicate ID
            if (teachers.some(t => t.id === teacherData.id)) {
                alert('Employee ID already exists!');
                return;
            }
            teachers.unshift(teacherData);
        }

        saveTeachers();
        renderTeachers(searchInput.value);
        closeModal();
    };

    const deleteTeacher = (id) => {
        teachers = teachers.filter(t => t.id !== id);
        saveTeachers();
        renderTeachers(searchInput.value);
    };

    // === Modal Logic ===
    const openAddModal = () => {
        form.reset();
        editTeacherIdInput.value = '';
        teacherIdInput.removeAttribute('readonly'); // Allow editing ID for new
        modalTitle.textContent = 'Add New Teacher';
        saveBtn.textContent = 'Add Teacher';
        modal.classList.remove('hidden');
    };

    const openEditModal = (id) => {
        const teacher = teachers.find(t => t.id === id);
        if (!teacher) return;

        editTeacherIdInput.value = teacher.id;
        teacherIdInput.value = teacher.id;
        teacherIdInput.setAttribute('readonly', true); // Cannot change ID during edit
        teacherNameInput.value = teacher.name;
        teacherSubjectInput.value = teacher.subject;
        teacherEmailInput.value = teacher.email;
        teacherStatusInput.value = teacher.status || 'Active';

        modalTitle.textContent = 'Edit Teacher';
        saveBtn.textContent = 'Save Changes';
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // === Event Listeners ===
    searchInput.addEventListener('input', (e) => renderTeachers(e.target.value));
    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', handleFormSubmit);

    // Close modal on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Initial Render
    renderTeachers();
});
