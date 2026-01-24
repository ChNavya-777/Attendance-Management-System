document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const classGrid = document.getElementById('classGrid');
    const searchInput = document.getElementById('topSearchInput');
    const modal = document.getElementById('classModal');
    const form = document.getElementById('classForm');
    const modalTitle = document.getElementById('modalTitle');
    const addBtnTop = document.getElementById('addClassBtnTop');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // === State Management ===
    // Mock Data
    let classes = JSON.parse(localStorage.getItem('admin_classes')) || [
        {
            id: 'CLS-101',
            grade: '10',
            section: 'A',
            subject: 'Advanced Mathematics',
            teacher: 'Mr. John Smith',
            students: 42,
            image: 'https://images.unsplash.com/photo-1550592704-6c76fc985830?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'CLS-102',
            grade: '11',
            section: 'B',
            subject: 'Theoretical Physics',
            teacher: 'Dr. Sarah Miller',
            students: 38,
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'CLS-103',
            grade: '9',
            section: 'C',
            subject: 'World History',
            teacher: 'Ms. Elena Rose',
            students: 35,
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'CLS-104',
            grade: '12',
            section: 'A',
            subject: 'English Literature',
            teacher: 'Mr. Robert Fox',
            students: 40,
            image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        }
    ];

    const saveClasses = () => {
        localStorage.setItem('admin_classes', JSON.stringify(classes));
    };

    // Images for random assignment
    const CLASS_IMAGES = [
        'https://images.unsplash.com/photo-1550592704-6c76fc985830?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ];

    // === Render ===
    const renderClasses = (filterText = '') => {
        classGrid.innerHTML = '';

        const filtered = classes.filter(c =>
            c.subject.toLowerCase().includes(filterText.toLowerCase()) ||
            `Grade ${c.grade}`.toLowerCase().includes(filterText.toLowerCase()) ||
            c.teacher.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filtered.length === 0) {
            classGrid.innerHTML = `<div class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No classes found.</div>`;
            return;
        }

        filtered.forEach(cls => {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-header-image">
                    <img src="${cls.image}" alt="Class Image" class="class-img">
                    <div class="student-count-badge">${cls.students} Students</div>
                </div>
                <div class="class-info">
                    <h3>Grade ${cls.grade} - Section ${cls.section}</h3>
                    <div class="class-meta">
                        <i class="ph-fill ph-book-open-text"></i>
                        <span>${cls.subject}</span>
                    </div>
                    <div class="class-meta" style="margin-top: 0.5rem;">
                        <i class="ph-fill ph-user"></i>
                        <span>${cls.teacher}</span>
                    </div>
                </div>
                <div class="card-footer-actions">
                    <div class="icon-actions">
                        <button class="icon-btn-sm edit-btn" data-id="${cls.id}"><i class="ph-fill ph-pencil-simple"></i></button>
                        <button class="icon-btn-sm delete-btn" data-id="${cls.id}"><i class="ph-fill ph-trash"></i></button>
                    </div>
                    <button class="btn btn-sm-gray">View Details <i class="ph-bold ph-arrow-right"></i></button>
                </div>
            `;
            classGrid.appendChild(card);
        });

        // Attach Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this class?')) {
                    deleteClass(id);
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openModal('edit', id);
            });
        });
    };

    // === Actions ===
    const saveClassForm = (e) => {
        e.preventDefault();
        const id = document.getElementById('classId').value;
        const isEdit = !!id;

        const newData = {
            id: id || Date.now().toString(), // Simple ID gen
            grade: document.getElementById('classGrade').value,
            section: document.getElementById('classSection').value,
            subject: document.getElementById('className').value,
            teacher: document.getElementById('classTeacher').value,
            students: isEdit ? classes.find(c => c.id === id).students : 0,
            image: isEdit ? classes.find(c => c.id === id).image : CLASS_IMAGES[Math.floor(Math.random() * CLASS_IMAGES.length)]
        };

        if (isEdit) {
            const idx = classes.findIndex(c => c.id === id);
            if (idx !== -1) classes[idx] = newData;
        } else {
            classes.unshift(newData);
        }

        saveClasses();
        renderClasses(searchInput.value);
        closeModal();
    };

    const deleteClass = (id) => {
        classes = classes.filter(c => c.id !== id);
        saveClasses();
        renderClasses(searchInput.value);
    };

    // === Modal Logic ===
    const openModal = (mode, id = null) => {
        modal.classList.remove('hidden');
        if (mode === 'edit') {
            modalTitle.textContent = 'Edit Class';
            const cls = classes.find(c => c.id === id);
            if (cls) {
                document.getElementById('classId').value = cls.id;
                document.getElementById('classGrade').value = cls.grade;
                document.getElementById('classSection').value = cls.section;
                document.getElementById('className').value = cls.subject;
                document.getElementById('classTeacher').value = cls.teacher;
            }
        } else {
            modalTitle.textContent = 'Add New Class';
            form.reset();
            document.getElementById('classId').value = '';
        }
    };

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    // === Event Listeners ===
    searchInput.addEventListener('input', (e) => renderClasses(e.target.value));
    addBtnTop.addEventListener('click', () => openModal('add'));
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', saveClassForm);

    // Initial Render
    renderClasses();
});
