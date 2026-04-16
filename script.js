// Archivo JavaScript principal para 1.21 Café / Vintage Club
document.addEventListener('DOMContentLoaded', () => {
  console.log('1.21 Café / Vintage Club - El sitio ha cargado correctamente.');
  
  // Ejemplo básico de interactividad para la barra de búsqueda
  const searchBtn = document.querySelector('.search-wrap button');
  const searchInput = document.querySelector('.search-wrap input');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      if (searchInput.value.trim() !== '') {
        alert(`Buscando: ${searchInput.value}`);
      }
    });
  }

  // Lógica para contraer/expandir la barra de eventos
  const eventBanner = document.getElementById('eventBanner');
  const eventToggleBtn = document.getElementById('eventToggleBtn');

  if (eventBanner && eventToggleBtn) {
    eventToggleBtn.addEventListener('click', () => {
      eventBanner.classList.toggle('collapsed');
    });

    // Auto-collapse on first scroll
    const autoCollapseOnScroll = () => {
      eventBanner.classList.add('collapsed');
    };

    // Add the listener that runs only once
    window.addEventListener('scroll', autoCollapseOnScroll, { once: true });
  }

  // Lógica para cambiar entre modo claro y oscuro
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;

  if (themeToggleBtn) {
    // 1. Revisar si hay un tema guardado en localStorage
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
    }

    // 2. Añadir el evento al botón
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      // 3. Guardar la preferencia del usuario
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.carousel-container');
  if (!container) return;

  const track = container.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextButton = container.querySelector('.carousel-btn.next');
  const prevButton = container.querySelector('.carousel-btn.prev');

  if (slides.length === 0) return;

  // --- Lógica del carrusel infinito ---

  // 1. Preparar las tarjetas: Añadimos bordes SVG curvos para el efecto de dibujo
  slides.forEach(slide => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'card-svg-border');
    
    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect1.setAttribute('width', '100%');
    rect1.setAttribute('height', '100%');
    rect1.setAttribute('rx', '16'); // Esquinas curvas
    rect1.setAttribute('ry', '16');
    rect1.setAttribute('class', 'svg-rect-primary');
    
    const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect2.setAttribute('width', 'calc(100% - 8px)');
    rect2.setAttribute('height', 'calc(100% - 8px)');
    rect2.setAttribute('x', '4');
    rect2.setAttribute('y', '4');
    rect2.setAttribute('rx', '12'); // Curva interior proporcional
    rect2.setAttribute('ry', '12');
    rect2.setAttribute('class', 'svg-rect-secondary');
    
    svg.appendChild(rect1);
    svg.appendChild(rect2);
    slide.appendChild(svg);
  });

  // Clona los primeros y últimos elementos para crear el efecto de bucle
  const visibleSlides = Math.round(container.offsetWidth / slides[0].offsetWidth);
  slides.slice(-visibleSlides).reverse().forEach(slide => {
    track.prepend(slide.cloneNode(true));
  });
  slides.slice(0, visibleSlides).forEach(slide => {
    track.appendChild(slide.cloneNode(true));
  });

  let allSlides = Array.from(track.children);
  let currentIndex = visibleSlides;
  let slideWidth = slides[0].getBoundingClientRect().width;
  let isAnimating = false;
  
  const updatePosition = () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  };

  updatePosition(); // Posición inicial

  const moveCarousel = (direction) => {
    if (isAnimating) return;
    isAnimating = true;

    // Identificar qué tarjeta sale y cuál entra
    const outIndex = direction === 'next' ? currentIndex : currentIndex + visibleSlides - 1;
    const inIndex = direction === 'next' ? currentIndex + visibleSlides : currentIndex - 1;
    
    const outSlide = allSlides[outIndex];
    const inSlide = allSlides[inIndex];

    // 1. Ocultar instantáneamente la tarjeta que va a entrar (prepararla)
    if (inSlide) {
      inSlide.classList.add('card-hidden');
      inSlide.classList.remove('card-anim-in', 'card-anim-out');
    }

    // 2. Desvanecer y desdibujar la tarjeta que sale
    if (outSlide) {
      outSlide.classList.add('card-anim-out');
    }

    setTimeout(() => {
      // 3. Mover las 3 tarjetas restantes
      if (direction === 'next') currentIndex++;
      else currentIndex--;

      track.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      setTimeout(() => {
        // 4. Dibujar el nuevo contenedor y mostrar su imagen
        if (inSlide) {
          inSlide.classList.remove('card-hidden');
          inSlide.classList.add('card-anim-in');
        }

        setTimeout(() => {
          // 5. Limpiar clases y manejar el bucle infinito
          allSlides.forEach(s => {
            s.classList.remove('card-hidden', 'card-anim-out', 'card-anim-in');
          });

          if (currentIndex >= slides.length + visibleSlides) {
            currentIndex = visibleSlides;
            updatePosition();
          } else if (currentIndex <= 0) {
            currentIndex = slides.length;
            updatePosition();
          }

          isAnimating = false;
        }, 450); // Esperar a que se termine de dibujar

      }, 350); // Esperar a que termine el desplazamiento

    }, 200); // Esperar a que se desvanezca la tarjeta inicial
  };

  nextButton.addEventListener('click', () => moveCarousel('next'));
  prevButton.addEventListener('click', () => moveCarousel('prev'));

  // --- Auto-deslizamiento ---
  let autoSlide = setInterval(() => moveCarousel('next'), 5000); // Más tiempo para apreciar la animación

  container.addEventListener('mouseenter', () => clearInterval(autoSlide));
  container.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => moveCarousel('next'), 5000);
  });

  // --- Responsividad ---
  window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width;
    updatePosition();
  });

  // --- Interactividad de Granos de Café (Repelente al Ratón y a la Taza) ---
  const imgPanel = document.querySelector('.cafe-img-panel');
  if (imgPanel) {
    const numBeans = 75; // Muchos más granos de café
    const beansElements = [];
    const beansData = [];
    
    for (let i = 0; i < numBeans; i++) {
      const bean = document.createElement('div');
      bean.className = 'coffee-bean';
      
      // Posición aleatoria, como esparcidos en una mesa con un hueco central
      let x, y, valid;
      let attempts = 0;
      do {
        valid = true;
        // Rango ampliado (-10 a 110) para que algunos queden cortados por los bordes naturalmente
        x = -10 + Math.random() * 120; 
        y = -10 + Math.random() * 120; 
        
        let dx = x - 50;
        let dy = y - 50;
        let distFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        // Hueco en el centro (forma circular). 38% de radio cubre muy bien la taza
        if (distFromCenter < 38) { 
          valid = false;
        }
        
        // Evitar que se amontonen uno encima de otro
        if (valid) {
          for (let j = 0; j < beansData.length; j++) {
            let prev = beansData[j];
            let distToPrev = Math.sqrt(Math.pow(x - prev.x, 2) + Math.pow(y - prev.y, 2));
            if (distToPrev < 5.5) { // Distancia mínima de separación
              valid = false;
              break;
            }
          }
        }
        attempts++;
      } while (!valid && attempts < 300);
      
      const rot = Math.random() * 360;  // Rotación aleatoria
      const scale = 0.35 + Math.random() * 0.55; // Ligeramente más pequeños para que quepan más
      
      bean.style.left = `${x}%`;
      bean.style.top = `${y}%`;
      bean.style.transform = `rotate(${rot}deg) scale(${scale})`;
      
      // Guardamos el estado original
      beansData.push({ x: x, y: y, rot: rot, scale: scale });
      
      // Nuevo dibujo SVG con la clásica línea en "S" curva
      bean.innerHTML = `<svg viewBox="0 0 100 100" width="30" height="30">
        <g transform="rotate(-30 50 50)">
          <ellipse cx="50" cy="50" rx="35" ry="45" fill="var(--espresso)" />
          <path d="M 40 18 C 65 35, 35 65, 60 82" stroke="var(--warm-tan)" stroke-width="4" fill="none" stroke-linecap="round" />
        </g>
      </svg>`;
      
      imgPanel.appendChild(bean);
      beansElements.push(bean);
    }

    // Lógica para apartar los granos (ratón + taza central + entre sí)
    imgPanel.addEventListener('mousemove', (e) => {
      const rect = imgPanel.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Centro de la taza (para el campo de fuerza)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Matriz de fuerzas a aplicar
      const forces = beansElements.map(() => ({ pushX: 0, pushY: 0 }));
      
      for (let i = 0; i < beansElements.length; i++) {
        const bean = beansElements[i];
        const beanX = bean.offsetLeft + (bean.offsetWidth / 2);
        const beanY = bean.offsetTop + (bean.offsetHeight / 2);
        
        let fX = 0;
        let fY = 0;
        
        // 1. Repulsión del ratón
        const dx = beanX - mouseX;
        const dy = beanY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxMouseDist = 90;
        
        if (dist < maxMouseDist) {
          const pushForce = maxMouseDist - dist;
          const angle = Math.atan2(dy, dx);
          fX += Math.cos(angle) * pushForce;
          fY += Math.sin(angle) * pushForce;
        }
        
        // 2. Repulsión extrema del dibujo de la taza (Centro)
        const dxCup = beanX - centerX;
        const dyCup = beanY - centerY;
        const distCup = Math.sqrt(dxCup * dxCup + dyCup * dyCup);
        const maxCupDist = 230; // Borde intocable gigante que cubre toda la taza
        
        if (distCup < maxCupDist) {
          const pushForceCup = maxCupDist - distCup;
          const angleCup = Math.atan2(dyCup, dxCup);
          fX += Math.cos(angleCup) * pushForceCup * 2.5; // Fuerza multiplicada para evitar intrusión
          fY += Math.sin(angleCup) * pushForceCup * 2.5;
        }
        
        // 3. Repulsión entre granos de café
        for (let j = 0; j < beansElements.length; j++) {
          if (i === j) continue;
          const otherBean = beansElements[j];
          const oX = otherBean.offsetLeft + (otherBean.offsetWidth / 2);
          const oY = otherBean.offsetTop + (otherBean.offsetHeight / 2);
          
          const dxB = beanX - oX;
          const dyB = beanY - oY;
          const distB = Math.sqrt(dxB * dxB + dyB * dyB);
          
          if (distB < 45) { // Distancia mínima entre granos en pixeles
            const forceB = 45 - distB;
            const angleB = Math.atan2(dyB, dxB);
            fX += Math.cos(angleB) * forceB * 0.4; // Repulsión suave para evitar superposición
            fY += Math.sin(angleB) * forceB * 0.4;
          }
        }
        
        forces[i].pushX = fX;
        forces[i].pushY = fY;
      }
      
      // Aplicar las transformaciones resultantes
      for (let i = 0; i < beansElements.length; i++) {
        const bean = beansElements[i];
        const data = beansData[i];
        const force = forces[i];
        
        if (force.pushX !== 0 || force.pushY !== 0) {
          bean.style.transform = `translate(${force.pushX}px, ${force.pushY}px) rotate(${data.rot}deg) scale(${data.scale})`;
        } else {
          bean.style.transform = `translate(0px, 0px) rotate(${data.rot}deg) scale(${data.scale})`;
        }
      }
    });
    
    // Cuando el ratón sale, todos vuelven a su posición original
    imgPanel.addEventListener('mouseleave', () => {
      for (let i = 0; i < beansElements.length; i++) {
        const bean = beansElements[i];
        const data = beansData[i];
        bean.style.transform = `translate(0px, 0px) rotate(${data.rot}deg) scale(${data.scale})`;
      }
    });
  }
});