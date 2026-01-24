/**
 * Teacher Directory Logic (Read-Only)
 */

// Mock Data (Consistent with Admin Teachers)
const MOCK_TEACHERS = [
    {
        id: 'TCH-1001',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@school.edu',
        department: 'Mathematics',
        phone: '(555) 123-4567',
        avatarBg: '0D9488'
    },
    {
        id: 'TCH-1002',
        name: 'Michael Ross',
        email: 'michael.ross@school.edu',
        department: 'Science',
        phone: '(555) 234-5678',
        avatarBg: '4F46E5'
    },
    {
        id: 'TCH-1003',
        name: 'Emily Blunt',
        email: 'emily.blunt@school.edu',
        department: 'English',
        phone: '(555) 345-6789',
        avatarBg: 'DB2777'
    },
    {
        id: 'TCH-1004',
        name: 'David Kim',
        email: 'david.kim@school.edu',
        department: 'History',
        phone: '(555) 456-7890',
        avatarBg: 'EA580C'
    },
    {
        id: 'TCH-1005',
        name: 'Jessica Lee',
        email: 'jessica.lee@school.edu',
        department: 'Art',
        phone: '(555) 567-8901',
        avatarBg: '9333EA'
    }
];

const renderTeachersTable = (teachers) => {
    const tableBody = document.getElementById('teachersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (teachers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No teachers found.</td></tr>';
        return;
    }

    teachers.forEach(teacher => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="user-cell">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=${teacher.avatarBg || 'random'}&color=fff" alt="${teacher.name}">
                    <div>
                        <div class="font-medium">${teacher.name}</div>
                    </div>
                </div>
            </td>
            <td class="font-mono">${teacher.id}</td>
            <td><span class="badge-gray">${teacher.department}</span></td>
            <td><a href="mailto:${teacher.email}" class="text-primary hover:underline">${teacher.email}</a></td>
            <td>${teacher.phone}</td>
            <td>
                <div class="action-buttons">
                    <a href="mailto:${teacher.email}" class="icon-btn-sm" title="Send Email">
                        <i class="ph-fill ph-envelope-simple"></i>
                    </a>
                </div>
            </td>
        `;

        tableBody.appendChild(tr);
    });
};

/* --- Search Functionality --- */
const setupSearch = (teachers) => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = teachers.filter(t =>
            t.name.toLowerCase().includes(term) ||
            t.email.toLowerCase().includes(term) ||
            t.department.toLowerCase().includes(term)
        );
        renderTeachersTable(filtered);
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTeachersTable(MOCK_TEACHERS);
    setupSearch(MOCK_TEACHERS);
});
