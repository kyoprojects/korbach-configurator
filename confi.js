let searchModalOpen = false;
let firstSearchModalInteraction = true;

// Define createHotspots in the global scope at the very top
window.createHotspots = function () {
  // Only create hotspots if we have closeups
  if (!Wized.data.v.closeUps || Wized.data.v.closeUps.length === 0) {
    // Remove any existing hotspots if no closeups exist
    const existingHotspots = document.querySelectorAll('.wheel-hotspot');
    existingHotspots.forEach(hotspot => hotspot.remove());
    return;
  }

  // Remove any existing hotspots
  const existingHotspots = document.querySelectorAll('.wheel-hotspot');
  existingHotspots.forEach(hotspot => hotspot.remove());

  // Create hotspot container
  const hotspotsContainer = document.createElement('div');
  hotspotsContainer.className = 'hotspots-container';

  // Create wheel hotspot
  const wheelHotspot = document.createElement('div');
  wheelHotspot.className = 'wheel-hotspot';
  wheelHotspot.innerHTML = `
    <div class="hotspot-pulse"></div>
    <div class="hotspot-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
    <div class="hotspot-label">View close-ups</div>
  `;

  // Add click handler
  wheelHotspot.addEventListener('click', () => {
    animateControlsOut();
    window.showCloseUpView();
  });

  hotspotsContainer.appendChild(wheelHotspot);
  document.querySelector('#images-wrapper').appendChild(hotspotsContainer);
};

(async function initializeData() {
  Wized.requests.execute('get_wheels');
  // Wized.requests.execute('get_renders');
  Wized.requests.execute('get_carcolors');
  await Wized.requests.waitFor('get_wheels');

  await new Promise(resolve => gsap.delayedCall(1, resolve));

  // Add function to update tooltips
  window.updateControlTooltips = function () {
    // Remove any existing tooltips
    document.querySelectorAll('.control-tooltip').forEach(tooltip => tooltip.remove());

    // Create tooltips
    const tooltips = [
      {
        step: 'car-model',
        label: 'car',
        value: Wized.data.v.carModel || 'Not selected'
      },
      {
        step: 'car-color',
        label: 'car color',
        value: Wized.data.v.carColor || 'Not selected'
      },
      {
        step: 'wheel-model',
        label: 'wheel model',
        value: Wized.data.v.wheelModel || 'Not selected'
      },
      {
        step: 'wheel-color',
        label: 'wheel color',
        value: Wized.data.v.wheelColor || 'Not selected'
      }
    ];

    tooltips.forEach(({ step, label, value }) => {
      const menuItem = document.querySelector(`[element="sidebar-item"][step="${step}"]`);
      if (!menuItem) return;

      const tooltip = document.createElement('div');
      tooltip.className = 'control-tooltip';

      const labelSpan = document.createElement('span');
      labelSpan.style.opacity = '0.5';
      labelSpan.textContent = label;

      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;

      tooltip.appendChild(labelSpan);
      tooltip.appendChild(valueSpan);

      menuItem.appendChild(tooltip);
    });
  };

  // Call updateControlTooltips initially
  updateControlTooltips();

  // Update tooltips when Wized data changes
  Wized.on('requestend', result => {
    if (result.name == 'get_renders') {
      updateControlTooltips();
    }
  });

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
            // console.error('Error loading:', url);
            resolve(); // Resolve even on error to continue preloading
          };
        });
      })
    );
  }

  async function lazyLoadImages() {
    // Start loading all other images in the background
    const data = Wized.data.r.get_renders.data;
    const allImageUrls = data.flatMap(car => [car.thumbnail, ...(car.renders || []).map(render => render.image)]).filter(Boolean);

    // Remove already loaded images from background loading
    const backgroundImages = allImageUrls.filter(url => !criticalImages.includes(url));

    // Load rest in background - don't await
    preloadImages(backgroundImages).then(() => {
      console.log('Background images loaded');
    });
  }

  window.initConfigurator = async function () {
    const carData = Wized.data.r.get_renders.data.find(item => item.model == Wized.data.v.carModel);

    // Set initial colors/models
    const newCarColor = carData.renders.find(render => render.model == null).color;
    Wized.data.v.carColor = newCarColor;
    const newWheelModel = carData.renders.find(render => render.model !== null).model;
    Wized.data.v.wheelModel = newWheelModel;

    // Get only the critical images we need right now
    const criticalImages = [
      // Current car render
      carData.renders.find(render => render.view === Wized.data.v.view && render.color === newCarColor && render.car_model === Wized.data.v.carModel)?.image,
      // Current wheel render
      carData.renders.find(render => render.view === Wized.data.v.view && render.model === newWheelModel)?.image
    ].filter(Boolean);

    // Preload only critical images
    await preloadImages(criticalImages);
    console.log('Critical images preloaded');

    lazyLoadImages();

    initDock();
  };

  window.updateAllLayers = async function (transitionType) {
    console.log('✅✅✅updateAllLayers');
    // const clickedConfig = {
    //   car: Wized.data.v.carModel,
    //   carColor: Wized.data.v.carColor,
    //   wheel: Wized.data.v.wheelModel,
    //   wheelColor: Wized.data.v.wheelColor,
    //   view: Wized.data.v.view
    // };
    // console.log('Clicked Config:', clickedConfig);

    console.log('🔥🔥🔥');
    window.initCloseUpSlider();

    const data = Wized.data.r.get_renders.data;

    const wheelOverlay = data
      .find(item => item.model === Wized.data.v.carModel)
      .renders.find(item => item.view === Wized.data.v.view && item.model === Wized.data.v.wheelModel && item.color === Wized.data.v.wheelColor)?.image;

    const carOverlay = data
      .find(item => item.model === Wized.data.v.carModel)
      .renders.find(item => item.view === Wized.data.v.view && item.color === Wized.data.v.carColor && item.car_model === Wized.data.v.carModel)?.image;

    // const baseImage = data.find(item => item.model === Wized.data.v.carModel).renders.find(item => item.view === Wized.data.v.view && item.base === true)?.image;

    const matchedImages = {
      wheelOverlay,
      carOverlay
    };
    console.log('Matched Images:', matchedImages);

    const wheelOverlayPreload = document.querySelector('[w-el="scenery-wheel-overlay-preload"]');
    const carOverlayPreload = document.querySelector('[w-el="scenery-car-overlay-preload"]');
    // const sceneryPreload = document.querySelector('[w-el="scenery-preload"]');

    wheelOverlayPreload.src = wheelOverlay;
    carOverlayPreload.src = carOverlay;
    // sceneryPreload.src = baseImage;

    // check if all images are loaded
    let imagesLoaded = 0;
    function checkAllLoaded() {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        document.querySelector('.images-wrapper.preload').classList.add('show');

        // Update the regular images with the preloaded images
        document.querySelector('[w-el="scenery-wheel-overlay"]').src = wheelOverlayPreload.src;
        document.querySelector('[w-el="scenery-car-overlay"]').src = carOverlayPreload.src;
        // document.querySelector('[w-el="scenery"]').src = sceneryPreload.src;

        document.querySelector('.images-wrapper.preload').classList.remove('show');
      }
    }
    wheelOverlayPreload.onload = checkAllLoaded;
    carOverlayPreload.onload = checkAllLoaded;
    // sceneryPreload.onload = checkAllLoaded;
    console.log('images loaded');

    return new Promise(resolve => {
      // animate images in and wait for it to finish
      console.log('reshow images');
      let tl = gsap.timeline({
        onComplete: function () {
          console.log('Animation complete, resolving promise');
          resolve();
        }
      });
      if (transitionType == 'view') {
        tl.to('[overlay="white"]', { autoAlpha: 0, opacity: 0, duration: 0.3, ease: 'power2.out' }).to('#images-wrapper', { scale: 1.08, duration: 0.3, ease: 'expo.out' }, '-=0.1');
      } else if (transitionType == 'car') {
        console.log('switch car');
        if (firstSearchModalInteraction == false) {
          setTimeout(() => {
            animateControlsIn();
          }, 100);
          tl.to('[overlay="white"]', { autoAlpha: 0, opacity: 0, duration: 0.3, ease: 'power2.out' }).to('#images-wrapper', { scale: 1.08, duration: 0.3, ease: 'expo.out' }, '-=0.1');
        }
      } else {
        resolve();
      }
    });
  };

  // we can remove this , only load after first click
  // window.updateAllLayers();
})();

(async function defineEnterFunctions() {
  gsap.set('#images-wrapper', { scale: 1 });

  window.hideStartScreen = function () {
    let tl = gsap.timeline();

    tl.to('#search-modal', {
      opacity: 0,
      y: 160,
      duration: 0.2,
      scale: 0.6,
      ease: 'power3.out'
    })
      .to(
        '#start-screen',
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power4.out'
        },
        '-=0.08'
      )
      .add(() => {
        startConfig().then(() => {
          resolve();
        });
      });
  };

  function startConfig() {
    const tl = gsap.timeline();

    gsap
      .timeline()
      .set('[control="bottom"]', { autoAlpha: 0, y: 40, scale: 0.9 })
      // .set('.nav-item', { autoAlpha: 0, y: 15 })

      .fromTo(
        '[overlay="white"]',
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            resolve();
            // document.querySelector('[overlay="white"]').remove();
          }
        }
      )
      .to('#images-wrapper', { scale: 1.08, duration: 0.5, ease: 'expo.out' }, '<')
      .fromTo('[control="bottom"]', { autoAlpha: 0, y: 30, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .fromTo('.wheel-control-thumbnail', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 2, ease: 'expo.out', stagger: 0.04 }, '-=0.8');

    //
  }
})();

(async function searchModals() {
  const modal = document.getElementById('search-modal');
  function openSearchModal() {
    console.log('Opening modal...');
    const modal = document.getElementById('search-modal');

    if (!modal) return;
    modal.style.display = 'flex';

    gsap.fromTo(modal, { autoAlpha: 0, scale: 0.8, y: 50 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.2, ease: 'power3.out' });

    searchModalOpen = true;
  }
  window.closeSearchModal = function () {
    const modal = document.getElementById('search-modal');

    gsap.to(modal, {
      scale: 0.8,
      y: 50,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        modal.style.display = 'none';
      }
    });
  };
  document.querySelector('[el="search-trigger"]').addEventListener('click', function () {
    openSearchModal();
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });
  document.addEventListener('click', function (e) {
    const isInsideModal = e.target.closest('#search-modal');
    const isTrigger = e.target.closest('[el="search-trigger"]');
    if (searchModalOpen && !isInsideModal && !isTrigger) {
      closeSearchModal();
    }
  });
})();

const clickSound = new Audio('https://kyoprojects.github.io/korbach-configurator/370962__cabled_mess__click-01_minimal-ui-sounds.wav');
const clickSound2 = new Audio('https://kyoprojects.github.io/korbach-configurator/670810__outervo1d__tsa-2.wav');

function appleDockNav() {
  const navItems = document.querySelectorAll('[nav-item]');

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
}

(async function handleSidebarSfx() {
  const navItems = document.querySelectorAll('[element="sidebar-item"]');

  navItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hovered');
      clickSound.play();
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovered');
    });
  });
})();

async function initDock() {
  await Wized.requests.waitFor('get_wheels');
  setTimeout(() => {
    appleDockNav();
  }, 200);
}

async function animateControlsOut() {
  console.log('🚀animateControlsOut');
  document.querySelectorAll('[control]').forEach(el => {
    // console.log('🚀el = ', el);
    const dir = el.getAttribute('control');
    const props = { duration: 0.3, autoAlpha: 0, scale: 0, ease: 'power2.in' };
    if (dir === 'left') props.x = '-100%';
    else if (dir === 'right') props.x = '100%';
    else if (dir === 'top') props.y = '-100%';
    else if (dir === 'bottom') props.y = '100%';
    gsap.to(el, props);
  });
}

async function animateControlsIn() {
  console.log('🚀animateControlsIn');
  document.querySelectorAll('[control]').forEach(el => {
    const dir = el.getAttribute('control');
    const props = { duration: 0.3, autoAlpha: 1, scale: 1, ease: 'power2.inOut' };
    if (dir === 'left' || dir === 'right') props.x = '0%';
    if (dir === 'top' || dir === 'bottom') props.y = '0%';
    gsap.to(el, props);
  });
}

(async function splineTransitions() {
  function showSplineAnimation() {
    gsap.set('#splineOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });
    gsap.set('#splineContainer', { display: 'flex', opacity: 0, autoAlpha: 0, y: '100%', scale: 0, width: '10%' });
    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }, '<')
      .to('#splineOverlay', { duration: 0.2, opacity: 1, autoAlpha: 1, ease: 'power2.expo' }, '<')
      .fromTo('#splineContainer', { y: '100%', scale: 0, autoAlpha: 0 }, { duration: 0.1, y: '0%', scale: 1, autoAlpha: 1, ease: 'power2.inOut' })
      .fromTo('#splineContainer', { width: '5%' }, { duration: 0.2, width: '100%', ease: 'power2.inOut' })
      .fromTo('#splineScene', { scale: 0.3, y: 200, autoAlpha: 0 }, { duration: 0.3, scale: 1, y: 0, autoAlpha: 1, ease: 'power4.out' }, '-=0.3');
  }

  function hideSplineAnimation() {
    let tl = gsap.timeline();
    tl.to('#splineScene', { duration: 0.2, scale: 0.5, y: 50, autoAlpha: 0, ease: 'power2.expo' })
      .to('#splineContainer', { duration: 0.5, y: '100%', scale: 0, autoAlpha: 0, ease: 'power2.inOut' }, '-=0.8')
      .to('#splineOverlay', {
        duration: 0.2,
        opacity: 0,
        autoAlpha: 0,
        ease: 'power2.expo',
        onComplete: () => {
          gsap.set('#splineOverlay', { display: 'none' });
          gsap.set('#splineContainer', { display: 'none' });
        }
      })
      .to('#images-wrapper', { scale: 1.08, duration: 0.2, ease: 'expo.out' }, '<');
  }

  document.querySelector('#opensplinemodal').addEventListener('click', () => {
    showSplineAnimation();
    animateControlsOut();
  });
  document.querySelector('#splinePseudo').addEventListener('click', () => {
    hideSplineAnimation();
    animateControlsIn();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hideSplineAnimation();
      animateControlsIn();
    }
  });
})();

(async function quoteFormTransitions() {
  function showQuoteForm() {
    gsap.set('#quoteOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });
    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }, '<')
      .to('#quoteOverlay', { duration: 0.2, opacity: 1, autoAlpha: 1, ease: 'power2.expo' }, '<')
      .call(() => window.initializeQuoteFormSlider());
  }

  function hideQuoteForm() {
    let tl = gsap.timeline();
    tl.to('#quoteOverlay', {
      duration: 0.2,
      opacity: 0,
      autoAlpha: 0,
      ease: 'power2.expo',
      onComplete: () => {
        gsap.set('#quoteOverlay', { display: 'none' });
        window.destroyQuoteFormSlider && window.destroyQuoteFormSlider();
      }
    }).to('#images-wrapper', { scale: 1.08, duration: 0.2, ease: 'expo.out' }, '<');
  }

  document.querySelector('#openQuoteForm').addEventListener('click', () => {
    showQuoteForm();
    animateControlsOut();
  });
  document.querySelector('#quotePseudo').addEventListener('click', () => {
    hideQuoteForm();
    animateControlsIn();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hideQuoteForm();
      animateControlsIn();
    }
  });
})();

document.addEventListener('mousemove', e => {
  // Calculate center point of window
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const offsetX = (e.clientX - centerX) * 0.012;
  const offsetY = (e.clientY - centerY) * 0.012;

  gsap.to('#images-wrapper', {
    x: offsetX,
    y: offsetY,
    ease: 'power4.out',
    duration: 16
  });
});

window.changeNavTabs = async function (transitionType) {
  if (transitionType === 'car') {
    // Start request immediately
    Wized.requests.execute('get_renders');
  }

  return new Promise(resolve => {
    if (transitionType == 'view' || transitionType == 'car') {
      let tl = gsap.timeline({
        onComplete: async function () {
          console.log('Resolve changeNavTabs done, now calling updateAllLayers');
          if (transitionType == 'car') {
            // Wized.requests.execute('get_renders');
            // Use Promise chaining instead of await
            Wized.requests
              .waitFor('get_renders')
              .then(() => {
                return initConfigurator(); // Return the promise from initConfigurator
              })
              .then(() => {
                return window.updateAllLayers(transitionType);
              })
              .then(() => {
                console.log('updateAllLayers done');
                resolve();
              });
          } else {
            window.updateAllLayers(transitionType).then(() => {
              console.log('updateAllLayers done');
              resolve();
            });
          }
        }
      });
      tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }).to('[overlay="white"]', { autoAlpha: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.1');
    } else {
      resolve();
      window.updateAllLayers(transitionType);
    }
  });
};

async function switchCar(model) {
  closeSearchModal();

  if (firstSearchModalInteraction == false) {
    // hide out side & bottom controls before switching car
    animateControlsOut();
  }
  // update variables
  Wized.data.v.carModel = model;

  // await Wized.requests.waitFor('get_renders');
  await changeNavTabs('car');

  if (firstSearchModalInteraction == true) {
    await hideStartScreen();
  } else if (firstSearchModalInteraction == false) {
    // we do this in the changeNavTabs function now
    // await animateControlsIn();
  }

  // set flag to false after first time
  if (firstSearchModalInteraction == true) firstSearchModalInteraction = false;
}

(async function modalEventListening() {
  window.addEventListener('message', event => {
    if (event.origin === 'https://car-search-magic.lovable.app' || event.origin === 'http://localhost:8080') {
      if (event.data.type == 'selectCar') {
        // console.log('Received message:', event);
        if (event.data.type === 'selectCar') {
          const model = event.data.data.model;
          console.log('✅✅✅✅✅✅✅model =', model);
          switchCar(model);
        } else {
          console.log('no valid event');
        }
      }
    }
  });
})();

(async function viewControlsAnimation() {
  // Get elements
  const viewControls = document.querySelector('[show-view-controls]');
  const navContainer = document.querySelector('[nav-views-container]');

  if (viewControls && navContainer) {
    // Initial state - hide view controls
    gsap.set('.div-block-95', {
      opacity: 0,
      y: 10,
      scale: 0.8,
      transformOrigin: 'top center',
      pointerEvents: 'none'
    });

    // Hide individual view buttons initially
    gsap.set('.div-block-97', {
      opacity: 0,
      y: 5,
      scale: 0.6,
      transformOrigin: 'center'
    });

    // Hide arrows initially
    gsap.set('.nav-view-arrow', {
      opacity: 0,
      y: 3
    });

    // Create a reusable timeline that we can play forward or reverse
    const controlsTimeline = gsap.timeline({ paused: true });

    // Sequence for the animation
    controlsTimeline
      // First animate the container
      .to('.div-block-95', {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: 'auto',
        duration: 0.35,
        ease: 'back.out(1.7)'
      })

      // Then stagger the buttons
      .to(
        '.div-block-97',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.06,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      ) // Start slightly before first animation finishes

      // Finally stagger the arrows
      .to(
        '.nav-view-arrow',
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.04,
          ease: 'power2.out'
        },
        '-=0.15'
      );

    // Flag to track if the animation is currently running
    let isAnimating = false;

    // Function to show the controls
    function showControls() {
      // if (isAnimating) return;
      // isAnimating = true;

      // Play the timeline forward
      controlsTimeline
        .timeScale(1)
        .play()
        .then(() => {
          isAnimating = false;
        });

      // Ensure pointer events are enabled
      gsap.set('.div-block-95', { pointerEvents: 'auto' });
    }

    // Function to hide the controls
    function hideControls() {
      // if (isAnimating || viewControls.matches(':hover')) return;
      // isAnimating = true;

      // Play the timeline in reverse
      controlsTimeline
        .timeScale(1.2)
        .reverse()
        .then(() => {
          isAnimating = false;
          // Ensure pointer events are disabled when fully hidden
          gsap.set('.div-block-95', { pointerEvents: 'none' });
        });
    }

    // Event listeners
    viewControls.addEventListener('mouseenter', showControls);
    navContainer.addEventListener('mouseenter', showControls);
    navContainer.addEventListener('mouseleave', hideControls);

    // Individual view button hover effects (opacity only)
    document.querySelectorAll('.div-block-97').forEach(button => {
      button.addEventListener('mouseenter', () => {
        // Dim all other buttons
        document.querySelectorAll('.div-block-97').forEach(otherButton => {
          if (otherButton !== button) {
            gsap.to(otherButton, {
              opacity: 0.3,
              duration: 0.2,
              ease: 'power2.out'
            });
          }
        });

        // // Arrow animation
        // const arrow = button.querySelector('.nav-view-arrow');
        // if (arrow) {
        //   if (arrow.classList.contains('l')) {
        //     gsap.to(arrow, { x: -3, duration: 0.2, ease: 'power2.out' });
        //   } else if (arrow.classList.contains('r')) {
        //     gsap.to(arrow, { x: 3, duration: 0.2, ease: 'power2.out' });
        //   } else {
        //     gsap.to(arrow, { y: 3, duration: 0.2, ease: 'power2.out' });
        //   }
        // }
      });

      button.addEventListener('mouseleave', () => {
        // Restore opacity of all buttons
        document.querySelectorAll('.div-block-97').forEach(otherButton => {
          gsap.to(otherButton, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out'
          });
        });

        // Reset arrow position
        const arrow = button.querySelector('.nav-view-arrow');
        if (arrow) {
          gsap.to(arrow, { x: 0, y: 0, duration: 0.2 });
        }
      });
    });
  }
})();

(async function closeUpTransitions() {
  function showCloseUpAnimation() {
    // Only show if we have closeup renders
    if (!Wized.data.v.closeUps || Wized.data.v.closeUps.length === 0) return;

    gsap.set('#closeupOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });
    gsap.set('#closeupContainer', { display: 'flex', opacity: 0, autoAlpha: 0, width: '5%' });
    gsap.set('#closeupContentWrap', { display: 'flex', opacity: 0, autoAlpha: 0, scale: 0.3 });

    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }, '<')
      .to('#closeupOverlay', { duration: 0.2, opacity: 1, autoAlpha: 1, ease: 'power2.expo' }, '<')
      .fromTo('#closeupContainer', { width: '5%' }, { duration: 0.2, width: '100%', ease: 'power2.inOut' })
      .fromTo('#closeupContentWrap', { scale: 0.3, autoAlpha: 0 }, { duration: 0.3, scale: 1, autoAlpha: 1, ease: 'power4.out' }, '-=0.3');

    // Initialize slider with closeup images
    initializeCloseUpSlider();
  }

  function hideCloseUpAnimation() {
    let tl = gsap.timeline();
    tl.to('#closeupContentWrap', { duration: 0.2, scale: 0.5, autoAlpha: 0, ease: 'power2.expo' })
      .to('#closeupContainer', { duration: 0.5, scale: 0, autoAlpha: 0, ease: 'power2.inOut' }, '-=0.8')
      .to('#closeupOverlay', {
        duration: 0.2,
        opacity: 0,
        autoAlpha: 0,
        ease: 'power2.expo',
        onComplete: () => {
          gsap.set('#closeupOverlay', { display: 'none' });
          gsap.set('#closeupContainer', { display: 'none' });
          // Cleanup slider if needed
          destroyCloseUpSlider();
        }
      })
      .to('#images-wrapper', { scale: 1.08, duration: 0.2, ease: 'expo.out' }, '<');
  }

  // Function to initialize the slider with closeup images
  function initializeCloseUpSlider() {
    const closeupContainer = document.querySelector('#closeupContentWrap');
    closeupContainer.innerHTML = ''; // Clear existing content

    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'closeup-slider';

    // Create navigation arrows
    const prevArrow = document.createElement('div');
    prevArrow.className = 'closeup-nav prev';
    prevArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    const nextArrow = document.createElement('div');
    nextArrow.className = 'closeup-nav next';
    nextArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    // Create slides container
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'closeup-slides';

    let currentSlide = 0;
    const slides = Wized.data.v.closeUps;
    let isZoomed = false;
    let startX = 0,
      startY = 0;
    let translateX = 0,
      translateY = 0;

    function updateSlides() {
      slidesContainer.innerHTML = '';
      slides.forEach((closeup, index) => {
        const slide = document.createElement('div');
        slide.className = `closeup-slide ${index === currentSlide ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = closeup.image;
        img.alt = 'Close-up view';
        img.draggable = false;

        // Add zoom button
        const zoomButton = document.createElement('div');
        zoomButton.className = 'zoom-button';
        zoomButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>`;

        function handleZoom(e) {
          e.stopPropagation(); // Prevent event from bubbling to img click handler
          if (!isZoomed) {
            slide.classList.add('zoomed');
            isZoomed = true;
            // Hide navigation arrows when zoomed
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            // Update zoom button icon
            zoomButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>`;

            // Center the zoom
            img.style.transformOrigin = '50% 50%';
            translateX = 0;
            translateY = 0;
            updateImagePosition();
          } else {
            resetZoom(slide);
            // Reset zoom button icon
            zoomButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>`;
          }
        }

        // Add scroll handling for panning
        function handleScroll(e) {
          if (!isZoomed) return;
          e.preventDefault();

          const scrollSpeed = 15;
          // Shift + scroll for horizontal movement
          if (e.shiftKey) {
            translateX -= e.deltaY / scrollSpeed;
          } else {
            translateY -= e.deltaY / scrollSpeed;
          }

          // Limit the pan range (assuming 2x zoom)
          const maxTranslate = img.width / 2;
          translateX = Math.min(Math.max(translateX, -maxTranslate), maxTranslate);
          translateY = Math.min(Math.max(translateY, -maxTranslate), maxTranslate);

          updateImagePosition();
        }

        function updateImagePosition() {
          img.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
        }

        // Add pan functionality
        slide.addEventListener('mousedown', e => {
          if (!isZoomed) return;
          e.preventDefault();
          startX = e.clientX - translateX;
          startY = e.clientY - translateY;
          slide.classList.add('panning');

          function onMouseMove(e) {
            if (!isZoomed) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;

            // Limit the pan range (assuming 2x zoom)
            const maxTranslate = img.width / 2;
            translateX = Math.min(Math.max(translateX, -maxTranslate), maxTranslate);
            translateY = Math.min(Math.max(translateY, -maxTranslate), maxTranslate);

            updateImagePosition();
          }

          function onMouseUp() {
            slide.classList.remove('panning');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });

        slide.addEventListener('wheel', handleScroll, { passive: false });
        zoomButton.addEventListener('click', handleZoom);
        img.addEventListener('click', handleZoom);

        slide.appendChild(img);
        slide.appendChild(zoomButton);
        slidesContainer.appendChild(slide);
      });

      // Update arrow visibility
      prevArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
      nextArrow.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
    }

    function resetZoom(slide) {
      slide.classList.remove('zoomed');
      const img = slide.querySelector('img');
      img.style.transform = '';
      img.style.transformOrigin = '';
      translateX = 0;
      translateY = 0;
      isZoomed = false;
      // Show navigation arrows again
      prevArrow.style.display = '';
      nextArrow.style.display = '';
    }

    function nextSlide() {
      if (isZoomed) return; // Prevent slide change while zoomed
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlides();
      }
    }

    function prevSlide() {
      if (isZoomed) return; // Prevent slide change while zoomed
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    }

    // Add event listeners
    nextArrow.addEventListener('click', nextSlide);
    prevArrow.addEventListener('click', prevSlide);

    // Add keyboard navigation
    document.addEventListener('keydown', e => {
      if (document.querySelector('#closeupOverlay').style.display === 'flex') {
        if (e.key === 'ArrowRight' && !isZoomed) nextSlide();
        if (e.key === 'ArrowLeft' && !isZoomed) prevSlide();
        if (e.key === 'Escape' && isZoomed) {
          const activeSlide = document.querySelector('.closeup-slide.active');
          if (activeSlide) resetZoom(activeSlide);
        }
      }
    });

    // Append everything to the container
    sliderContainer.appendChild(prevArrow);
    sliderContainer.appendChild(slidesContainer);
    sliderContainer.appendChild(nextArrow);
    closeupContainer.appendChild(sliderContainer);

    // Initialize first slide
    updateSlides();

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .closeup-slider {
        position: relative;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .closeup-slides {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .closeup-slide {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .closeup-slide.zoomed {
        cursor: zoom-out;
      }
      .closeup-slide.panning {
        cursor: move;
      }
      .closeup-slide.active {
        opacity: 1;
      }
      .closeup-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      .closeup-slide.zoomed img {
        transform: scale(2);
      }
      .zoom-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 44px;
        height: 44px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
        transition: all 0.2s ease;
        color: #000;
      }
      .zoom-button:hover {
        transform: scale(1.1);
        background: #f5f5f5;
      }
      .closeup-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
        transition: all 0.2s ease;
      }
      .closeup-nav:hover {
        background: #f5f5f5;
        transform: translateY(-50%) scale(1.1);
      }
      .closeup-nav.prev {
        left: 40px;
      }
      .closeup-nav.next {
        right: 40px;
      }
    `;
    document.head.appendChild(style);
  }

  function destroyCloseUpSlider() {
    const closeupContainer = document.querySelector('#closeupContentWrap');
    if (closeupContainer) {
      closeupContainer.innerHTML = '';
    }
    // Remove keyboard event listeners
    document.removeEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.stopPropagation();
      }
    });
  }

  // Event listeners
  window.showCloseUpView = showCloseUpAnimation; // Expose to window for external use

  document.querySelector('#closeupPseudo').addEventListener('click', () => {
    hideCloseUpAnimation();
    animateControlsIn();
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.querySelector('#closeupOverlay').style.display === 'flex') {
      hideCloseUpAnimation();
      animateControlsIn();
    }
  });
})();

(window.closeUpSlider = function () {
  Wized.on('requestend', result => {
    if (result.name == 'get_renders') {
      console.log('wized = ', Wized.data);
    }
  });
  (window.initCloseUpSlider = function () {
    // Update closeups data
    Wized.data.v.closeUps = Wized.data.r.get_renders.data
      .find(item => item.model == Wized.data.v.carModel)
      .renders.filter(render => render.model == Wized.data.v.wheelModel && render.color == Wized.data.v.wheelColor && render.view == 'closeup');
    console.log('closeUps = ', Wized.data.v.closeUps);

    // Create/update hotspots after setting closeups data
    window.createHotspots();
  })();
})();
