document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const tableBody = document.getElementById('studentsTableBody');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const addBtn = document.getElementById('addStudentBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');

    // Form Inputs
    const studentIdInput = document.getElementById('studentId');
    const studentNameInput = document.getElementById('studentName');
    const studentGradeInput = document.getElementById('studentGrade');
    const studentEmailInput = document.getElementById('studentEmail');
    const studentStatusInput = document.getElementById('studentStatus');
    const editStudentIdInput = document.getElementById('editStudentId');

    // === State Management ===
    // Use 'students_data' as the key for admin management
    let students = JSON.parse(localStorage.getItem('students_data')) || [
        { id: 'STU-101', name: 'Alice Miller', grade: '10-A', email: 'alice.m@school.edu', status: 'Active' },
        { id: 'STU-102', name: 'Benjamin Johnson', grade: '10-A', email: 'ben.j@school.edu', status: 'Active' },
        { id: 'STU-103', name: 'Catherine Hill', grade: '11-B', email: 'cathy.h@school.edu', status: 'Inactive' },
        { id: 'STU-104', name: 'Daniel White', grade: '12-C', email: 'daniel.w@school.edu', status: 'Active' },
        { id: 'STU-105', name: 'Emma Smith', grade: '10-A', email: 'emma.s@school.edu', status: 'Active' }
    ];

    // Save to localStorage
    const saveStudents = () => {
        localStorage.setItem('students_data', JSON.stringify(students));
    };

    // === Render ===
    const renderStudents = (filterText = '') => {
        tableBody.innerHTML = '';

        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(filterText.toLowerCase()) ||
            s.id.toLowerCase().includes(filterText.toLowerCase()) ||
            s.email.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No students found.</td></tr>`;
            return;
        }

        filtered.forEach(student => {
            const tr = document.createElement('tr');

            // Status Badge Logic
            const statusClass = student.status === 'Active' ? 'text-teal-600 bg-teal-50' : 'text-red-500 bg-red-50';
            const statusDot = student.status === 'Active' ? 'online' : 'offline';

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
                    <span class="badge ${statusClass}">
                        <span class="status-dot ${statusDot}"></span> ${student.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn-sm edit-btn" data-id="${student.id}" title="Edit Student">
                            <i class="ph-bold ph-pencil-simple"></i>
                        </button>
                        <button class="icon-btn-sm text-red-600 delete-btn" data-id="${student.id}" title="Delete Student">
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
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const isEdit = editStudentIdInput.value !== '';

        const studentData = {
            id: studentIdInput.value,
            name: studentNameInput.value,
            grade: studentGradeInput.value,
            email: studentEmailInput.value,
            status: studentStatusInput.value
        };

        if (isEdit) {
            // Update existing
            const index = students.findIndex(s => s.id === editStudentIdInput.value);
            if (index !== -1) {
                students[index] = studentData;
            }
        } else {
            // Add new
            // Check for duplicate ID
            if (students.some(s => s.id === studentData.id)) {
                alert('Student ID already exists!');
                return;
            }
            students.unshift(studentData);
        }

        saveStudents();
        renderStudents(searchInput.value);
        closeModal();
    };

    const deleteStudent = (id) => {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudents(searchInput.value);
    };

    // === Modal Logic ===
    const openAddModal = () => {
        form.reset();
        editStudentIdInput.value = '';
        studentIdInput.removeAttribute('readonly'); // Allow editing ID for new
        modalTitle.textContent = 'Add New Student';
        saveBtn.textContent = 'Add Student';
        modal.classList.remove('hidden');
    };

    const openEditModal = (id) => {
        const student = students.find(s => s.id === id);
        if (!student) return;

        editStudentIdInput.value = student.id;
        studentIdInput.value = student.id;
        studentIdInput.setAttribute('readonly', true); // Cannot change ID during edit
        studentNameInput.value = student.name;
        studentGradeInput.value = student.grade;
        studentEmailInput.value = student.email;
        studentStatusInput.value = student.status || 'Active';

        modalTitle.textContent = 'Edit Student';
        saveBtn.textContent = 'Save Changes';
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // === Event Listeners ===
    searchInput.addEventListener('input', (e) => renderStudents(e.target.value));
    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', handleFormSubmit);

    // Close modal on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Initial Render
    renderStudents();
});
