const clickSound = new Audio('https://kyoprojects.github.io/korbach-conifgurator/370962__cabled_mess__click-01_minimal-ui-sounds.wav');
const clickSound2 = new Audio('https://kyoprojects.github.io/korbach-conifgurator/670810__outervo1d__tsa-2.wav');
console.log('startttt');

(async function () {
  Wized.requests.execute('get_wheels');
  Wized.requests.execute('get_renders');
  await Wized.requests.waitFor('get_wheels');
  console.log('wized request = ', Wized.data.r.get_wheels.data);
  await new Promise(resolve => gsap.delayedCall(1, resolve));

  window.updateAllLayers = function () {
    const clickedConfig = {
      car: Wized.data.v.carModel,
      carColor: Wized.data.v.carColor,
      wheel: Wized.data.v.wheelModel,
      wheelColor: Wized.data.v.wheelColor,
      view: Wized.data.v.view
    };
    console.log('Clicked Config:', clickedConfig);

    const data = Wized.data.r.get_renders.data;

    const wheelOverlay = data.find(item => item.model === Wized.data.v.carModel).renders.find(item => item.view === Wized.data.v.view && item.model === Wized.data.v.wheelModel && item.color === Wized.data.v.wheelColor)?.image;

    console.log('wheeloverlay = ', wheelOverlay);

    const carOverlay = data.find(item => item.model === Wized.data.v.carModel).renders.find(item => item.view === Wized.data.v.view && item.color === Wized.data.v.carColor && item.car_model === Wized.data.v.carModel && item.base === false)?.image;

    const baseImage = data.find(item => item.model === Wized.data.v.carModel).renders.find(item => item.view === Wized.data.v.view && item.base === true)?.image;

    const matchedImages = {
      wheelOverlay,
      carOverlay,
      baseImage
    };
    // console.log('Matched Images:', matchedImages);

    const wheelOverlayPreload = document.querySelector('[w-el="scenery-wheel-overlay-preload"]');
    const carOverlayPreload = document.querySelector('[w-el="scenery-car-overlay-preload"]');
    const sceneryPreload = document.querySelector('[w-el="scenery-preload"]');

    wheelOverlayPreload.src = wheelOverlay;
    carOverlayPreload.src = carOverlay;
    sceneryPreload.src = baseImage;

    let imagesLoaded = 0;

    function checkAllLoaded() {
      imagesLoaded++;
      if (imagesLoaded === 3) {
        setTimeout(() => {
          document.querySelector('.images-wrapper.preload').classList.add('show');

          // Update the regular images with the preloaded images
          document.querySelector('[w-el="scenery-wheel-overlay"]').src = wheelOverlayPreload.src;
          document.querySelector('[w-el="scenery-car-overlay"]').src = carOverlayPreload.src;
          document.querySelector('[w-el="scenery"]').src = sceneryPreload.src;

          document.querySelector('.images-wrapper.preload').classList.remove('show');
        }, 0);
      }
    }
    wheelOverlayPreload.onload = checkAllLoaded;
    carOverlayPreload.onload = checkAllLoaded;
    sceneryPreload.onload = checkAllLoaded;
  };

  // preload images
  function preloadImages(imageUrls) {
    return Promise.allSettled(
      imageUrls.map(url => {
        return new Promise(resolve => {
          if (!url) return resolve(); // Skip invalid or empty URLs

          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = () => {
            console.error('Error loading:', url);
            resolve(); // Resolve even on error to continue preloading
          };
        });
      })
    );
  }

  async function initConfigurator() {
    const data = Wized.data.r.get_renders.data;

    const imageUrls = data.flatMap(car => [car.thumbnail, ...(car.renders || []).map(render => render.image)]).filter(Boolean); // Remove undefined or null values

    // console.log('Image URLs:', imageUrls);

    await preloadImages(imageUrls);
    console.log('All images preloaded successfully!');
  }

  initConfigurator();

  window.updateAllLayers();

  // animations

  // magnetic images
  document.addEventListener('mousemove', e => {
    gsap.to('#images-wrapper', {
      x: e.clientX * 0.012,
      y: e.clientY * 0.012,
      ease: 'power4.out',
      duration: 16
    });
  });

  // entrance

  gsap.set('#images-wrapper', { scale: 1 });

  document.getElementById('search-pseudo').addEventListener('click', function () {
    let tl = gsap.timeline();

    tl.to('#search-modal', {
      opacity: 0,
      y: 160, // ✅ Remove quotes from numeric values
      duration: 0.2,
      scale: 0.6,
      ease: 'power3.out'
    })
      .to(
        '#start-screen',
        {
          autoAlpha: 0, // ✅ Handles both opacity & visibility correctly
          duration: 0.3, // ✅ Ensures it doesn't snap
          ease: 'power4.out'
        },
        '-=0.08'
      ) // ✅ Overlapping animation slightly to smooth out transition
      .add(() => {
        startConfig(); // ✅ Runs after animation completes
      });
  });

  function startConfig() {
    const tl = gsap.timeline();

    gsap
      .timeline()
      .set('[control="bottom"]', { autoAlpha: 0, y: 40, scale: 0.9 })
      // .set('.nav-item', { autoAlpha: 0, y: 15 })

      .fromTo('[overlay="white"]', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'power2.out', onComplete: () => document.querySelector('[overlay="white"]').remove() })
      .to('#images-wrapper', { scale: 1.08, duration: 0.5, ease: 'expo.out' }, '<')
      .fromTo('[control="bottom"]', { autoAlpha: 0, y: 30, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .fromTo('.wheel-control-thumbnail', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 2, ease: 'expo.out', stagger: 0.04 }, '-=0.8');

    // apple dock hover animations
    const navItems = document.querySelectorAll('[nav-item]');
    console.log(navItems);

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        clickSound2.play();
      });
    });

    // Helper function to add/remove a class to a sibling at a given off-set
    const toggleSiblingClass = (items, index, offset, className, add) => {
      const sibling = items[index + offset];
      if (sibling) {
        sibling.classList.toggle(className, add);
      }
    };

    //

    // Event listeners to toggle classes on hover
    navItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hover'); // Add .hover to current item
        clickSound.play();

        // Toggle classes for siblings
        toggleSiblingClass(navItems, index, -1, 'sibling-close', true); // Previous sibling
        toggleSiblingClass(navItems, index, 1, 'sibling-close', true); // Next sibling
        toggleSiblingClass(navItems, index, -2, 'sibling-far', true); // Previous-previous sibling
        toggleSiblingClass(navItems, index, 2, 'sibling-far', true); // Next-next sibling
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('hover'); // Remove .hover from current item

        // Toggle classes for siblings
        toggleSiblingClass(navItems, index, -1, 'sibling-close', false); // Previous sibling
        toggleSiblingClass(navItems, index, 1, 'sibling-close', false); // Next sibling
        toggleSiblingClass(navItems, index, -2, 'sibling-far', false); // Previous-previous sibling
        toggleSiblingClass(navItems, index, 2, 'sibling-far', false); // Next-next sibling
      });
    });

    const modal = document.getElementById('search-modal');
    function openSearchModal() {
      console.log('Opening modal...');
      const modal = document.getElementById('search-modal');

      if (!modal) return;
      modal.style.display = 'flex'; // ✅ Ensure it's visible before animation

      gsap.fromTo(
        modal,
        { autoAlpha: 0, scale: 0.8, y: 50 }, // ✅ Start faded & slightly below
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.2, ease: 'power3.out' } // ✅ Smooth transition
      );
    }

    function closeSearchModal() {
      const modal = document.getElementById('search-modal');

      gsap.to(modal, {
        scale: 0.8,
        y: 50,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          modal.style.display = 'none'; // ✅ Hide only after animation completes
        }
      });
    }
    // Click event for the search trigger
    document.querySelector('[el="search-trigger"]').addEventListener('click', function () {
      openSearchModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape') {
        closeSearchModal();
      }
    });
  }
})();
