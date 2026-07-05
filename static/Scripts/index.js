document.addEventListener('DOMContentLoaded', function () {
    function scrollToTarget(target, updateHash) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

        window.scrollTo({ top: top, behavior: 'smooth' });

        if (updateHash) {
            history.replaceState(null, '', '#' + target.id);
        }
    }

    document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            const url = new URL(link.getAttribute('href'), window.location.origin);

            if (url.pathname !== window.location.pathname || !url.hash) return;

            const target = document.querySelector(url.hash);
            if (!target) return;

            event.preventDefault();
            scrollToTarget(target, true);
        });
    });

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function () {
                scrollToTarget(target, false);
            }, 100);
        }
    }

    const animatedItems = document.querySelectorAll('.card, .menu-item, .aviso-box');

    if ('IntersectionObserver' in window && animatedItems.length) {
        animatedItems.forEach(function (item) {
            item.classList.add('reveal-init');
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedItems.forEach(function (item) {
            observer.observe(item);
        });
    }
});
