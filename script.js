function toggleMenu() {
  try {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
      menu.classList.toggle("open");
      icon.classList.toggle("open");
    }
  } catch (error) {
    console.error('Error toggling menu:', error);
  }
}
