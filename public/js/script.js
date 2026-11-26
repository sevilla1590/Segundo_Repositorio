// Animación simple al cargar las tarjetas de servicios
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-servicio');
  cards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all .6s ease';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, i * 120);
  });
});