document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const tableBody = document.getElementById('studentsTableBody');
    const searchInput = document.getElementById('searchInput');

    // === State Management ===
    // Initialize with mock data if localStorage is empty
    let students = JSON.parse(localStorage.getItem('teacher_students')) || [
        { id: 'STU-101', name: 'Alice Miller', grade: '10-A', email: 'alice.m@school.edu' },
        { id: 'STU-102', name: 'Benjamin Johnson', grade: '10-A', email: 'ben.j@school.edu' },
        { id: 'STU-103', name: 'Catherine Hill', grade: '11-B', email: 'cathy.h@school.edu' },
        { id: 'STU-104', name: 'Daniel White', grade: '12-C', email: 'daniel.w@school.edu' },
        { id: 'STU-105', name: 'Emma Smith', grade: '10-A', email: 'emma.s@school.edu' }
    ];

    // Save to localStorage
    const saveStudents = () => {
        localStorage.setItem('teacher_students', JSON.stringify(students));
    };

    // === Render ===
    const renderStudents = (filterText = '') => {
        tableBody.innerHTML = '';

        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(filterText.toLowerCase()) ||
            s.id.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 2rem;">No students found.</td></tr>`;
            return;
        }

        filtered.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="font-mono text-sm">${student.id}</td>
                <td>
                    <div class="user-cell">
                        <div class="avatar-sm text-avatar bg-blue-100 text-blue-600">${getInitials(student.name)}</div>
                        <span class="font-medium">${student.name}</span>
                    </div>
                </td>
                <td><span class="badge-gray">${student.grade}</span></td>
                <td class="text-muted text-sm">${student.email}</td>
                <td>
                    <button class="icon-btn-sm text-red-600 delete-btn" data-id="${student.id}" title="Delete Student">
                        <i class="ph-bold ph-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Attach Delete Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this student?')) {
                    deleteStudent(id);
                }
            });
        });
    };

    // === Utilities ===
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // === Actions ===
    const deleteStudent = (id) => {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudents(searchInput.value);
    };

    // === Event Listeners ===
    searchInput.addEventListener('input', (e) => renderStudents(e.target.value));

    // Initial Render
    renderStudents();
});

