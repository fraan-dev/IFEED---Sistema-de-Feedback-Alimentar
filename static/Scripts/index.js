

document.addEventListener('DOMContentLoaded', function () {

   
    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;

            const targetId = href.substring(hashIndex + 1);
            const target = document.getElementById(targetId);

            
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')
                    ? document.querySelector('.header').offsetHeight
                    : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    
    const animatedItems = document.querySelectorAll(
        '.card, .menu-item, .aviso-box'
    );

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