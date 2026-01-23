document.addEventListener('DOMContentLoaded', () => {
    // === Mock Data Configuration ===
    const TEACHERS = ['Mr. John Smith', 'Dr. Sarah Miller', 'Ms. Elena Rose', 'Mr. Robert Fox'];
    const SUBJECTS = ['Mathematics', 'Physics', 'English Literature', 'History', 'Chemistry', 'Biology'];
    const GRADES = ['10 - B', '11 - A', '12 - C', '9 - A', '10 - A', '11 - B'];

    // Generate Mock Records
    function generateMockData(count) {
        const data = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - Math.floor(Math.random() * 30)); // Last 30 days

            const totalStudents = 35 + Math.floor(Math.random() * 10); // 35-45 students
            const absentees = Math.floor(Math.random() * 8); // 0-7 absentees
            const present = totalStudents - absentees;
            const percentage = ((present / totalStudents) * 100).toFixed(1);

            data.push({
                id: i + 1,
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                rawDate: date, // for sorting/filtering
                gradeSection: GRADES[Math.floor(Math.random() * GRADES.length)],
                subject: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
                teacher: TEACHERS[Math.floor(Math.random() * TEACHERS.length)],
                present: present,
                absent: absentees,
                percentage: parseFloat(percentage),
                actionUrl: '#'
            });
        }
        // Sort by date descending
        return data.sort((a, b) => b.rawDate - a.rawDate);
    }

    let allReports = generateMockData(240); // Generate 240 records
    let currentReports = [...allReports];

    // Pagination State
    const itemsPerPage = 5;
    let currentPage = 1;

    // DOM Elements
    const tableBody = document.getElementById('reportsTableBody');
    const startIdxSpan = document.getElementById('startIdx');
    const endIdxSpan = document.getElementById('endIdx');
    const totalRowsSpan = document.getElementById('totalRows');
    const paginationContainer = document.getElementById('pagination');

    // Filter Elements
    const gradeFilter = document.getElementById('gradeFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    const teacherFilter = document.getElementById('teacherFilter');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // === Rendering Functions ===

    function renderTable(page) {
        tableBody.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, currentReports.length);
        const pageData = currentReports.slice(start, end);

        if (pageData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">No records found matching filters.</td></tr>`;
            startIdxSpan.textContent = 0;
            endIdxSpan.textContent = 0;
            totalRowsSpan.textContent = 0;
            paginationContainer.innerHTML = '';
            return;
        }

        pageData.forEach(row => {
            // Determine progress bar color
            let progressColor = 'bg-teal-600'; // Default green/teal
            if (row.percentage < 75) progressColor = 'bg-red-500';
            else if (row.percentage < 85) progressColor = 'bg-yellow-400';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.gradeSection}</td>
                <td>${row.subject}</td>
                <td>
                    <div class="user-cell">
                        <span>${row.teacher}</span>
                    </div>
                </td>
                <td class="text-bold">${row.present}</td>
                <td class="text-red-600 text-bold">${row.absent}</td>
                <td>
                    <div class="attendance-progress-wrapper">
                        <div class="attendance-progress-bar">
                            <div class="attendance-fill ${progressColor}" style="width: ${row.percentage}%"></div>
                        </div>
                        <span class="text-bold" style="font-size: 0.9rem;">${row.percentage}%</span>
                    </div>
                </td>
                <td>
                    <button class="icon-btn-sm" title="View Details">
                        <i class="ph-bold ph-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Update Footer Info
        startIdxSpan.textContent = start + 1;
        endIdxSpan.textContent = end;
        totalRowsSpan.textContent = currentReports.length;

        renderPagination(page);
    }

    function renderPagination(currentPage) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(currentReports.length / itemsPerPage);

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="ph-bold ph-caret-left"></i>';
        prevBtn.disabled = currentPage === 1;
        if (currentPage === 1) prevBtn.style.opacity = '0.5';
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                renderTable(currentPage - 1);
                updateCurrentPage(currentPage - 1);
            }
        };
        paginationContainer.appendChild(prevBtn);

        // Page Numbers (Simple Logic: standard 1,2,3... or abbreviated for this demo)
        // For simplicity, let's show max 5 pages or logical set
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                renderTable(i);
                updateCurrentPage(i);
            };
            paginationContainer.appendChild(btn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<i class="ph-bold ph-caret-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        if (currentPage === totalPages) nextBtn.style.opacity = '0.5';
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                renderTable(currentPage + 1);
                updateCurrentPage(currentPage + 1);
            }
        };
        paginationContainer.appendChild(nextBtn);
    }

    function updateCurrentPage(page) {
        currentPage = page;
    }

    // === Filter Logic ===
    function applyFilters() {
        const gradeVal = gradeFilter.value;
        const subjectVal = subjectFilter.value;
        const teacherVal = teacherFilter.value;
        const startVal = startDateInput.value ? new Date(startDateInput.value) : null;
        const endVal = endDateInput.value ? new Date(endDateInput.value) : null;

        currentReports = allReports.filter(row => {
            let matchesGrade = gradeVal === '' || row.gradeSection.includes(gradeVal); // Simple includes for '10' matching '10 - B'
            let matchesSubject = subjectVal === '' || row.subject === subjectVal;
            let matchesTeacher = teacherVal === '' || row.teacher === teacherVal;

            let matchesDate = true;
            if (startVal && endVal) {
                matchesDate = row.rawDate >= startVal && row.rawDate <= endVal;
            } else if (startVal) {
                matchesDate = row.rawDate >= startVal;
            } else if (endVal) {
                matchesDate = row.rawDate <= endVal;
            }

            return matchesGrade && matchesSubject && matchesTeacher && matchesDate;
        });

        currentPage = 1;
        renderTable(currentPage);
    }

    // Event Listeners for Filters
    gradeFilter.addEventListener('change', applyFilters);
    subjectFilter.addEventListener('change', applyFilters);
    teacherFilter.addEventListener('change', applyFilters);
    startDateInput.addEventListener('change', applyFilters);
    endDateInput.addEventListener('change', applyFilters);

    // Initial Render
    renderTable(currentPage);

    // Mock Export functionality
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        alert('Exporting CSV... (This is a simplified mock action)');
    });

    // Set default date range inputs loosely (optional helper)
    // const today = new Date().toISOString().split('T')[0];
    // document.getElementById('endDate').value = today;
});
