document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const tableBody = document.getElementById('teachersTableBody');
    const searchInput = document.getElementById('searchInput');

    // === State Management ===
    // Use 'teachers_data' from localStorage (shared with Admin)
    let teachers = JSON.parse(localStorage.getItem('teachers_data')) || [
        { id: 'EMP-101', name: 'Sarah Jenkins', subject: 'Mathematics', email: 'sarah.j@school.edu', status: 'Active' },
        { id: 'EMP-102', name: 'Michael Ross', subject: 'Physics', email: 'michael.r@school.edu', status: 'Active' },
        { id: 'EMP-103', name: 'Emily Blunt', subject: 'English Literature', email: 'emily.b@school.edu', status: 'On Leave' },
        { id: 'EMP-104', name: 'David Kim', subject: 'History', email: 'david.k@school.edu', status: 'Active' },
        { id: 'EMP-105', name: 'Rachel Green', subject: 'Biology', email: 'rachel.g@school.edu', status: 'Active' }
    ];

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
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">No teachers found.</td></tr>`;
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
                statusDot = 'away';
            }

            const dotStyle = teacher.status === 'On Leave' ? 'background-color: #fbbf24;' : '';

            // Read-only view (no actions column)
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
            `;
            tableBody.appendChild(tr);
        });
    };

    // === Utilities ===
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // === Event Listeners ===
    if (searchInput) {
        searchInput.addEventListener('input', (e) => renderTeachers(e.target.value));
    }

    // Initial Render
    renderTeachers();
});
