// lightbox.js

// 1. Selecciona todas las imágenes de la galería
const imgs = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');

// 2. Al hacer click en cualquiera
imgs.forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    lbImg.src = img.src;                // clona la src
    lightbox.classList.add('show');     // muestra el overlay
  });
});

// 3. Cerrar lightbox con click fuera de la imagen
lightbox.addEventListener('click', () => {
  lightbox.classList.remove('show');
});