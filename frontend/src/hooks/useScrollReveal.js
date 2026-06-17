import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando cambia la ruta, React desmonta la página anterior y monta la nueva.
    // Los elementos [data-reveal] de la nueva página empiezan con opacity:0.
    // Necesitamos esperar a que React termine el render completo antes de observar.

    let observers = [];

    function revealAll() {
      // Limpiar observers anteriores
      observers.forEach(obs => obs.disconnect());
      observers = [];

      const els = document.querySelectorAll('[data-reveal]');

      // Resetear todos primero (por si venimos de la misma ruta)
      els.forEach(el => el.classList.remove('revealed'));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -20px 0px',
        }
      );

      observers.push(observer);

      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (alreadyVisible) {
          // Ya en viewport — revelar con transición suave
          requestAnimationFrame(() => {
            el.classList.add('revealed');
          });
        } else {
          observer.observe(el);
        }
      });
    }

    // Esperar a que React termine de renderizar la nueva página.
    // requestAnimationFrame asegura que el DOM esté pintado.
    // El setTimeout adicional cubre componentes que cargan con useEffect.
    const raf = requestAnimationFrame(() => {
      revealAll();

      // Segunda pasada para elementos que tardan más (fonts, imágenes lazy)
      const t2 = setTimeout(revealAll, 400);
      observers._t2 = t2;
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(observers._t2);
      observers.forEach(obs => obs.disconnect());
    };
  }, [pathname]); // ← corre cada vez que cambia la ruta
}
