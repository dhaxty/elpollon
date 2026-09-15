/**
 * EL POLLÓN - SCRIPT PRINCIPAL (Vanilla JavaScript)
 * Funcionalidad:
 * 1. Control del menú hamburguesa y navegación móvil (drawer + backdrop).
 * 2. Botón flotante 'Volver arriba' con detección de scroll.
 * 3. Actualización dinámica del año en el copyright del footer.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. CONTROL DEL MENÚ HAMBURGUESA Y DRAWER MÓVIL
  // =========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navDrawer = document.getElementById('nav-drawer');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  /**
   * Abre o cierra el menú móvil alternando las clases activas.
   */
  const toggleMenu = () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;

    hamburgerBtn.classList.toggle('is-active', newState);
    navDrawer.classList.toggle('is-open', newState);
    navBackdrop.classList.toggle('is-active', newState);
    hamburgerBtn.setAttribute('aria-expanded', String(newState));

    // Previene el scroll del fondo en dispositivos móviles cuando el menú está abierto
    document.body.style.overflow = newState ? 'hidden' : '';
  };

  /**
   * Cierra el menú móvil de forma explícita.
   */
  const closeMenu = () => {
    hamburgerBtn.classList.remove('is-active');
    navDrawer.classList.remove('is-open');
    navBackdrop.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Evento click en el botón hamburguesa
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  // Cierra al hacer click en el fondo oscuro (backdrop)
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Cierra al hacer click en cualquiera de los enlaces de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cierra al pulsar la tecla Escape (accesibilidad)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // =========================================================================
  // 2. BOTÓN FLOTANTE "VOLVER ARRIBA"
  // =========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  /**
   * Muestra u oculta el botón flotante según la posición de scroll vertical.
   */
  const handleScroll = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  // Escuchar el evento scroll de la ventana
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Desplazamiento suave al inicio al pulsar el botón
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 3. AÑO DINÁMICO EN EL COPYRIGHT DEL FOOTER
  // =========================================================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
