const NAVBAR_FULL_SCROLL = 100;

// Navbar fading
setTimeout(() => {
  if (!document.body) return;
  const navbar = document.querySelector('.navbar') as HTMLElement;
  navbar.style.transition = '.5s background-color ease-in-out';
  document.body.addEventListener('scroll', () => {
    const scrollAmount = Math.max(0, document.body.scrollTop) + 20;
    const opacity = Math.min(scrollAmount, NAVBAR_FULL_SCROLL) / NAVBAR_FULL_SCROLL;
    navbar.style.backgroundColor = `rgba(0, 0, 0, ${opacity / 3})`
  });
}, 100);
