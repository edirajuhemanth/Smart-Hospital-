document.addEventListener('DOMContentLoaded', function() {
    // Enable tooltips if bootstrap is loaded
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Simulate login/register toggle in auth card
    const toggleForms = document.querySelectorAll('.toggle-form');
    if (toggleForms.length > 0) {
        toggleForms.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('data-target');
                if (target === 'register') {
                    document.getElementById('login-form').classList.add('d-none');
                    document.getElementById('register-form').classList.remove('d-none');
                } else {
                    document.getElementById('register-form').classList.add('d-none');
                    document.getElementById('login-form').classList.remove('d-none');
                }
            });
        });
    }

    // Add loading animation to buttons
    const loginForm = document.getElementById('loginFormElement');
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('login-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            btn.disabled = true;
            
            setTimeout(() => {
                const userType = document.getElementById('login-role').value;
                if (userType === 'patient') window.location.href = 'patient-dashboard.html';
                else if (userType === 'doctor') window.location.href = 'doctor-dashboard.html';
                else window.location.href = 'admin-dashboard.html';
            }, 1500);
        });
    }
});
