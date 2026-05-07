document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const textElements = document.querySelectorAll('.split-text');
  
  textElements.forEach(el => {
    // Split the text into characters
    const splitText = new SplitType(el, { types: 'chars, words' });
    
    // The user's settings: from {opacity: 0, y: 40}, to {opacity: 1, y: 0}, duration: 1.25, stagger: 0.05 (50ms)
    gsap.from(splitText.chars, {
      opacity: 0,
      y: 40,
      duration: 1.25,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%", // Start animation when top of element hits 90% of viewport
        once: true
      },
      onComplete: () => {
        console.log('All letters have animated!');
      }
    });
  });
});
