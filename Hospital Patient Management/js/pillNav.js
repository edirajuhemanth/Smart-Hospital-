document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector('.pill-nav-container');
  if (!navContainer) return;

  const ease = 'power2.easeOut';
  
  // Elements
  const pills = document.querySelectorAll('.pill');
  const logo = document.querySelector('.pill-logo');
  const logoIcon = logo ? logo.querySelector('i') : null;
  const hamburger = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu-popover');
  const navItems = document.querySelector('.pill-nav-items');

  // Set CSS Variables dynamically based on user props
  const baseColor = '#000000';
  const pillColor = '#ffffff';
  const hoveredPillTextColor = '#ffffff';
  const pillTextColor = '#000000';

  const pillNav = document.querySelector('.pill-nav');
  if (pillNav) {
    pillNav.style.setProperty('--base', baseColor);
    pillNav.style.setProperty('--pill-bg', pillColor);
    pillNav.style.setProperty('--hover-text', hoveredPillTextColor);
    pillNav.style.setProperty('--pill-text', pillTextColor);
  }
  if (mobileMenu) {
    mobileMenu.style.setProperty('--base', baseColor);
    mobileMenu.style.setProperty('--pill-bg', pillColor);
    mobileMenu.style.setProperty('--hover-text', hoveredPillTextColor);
    mobileMenu.style.setProperty('--pill-text', pillTextColor);
  }

  const tlMap = new Map();
  const activeTweens = new Map();

  const layout = () => {
    pills.forEach((pill) => {
      const circle = pill.querySelector('.hover-circle');
      if (!circle) return;

      const rect = pill.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector('.pill-label');
      const white = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      if (tlMap.has(pill)) {
        tlMap.get(pill).kill();
      }

      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
      }

      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
      }

      tlMap.set(pill, tl);
    });
  };

  layout();
  window.addEventListener('resize', layout);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layout);
  }

  // Hover Events for Pills
  pills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      const tl = tlMap.get(pill);
      if (!tl) return;
      if (activeTweens.has(pill)) activeTweens.get(pill).kill();
      activeTweens.set(pill, tl.tweenTo(tl.duration(), {
        duration: 0.3,
        ease,
        overwrite: 'auto'
      }));
    });

    pill.addEventListener('mouseleave', () => {
      const tl = tlMap.get(pill);
      if (!tl) return;
      if (activeTweens.has(pill)) activeTweens.get(pill).kill();
      activeTweens.set(pill, tl.tweenTo(0, {
        duration: 0.2,
        ease,
        overwrite: 'auto'
      }));
    });
  });

  // Logo Hover Event
  let logoTween = null;
  if (logo && logoIcon) {
    logo.addEventListener('mouseenter', () => {
      if (logoTween) logoTween.kill();
      gsap.set(logoIcon, { rotate: 0 });
      logoTween = gsap.to(logoIcon, {
        rotate: 360,
        duration: 0.3,
        ease,
        overwrite: 'auto'
      });
    });
  }

  // Initial Load Animation (Skip if preferred)
  // We'll leave it as false as per user request (initialLoadAnimation={false})

  // Mobile Menu Toggle
  let isMobileMenuOpen = false;
  if (mobileMenu) {
    gsap.set(mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      const lines = hamburger.querySelectorAll('.hamburger-line');

      if (isMobileMenuOpen) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
        
        gsap.set(mobileMenu, { visibility: 'visible' });
        gsap.fromTo(
          mobileMenu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
        
        gsap.to(mobileMenu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(mobileMenu, { visibility: 'hidden' });
          }
        });
      }
    });
  }
});
