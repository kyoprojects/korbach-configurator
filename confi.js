// Mobile scroll disabler has been removed

const isMobile = window.innerWidth < 768;

// Hide quote form on page load
const quoteForm = document.getElementById('openQuoteForm');
if (quoteForm) {
  gsap.set(quoteForm, { opacity: 0, y: 20 });
}

// Function to check if device is in landscape orientation
function isLandscapeOrientation() {
  return window.innerHeight < window.innerWidth;
}

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
                    window.initializeShareModal(); // Initialize share modal
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

// Function to create share modal HTML
function createShareModal() {
  const shareModalHTML = `
    <div id="shareOverlay" class="share-overlay" style="display: none;">
      <div id="sharePseudo" class="share-pseudo"></div>
      <div class="share-container">
        <div class="share-modal">
          <div class="share-modal-inner">
            <div class="share-header">
              <div class="share-config-info">
                <div class="share-config-details">
                  <div class="share-config-row">
                    <span class="share-label" id="shareCarName">Porsche Taycan</span>
                    <span class="share-value" id="shareCarColor">Dolomite Silver</span>
                  </div>
                  <div class="share-config-row">
                    <span class="share-label" id="shareWheelModel">PS3</span>
                    <span class="share-value" id="shareWheelName">Porsche Taycan</span>
                  </div>
                </div>
                <div class="share-thumbnail" id="shareThumbnail"></div>
              </div>
            </div>
            
            <div class="share-modal-body">
              <div class="share-options">
            <button class="share-option active" id="copyLinkBtn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy link</span>
            </button>
            <button class="share-option" id="emailShareBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>E-mail</span>
            </button>
            <button class="share-option" id="whatsappShareBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Whatsapp</span>
            </button>
          </div>
          
          <label for="includeConfigToggle" class="share-toggle-section">
            <div class="share-toggle-wrapper">
              <div class="share-toggle-content">
                <div class="share-toggle-text">
                  <label class="share-toggle-label">Include current configuration</label>
                  <p class="share-toggle-text">Copy your configuration and share it with your friends</p>
                </div>
                <label class="share-toggle">
                  <input type="checkbox" id="includeConfigToggle" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </label>
          
          <div class="share-link-section" id="linkSection">
            <div class="share-link-box">
              <span class="share-link-text" id="shareLinkText">Loading...</span>
              <button class="copy-icon-btn" id="copyIconBtn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="share-email-section" id="emailSection" style="display: none;">
            <form id="shareEmailForm" class="share-email-form">
              <div class="email-form-group">
                <input type="email" id="recipientEmail" class="email-input" placeholder="Enter email address" required>
              </div>
              <div class="email-form-group">
                <textarea id="emailMessage" class="email-textarea" placeholder="Add a personal message (optional)" rows="3"></textarea>
              </div>
              <div class="email-form-actions">
                <button type="submit" class="email-send-btn">Send Email</button>
              </div>
            </form>
            <div class="email-success-message" id="emailSuccess" style="display: none;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="success-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <p>Email sent successfully!</p>
            </div>
          </div>
          
          <div class="share-whatsapp-section" id="whatsappSection" style="display: none;">
            <div class="whatsapp-share-content">
              <p class="whatsapp-share-description">Share your configuration via WhatsApp</p>
              <button type="button" class="whatsapp-share-btn" id="whatsappShareButton">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Share to WhatsApp</span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject the modal HTML into the body
  document.body.insertAdjacentHTML('beforeend', shareModalHTML);
}

let searchModalOpen = false;
let firstSearchModalInteraction = true;
let hasQueryParams;

// Add at the top with other window functions
window.updateUrlParams = async function () {
  // // Use requestAnimationFrame to ensure this runs after other UI updates
  // requestAnimationFrame(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   // Update params only if values exist
  //   if (Wized.data.v.carModel) params.set('car-model', Wized.data.v.carModel);
  //   if (Wized.data.v.wheelModel) params.set('wheel-model', Wized.data.v.wheelModel);
  //   if (Wized.data.v.wheelColor) params.set('wheel-color', Wized.data.v.wheelColor);
  //   if (Wized.data.v.carColor) params.set('car-color', Wized.data.v.carColor);
  //   if (Wized.data.v.view) params.set('view', Wized.data.v.view);
  //   console.log('params', JSON.stringify(params, null, 2));
  //   // Update URL without reloading the page
  //   window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  // });
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
        if (isLandscapeOrientation()) {
          // In landscape, use desktop-like horizontal positioning
          tooltip.style.left = '100%';
          tooltip.style.top = '50%';
          tooltip.style.bottom = 'auto';
          tooltip.style.transform = 'translateY(-50%) translateX(-10px)';
          tooltip.style.marginLeft = '12px';
          tooltip.style.marginBottom = '0';
        } else {
          // In portrait, position tooltip above the element instead of to the right
          tooltip.style.left = '50%';
          tooltip.style.top = 'auto';
          tooltip.style.bottom = '100%';
          tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
          tooltip.style.marginLeft = '0';
          tooltip.style.marginBottom = '5px';

          // Modify the arrow to point down instead of left
          tooltip.style.setProperty('--tooltip-arrow-position', 'bottom');
        }

        // We no longer add mobile-visible class here
        // This is now handled in the changeNavTabs callback
        // to ensure tooltips only show after animation completes
      }

      const labelSpan = document.createElement('span');
      labelSpan.style.opacity = '0.5';
      labelSpan.textContent = label;

      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;

      tooltip.appendChild(labelSpan);
      tooltip.appendChild(valueSpan);

      menuItem.appendChild(tooltip);

      // Add mobile touch events for auto-hide behavior
      if (isMobile) {
        menuItem.addEventListener('touchstart', () => {
          // Clear any existing timer for this tooltip
          if (tooltip.hideTimer) {
            clearTimeout(tooltip.hideTimer);
          }

          // Show tooltip
          tooltip.classList.add('mobile-visible');

          // Set timer to auto-hide after 2 seconds
          tooltip.hideTimer = setTimeout(() => {
            tooltip.classList.remove('mobile-visible');
          }, 2000);
        });
      }
    });
  };

  // Handle orientation changes for mobile tooltips
  if (isMobile) {
    window.addEventListener('orientationchange', () => {
      // Wait for orientation change to complete
      setTimeout(() => {
        // Update tooltips with new orientation
        updateControlTooltips();
      }, 100);
    });

    // Also handle resize events as a fallback
    window.addEventListener('resize', () => {
      if (isMobile) {
        // Debounce resize events
        clearTimeout(window.tooltipResizeTimer);
        window.tooltipResizeTimer = setTimeout(() => {
          updateControlTooltips();
        }, 150);
      }
    });
  }

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

  window.initConfigurator = async function (preserveExistingValues = false) {
    const carData = Wized.data.r.get_renders.data.find(item => item.model == Wized.data.v.carModel);

    // Set initial colors/models
    const newCarColor = carData.renders.find(render => render.model == null).color;
    const newWheelModel = carData.renders.find(render => render.model !== null).model;

    if (!preserveExistingValues) {
      Wized.data.v.carColor = newCarColor;
      Wized.data.v.wheelModel = newWheelModel;
    }

    // Get only the critical images we need right now
    const criticalImages = [
      // Current car render
      carData.renders.find(render => render.view === Wized.data.v.view && render.color === Wized.data.v.carColor && render.car_model === Wized.data.v.carModel)?.image,
      // Current wheel render
      carData.renders.find(render => render.view === Wized.data.v.view && render.model === Wized.data.v.wheelModel)?.image
    ].filter(Boolean);

    // Preload only critical images
    await preloadImages(criticalImages);

    // temporarily disable for mobile performance debugging
    // lazyLoadImages(criticalImages);

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

    // We no longer update tooltips here for car transitions
    // This is now handled in the changeNavTabs callback
    // to ensure tooltips only show after animation completes
    if (transitionType !== 'car') {
      window.updateControlTooltips();
    }

    window.initCloseUpSlider();

    // Update share modal content if it exists
    if (window.updateShareModalContent && document.getElementById('shareThumbnail')) {
      window.updateShareModalContent();
    }

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
          // For view transitions, just animate the white overlay (no logo)
          tl.to({}, { duration: 0.3 }) // Brief delay for consistency
            // Directly fade out overlay and scale images (skip logo animation)
            .to('[overlay="white"]', {
              autoAlpha: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                // Always ensure logo-loader is hidden
                gsap.set('[logo-loader]', { display: 'none' });
                // Hide preselect loading text
                const loadingText = document.querySelector('#preselect-loading-text');
                if (loadingText) {
                  gsap.to('#preselect-loading-text', { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power2.out' });
                }
              }
            })
            .to(
              '#images-wrapper',
              {
                scale: 1.08,
                duration: 0.3,
                ease: 'expo.out'
              },
              '-=0.1'
            );
        } else if (transitionType == 'car') {
          if (firstSearchModalInteraction == false) {
            setTimeout(() => {
              animateControlsIn();
            }, 100);

            // Only animate and delay for logo if not the first interaction
            if (firstSearchModalInteraction !== true) {
              // Ensure logo is visible for at least 1 sec total
              tl.to({}, { duration: 0.6 }) // Add delay to ensure minimum 1sec visibility (0.4s from entrance + 0.6s = 1sec)
                // First animate out the logo
                .to('[logo-loader]', {
                  autoAlpha: 0,
                  scale: 1.2,
                  duration: 0.3,
                  ease: 'power2.in'
                });
            }

            // Then fade out the white overlay and scale images
            tl.to('[overlay="white"]', {
              autoAlpha: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                // Hide the logo-loader again
                gsap.set('[logo-loader]', { display: 'none' });
                // Hide preselect loading text
                const loadingText = document.querySelector('#preselect-loading-text');
                if (loadingText) {
                  gsap.to('#preselect-loading-text', { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power2.out' });
                }
              }
            }).to(
              '#images-wrapper',
              {
                scale: 1.08,
                duration: 0.3,
                ease: 'expo.out'
              },
              '-=0.1'
            );
          }
        } else {
          resolve();
        }
      });
    });
  };
};

// // Helper function to handle navbar option hover effect on dividers
// function setupNavbarOptionHoverEffects() {
//   // Check if browser supports :has selector
//   const supportsHasSelector = CSS.supports('selector(:has(*))');

//   // Only need JavaScript fallback if :has is not supported
//   if (!supportsHasSelector) {
//     const navbarOptions = document.querySelectorAll('.navbar-option');

//     navbarOptions.forEach(option => {
//       option.addEventListener('mouseenter', () => {
//         // Add hover class
//         option.classList.add('hovered-option');

//         // Find previous divider and add class
//         let prevElement = option.previousElementSibling;
//         if (prevElement && prevElement.classList.contains('dark-divider')) {
//           prevElement.classList.add('prev-divider');
//         }
//       });

//       option.addEventListener('mouseleave', () => {
//         // Remove hover class
//         option.classList.remove('hovered-option');

//         // Remove class from previous divider
//         document.querySelectorAll('.prev-divider').forEach(el => {
//           el.classList.remove('prev-divider');
//         });
//       });
//     });
//   }
// }

// Store the previous navigation step when modal is opened
let previousNavigationStep = '';
let isCarModalOpen = false;

// Function to update active navbar option based on current navigation step or modal state
function updateActiveNavbarOption() {
  // Get current navigation step from Wized
  const navigationStep = Wized.data.v.navigationStep || '';

  // Check if browser supports :has selector
  const supportsHasSelector = CSS.supports('selector(:has(*))');

  // First, clear all previous states
  document.querySelectorAll('.navbar-option').forEach(option => {
    option.classList.remove('selected');
  });

  document.querySelectorAll('.prev-divider-selected').forEach(el => {
    el.classList.remove('prev-divider-selected');
  });

  // Determine which step should be active
  let activeStep = navigationStep;

  // If car modal is open, set car-model as active regardless of navigation step
  if (isCarModalOpen) {
    activeStep = 'car-model';
  }

  // Find and highlight the active option
  if (activeStep) {
    const activeOption = document.querySelector(`.navbar-option[step="${activeStep}"]`);
    if (activeOption) {
      activeOption.classList.add('selected');

      // Handle the divider before the selected option for browsers that don't support :has()
      if (!supportsHasSelector) {
        const prevElement = activeOption.previousElementSibling;
        if (prevElement && prevElement.classList.contains('dark-divider')) {
          prevElement.classList.add('prev-divider-selected');
        }
      }
    }
  }
}

window.defineEnterFunctions = async function () {
  gsap.set('#images-wrapper', { scale: 1 });

  // Setup navbar option hover effects
  // setupNavbarOptionHoverEffects();

  // Set up Wized variable change listener for updating active state
  Wized.reactivity.watch(() => Wized.data.v.navigationStep, updateActiveNavbarOption);

  // Initial update
  updateActiveNavbarOption();

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
        .to(
          document.querySelector('#preselect-loading-text') || {},
          {
            autoAlpha: 0,
            y: -10,
            duration: 0.5,
            ease: 'power2.out'
          },
          '-=0.4'
        )
        .fromTo(
          '[overlay="white"]',
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              // Add disclaimer animations after dock animates in
              if (!disclaimerAnimationTriggered) {
                console.log('Triggering disclaimer animations for the first time');
                disclaimerAnimationTriggered = true;
                setTimeout(() => {
                  animateMobileDisclaimer();
                  animateDesktopDisclaimer();
                }, 800); // Wait for dock animation to complete
              } else {
                console.log('Disclaimer animations already triggered, skipping');
              }
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

    // Store the current navigation step and set car modal flag
    previousNavigationStep = Wized.data.v.navigationStep || '';
    isCarModalOpen = true;

    // Update the active navbar option to show car-model as selected
    updateActiveNavbarOption();

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

        // Reset car modal flag and restore previous navigation step selection
        isCarModalOpen = false;

        // Update the active navbar option back to the previous selection
        updateActiveNavbarOption();

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

  if (isMobile) return;

  // Helper function to add/remove a class to a sibling at a given off-set
  const toggleSiblingClass = (items, index, offset, className, add) => {
    const sibling = items[index + offset];
    if (sibling) {
      sibling.classList.toggle(className, add);
    }
  };

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

// Flags to prevent multiple disclaimer animations
let desktopDisclaimerAnimated = false;
let mobileDisclaimerAnimated = false;
let disclaimerAnimationTriggered = false;

function animateDesktopDisclaimer() {
  console.log('animateDesktopDisclaimer called, isMobile:', isMobile);

  // Only show disclaimer on desktop devices
  if (isMobile) {
    console.log('Mobile device, skipping desktop disclaimer');
    return;
  }

  // Prevent multiple animations
  if (desktopDisclaimerAnimated) {
    console.log('Desktop disclaimer already animated, skipping');
    return;
  }

  const disclaimer = document.querySelector('#disclaimer');
  console.log('Found desktop disclaimer element:', disclaimer);

  if (!disclaimer) {
    console.log('No disclaimer element found with ID #disclaimer');
    return;
  }

  console.log('Starting desktop disclaimer animation');
  desktopDisclaimerAnimated = true;

  // Show and animate the existing disclaimer
  disclaimer.style.display = 'flex';
  gsap.fromTo(disclaimer, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

  // Hide after 5 seconds
  setTimeout(() => {
    console.log('Hiding desktop disclaimer after timeout');
    gsap.to(disclaimer, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        disclaimer.style.display = 'none';
        console.log('Desktop disclaimer hidden');

        // Animate in quote form 0.5s after disclaimer is hidden
        setTimeout(() => {
          const quoteForm = document.getElementById('openQuoteForm');
          if (quoteForm) {
            gsap.fromTo(quoteForm, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, ease: 'back.out(1.2)' });
          }
        }, 500);
      }
    });
  }, 5000);
}

function animateMobileDisclaimer() {
  console.log('animateMobileDisclaimer called, isMobile:', isMobile, 'mobileDisclaimerAnimated:', mobileDisclaimerAnimated);

  // Only show disclaimer on mobile devices
  if (!isMobile) {
    console.log('Not mobile device, skipping disclaimer');
    return;
  }

  // Prevent multiple animations
  if (mobileDisclaimerAnimated) {
    console.log('Mobile disclaimer already animated, skipping');
    return;
  }

  const disclaimer = document.querySelector('#disclaimermobile');
  console.log('Found disclaimer element:', disclaimer);

  if (!disclaimer) {
    console.log('No disclaimer element found with ID #disclaimermobile');
    return;
  }

  console.log('Starting mobile disclaimer animation');
  mobileDisclaimerAnimated = true;

  // Show and animate the existing disclaimer
  disclaimer.style.display = 'flex';

  // Disable any CSS transitions that might interfere with GSAP
  disclaimer.style.transition = 'none';

  // Clear any existing GSAP animations on this element
  gsap.killTweensOf(disclaimer);

  gsap.fromTo(disclaimer, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

  // Hide after 5 seconds
  setTimeout(() => {
    console.log('Hiding disclaimer after timeout');
    gsap.to(disclaimer, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        disclaimer.style.display = 'none';
        console.log('Disclaimer hidden');

        // Animate in quote form 0.5s after disclaimer is hidden
        setTimeout(() => {
          const quoteForm = document.getElementById('openQuoteForm');
          if (quoteForm) {
            gsap.fromTo(quoteForm, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, ease: 'back.out(1.2)' });
          }
        }, 500);
      }
    });
  }, 5000);
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
    const spinner = document.getElementById('splineSpinner');
    const defaultIcon = document.getElementById('splineDefaultIcon');
    let sceneReady = false;

    // Show loading state
    if (spinner) spinner.style.display = 'flex';
    if (defaultIcon) defaultIcon.style.display = 'none';

    // Initialize iframe src if not already loaded
    if (iframe && !iframe.src) {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.includes('configurator.korbachforged.com') ? 'https://korbach-spline.netlify.app/' : 'http://localhost:5173';

      iframe.src = baseUrl;

      // Add mouse movement tracking for desktop
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (!isMobile && !iframe.dataset.mouseListenerAdded) {
        document.addEventListener('mousemove', e => {
          if (iframe) {
            iframe.contentWindow.postMessage(
              {
                type: 'MOUSE_MOVE',
                normalizedX: e.clientX / window.innerWidth,
                normalizedY: e.clientY / window.innerHeight
              },
              '*'
            );
          }
        });
        iframe.dataset.mouseListenerAdded = 'true';
      }

      // Listen for page initialization and then change scene
      if (!iframe.dataset.initListenerAdded) {
        const handleMessage = e => {
          if (e.data.type === 'IFRAME_INIT' && e.data.status === 'framework_ready') {
            iframe.contentWindow.postMessage(
              {
                type: 'CHANGE_SCENE',
                url: Wized.data.r.get_wheels.data.find(w => w.model == Wized.data.v.wheelModel).spline
              },
              '*'
            );
            window.removeEventListener('message', handleMessage);
          }
        };
        window.addEventListener('message', handleMessage);
        iframe.dataset.initListenerAdded = 'true';
      }
    }

    // Send scene change message and wait for scene_rendered
    if (iframe) {
      const handleSceneRendered = e => {
        if (e.data.type === 'APP_INITIALIZED' && e.data.status === 'ready') {
          sceneReady = true;
          // Hide loading state
          if (spinner) spinner.style.display = 'none';
          if (defaultIcon) defaultIcon.style.display = 'flex';

          // Add small timeout before starting animation
          setTimeout(() => {
            startSplineModalAnimation();
          }, 100);

          window.removeEventListener('message', handleSceneRendered);
        }
      };

      window.addEventListener('message', handleSceneRendered);

      iframe.contentWindow.postMessage(
        {
          type: 'CHANGE_SCENE',
          url: Wized.data.r.get_wheels.data.find(w => w.model == Wized.data.v.wheelModel).spline
        },
        '*'
      );
    }

    // Only start animation if scene is already ready (subsequent opens)
    if (sceneReady) {
      setTimeout(() => {
        startSplineModalAnimation();
      }, 100);
    }
  }

  function startSplineModalAnimation() {
    animateControlsOut();

    // Hide thumbs up before opening modal
    const thumbsUp = document.getElementById('spline-thumbsup');
    if (thumbsUp) {
      gsap.set(thumbsUp, { y: 30, opacity: 0 });
    }

    gsap.set('#splineOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });
    gsap.set('#splineContainer', { display: 'flex', opacity: 0, autoAlpha: 0, y: '100%', scale: 0, width: '10%' });

    // Mobile scroll disabler has been removed

    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }, '<')
      .to('#splineOverlay', { duration: 0.2, opacity: 1, autoAlpha: 1, ease: 'power2.expo' }, '<')
      .fromTo('#splineContainer', { y: '100%', scale: 0, autoAlpha: 0 }, { duration: 0.1, y: '0%', scale: 1, autoAlpha: 1, ease: 'power2.inOut' })
      .fromTo('#splineContainer', { width: '5%' }, { duration: 0.2, width: '100%', ease: 'power2.inOut' })
      .fromTo('#splineScene', { scale: 0.3, y: 200, autoAlpha: 0 }, { duration: 0.3, scale: 1, y: 0, autoAlpha: 1, ease: 'power4.out' }, '-=0.3')
      .call(() => {
        console.log('Spline animation call triggered');
        // Show thumbs up animation only once per page load
        if (!window.splineThumbsUpShown) {
          console.log('Thumbs up not shown yet, checking for element...');
          const thumbsUp = document.getElementById('spline-thumbsup');
          console.log('Thumbs up element found:', thumbsUp);
          if (thumbsUp) {
            console.log('Starting thumbs up animation...');
            // Reset and show
            gsap.set(thumbsUp, { y: 30, opacity: 0 });
            console.log('GSAP set applied');

            // Animate in up
            gsap.to(thumbsUp, {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                console.log('Thumbs up fade in complete');
                // Wait 3 seconds then animate out down
                gsap.delayedCall(3, () => {
                  console.log('Starting thumbs up fade out...');
                  gsap.to(thumbsUp, {
                    y: -30,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                      console.log('Thumbs up animation complete');
                      // Reset for next time
                      gsap.set(thumbsUp, { y: 30, opacity: 0 });
                      // Set flag only after animation completes
                      window.splineThumbsUpShown = true;
                      console.log('Page flag set after animation completion');
                    }
                  });
                });
              }
            });
            console.log('Animation started, will set flag after completion');
          } else {
            console.log('Thumbs up element not found!');
          }
        } else {
          console.log('Thumbs up already shown this page load');
        }
      });
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

(async function shareModalTransitions() {
  function updateShareModalContent() {
    // Get current configuration
    const carData = Wized.data.r.get_renders?.data?.find(item => item.model === Wized.data.v.carModel);
    if (!carData) return;

    // Update car info
    document.getElementById('shareCarName').textContent = `${carData.brand} ${carData.name}`;
    document.getElementById('shareCarColor').textContent = (Wized.data.v.carColor || '')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Update wheel info
    document.getElementById('shareWheelModel').textContent = (Wized.data.v.wheelModel || '').toUpperCase();

    // Format wheel color same as in configuration tooltips
    const wheelColors = {
      gloss_black: 'Gloss Black',
      gloss_bronze: 'Gloss Bronze',
      gloss_titanium: 'Gloss Titanium',
      satin_black: 'Satin Black',
      satin_bronze: 'Satin Bronze',
      satin_grey: 'Satin Grey'
    };

    document.getElementById('shareWheelName').textContent = wheelColors[Wized.data.v.wheelColor] || Wized.data.v.wheelColor || 'Not selected';

    // Create composed thumbnail with car + wheel overlay
    createComposedThumbnail(carData);

    // Update the share link with current configuration
    updateShareLink();
  }

  function createComposedThumbnail(carData) {
    const thumbnailElement = document.getElementById('shareThumbnail');

    // Get car and wheel images for front view
    const carImage = carData.renders?.find(render => render.view === 'front' && render.color === Wized.data.v.carColor && render.car_model === Wized.data.v.carModel)?.image;

    const wheelImage = carData.renders?.find(render => render.view === 'front' && render.model === Wized.data.v.wheelModel && render.color === Wized.data.v.wheelColor)?.image;

    if (!carImage || !wheelImage) {
      // Fallback to single image or default thumbnail
      const fallbackUrl = carImage || carData.thumbnail || '';
      thumbnailElement.style.backgroundImage = fallbackUrl ? `url('${fallbackUrl}')` : '';
      return;
    }

    // Clear existing content
    thumbnailElement.innerHTML = '';
    thumbnailElement.style.backgroundImage = '';

    // Create container for layered images
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 10px;
    `;

    // Create car base image
    const carImg = document.createElement('img');
    carImg.src = carImage;
    carImg.alt = 'Car configuration';
    carImg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    `;

    // Create wheel overlay image
    const wheelImg = document.createElement('img');
    wheelImg.src = wheelImage;
    wheelImg.alt = 'Wheel overlay';
    wheelImg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    `;

    // Add images to container
    imageContainer.appendChild(carImg);
    imageContainer.appendChild(wheelImg);

    // Add container to thumbnail element
    thumbnailElement.appendChild(imageContainer);
  }

  function updateShareLink() {
    const includeConfig = document.getElementById('includeConfigToggle').checked;
    const baseUrl = 'https://configurator.korbachforged.com/';

    let shareUrl = baseUrl;
    const params = new URLSearchParams();

    // Add configuration parameters if enabled
    if (includeConfig) {
      if (Wized.data.v.carModel) params.set('car-model', Wized.data.v.carModel);
      if (Wized.data.v.wheelModel) params.set('wheel-model', Wized.data.v.wheelModel);
      if (Wized.data.v.wheelColor) params.set('wheel-color', Wized.data.v.wheelColor);
      if (Wized.data.v.carColor) params.set('car-color', Wized.data.v.carColor);
      if (Wized.data.v.view) params.set('view', Wized.data.v.view);
    }

    // Add UTM parameters for tracking
    params.set('utm_source', 'configurator');
    params.set('utm_medium', 'share');
    params.set('utm_campaign', 'configuration_sharing');
    params.set('utm_content', 'share_modal');

    shareUrl = `${baseUrl}?${params.toString()}`;

    // Truncate display text but keep full URL for copying
    const displayText = shareUrl.length > 60 ? shareUrl.substring(0, 57) + '...' : shareUrl;
    document.getElementById('shareLinkText').textContent = displayText;
    document.getElementById('shareLinkText').setAttribute('data-full-url', shareUrl);
  }

  function copyToClipboard(text, sourceElement = null) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback on the link box instead of button
      const linkBox = document.querySelector('.share-link-box');
      const linkText = document.getElementById('shareLinkText');
      const originalText = linkText.textContent;

      linkText.textContent = 'Copied!';
      linkBox.classList.add('copied');

      setTimeout(() => {
        linkText.textContent = originalText;
        linkBox.classList.remove('copied');
      }, 2000);
    });
  }

  function showShareModal() {
    updateShareModalContent();
    updateShareLink();
    gsap.set('#shareOverlay', { display: 'flex', opacity: 0, autoAlpha: 0 });

    let tl = gsap.timeline();
    tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }, '<').to('#shareOverlay', { duration: 0.2, opacity: 1, autoAlpha: 1, ease: 'power2.expo' }, '<');
  }

  function hideShareModal() {
    let tl = gsap.timeline();
    tl.to('#shareOverlay', {
      duration: 0.2,
      opacity: 0,
      autoAlpha: 0,
      ease: 'power2.expo',
      onComplete: () => {
        gsap.set('#shareOverlay', { display: 'none' });
      }
    }).to('#images-wrapper', { scale: 1.08, duration: 0.2, ease: 'expo.out' }, '<');
  }

  // Initialize share modal after DOM is ready
  window.initializeShareModal = function () {
    createShareModal();

    // Set up reactivity watchers for real-time updates
    if (typeof Wized !== 'undefined' && Wized.reactivity) {
      // Watch for car model changes
      Wized.reactivity.watch(
        () => Wized.data.v.carModel,
        () => {
          if (document.getElementById('shareThumbnail')) {
            updateShareModalContent();
          }
        }
      );

      // Watch for car color changes
      Wized.reactivity.watch(
        () => Wized.data.v.carColor,
        () => {
          if (document.getElementById('shareThumbnail')) {
            updateShareModalContent();
          }
        }
      );

      // Watch for wheel model changes
      Wized.reactivity.watch(
        () => Wized.data.v.wheelModel,
        () => {
          if (document.getElementById('shareThumbnail')) {
            updateShareModalContent();
          }
        }
      );

      // Watch for wheel color changes
      Wized.reactivity.watch(
        () => Wized.data.v.wheelColor,
        () => {
          if (document.getElementById('shareThumbnail')) {
            updateShareModalContent();
          }
        }
      );
    }

    const shareButton = document.querySelector('#openShareModal');
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        showShareModal();
        animateControlsOut();
      });
    }

    // Share option buttons
    const shareOptions = document.querySelectorAll('.share-option');
    const linkSection = document.getElementById('linkSection');
    const emailSection = document.getElementById('emailSection');
    const whatsappSection = document.getElementById('whatsappSection');
    const toggleSection = document.querySelector('.share-toggle-section');

    shareOptions.forEach(option => {
      option.addEventListener('click', function () {
        shareOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        // Hide all sections first
        linkSection.style.display = 'none';
        emailSection.style.display = 'none';
        whatsappSection.style.display = 'none';
        toggleSection.style.display = 'none';

        // Show appropriate section based on selected option
        if (this.id === 'emailShareBtn') {
          emailSection.style.display = 'flex';
        } else if (this.id === 'whatsappShareBtn') {
          whatsappSection.style.display = 'flex';
        } else {
          // Copy link option
          linkSection.style.display = 'flex';
          toggleSection.style.display = 'block';
        }

        // Reset email form when switching away
        if (this.id !== 'emailShareBtn') {
          document.getElementById('shareEmailForm').reset();
          document.getElementById('emailSuccess').style.display = 'none';
          document.getElementById('shareEmailForm').style.display = 'flex';
        }
      });
    });

    // Copy link functionality
    document.getElementById('copyLinkBtn').addEventListener('click', () => {
      const fullUrl = document.getElementById('shareLinkText').getAttribute('data-full-url');
      copyToClipboard(fullUrl);
    });

    document.getElementById('copyIconBtn').addEventListener('click', e => {
      e.stopPropagation(); // Prevent triggering the link box click
      const fullUrl = document.getElementById('shareLinkText').getAttribute('data-full-url');
      copyToClipboard(fullUrl);
    });

    // Make entire link box clickable
    document.querySelector('.share-link-box').addEventListener('click', () => {
      const fullUrl = document.getElementById('shareLinkText').getAttribute('data-full-url');
      copyToClipboard(fullUrl);
    });

    // Email form submission
    document.getElementById('shareEmailForm').addEventListener('submit', async e => {
      e.preventDefault();

      const recipientEmail = document.getElementById('recipientEmail').value;
      const personalMessage = document.getElementById('emailMessage').value;

      // Construct the current URL with all query parameters and UTM tracking
      const includeConfig = document.getElementById('includeConfigToggle').checked;
      const baseUrl = 'https://configurator.korbachforged.com/';
      const params = new URLSearchParams();

      // Add configuration parameters if enabled
      if (includeConfig) {
        if (Wized.data.v.carModel) params.set('car-model', Wized.data.v.carModel);
        if (Wized.data.v.wheelModel) params.set('wheel-model', Wized.data.v.wheelModel);
        if (Wized.data.v.wheelColor) params.set('wheel-color', Wized.data.v.wheelColor);
        if (Wized.data.v.carColor) params.set('car-color', Wized.data.v.carColor);
        if (Wized.data.v.view) params.set('view', Wized.data.v.view);
      }

      // Add email-specific UTM parameters for tracking
      params.set('utm_source', 'email');
      params.set('utm_medium', 'share');
      params.set('utm_campaign', 'configuration_sharing');
      params.set('utm_content', 'email_share');

      const fullUrl = `${baseUrl}?${params.toString()}`;

      // Get current configuration details
      const carData = Wized.data.r.get_renders?.data?.find(item => item.model === Wized.data.v.carModel);
      const carName = `${carData.brand} ${carData.name}`;
      const carColor = (Wized.data.v.carColor || '')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const wheelModel = (Wized.data.v.wheelModel || '').toUpperCase();

      // Prepare email content
      const subject = 'Check out this Korbach Forged configuration';
      let body = `Hi,\n\n`;

      if (personalMessage) {
        body += `${personalMessage}\n\n`;
      }

      body += `I wanted to share this amazing wheel configuration with you:\n\n`;
      body += `Car: ${carName} in ${carColor}\n`;
      body += `Wheels: ${wheelModel}\n\n`;
      body += `View the full configuration here: ${fullUrl}\n\n`;
      body += `Best regards,\nKorbach Forged Configurator`;

      const sendButton = e.target.querySelector('.email-send-btn');
      sendButton.textContent = 'Sending...';
      sendButton.disabled = true;

      try {
        // Send to n8n webhook
        const webhookData = {
          currentUrl: fullUrl,
          emailToSendTo: recipientEmail,
          personalMessage: personalMessage
        };

        const response = await fetch('https://n8n.srv865019.hstgr.cloud/webhook/configurator-sharing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Show success message
        document.getElementById('shareEmailForm').style.display = 'none';
        document.getElementById('emailSuccess').style.display = 'flex';

        // Reset form after 3 seconds
        setTimeout(() => {
          document.getElementById('shareEmailForm').reset();
          document.getElementById('emailSuccess').style.display = 'none';
          document.getElementById('shareEmailForm').style.display = 'flex';
          sendButton.textContent = 'Send Email';
          sendButton.disabled = false;

          // Switch back to copy link view
          document.getElementById('copyLinkBtn').click();
        }, 3000);
      } catch (error) {
        console.error('Error sending email:', error);

        // Show error message
        sendButton.textContent = 'Error - Try Again';
        sendButton.disabled = false;

        // Reset button text after 3 seconds
        setTimeout(() => {
          sendButton.textContent = 'Send Email';
        }, 3000);
      }
    });

    // WhatsApp share button functionality
    document.getElementById('whatsappShareButton').addEventListener('click', () => {
      // Construct WhatsApp-specific URL with UTM parameters
      const includeConfig = document.getElementById('includeConfigToggle').checked;
      const baseUrl = 'https://configurator.korbachforged.com/';
      const params = new URLSearchParams();

      // Add configuration parameters if enabled
      if (includeConfig) {
        if (Wized.data.v.carModel) params.set('car-model', Wized.data.v.carModel);
        if (Wized.data.v.wheelModel) params.set('wheel-model', Wized.data.v.wheelModel);
        if (Wized.data.v.wheelColor) params.set('wheel-color', Wized.data.v.wheelColor);
        if (Wized.data.v.carColor) params.set('car-color', Wized.data.v.carColor);
        if (Wized.data.v.view) params.set('view', Wized.data.v.view);
      }

      // Add WhatsApp-specific UTM parameters
      params.set('utm_source', 'whatsapp');
      params.set('utm_medium', 'share');
      params.set('utm_campaign', 'configuration_sharing');
      params.set('utm_content', 'whatsapp_share');

      const whatsappUrl = `${baseUrl}?${params.toString()}`;

      const carData = Wized.data.r.get_renders?.data?.find(item => item.model === Wized.data.v.carModel);
      const carName = `${carData.brand} ${carData.name}`;
      const carColor = (Wized.data.v.carColor || '')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const wheelModel = (Wized.data.v.wheelModel || '').toUpperCase();

      const message = `Check out this Korbach Forged configuration:\n\n🚗 Car: ${carName} in ${carColor}\n🛞 Wheels: ${wheelModel}\n\nView here: ${whatsappUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Toggle config inclusion
    document.getElementById('includeConfigToggle').addEventListener('change', updateShareLink);

    // Prevent copy when clicking on toggle section
    document.querySelector('.share-toggle-section').addEventListener('click', e => {
      e.stopPropagation();
    });

    // Click outside to close
    document.addEventListener('click', e => {
      if (e.target.id === 'shareOverlay' || e.target.id === 'sharePseudo') {
        hideShareModal();
        animateControlsIn();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.querySelector('#shareOverlay')?.style.display === 'flex') {
        hideShareModal();
        animateControlsIn();
      }
    });
  };

  // Export functions for external access
  window.updateShareModalContent = updateShareModalContent;
})();

(async function quoteFormTransitions() {
  function showQuoteForm() {
    // Hide quote form button
    const quoteForm = document.getElementById('openQuoteForm');
    if (quoteForm) {
      gsap.to(quoteForm, { opacity: 0, y: -20, duration: 0.15, ease: 'power3.in' });
    }

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

        // Show quote form button back
        const quoteForm = document.getElementById('openQuoteForm');
        if (quoteForm) {
          gsap.to(quoteForm, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.in' });
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

window.changeNavTabs = async function (transitionType, preserveExistingValues = false) {
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
                return initConfigurator(preserveExistingValues); // Return the promise from initConfigurator
              })
              .then(() => {
                return window.updateAllLayers(transitionType);
              })
              .then(() => {
                if (transitionType == 'car') {
                  if (isMobile) {
                    // Force remove any existing tooltips first to ensure clean state
                    document.querySelectorAll('.control-tooltip').forEach(tooltip => tooltip.remove());

                    // Update tooltips to recreate them
                    updateControlTooltips();

                    // Find the car-model tooltip (should be freshly created)
                    const carTooltip = document.querySelector('[element="sidebar-item"][step="car-model"] .control-tooltip');
                    if (carTooltip) {
                      console.log('carTooltip found - showing after animation');

                      // Make it visible now that animations are complete
                      carTooltip.classList.add('mobile-visible');

                      // Auto-hide after 2 seconds
                      setTimeout(() => {
                        if (carTooltip && carTooltip.parentNode) {
                          carTooltip.classList.remove('mobile-visible');
                        }
                      }, 2000);
                    } else {
                      console.log('no carTooltip found after animation');
                    }
                  }
                }
                resolve();
              });
          } else {
            window.updateAllLayers(transitionType).then(() => {
              resolve();
            });
          }
        }
      });
      // First scale the images wrapper and fade in white overlay
      tl.to('#images-wrapper', { scale: 1, duration: 0.3, ease: 'expo.out' }).to('[overlay="white"]', { autoAlpha: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.1');

      // Only show the logo-loader if it's a car transition AND not the first interaction
      if (transitionType === 'car' && firstSearchModalInteraction !== true) {
        tl.fromTo('[logo-loader]', { display: 'block', autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1');
      }
    } else {
      resolve();
      window.updateAllLayers(transitionType);
    }
  });
};

async function switchCar(model, preserveExistingValues = false) {
  if (Wized.data.v.soundEnabled) clickSound2.play();

  closeSearchModal();

  if (firstSearchModalInteraction == false) animateControlsOut();

  Wized.data.v.carModel = model;
  await changeNavTabs('car', preserveExistingValues);

  // We no longer update tooltips here
  // Tooltips are now updated in the changeNavTabs callback
  // to ensure they only show after animation completes

  // Update share modal content after car switch
  if (window.updateShareModalContent && document.getElementById('shareThumbnail')) {
    window.updateShareModalContent();
  }

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
        } else if (event.data.type === 'openChatWidget') {
          window.openChatWidget();
        }
      }
    }
  });
})();

(async function viewControlsAnimation() {
  // Get elements
  const viewControls = document.querySelector('[show-view-controls]');
  const navContainer = document.querySelector('[nav-views-container]');
  const imagesWrapper = document.querySelector('#images-wrapper');

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
    // Flag to track if controls are visible
    let controlsVisible = false;

    // Function to show the controls
    function showControls() {
      if (isAnimating) return;
      isAnimating = true;
      controlsVisible = true;

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
      if (isAnimating) return;
      isAnimating = true;
      controlsVisible = false;

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

    // Event listeners for desktop
    if (!isMobile) {
      viewControls.addEventListener('mouseenter', showControls);
      navContainer.addEventListener('mouseenter', showControls);
      navContainer.addEventListener('mouseleave', hideControls);
    }
    // Mobile-specific event handling
    else {
      // For mobile, toggle controls on click
      viewControls.addEventListener('click', () => {
        if (controlsVisible) {
          hideControls();
        } else {
          showControls();
        }
      });

      // Close controls when clicking outside on mobile
      document.addEventListener('click', e => {
        // Only process if controls are visible
        if (!controlsVisible) return;

        // Check if click was outside the view controls and nav container
        const clickedOnControls = e.target.closest('[nav-views-container]') || e.target.closest('[show-view-controls]') || e.target.closest('.div-block-95');

        if (!clickedOnControls) {
          hideControls();
        }
      });
    }

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
  // Function to resolve the first two close-up images before showing the modal
  function resolveCloseUpImages() {
    return new Promise(resolve => {
      const closeUps = Wized.data.v.closeUps;
      if (!closeUps || closeUps.length === 0) {
        resolve();
        return;
      }

      // Get the first close-up (or first two if available)
      const firstCloseUp = closeUps[0];
      const secondCloseUp = closeUps.length > 1 ? closeUps[1] : null;

      // Pre-load images in memory first
      const carImg1 = new Image();
      const wheelImg1 = new Image();
      const carImg2 = secondCloseUp ? new Image() : null;
      const wheelImg2 = secondCloseUp ? new Image() : null;

      let carLoaded1 = false;
      let wheelLoaded1 = false;
      let carLoaded2 = !secondCloseUp; // If no second closeup, consider it loaded
      let wheelLoaded2 = !secondCloseUp; // If no second closeup, consider it loaded

      // Function to check if all required images are loaded
      const checkAllLoaded = () => {
        if (carLoaded1 && wheelLoaded1 && carLoaded2 && wheelLoaded2) {
          resolve();
        }
      };

      // Load first close-up car image
      carImg1.onload = () => {
        carLoaded1 = true;
        checkAllLoaded();
      };

      carImg1.onerror = () => {
        carLoaded1 = true;
        checkAllLoaded();
      };

      // Load first close-up wheel image
      wheelImg1.onload = () => {
        wheelLoaded1 = true;
        checkAllLoaded();
      };

      wheelImg1.onerror = () => {
        wheelLoaded1 = true;
        checkAllLoaded();
      };

      // Load second close-up images if they exist
      if (secondCloseUp) {
        carImg2.onload = () => {
          carLoaded2 = true;
          checkAllLoaded();
        };

        carImg2.onerror = () => {
          carLoaded2 = true;
          checkAllLoaded();
        };

        wheelImg2.onload = () => {
          wheelLoaded2 = true;
          checkAllLoaded();
        };

        wheelImg2.onerror = () => {
          wheelLoaded2 = true;
          checkAllLoaded();
        };
      }

      // Start loading all images
      carImg1.src = firstCloseUp.carImage;
      wheelImg1.src = firstCloseUp.wheelImage;

      if (secondCloseUp) {
        carImg2.src = secondCloseUp.carImage;
        wheelImg2.src = secondCloseUp.wheelImage;
      }
    });
  }

  async function showCloseUpAnimation() {
    // Only show if we have closeup renders
    if (!Wized.data.v.closeUps || Wized.data.v.closeUps.length === 0) return;

    // Resolve the first two close-up images before showing the modal
    await resolveCloseUpImages();

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

    // Function to manage arrow visibility
    function updateArrowVisibility() {
      // If zoomed, hide arrows
      if (isZoomed) {
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
        return;
      }

      // Show arrows with proper opacity based on current slide
      prevArrow.style.display = 'flex';
      nextArrow.style.display = 'flex';
      prevArrow.style.opacity = currentSlide === 0 ? '0.3' : '1';
      nextArrow.style.opacity = currentSlide === slides.length - 1 ? '0.3' : '1';
    }

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

        // Add direct event listeners to images for better dragging experience
        carImg.addEventListener('mousedown', e => {
          if (isZoomed) {
            e.preventDefault(); // Prevent image dragging default behavior
          }
        });

        wheelImg.addEventListener('mousedown', e => {
          if (isZoomed) {
            e.preventDefault(); // Prevent image dragging default behavior
          }
        });

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
            // Update navigation arrows visibility
            updateArrowVisibility();
            // Update zoom button icon
            zoomButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>`;

            // Center the zoom
            carImg.style.transformOrigin = '50% 50%';
            wheelImg.style.transformOrigin = '50% 50%';
            // Set cursor to grab to indicate draggability
            carImg.style.cursor = 'grab';
            wheelImg.style.cursor = 'grab';
            imageWrapper.style.cursor = 'grab';
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

          // Change cursor to grabbing during drag
          carImg.style.cursor = 'grabbing';
          wheelImg.style.cursor = 'grabbing';
          imageWrapper.style.cursor = 'grabbing';

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
            // Reset cursor to grab after drag ends
            if (isZoomed) {
              carImg.style.cursor = 'grab';
              wheelImg.style.cursor = 'grab';
              imageWrapper.style.cursor = 'grab';
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });

        slide.addEventListener('wheel', handleScroll, { passive: false });
        zoomButton.addEventListener('click', handleZoom);

        slide.appendChild(imageWrapper);
        slide.appendChild(zoomButton);
        slidesContainer.appendChild(slide);
      });

      // Update arrow visibility
      updateArrowVisibility();
    }

    function resetZoom(slide) {
      slide.classList.remove('zoomed');
      const carImg = slide.querySelector('.closeup-image-wrapper img:first-child');
      const wheelImg = slide.querySelector('.closeup-image-wrapper img:last-child');

      if (carImg) {
        carImg.style.transform = '';
        carImg.style.transformOrigin = '';
        carImg.style.cursor = '';
      }

      if (wheelImg) {
        wheelImg.style.transform = '';
        wheelImg.style.transformOrigin = '';
        wheelImg.style.cursor = '';
      }

      // Reset image wrapper cursor
      const imageWrapper = slide.querySelector('.closeup-image-wrapper');
      if (imageWrapper) {
        imageWrapper.style.cursor = '';
      }

      translateX = 0;
      translateY = 0;
      isZoomed = false;
      // Update navigation arrows visibility
      updateArrowVisibility();
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
      this.hideTimers = new Map();
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

      // Set initial transform based on position
      let initialTransform = '';
      switch (position) {
        case 'top':
          initialTransform = 'translateY(4px)';
          break;
        case 'bottom':
        case 'bottom-right':
        case 'bottom-left':
          initialTransform = 'translateY(-4px)';
          break;
        case 'left':
          initialTransform = 'translateX(4px)';
          break;
        case 'right':
          initialTransform = 'translateX(-4px)';
          break;
        default:
          initialTransform = 'translateY(4px)';
      }

      // Ensure initial state is hidden
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = initialTransform;

      // Add tooltip to DOM
      document.body.appendChild(tooltip);

      // Store reference
      this.tooltips.set(element, tooltip);

      // Add event listeners based on device type
      if (isMobile) {
        // On mobile, use click events instead of hover
        element.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          this.show(element);
          setTimeout(() => {
            this.hide(element);
          }, 2000);
        });
      } else {
        // On desktop, use hover events
        element.addEventListener('mouseenter', () => this.show(element));
        element.addEventListener('mouseleave', () => this.hide(element));
        element.addEventListener('focus', () => this.show(element));
        element.addEventListener('blur', () => this.hide(element));
      }
    }

    show(element) {
      const tooltip = this.tooltips.get(element);
      if (!tooltip) return;

      // Clear any existing hide timer
      this.clearHideTimer(element);

      // Position the tooltip
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let top, left;
      let initialTransform = '';
      let finalTransform = '';

      const position = tooltip.className.split('tooltip-')[1];
      switch (position) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          initialTransform = 'translateY(4px)';
          finalTransform = 'translateY(0)';
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          initialTransform = 'translateY(-4px)';
          finalTransform = 'translateY(0)';
          break;
        case 'bottom-right':
          top = rect.bottom + 8;
          left = rect.right - tooltipRect.width;
          initialTransform = 'translateY(-4px)';
          finalTransform = 'translateY(0)';
          break;
        case 'bottom-left':
          top = rect.bottom + 8;
          left = rect.left;
          initialTransform = 'translateY(-4px)';
          finalTransform = 'translateY(0)';
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          initialTransform = 'translateX(4px)';
          finalTransform = 'translateX(0)';
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          initialTransform = 'translateX(-4px)';
          finalTransform = 'translateX(0)';
          break;
      }

      // Apply position
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;

      // Show with animation
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = initialTransform;

      // Force a reflow to ensure the initial transform is applied
      tooltip.offsetHeight;

      // Apply the animation
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = finalTransform;
      });
    }

    showWithAutoHide(element) {
      this.show(element);

      // Set timer to auto-hide after 2 seconds on mobile
      const timer = setTimeout(() => {
        this.hide(element);
      }, 2000);

      this.hideTimers.set(element, timer);
    }

    clearHideTimer(element) {
      const timer = this.hideTimers.get(element);
      if (timer) {
        clearTimeout(timer);
        this.hideTimers.delete(element);
      }
    }

    hide(element) {
      const tooltip = this.tooltips.get(element);
      if (!tooltip) return;

      // Clear any hide timer
      this.clearHideTimer(element);

      const position = tooltip.className.split('tooltip-')[1];
      let hideTransform = '';

      // Set the correct hide transform based on position
      switch (position) {
        case 'top':
          hideTransform = 'translateY(4px)';
          break;
        case 'bottom':
        case 'bottom-right':
        case 'bottom-left':
          hideTransform = 'translateY(-4px)';
          break;
        case 'left':
          hideTransform = 'translateX(4px)';
          break;
        case 'right':
          hideTransform = 'translateX(-4px)';
          break;
        default:
          hideTransform = 'translateY(4px)';
      }

      tooltip.style.opacity = '0';
      tooltip.style.transform = hideTransform;
      setTimeout(() => {
        tooltip.style.visibility = 'hidden';
      }, 200);
    }

    remove(element) {
      const tooltip = this.tooltips.get(element);
      if (tooltip) {
        // Clear any hide timer
        this.clearHideTimer(element);
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
  const shareButton = document.getElementById('openShareModal');
  const splineModal = document.getElementById('opensplinemodal');

  if (openQuoteForm && !isMobile) {
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
      console.log('no query params');
      await window.initializeData();
      await window.defineEnterFunctions();
      window.initializeShareModal(); // Initialize share modal
    } else {
      console.log('query params');
      gsap.set('#search-modal', { display: 'none' });

      // Create loading text element
      let loadingText = document.querySelector('#preselect-loading-text');
      if (!loadingText) {
        loadingText = document.createElement('div');
        loadingText.id = 'preselect-loading-text';
        loadingText.textContent = 'Loading configuration';
        loadingText.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 100px));
          color: #666;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 1px;
          text-align: center;
          z-index: 9999999998;
          pointer-events: none;
          margin-top: 44px;
        `;
        document.body.appendChild(loadingText);
      }

      // Set initial state and animate in
      gsap.set('[overlay="white"]', {
        autoAlpha: 0,
        zIndex: 999999999
      });
      gsap.set('[logo-loader]', {
        display: 'flex',
        autoAlpha: 0,
        scale: 0.5,
        zIndex: 9999999999,
        maxHeight: '100svh',
        position: 'fixed',
        justifyContent: 'center',
        alignItems: 'center'
      });
      gsap.set('#preselect-loading-text', {
        autoAlpha: 0,
        y: 10
      });

      // Animate in the white overlay and logo loader with smoother timing
      const tl = gsap.timeline();
      tl.to('[overlay="white"]', {
        autoAlpha: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
        .to(
          '[logo-loader]',
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.4)'
          },
          '-=0.2'
        )
        .to(
          '#preselect-loading-text',
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          },
          '-=0.3'
        );

      await window.initializeData();
      await window.defineEnterFunctions();
      window.initializeShareModal(); // Initialize share modal

      Wized.data.v.carModel = hasCarQueryParam;
      Wized.data.v.wheelModel = hasWheelQueryParam;
      Wized.data.v.wheelColor = hasWheelColorQueryParam;
      Wized.data.v.carColor = hasCarColorQueryParam;
      Wized.data.v.view = hasViewQueryParam;

      console.log('values = ', {
        carModel: Wized.data.v.carModel,
        wheelModel: Wized.data.v.wheelModel,
        wheelColor: Wized.data.v.wheelColor,
        carColor: Wized.data.v.carColor,
        view: Wized.data.v.view
      });

      switchCar(Wized.data.v.carModel, true);
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

// Zoom Overlay Functionality
(function initializeZoomOverlay() {
  function createZoomOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.id = 'zoomOverlay';

    const content = document.createElement('div');
    content.className = 'zoom-overlay-content';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';

    const closeImg = document.createElement('img');
    closeImg.src = 'https://cdn.prod.website-files.com/675364fc6bb8d63cafd2bf42/68ab0675c435e679478c3366_Cancel%20Icon%20(1).svg';
    closeImg.loading = 'lazy';
    closeImg.alt = '';
    closeImg.className = 'image-32';

    closeBtn.appendChild(closeImg);
    closeBtn.addEventListener('click', closeZoomOverlay);

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'zoom-overlay-images';

    const carImg = document.createElement('img');
    carImg.className = 'zoom-overlay-car';
    carImg.alt = 'Car configuration';

    const wheelImg = document.createElement('img');
    wheelImg.className = 'zoom-overlay-wheel';
    wheelImg.alt = 'Wheel configuration';

    imagesContainer.appendChild(carImg);
    imagesContainer.appendChild(wheelImg);
    content.appendChild(closeBtn);
    content.appendChild(imagesContainer);
    overlay.appendChild(content);

    document.body.appendChild(overlay);

    return overlay;
  }

  function getCurrentConfigurationImages() {
    const data = Wized.data.r.get_renders?.data;
    if (!data) return { carImage: null, wheelImage: null };

    const carData = data.find(item => item.model === Wized.data.v.carModel);
    if (!carData) return { carImage: null, wheelImage: null };

    const carImage = carData.renders?.find(render => render.view === Wized.data.v.view && render.color === Wized.data.v.carColor && render.car_model === Wized.data.v.carModel)?.image;

    const wheelImage = carData.renders?.find(render => render.view === Wized.data.v.view && render.model === Wized.data.v.wheelModel && render.color === Wized.data.v.wheelColor)?.image;

    return { carImage, wheelImage };
  }

  function openZoomOverlay() {
    const overlay = document.getElementById('zoomOverlay') || createZoomOverlay();
    const { carImage, wheelImage } = getCurrentConfigurationImages();

    if (!carImage && !wheelImage) {
      console.warn('Could not load configuration images for zoom overlay');
      return;
    }

    const carImg = overlay.querySelector('.zoom-overlay-car');
    const wheelImg = overlay.querySelector('.zoom-overlay-wheel');

    // Set images with fallback handling
    if (carImage) {
      carImg.src = carImage;
      carImg.style.display = 'block';
    } else {
      carImg.style.display = 'none';
    }

    if (wheelImage) {
      wheelImg.src = wheelImage;
      wheelImg.style.display = 'block';
    } else {
      wheelImg.style.display = 'none';
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Prevent scrolling on mobile when overlay is open (but allow zoom)
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
  }

  function preventScroll(e) {
    if (document.getElementById('zoomOverlay')?.classList.contains('active')) {
      // Allow pinch-to-zoom gestures (multi-touch) but prevent single-touch scrolling
      if (e.touches && e.touches.length === 1) {
        e.preventDefault();
      }
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape' && document.getElementById('zoomOverlay')?.classList.contains('active')) {
      closeZoomOverlay();
    }
  }

  function closeZoomOverlay() {
    const overlay = document.getElementById('zoomOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';

      // Remove event listeners
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', handleEscapeKey);
    }
  }

  // Connect to zoom button
  function connectZoomButton() {
    const zoomButton = document.getElementById('tiltButton');
    if (zoomButton) {
      zoomButton.addEventListener('click', openZoomOverlay);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectZoomButton);
  } else {
    connectZoomButton();
  }

  // Also try to connect after a small delay in case the button is added dynamically
  setTimeout(connectZoomButton, 1000);

  // Expose functions globally for potential external access
  window.openZoomOverlay = openZoomOverlay;
  window.closeZoomOverlay = closeZoomOverlay;
})();
