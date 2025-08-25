// Mobile scroll disabler has been removed

const isMobile = window.innerWidth < 768;

function preloader() {
  const audioUrl = new Audio('https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/Video/preloader/Tension%20Background%20Music%20Compilation.mp3');
  let videoPlayed = false;
  document.addEventListener('click', function () {
    if (videoPlayed) {
      return;
    }
    audioUrl.volume = 0.08; // Very soft
    audioUrl.play();
    videoPlayed = true;
    // close evt listener
  });

  // Create preloader HTML structure directly
  const preloaderHTML = `
        <!-- Preloader Container -->
        <div class="smoke-overlay">
            <video 
                id="smoke-video"
                src="https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/Video//Creativity%20Video.webm"
                autoplay
                loop
                muted
                playsinline
                class="smoke-video"
            ></video>
        </div>
        <div id="preloader" class="preloader">
            <!-- Initial Text Scene -->
            <div id="intro-text" class="scene">
                <div class="text-overlay intro-text">Performance Redefined</div>
            </div>

            <!-- Initial Black Scene -->
            <div id="black-scene" class="scene active">
                <div class="black-overlay"></div>
                <canvas id="logo-canvas" class="logo-canvas"></canvas>
                <div class="logo-container">
                    <img src="https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/Video/preloader/logo.png" 
                        alt="Korbach Logo" 
                        class="logo-image"
                        crossorigin="anonymous">
                </div>
            </div>

            <!-- First Text Scene -->
            <div id="text-scene-1" class="scene">
                <div class="text-overlay">Forge your vision</div>
            </div>

            <!-- Video Scene -->
            <div id="video-scene-1" class="scene">
                <div class="video-placeholder">
                    <video 
                        src="https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/Video/preloader/porsche_video.mp4"
                        playsinline
                        class="car-video"
                    ></video>
                </div>
            </div>

            <!-- Final Text Scene -->
            <div id="text-scene-2" class="scene">
                <div class="text-overlay">A Korbach Forged Experience</div>
            </div>
        </div>
    `;

  // 1. Add End Overlay HTML to preloaderHTML
  const endOverlayHTML = `
    <div id="end-overlay" class="end-overlay">
      <div class="end-overlay-content">
        <button id="end-overlay-btn" class="end-overlay-btn">
          Enter the configurator <span class="dot">•</span>
        </button>
        <div class="end-overlay-subtext">A Korbach Forged Experience</div>
      </div>
    </div>
  `;

  // 1. Update Glitch Overlay HTML to use a grid of blocks (8 rows x 16 columns)
  // Create glitch overlay first, before preloader
  // Increase number of blocks for better coverage
  const glitchRows = 12,
    glitchCols = 24; // More columns for better coverage
  const glitchBlocks = Array.from({ length: glitchRows * glitchCols })
    .map((_, i) => {
      const row = Math.floor(i / glitchCols);
      const col = i % glitchCols;
      // Add 1px overlap to prevent gaps
      return `<div class="glitch-block" style="top:${(row * 100) / glitchRows}vh; left:${(col * 100) / glitchCols}vw; width:${100 / glitchCols + 0.1}vw; height:${100 / glitchRows + 0.1}vh;"></div>`;
    })
    .join('');
  const glitchOverlayHTML = `
    <div id="glitch-transition" class="glitch-transition">
      ${glitchBlocks}
    </div>
  `;
  const preloaderHTMLWithGlitch = preloaderHTML + endOverlayHTML + glitchOverlayHTML;

  // Insert endOverlayHTML just after preloaderHTML
  const preloaderHTMLWithEnd = preloaderHTML + endOverlayHTML;

  // Find preloader wrapper and inject preloader
  const preloaderWrap = document.querySelector('#preloader-wrap');
  if (preloaderWrap) {
    preloaderWrap.innerHTML = preloaderHTMLWithEnd;
  } else {
    console.error('Preloader wrapper (#preloader-wrap) not found');
    return;
  }

  // Add glitch overlay to body
  document.body.insertAdjacentHTML('beforeend', glitchOverlayHTML);

  // Particle effect class
  class LogoParticles {
    constructor(canvas, logoElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.logoElement = logoElement;
      this.particles = [];
      this.particleSettings = {
        color: '#fff',
        baseRadius: 1,
        addedRadius: 1,
        baseSpeed: 3,
        addedSpeed: 2,
        density: 2
      };

      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth * devicePixelRatio;
      this.canvas.height = window.innerHeight * devicePixelRatio;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
      this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    async getParticlesFromImage() {
      return new Promise(resolve => {
        const img = this.logoElement;
        const { ctx, canvas, particleSettings } = this;
        const { density } = particleSettings;

        // Calculate centered position for the logo
        const logoWidth = 60;
        const logoHeight = (logoWidth / img.naturalWidth) * img.naturalHeight;
        const x = Math.floor((canvas.width / devicePixelRatio - logoWidth) / 2);
        const y = Math.floor((canvas.height / devicePixelRatio - logoHeight) / 2);

        // Draw the logo to canvas to get pixel data
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, logoWidth, logoHeight);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        this.particles = [];

        // Adjust density based on logo size
        const particleDensity = 1; // Smaller number = more particles

        for (let y = 0; y < canvas.height; y += particleDensity) {
          for (let x = 0; x < canvas.width; x += particleDensity) {
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 128) {
              const particle = {
                x: x / devicePixelRatio,
                y: y / devicePixelRatio,
                originX: x / devicePixelRatio,
                originY: y / devicePixelRatio,
                color: 'rgba(255, 255, 255, 0)',
                radius: 0.5, // Smaller, consistent radius
                speed: particleSettings.baseSpeed,
                angle: Math.random() * Math.PI * 2,
                opacity: 0
              };

              this.particles.push(particle);
            }
          }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        resolve();
      });
    }

    animate(progress) {
      const { ctx, canvas, particles } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        let particleOpacity;
        const animateInDuration = 0.2; // Increased to 0.2 (400ms for in)
        const animateOutStart = 0.8; // Start dispersing at 80% (400ms for out)

        if (progress < animateInDuration) {
          const normalizedProgress = progress / animateInDuration;
          const easeProgress = this.easeOutQuint(normalizedProgress);
          const distance = 50 * (1 - easeProgress);
          particle.x = particle.originX + Math.cos(particle.angle) * distance;
          particle.y = particle.originY + Math.sin(particle.angle) * distance;
          particleOpacity = easeProgress;
        } else if (progress > animateOutStart) {
          const normalizedProgress = (progress - animateOutStart) / (1 - animateOutStart);
          const easeProgress = this.easeInQuint(normalizedProgress);
          const distance = 50 * easeProgress;
          particle.x = particle.originX + Math.cos(particle.angle) * distance;
          particle.y = particle.originY + Math.sin(particle.angle) * distance;
          particleOpacity = 1 - easeProgress;
        } else {
          particle.x = particle.originX;
          particle.y = particle.originY;
          particleOpacity = 1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`;
        ctx.fill();
      });
    }

    // Easing functions for smoother animation
    easeOutQuint(x) {
      return 1 - Math.pow(1 - x, 5);
    }

    easeInQuint(x) {
      return x * x * x * x * x;
    }
  }

  // Initialize the preloader controller
  class PreloaderController {
    constructor() {
      this.timeline = gsap.timeline();
      this.init();
    }

    init() {
      this.startSequence();
    }

    async startSequence() {
      // Start smoke effect immediately but very subtle
      const smokeOverlay = document.querySelector('.smoke-overlay');
      const smokeVideo = document.getElementById('smoke-video');
      if (smokeVideo) {
        smokeVideo.playbackRate = 0.5;
      }
      gsap.to(smokeOverlay, {
        opacity: 0.1,
        duration: 0.2,
        ease: 'power2.out'
      });

      // Minimal initial black screen
      await new Promise(resolve => setTimeout(resolve, 50));

      // Start logo animation immediately
      await this.animateLogoParticles();

      // Rest of the sequence - no delays between
      await this.showIntroText();
      await this.showFirstText();
      await this.showVideoScene1();
      await this.showBrandText();

      // Animate the smoke overlay out slower and smoother
      gsap.to(smokeOverlay, {
        opacity: 0,
        duration: 1,
        ease: 'expo.inOut'
      });

      // Quicker cleanup
      setTimeout(() => {
        // Show the end overlay
        const endOverlay = document.getElementById('end-overlay');
        endOverlay.classList.add('active');
        // Animate overlay in (already handled by CSS animation)

        // Only allow one click
        let overlayClicked = false;
        const btn = document.getElementById('end-overlay-btn');
        btn.focus();
        btn.addEventListener('click', () => {
          if (overlayClicked) return;
          overlayClicked = true;
          clickSound2.play(); // Play click sound on button click

          const glitch = document.getElementById('glitch-transition');
          const blocks = glitch.querySelectorAll('.glitch-block');

          // 1. Make sure all blocks are initially invisible
          gsap.set(blocks, { opacity: 0, visibility: 'visible' });
          glitch.style.display = 'block';

          // Track completion of block animations
          let completedBlocks = 0;
          const totalBlocks = blocks.length;

          // 2. Stagger IN the grid
          gsap.to(blocks, {
            opacity: 1,
            duration: 0.2,
            stagger: {
              amount: 0.3,
              from: 'random',
              grid: [glitchRows, glitchCols]
            },
            ease: 'power1.in',
            onComplete: () => {
              console.log('All blocks animated in');

              // Remove preloader after blocks are in
              const preloader = document.querySelector('#preloader');
              if (preloader) {
                preloader.remove();
                console.log('Preloader removed');
              }
              const endOverlay = document.getElementById('end-overlay');
              if (endOverlay) {
                endOverlay.remove();
                console.log('End overlay removed');
              }

              gsap.to('#search-modal', {
                opacity: 0,
                y: 160,
                duration: 0.2,
                scale: 0.6,
                ease: 'power3.out'
              });

              gsap.delayedCall(0.2, () => {
                // 3. Stagger OUT the grid
                gsap.to(blocks, {
                  opacity: 0,
                  duration: 0.2,
                  stagger: {
                    amount: 0.3,
                    from: 'random',
                    grid: [glitchRows, glitchCols]
                  },
                  ease: 'power1.out',
                  onComplete: () => {
                    // 4. Wait for ALL blocks to finish their stagger
                    const totalDuration = 0.2 + 0.3; // duration + stagger amount
                    gsap.delayedCall(totalDuration, () => {
                      // Only remove glitch overlay after all animations are done
                      const glitchStyles = document.getElementById('glitch-styles');
                      if (glitchStyles) glitchStyles.remove();
                      if (glitch) glitch.remove();

                      // Fade out audio
                      gsap.to(audioUrl, {
                        volume: 0,
                        duration: 8,
                        onComplete: () => {
                          audioUrl.pause();
                        }
                      });
                    });

                    // cleanup wrap
                    const preloaderWrap = document.querySelector('#preloader-wrap');
                    if (preloaderWrap) {
                      preloaderWrap.remove();
                    }

                    // cleanup preloader
                    const preloader = document.querySelector('#preloader');
                    if (preloader) {
                      preloader.remove();
                    }

                    // start configurator
                    window.initializeData();
                    window.defineEnterFunctions();
                    // open search modal
                    if (!hasQueryParams) {
                      window.openSearchModal();
                    }
                  }
                });
              });
            }
          });
        });
      }, 500);
    }

    async animateLogoParticles() {
      return new Promise(resolve => {
        const canvas = document.querySelector('#logo-canvas');
        const logoImg = document.querySelector('.logo-image');

        // Start animation as soon as logo is loaded
        if (logoImg.complete) {
          this.startLogoAnimation(canvas, logoImg, resolve);
        } else {
          logoImg.onload = () => {
            this.startLogoAnimation(canvas, logoImg, resolve);
          };
        }
      });
    }

    async startLogoAnimation(canvas, logoImg, resolve) {
      const logoEffect = new LogoParticles(canvas, logoImg);
      await logoEffect.getParticlesFromImage();

      // We'll use a GSAP timeline to allow a callback after vaporize-in
      let vaporizeInComplete = false;
      const timeline = gsap.timeline({
        onUpdate: function () {
          // progress: 0 to 1
          const progress = this.progress();
          logoEffect.animate(progress);
          // Vaporize-in is first 0.2 (0.4s of 2s in/out+hold)
          if (!vaporizeInComplete && progress >= 0.2) {
            vaporizeInComplete = true;
            // Start the next step (text) as soon as logo is fully formed
            resolve();
          }
        },
        onComplete: function () {
          // Do nothing, cleanup handled elsewhere
        },
        duration: 3
      });
      // Animate from 0 to 1 over 3s
      timeline.to({}, { duration: 3 });
    }

    async showIntroText() {
      return new Promise(resolve => {
        const scene = document.querySelector('#intro-text');
        const text = scene.querySelector('.text-overlay');

        scene.classList.add('active');

        const words = text.textContent.split(' ');
        text.innerHTML = words.map(word => `<span class="text-word">${word}</span>`).join(' ');

        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              gsap.to(text.querySelectorAll('.text-word'), {
                opacity: 0,
                scale: 0.8,
                filter: 'blur(10px)',
                duration: 0.3,
                stagger: {
                  each: 0.08,
                  from: 'start'
                },
                ease: 'power2.in',
                onComplete: () => {
                  scene.classList.remove('active');
                  resolve();
                }
              });
            }, 1000); // Reduced hold time
          }
        });

        tl.to(text.querySelectorAll('.text-word'), {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          stagger: {
            each: 0.08,
            from: 'start'
          },
          ease: 'power2.out'
        });
      });
    }

    async showFirstText() {
      return new Promise(resolve => {
        const scene = document.querySelector('#text-scene-1');
        const text = scene.querySelector('.text-overlay');

        scene.classList.add('active');

        const words = text.textContent.split(' ');
        text.innerHTML = words.map(word => `<span class="text-word">${word}</span>`).join(' ');

        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              gsap.to(text.querySelectorAll('.text-word'), {
                opacity: 0,
                scale: 0.8,
                filter: 'blur(10px)',
                duration: 0.3,
                stagger: {
                  each: 0.08,
                  from: 'start'
                },
                ease: 'power2.in',
                onComplete: () => {
                  scene.classList.remove('active');
                  resolve();
                }
              });
            }, 1000);
          }
        });

        tl.to(text.querySelectorAll('.text-word'), {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          stagger: {
            each: 0.08,
            from: 'start'
          },
          ease: 'power2.out'
        });
      });
    }

    async showBrandText() {
      return new Promise(resolve => {
        const scene = document.querySelector('#text-scene-2');
        const text = scene.querySelector('.text-overlay');

        scene.classList.add('active');

        const words = text.textContent.split(' ');
        text.innerHTML = words.map(word => `<span class="text-word">${word}</span>`).join(' ');

        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              gsap.to(text.querySelectorAll('.text-word'), {
                opacity: 0,
                scale: 0.8,
                filter: 'blur(10px)',
                duration: 0.3,
                stagger: {
                  each: 0.08,
                  from: 'start'
                },
                ease: 'power2.in',
                onComplete: () => {
                  scene.classList.remove('active');
                  resolve();
                }
              });
            }, 1000);
          }
        });

        tl.to(text.querySelectorAll('.text-word'), {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          stagger: {
            each: 0.08,
            from: 'start'
          },
          ease: 'power2.out'
        });
      });
    }

    async showVideoScene1() {
      return new Promise(resolve => {
        const scene = document.querySelector('#video-scene-1');
        const video = scene.querySelector('.car-video');

        scene.classList.add('active');

        video.playbackRate = 2.0;
        video.volume = 0;

        let exitStarted = false;

        // Function to handle sound fadeout separately
        const handleSoundFadeout = () => {
          // Wait 2 seconds before starting sound fadeout
          gsap.delayedCall(2, () => {
            // Fade out sound over 5 seconds
            gsap.to(video, {
              volume: 0,
              duration: 5,
              ease: 'power2.inOut',
              onComplete: () => {
                // Only stop the video after sound has faded
                video.pause();
                video.currentTime = 0;
              }
            });
          });
        };

        // Function to trigger exit animation
        const triggerExit = () => {
          if (exitStarted) return;
          exitStarted = true;
          video.removeEventListener('timeupdate', onTimeUpdate);

          // First fade out the video visually
          gsap.to(video, {
            opacity: 0,
            scale: 1.08,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              // Hide the video but don't stop it yet
              video.style.visibility = 'hidden';
              scene.classList.remove('active');

              // Handle sound fadeout asynchronously
              handleSoundFadeout();

              // Resolve immediately to continue with next animation
              resolve();
            }
          });
        };

        // Listen for timeupdate to crop 2.2s off the end
        const onTimeUpdate = () => {
          if (video.duration && video.currentTime >= video.duration - 2.2 && !exitStarted) {
            exitStarted = true;
            video.removeEventListener('timeupdate', onTimeUpdate);

            // First fade out the video visually
            gsap.to(video, {
              opacity: 0,
              scale: 1.05,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => {
                // Hide the video but don't stop it yet
                video.style.visibility = 'hidden';
                scene.classList.remove('active');

                // Handle sound fadeout asynchronously
                handleSoundFadeout();

                // Resolve immediately to continue with next animation
                resolve();
              }
            });
          }
        };
        video.addEventListener('timeupdate', onTimeUpdate);

        video.play();

        const tl = gsap.timeline({
          onComplete: () => {
            // If not already triggered by timeupdate, trigger after 1s hold
            setTimeout(() => {
              triggerExit();
            }, 1000);
          }
        });

        tl.to(video, {
          opacity: 1,
          scale: 1,
          width: '100vw',
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            video.style.left = '0';
            video.style.right = 'auto';
          }
        }).to(
          video,
          {
            volume: 0.7,
            duration: 0.8,
            ease: 'power2.out'
          },
          '<'
        );
      });
    }

    async showVideoScene2() {
      return new Promise(resolve => {
        const scene = document.querySelector('#video-scene-2');
        const video = scene.querySelector('.car-video');

        scene.classList.add('active');

        // Set playback speed
        video.playbackRate = 2.0;

        // Set initial volume to 0
        video.volume = 0;

        // Start video and fade in
        video.play();

        // Create timeline for coordinated video and audio fade
        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => {
              // Create timeline for fade out
              const fadeOutTl = gsap.timeline({
                onComplete: () => {
                  video.pause();
                  video.currentTime = 0;
                  scene.classList.remove('active');
                  resolve();
                }
              });

              // Fade out video and audio together
              fadeOutTl
                .to(video, {
                  opacity: 0,
                  scale: 1.1,
                  duration: 0.8,
                  ease: 'power2.inOut'
                })
                .to(
                  video,
                  {
                    volume: 0,
                    duration: 0.8,
                    ease: 'power2.inOut'
                  },
                  '<'
                ); // Start at same time as opacity animation
            }, 1500);
          }
        });

        // Fade in video and audio together
        tl.to(video, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out'
        }).to(
          video,
          {
            volume: 0.7, // Don't go to full volume
            duration: 1.5,
            ease: 'power2.out'
          },
          '<'
        ); // Start at same time as opacity animation
      });
    }
  }

  // Start the preloader
  new PreloaderController();
}

let searchModalOpen = false;
let firstSearchModalInteraction = true;
let hasQueryParams;

// Add at the top with other window functions
window.updateUrlParams = async function () {
  // Use requestAnimationFrame to ensure this runs after other UI updates
  requestAnimationFrame(() => {
    const params = new URLSearchParams(window.location.search);

    // Update params only if values exist
    if (Wized.data.v.carModel) params.set('car-model', Wized.data.v.carModel);
    if (Wized.data.v.wheelModel) params.set('wheel-model', Wized.data.v.wheelModel);
    if (Wized.data.v.wheelColor) params.set('wheel-color', Wized.data.v.wheelColor);
    if (Wized.data.v.carColor) params.set('car-color', Wized.data.v.carColor);
    if (Wized.data.v.view) params.set('view', Wized.data.v.view);

    console.log('params', JSON.stringify(params, null, 2));

    // Update URL without reloading the page
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  });
};

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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
    <div class="hotspot-label">View close-ups</div>
  `;

  // Set dynamic hotspot position from car data
  const currentCar = Wized.data.r.get_renders.data.find(item => item.model === Wized.data.v.carModel);
  if (currentCar && currentCar.cu_hotspot_offset) {
    try {
      // Parse the offset if it's a string, or use directly if it's already an object
      const offset = typeof currentCar.cu_hotspot_offset === 'string' ? JSON.parse(currentCar.cu_hotspot_offset) : currentCar.cu_hotspot_offset;

      // Apply the custom position if valid
      if (offset && offset.left) wheelHotspot.style.left = offset.left;
      if (offset && offset.top) wheelHotspot.style.top = offset.top;

      console.log('Applied custom hotspot position from car data:', offset);
    } catch (e) {
      console.error('Error parsing car cu_hotspot_offset:', e);
      // Fallback to default position
    }
  }

  // Add click handler
  wheelHotspot.addEventListener('click', () => {
    animateControlsOut();
    window.showCloseUpView();
  });

  hotspotsContainer.appendChild(wheelHotspot);
  document.querySelector('#images-wrapper').appendChild(hotspotsContainer);
};

window.initializeData = async function () {
  Wized.requests.execute('get_wheels');
  // Wized.requests.execute('get_renders');
  Wized.requests.execute('get_carcolors');
  await Wized.requests.waitFor('get_wheels');

  await new Promise(resolve => gsap.delayedCall(1, resolve));

  // Add function to update tooltips
  window.updateControlTooltips = function () {
    // Remove any existing tooltips
    document.querySelectorAll('.control-tooltip').forEach(tooltip => tooltip.remove());

    // Get wheel color display name from widget config
    const wheelColors = {
      gloss_black: 'Gloss Black',
      gloss_bronze: 'Gloss Bronze',
      gloss_titanium: 'Gloss Titanium',
      satin_black: 'Satin Black',
      satin_bronze: 'Satin Bronze',
      satin_grey: 'Satin Grey'
    };

    const currentCar = Wized.data.r.get_renders.data[0];
    const prettyCarName = `${currentCar.brand} ${currentCar.name}`;

    // Create tooltips
    const tooltips = [
      {
        step: 'car-model',
        label: 'Car',
        value: prettyCarName || 'Not selected'
      },
      {
        step: 'car-color',
        label: 'Car Color',
        value: (Wized.data.v.carColor || 'Not selected')
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      },
      {
        step: 'wheel-model',
        label: 'Wheel Model',
        value: (Wized.data.v.wheelModel || 'Not selected').toUpperCase()
      },
      {
        step: 'wheel-color',
        label: 'Wheel Color',
        value: wheelColors[Wized.data.v.wheelColor] || Wized.data.v.wheelColor || 'Not selected'
      }
    ];

    tooltips.forEach(({ step, label, value }) => {
      const menuItem = document.querySelector(`[element="sidebar-item"][step="${step}"]`);
      if (!menuItem) return;

      const tooltip = document.createElement('div');
      tooltip.className = 'control-tooltip';

      // For mobile devices, position tooltips on top
      if (isMobile) {
        // Position tooltip above the element instead of to the right
        tooltip.style.left = '50%';
        tooltip.style.top = 'auto';
        tooltip.style.bottom = '100%';
        tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
        tooltip.style.marginLeft = '0';
        tooltip.style.marginBottom = '10px';

        // Modify the arrow to point down instead of left
        tooltip.style.setProperty('--tooltip-arrow-position', 'bottom');
      }

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

  // updateControlTooltips();tool

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

  async function lazyLoadImages(criticalImages) {
    // Start loading all other images in the background
    const data = Wized.data.r.get_renders.data;
    const allImageUrls = data.flatMap(car => [car.thumbnail, ...(car.renders || []).map(render => render.image)]).filter(Boolean);

    // Remove already loaded images from background loading
    const backgroundImages = allImageUrls.filter(url => !criticalImages.includes(url));

    // Load rest in background - don't await
    preloadImages(backgroundImages).then(() => {
      // console.log('Background images loaded');
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

    lazyLoadImages(criticalImages);

    initDock();
  };

  window.updateAllLayers = async function (transitionType) {
    // const clickedConfig = {
    //   car: Wized.data.v.carModel,
    //   carColor: Wized.data.v.carColor,
    //   wheel: Wized.data.v.wheelModel,
    //   wheelColor: Wized.data.v.wheelColor,
    //   view: Wized.data.v.view
    // };
    // console.log('Clicked Config:', clickedConfig);

    // Update control tooltips when layers are updated
    window.updateControlTooltips();

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
    let animationPromiseResolve;
    const animationPromise = new Promise(resolve => {
      animationPromiseResolve = resolve;
    });

    // Simplified approach for better mobile compatibility
    console.log('Starting image loading process');

    // Pre-load images in memory first
    const wheelImg = new Image();
    const carImg = new Image();

    let wheelLoaded = false;
    let carLoaded = false;

    // Function to check if both images are loaded and continue
    const checkBothLoaded = () => {
      console.log(`Load status - Wheel: ${wheelLoaded}, Car: ${carLoaded}`);
      if (wheelLoaded && carLoaded) {
        console.log('Both images loaded, continuing');

        // Update the preload images
        wheelOverlayPreload.src = wheelImg.src;
        carOverlayPreload.src = carImg.src;

        // Update the visible images
        document.querySelector('.images-wrapper.preload').classList.add('show');
        document.querySelector('[w-el="scenery-wheel-overlay"]').src = wheelImg.src;
        document.querySelector('[w-el="scenery-car-overlay"]').src = carImg.src;
        document.querySelector('.images-wrapper.preload').classList.remove('show');

        // Continue with animation
        animationPromiseResolve();
      }
    };

    // Set a safety timeout
    // const safetyTimeout = setTimeout(() => {
    //   console.log('Safety timeout triggered - continuing anyway');

    //   // Force continue even if images aren't both loaded
    //   wheelOverlayPreload.src = wheelOverlay;
    //   carOverlayPreload.src = carOverlay;

    //   document.querySelector('.images-wrapper.preload').classList.add('show');
    //   document.querySelector('[w-el="scenery-wheel-overlay"]').src = wheelOverlay;
    //   document.querySelector('[w-el="scenery-car-overlay"]').src = carOverlay;
    //   document.querySelector('.images-wrapper.preload').classList.remove('show');

    //   animationPromiseResolve();
    // }, 3000);

    // Load wheel image
    wheelImg.onload = () => {
      console.log('Wheel image loaded');
      wheelLoaded = true;
      checkBothLoaded();
    };

    wheelImg.onerror = () => {
      console.log('Wheel image failed to load');
      wheelLoaded = true; // Consider it "loaded" to prevent hanging
      checkBothLoaded();
    };

    // Load car image
    carImg.onload = () => {
      console.log('Car image loaded');
      carLoaded = true;
      checkBothLoaded();
    };

    carImg.onerror = () => {
      console.log('Car image failed to load');
      carLoaded = true; // Consider it "loaded" to prevent hanging
      checkBothLoaded();
    };

    // Start loading both images
    console.log('Setting image sources');
    wheelImg.src = wheelOverlay;
    carImg.src = carOverlay;

    return animationPromise.then(() => {
      return new Promise(resolve => {
        let tl = gsap.timeline({
          onComplete: function () {
            resolve();
          }
        });
        if (transitionType == 'view') {
          tl.to('[overlay="white"]', { autoAlpha: 0, opacity: 0, duration: 0.3, ease: 'power2.out' }).to('#images-wrapper', { scale: 1.08, duration: 0.3, ease: 'expo.out' }, '-=0.1');
        } else if (transitionType == 'car') {
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
    });
  };
};

window.defineEnterFunctions = async function () {
  gsap.set('#images-wrapper', { scale: 1 });

  window.hideStartScreen = function () {
    return new Promise(resolve => {
      let tl = gsap.timeline();
      console.log('hideStartScreen');
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
    });
  };

  function startConfig() {
    return new Promise(resolve => {
      // const tl = gsap.timeline();
      gsap
        .timeline()
        .set('[control="bottom"]', { autoAlpha: 0, y: 40, scale: 0.9 })
        .fromTo(
          '[overlay="white"]',
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
              resolve();
            }
          }
        )
        .to('#images-wrapper', { scale: 1.08, duration: 0.5, ease: 'expo.out' }, '<')
        .fromTo('[control="bottom"]', { autoAlpha: 0, y: 30, scale: 0.7 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .fromTo('.wheel-control-thumbnail', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 2, ease: 'expo.out', stagger: 0.04 }, '-=0.8');
    });
  }
};

(function searchModals() {
  window.openSearchModal = function () {
    const modal = document.getElementById('search-modal');

    if (!modal) return;
    modal.style.display = 'flex';

    gsap.fromTo(modal, { autoAlpha: 0, scale: 0.8, y: 50 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.2, ease: 'power3.out' });

    searchModalOpen = true;

    // Focus the search input in the iframe, but only on desktop
    if (!isMobile) {
      // Wait a tiny bit for the animation to start
      setTimeout(() => {
        const searchModalIframe = document.getElementById('searchModalIframe');
        if (searchModalIframe) {
          searchModalIframe.contentWindow.postMessage(
            {
              type: 'searchModal',
              action: 'focusInput'
            },
            '*'
          );
          console.log('Search modal focus message sent');
        }
      }, 100);
    }

    // Mobile scroll disabler has been removed
  };
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
        searchModalOpen = false;

        // Re-enable scrolling on mobile devices
        if (typeof MobileScrollDisabler !== 'undefined') {
          MobileScrollDisabler.enable();
        }
      }
    });
  };
  document.querySelector('[el="search-trigger"]').addEventListener('click', function () {
    if (searchModalOpen) {
      closeSearchModal();
    } else {
      openSearchModal();
    }
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
    // Only close if we're not in the initial state (firstSearchModalInteraction is false)
    if (searchModalOpen && !isInsideModal && !isTrigger && !firstSearchModalInteraction) {
      closeSearchModal();
    }
  });
})();

const clickSound = new Audio('https://kyoprojects.github.io/korbach-configurator/370962__cabled_mess__click-01_minimal-ui-sounds.wav');
const clickSound2 = new Audio('https://kyoprojects.github.io/korbach-configurator/670810__outervo1d__tsa-2.wav');

async function appleDockNav() {
  await Wized.requests.waitFor('get_wheels');

  const navItems = document.querySelectorAll('[nav-item]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (Wized.data.v.soundEnabled) clickSound2.play();
    });
  });

  // Helper function to add/remove a class to a sibling at a given off-set
  const toggleSiblingClass = (items, index, offset, className, add) => {
    const sibling = items[index + offset];
    if (sibling) {
      sibling.classList.toggle(className, add);
    }
  };

  if (isMobile) return;
  navItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hover');
      if (Wized.data.v.soundEnabled) clickSound.play();
      toggleSiblingClass(navItems, index, -1, 'sibling-close', true);
      toggleSiblingClass(navItems, index, 1, 'sibling-close', true);
      toggleSiblingClass(navItems, index, -2, 'sibling-far', true);
      toggleSiblingClass(navItems, index, 2, 'sibling-far', true);
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('hover');
      toggleSiblingClass(navItems, index, -1, 'sibling-close', false);
      toggleSiblingClass(navItems, index, 1, 'sibling-close', false);
      toggleSiblingClass(navItems, index, -2, 'sibling-far', false);
      toggleSiblingClass(navItems, index, 2, 'sibling-far', false);
    });
  });
}

async function initDock() {
  await Wized.requests.waitFor('get_wheels');
  setTimeout(() => {
    appleDockNav();
  }, 200);
}

async function handleSidebarSfx() {
  const navItems = document.querySelectorAll('[element="sidebar-item"]');

  if (isMobile) return;

  navItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('hovered');
      if (Wized.data.v.soundEnabled) clickSound.play();
    });

    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovered');
    });
  });
}

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

(async function splineTransitions() {
  (function splineVisibility() {
    // Wait for initial data and handle visibility
    window.Wized = window.Wized || [];
    window.Wized.push(async Wized => {
      // Wait for get_wheels request to finish
      await Wized.requests.waitFor('get_wheels');

      // Initial check
      updateSplineButtonVisibility();

      // Listen for car model changes using reactivity
      Wized.reactivity.watch(
        () => Wized.data.v.wheelModel,
        () => {
          updateSplineButtonVisibility();
        }
      );
    });

    function updateSplineButtonVisibility() {
      console.log('updateSplineButtonVisibility');
      const splineButton = document.getElementById('splinebuttoncontainer');
      if (!splineButton) return;

      const currentWheel = Wized.data.r.get_wheels.data.find(w => w.model === Wized.data.v.wheelModel);

      if (currentWheel?.spline) {
        splineButton.style.display = 'flex';
      } else {
        splineButton.style.display = 'none';
      }
    }
  })();

  function showSplineAnimation() {
    const iframe = document.getElementById('wheelFrame');
    if (iframe) {
      iframe.contentWindow.postMessage(
        {
          type: 'CHANGE_SCENE',
          url: Wized.data.r.get_wheels.data.find(w => w.model == Wized.data.v.wheelModel).spline
        },
        '*'
      );
    }
    gsap.set('#splineOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });
    gsap.set('#splineContainer', { display: 'flex', opacity: 0, autoAlpha: 0, y: '100%', scale: 0, width: '10%' });

    // Mobile scroll disabler has been removed

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

          // Mobile scroll disabler has been removed
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

    // Mobile scroll disabler has been removed

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

        // Re-enable scrolling on mobile devices
        if (typeof MobileScrollDisabler !== 'undefined') {
          MobileScrollDisabler.enable();
        }
      }
    }).to('#images-wrapper', { scale: 1.08, duration: 0.2, ease: 'expo.out' }, '<');
  }

  document.querySelector('#openQuoteForm').addEventListener('click', () => {
    showQuoteForm();
    animateControlsOut();
  });
  document.querySelectorAll('#quotePseudo').forEach(el => {
    el.addEventListener('click', () => {
      hideQuoteForm();
      animateControlsIn();
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hideQuoteForm();
      animateControlsIn();
    }
  });
})();

if (!isMobile) {
  document.addEventListener('mousemove', e => {
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
}

window.changeNavTabs = async function (transitionType) {
  if (transitionType === 'car') {
    // Start request immediately
    Wized.requests.execute('get_renders');
  }

  return new Promise(resolve => {
    if (transitionType == 'view' || transitionType == 'car') {
      let tl = gsap.timeline({
        onComplete: async function () {
          if (transitionType == 'car') {
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
                resolve();
              });
          } else {
            window.updateAllLayers(transitionType).then(() => {
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
  if (Wized.data.v.soundEnabled) clickSound2.play();

  closeSearchModal();

  if (firstSearchModalInteraction == false) animateControlsOut();

  Wized.data.v.carModel = model;
  await changeNavTabs('car');

  updateUrlParams();

  if (firstSearchModalInteraction == true) await hideStartScreen();

  // set flag to false after first time
  if (firstSearchModalInteraction == true) firstSearchModalInteraction = false;
}

(async function modalEventListening() {
  window.addEventListener('message', event => {
    if (event.origin === 'https://prismatic-phoenix-e7fbdb.netlify.app' || event.origin === 'http://localhost:8080') {
      if (event.data.type == 'selectCar') {
        // console.log('Received message:', event);
        if (event.data.type === 'selectCar') {
          const model = event.data.data.model;
          switchCar(model);
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
      // if (isAnimating) return;
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

    // Mobile scroll disabler has been removed

    // Animate hotspot out
    const hotspot = document.querySelector('.wheel-hotspot');
    if (hotspot) {
      gsap.to(hotspot, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          hotspot.style.visibility = 'hidden';
        }
      });
    }

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

          // Mobile scroll disabler has been removed

          // Animate hotspot back in
          const hotspot = document.querySelector('.wheel-hotspot');
          if (hotspot) {
            hotspot.style.visibility = 'visible';
            gsap.fromTo(hotspot, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
          }

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

    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'closeup-close-btn';
    closeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;

    // Add click handler to close button
    closeButton.addEventListener('click', () => {
      hideCloseUpAnimation();
      animateControlsIn();
    });

    closeupContainer.appendChild(closeButton);

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

        // Create image wrapper to hold both car and wheel images
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'closeup-image-wrapper';
        imageWrapper.style.position = 'relative';
        imageWrapper.style.width = '100%';
        imageWrapper.style.height = '100%';

        // Add car base image
        const carImg = document.createElement('img');
        carImg.src = closeup.carImage;
        carImg.alt = 'Car close-up view';
        carImg.draggable = false;
        carImg.style.position = 'absolute';
        carImg.style.width = '100%';
        carImg.style.height = '100%';
        carImg.style.objectFit = 'cover';

        // Add wheel overlay image
        const wheelImg = document.createElement('img');
        wheelImg.src = closeup.wheelImage;
        wheelImg.alt = 'Wheel close-up view';
        wheelImg.draggable = false;
        wheelImg.style.position = 'absolute';
        wheelImg.style.width = '100%';
        wheelImg.style.height = '100%';
        wheelImg.style.objectFit = 'cover';

        imageWrapper.appendChild(carImg);
        imageWrapper.appendChild(wheelImg);

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
          const maxTranslate = imageWrapper.offsetWidth / 2;
          translateX = Math.min(Math.max(translateX, -maxTranslate), maxTranslate);
          translateY = Math.min(Math.max(translateY, -maxTranslate), maxTranslate);

          updateImagePosition();
        }

        function updateImagePosition() {
          carImg.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
          wheelImg.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
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
            const maxTranslate = imageWrapper.offsetWidth / 2;
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
        carImg.addEventListener('click', handleZoom);
        wheelImg.addEventListener('click', handleZoom);

        slide.appendChild(imageWrapper);
        slide.appendChild(zoomButton);
        slidesContainer.appendChild(slide);
      });

      // Update arrow visibility
      prevArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
      nextArrow.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
    }

    function resetZoom(slide) {
      slide.classList.remove('zoomed');
      const carImg = slide.querySelector('.closeup-image-wrapper img:first-child');
      const wheelImg = slide.querySelector('.closeup-image-wrapper img:last-child');

      if (carImg) {
        carImg.style.transform = '';
        carImg.style.transformOrigin = '';
      }

      if (wheelImg) {
        wheelImg.style.transform = '';
        wheelImg.style.transformOrigin = '';
      }

      zneejoqfgrqzvutkituy.supabase.co / storage / v1 / object / public / renders / BMW / m3 - g80 / car / cu1 / cu1 - aventurin - red.webp;
      zneejoqfgrqzvutkituy.supabase.co / storage / v1 / object / public / renders / bmw / m3 - g80 / car / cu1 / cu1 - aventurin - red.webp;

      https: translateX = 0;
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
      if (isZoomed) return;
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    }

    nextArrow.addEventListener('click', nextSlide);
    prevArrow.addEventListener('click', prevSlide);

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

    sliderContainer.appendChild(prevArrow);
    sliderContainer.appendChild(slidesContainer);
    sliderContainer.appendChild(nextArrow);
    closeupContainer.appendChild(sliderContainer);

    updateSlides();
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
  window.showCloseUpView = showCloseUpAnimation;

  document.querySelector('#closeupPseudo').addEventListener('click', () => {
    hideCloseUpAnimation();
    animateControlsIn();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.querySelector('#closeupOverlay').style.display === 'flex') {
      hideCloseUpAnimation();
      animateControlsIn();
    }
  });
})();

(window.closeUpSlider = function () {
  window.initCloseUpSlider = function () {
    // Get all closeup views for the current car model
    const carData = Wized.data.r.get_renders.data.find(item => item.model == Wized.data.v.carModel);
    if (!carData) return;

    // Get all unique closeup views (cu1, cu2, etc.)
    const closeupViews = [...new Set(carData.renders.filter(render => render.view && render.view.startsWith('cu')).map(render => render.view))].sort();

    if (closeupViews.length === 0) {
      Wized.data.v.closeUps = [];
      window.createHotspots();
      return;
    }

    // Create combined closeup data with car and wheel overlays
    Wized.data.v.closeUps = closeupViews
      .map(view => {
        // Find car image for this closeup view
        const carImage = carData.renders.find(render => render.view === view && render.color === Wized.data.v.carColor && render.type === 'car');

        // Find wheel overlay for this closeup view
        const wheelOverlay = carData.renders.find(render => render.view === view && render.model === Wized.data.v.wheelModel && render.color === Wized.data.v.wheelColor && render.type === 'wheel');

        return {
          view: view,
          carImage: carImage?.image || null,
          wheelImage: wheelOverlay?.image || null
        };
      })
      .filter(item => item.carImage && item.wheelImage); // Only keep views where we have both images

    console.log('closeUps = ', JSON.stringify(Wized.data.v.closeUps, null, 2));
    window.createHotspots();
  };
})();

(async function toggleSound() {
  const soundButton = document.querySelector('#toggleSound');
  const soundIcon = document.querySelector('#soundIcon');
  soundButton.addEventListener('click', () => {
    Wized.data.v.soundEnabled = !Wized.data.v.soundEnabled;
    if (Wized.data.v.soundEnabled) clickSound2.play();
    if (Wized.data.v.soundEnabled) {
      soundIcon.src = 'https://cdn.prod.website-files.com/675364fc6bb8d63cafd2bf42/6844a787dfe4e67d0ed427e5_Volume%20High%20Stroke%20Sharp.svg';
    } else {
      soundIcon.src = 'https://cdn.prod.website-files.com/675364fc6bb8d63cafd2bf42/6844a787fdc8e2cfeee3e484_Volume%20Mute%20Icon.svg';
    }
  });
})();

(function initModularTooltips() {
  class TooltipManager {
    constructor() {
      this.tooltips = new Map();
      this.tooltipTemplate = `
      <div class="tooltip-content">
        <div class="tooltip-text"></div>
      </div>
    `;
    }

    create(element, text, position = 'top') {
      // Remove any existing tooltip for this element
      this.remove(element);

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = `tooltip tooltip-${position}`;
      tooltip.innerHTML = this.tooltipTemplate;
      tooltip.querySelector('.tooltip-text').textContent = text;

      // Ensure initial state is hidden
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateY(4px)';

      // Add tooltip to DOM
      document.body.appendChild(tooltip);

      // Store reference
      this.tooltips.set(element, tooltip);

      // Add event listeners
      element.addEventListener('mouseenter', () => this.show(element));
      element.addEventListener('mouseleave', () => this.hide(element));
      element.addEventListener('focus', () => this.show(element));
      element.addEventListener('blur', () => this.hide(element));
    }

    show(element) {
      const tooltip = this.tooltips.get(element);
      if (!tooltip) return;

      // Position the tooltip
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let top, left;

      switch (tooltip.className.split('tooltip-')[1]) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom-right':
          top = rect.bottom + 8;
          // Align to the right edge of the button
          left = rect.right - tooltipRect.width;
          break;
        case 'bottom-left':
          top = rect.bottom + 8;
          // Align to the left edge of the button
          left = rect.left;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          break;
      }

      // Apply position
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      // Show with animation
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'visible';
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
      });
    }

    hide(element) {
      const tooltip = this.tooltips.get(element);
      if (!tooltip) return;

      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(4px)';
      setTimeout(() => {
        tooltip.style.visibility = 'hidden';
      }, 200);
    }

    remove(element) {
      const tooltip = this.tooltips.get(element);
      if (tooltip) {
        tooltip.remove();
        this.tooltips.delete(element);
      }
    }
  }

  // Initialize tooltip manager
  const tooltipManager = new TooltipManager();

  // Right top controls tooltips
  const openQuoteForm = document.getElementById('openQuoteForm');
  const toggleSound = document.getElementById('toggleSound');
  const shareButton = openQuoteForm?.nextElementSibling;
  const splineModal = document.getElementById('opensplinemodal');

  if (openQuoteForm) {
    tooltipManager.create(openQuoteForm, 'Request Quote', 'bottom-right');
  }
  if (shareButton) {
    tooltipManager.create(shareButton, 'Share', 'bottom-right');
  }
  if (toggleSound) {
    tooltipManager.create(toggleSound, 'Toggle Sound', 'bottom-right');
  }
  if (splineModal) {
    tooltipManager.create(splineModal, '3D View', 'bottom-left');
  }

  // Keep existing wheel tooltips functionality but position them at the bottom
  const wheelTooltips = document.querySelectorAll('[data-wheel-tooltip]');
  wheelTooltips.forEach(element => {
    const tooltipText = element.getAttribute('data-wheel-tooltip');
    tooltipManager.create(element, tooltipText, 'bottom');
  });
})();

(async function getUrlParams() {
  const hasPreloaderQueryParam = window.location.search.includes('?preloader=true');
  const params = new URLSearchParams(window.location.search);

  const hasCarQueryParam = params.get('car-model');
  const hasWheelQueryParam = params.get('wheel-model');
  const hasWheelColorQueryParam = params.get('wheel-color');
  const hasCarColorQueryParam = params.get('car-color');
  const hasViewQueryParam = params.get('view');

  hasQueryParams = hasCarQueryParam && hasWheelQueryParam && hasWheelColorQueryParam && hasCarColorQueryParam && hasViewQueryParam;

  if (hasPreloaderQueryParam) {
    preloader();
  } else {
    // remove preloader
    const preloader = document.querySelector('#preloader-wrap');
    if (preloader) {
      preloader.remove();
    }

    if (!hasQueryParams) {
      await window.initializeData();
      await window.defineEnterFunctions();
    } else {
      gsap.set('#search-modal', { display: 'none' });

      await window.initializeData();
      await window.defineEnterFunctions();

      Wized.data.v.carModel = hasCarQueryParam;
      Wized.data.v.wheelModel = hasWheelQueryParam;
      Wized.data.v.wheelColor = hasWheelColorQueryParam;
      Wized.data.v.carColor = hasCarColorQueryParam;
      Wized.data.v.view = hasViewQueryParam;

      switchCar(Wized.data.v.carModel);
    }
  }
})();

document.querySelectorAll('[w-el="control-view"]').forEach(control => {
  control.addEventListener('click', event => {
    const controlValue = event.currentTarget.getAttribute('view');
    Wized.data.v.view = controlValue;

    window.changeNavTabs('view');
  });
});

document.querySelectorAll('[w-el="control-navigation-step"]').forEach(control => {
  control.addEventListener('click', event => {
    const controlValue = event.currentTarget.getAttribute('step');
    Wized.data.v.navigationStep = controlValue;
  });
});
