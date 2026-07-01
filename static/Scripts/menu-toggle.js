

document.addEventListener('DOMContentLoaded', function () {


    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function closeMobileMenu() {
        if (!mobileMenu || !menuToggle) return;
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    if (mobileMenu) {
        
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 150);
    });

    
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

   
    const header = document.querySelector('.header');

    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    if (header) {
        handleHeaderScroll();
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    }

   
    const logoutModal = document.getElementById('logout-modal');

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
            link.addEventListener('click', function (e) {
                e.preventDefault();
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

        
        logoutModal.addEventListener('click', function (e) {
            if (e.target === logoutModal) {
                closeLogoutModal();
            }
        });

        
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && logoutModal.style.display === 'flex') {
                closeLogoutModal();
            }
        });
    }
});