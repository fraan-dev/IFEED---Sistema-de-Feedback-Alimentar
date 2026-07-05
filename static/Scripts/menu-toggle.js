document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const header = document.querySelector('.header');
    const logoutModal = document.getElementById('logout-modal');

    function setMobileMenu(open) {
        if (!mobileMenu || !menuToggle) return;

        mobileMenu.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuToggle.innerHTML = open
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            setMobileMenu(!mobileMenu.classList.contains('open'));
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMobileMenu(false);
            });
        });
    }

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            userDropdown.classList.toggle('open');
        });

        document.addEventListener('click', function (event) {
            if (!userDropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
                userDropdown.classList.remove('open');
            }
        });
    }

    function handleHeaderScroll() {
        if (!header) return;
        header.classList.toggle('header-scrolled', window.scrollY > 10);
    }

    if (header) {
        handleHeaderScroll();
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    }

    window.addEventListener('resize', function () {
        if (window.innerWidth > 850) {
            setMobileMenu(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setMobileMenu(false);
            if (userDropdown) userDropdown.classList.remove('open');
        }
    });

    if (logoutModal) {
        const confirmBtn = document.getElementById('logout-confirm');
        const cancelBtn = document.getElementById('logout-cancel');
        let logoutUrl = null;

        function openLogoutModal(url) {
            logoutUrl = url;
            logoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeLogoutModal() {
            logoutModal.style.display = 'none';
            document.body.style.overflow = '';
        }

        document.querySelectorAll('a[href*="logout"], .logout-link').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                openLogoutModal(link.getAttribute('href'));
            });
        });

        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                window.location.href = logoutUrl || '/logout/';
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeLogoutModal);
        }

        logoutModal.addEventListener('click', function (event) {
            if (event.target === logoutModal) {
                closeLogoutModal();
            }
        });
    }
});
