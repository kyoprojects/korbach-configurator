let searchModalOpen = false;

(async function initializeData() {
  Wized.requests.execute('get_wheels');
  Wized.requests.execute('get_renders');
  Wized.requests.execute('get_carcolors');
  await Wized.requests.waitFor('get_wheels');
  console.log('wized request = ', Wized.data.r.get_wheels.data);
  await new Promise(resolve => gsap.delayedCall(1, resolve));

  window.updateAllLayers = function (transitionType) {
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

    const carOverlay = data.find(item => item.model === Wized.data.v.carModel).renders.find(item => item.view === Wized.data.v.view && item.color === Wized.data.v.carColor && item.car_model === Wized.data.v.carModel)?.image;

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

    let imagesLoaded = 0;

    function checkAllLoaded() {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        setTimeout(() => {
          document.querySelector('.images-wrapper.preload').classList.add('show');

          // Update the regular images with the preloaded images
          document.querySelector('[w-el="scenery-wheel-overlay"]').src = wheelOverlayPreload.src;
          document.querySelector('[w-el="scenery-car-overlay"]').src = carOverlayPreload.src;
          // document.querySelector('[w-el="scenery"]').src = sceneryPreload.src;

          document.querySelector('.images-wrapper.preload').classList.remove('show');
        }, 0);
      }
    }
    wheelOverlayPreload.onload = checkAllLoaded;
    carOverlayPreload.onload = checkAllLoaded;
    // sceneryPreload.onload = checkAllLoaded;
    setTimeout(() => {
      if (transitionType == 'view') {
        console.log('reshow images');
        let tl = gsap.timeline();
        tl.to('[overlay="white"]', { autoAlpha: 0, opacity: 0, duration: 0.3, ease: 'power2.out' }).to('#images-wrapper', { scale: 1.08, duration: 0.3, ease: 'expo.out' }, '-=0.1');
      }
    }, 100);
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

  (async function initConfigurator() {
    const data = Wized.data.r.get_renders.data;

    const imageUrls = data.flatMap(car => [car.thumbnail, ...(car.renders || []).map(render => render.image)]).filter(Boolean); // Remove undefined or null values

    // console.log('Image URLs:', imageUrls);
    console.log('image urls = ', imageUrls);

    await preloadImages(imageUrls);
    console.log('All images preloaded successfully!');
  })();

  window.updateAllLayers();
})();

(async function enterConfig() {
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
        startConfig();
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

function appleDockNav() {
  console.log('define dock nav');
  const clickSound = new Audio('https://kyoprojects.github.io/korbach-configurator/370962__cabled_mess__click-01_minimal-ui-sounds.wav');
  const clickSound2 = new Audio('https://kyoprojects.github.io/korbach-configurator/670810__outervo1d__tsa-2.wav');
  const navItems = document.querySelectorAll('[nav-item]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      console.log('clicking');
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
      console.log('mouse enter');
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

(async function initDock() {
  await Wized.requests.waitFor('get_wheels');
  setTimeout(() => {
    appleDockNav();
  }, 200);
})();

(async function splineTransitions() {
  async function animateControlsOut() {
    document.querySelectorAll('[control]').forEach(el => {
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
    document.querySelectorAll('[control]').forEach(el => {
      const dir = el.getAttribute('control');
      const props = { duration: 0.3, autoAlpha: 1, scale: 1, ease: 'power2.inOut' };
      if (dir === 'left' || dir === 'right') props.x = '0%';
      if (dir === 'top' || dir === 'bottom') props.y = '0%';
      gsap.to(el, props);
    });
  }

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

// magnetic images
document.addEventListener('mousemove', e => {
  gsap.to('#images-wrapper', {
    x: e.clientX * 0.012,
    y: e.clientY * 0.012,
    ease: 'power4.out',
    duration: 16
  });
});

window.changeNavTabs = function (transitionType) {
  console.log('change nav tabs');
  if (transitionType == 'view') {
    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }).to('[overlay="white"]', { autoAlpha: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.1');
  }
  setTimeout(() => {
    window.updateAllLayers('view');
  }, 500);
};

(async function handleSidebar() {
  const navItems = document.querySelectorAll('[element="sidebar-item"]');

  navItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      console.log('mouse enter');
      item.classList.add('hovered');
      clickSound.play();
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovered');
    });
  });
})();

function switchCar(model) {
  console.log('switchcar');
  closeSearchModal();
  hideStartScreen();

  Wized.data.v.carModel = model;
  console.log('carmodel = ', Wized.data.v.carModel);

  const newCarColor = Wized.data.r.get_renders.data.find(item => item.model == Wized.data.v.carModel).renders.find(render => render.model == null).color;
  Wized.data.v.carColor = newCarColor;
  console.log('newCarColor = ', Wized.data.v.carColor);

  const newWheelModel = Wized.data.r.get_renders.data.find(item => item.model == Wized.data.v.carModel).renders.find(render => render.model !== null).model;
  Wized.data.v.wheelModel = newWheelModel;
  console.log('newWheelModel = ', Wized.data.v.wheelModel);

  window.updateAllLayers();
}

(async function modalEventListening() {
  window.addEventListener('message', event => {
    if (event.origin === 'https://carsearch-magic.lovable.app' || event.origin === 'http://localhost:8080') {
      console.log('Received message:', event);
      if (event.data.type === 'selectCar') {
        const model = event.data.data.model;
        console.log('model =', model);
        switchCar(model);
      } else {
        console.log('no valid event');
      }
    } else {
      console.log('origin not allowed');
      console.log(event.origin);
    }
  });
})();
