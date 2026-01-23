// Main script file
console.log("AttendancePro Loaded");

document.addEventListener('DOMContentLoaded', () => {
    // Handle Logout
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Optional: Clear any session/local storage if used
            // localStorage.removeItem('userToken'); 

            // Redirect to Landing Page
            window.location.href = 'index.html';
        });
    });
});
