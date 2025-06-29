console.log('VehicleSelectorWidget');
class VehicleSelectorWidget {
  constructor(containerId, apiKey) {
    this.container = document.getElementById(containerId);
    this.API_KEY = apiKey;
    this.BASE_URL = 'https://api.wheel-size.com/v2';

    this.makes = [];
    this.models = [];
    this.years = [];
    this.wheelSizes = [];

    this.selectedMake = '';
    this.selectedModel = '';
    this.selectedYear = '';
    this.selectedMakeData = null;

    // Config
    this.config = {
      wheelColors: [
        { id: 'gloss_black', name: 'Gloss Black', color: '#000000' },
        { id: 'gloss_bronze', name: 'Gloss Bronze', color: '#966F33' },
        { id: 'gloss_titanium', name: 'Gloss Titanium', color: '#C0C0C0' },
        { id: 'satin_black', name: 'Satin Black', color: '#1A1A1A' },
        { id: 'satin_bronze', name: 'Satin Bronze', color: '#7C5C39' },
        { id: 'satin_grey', name: 'Satin Grey', color: '#808080' }
      ]
    };

    this.init();
  }

  createFormStructure() {
    const formHtml = `
      <form id="vehicle-form" class="vehicle-selector">
        <!-- Step 1: Vehicle Selection -->
        <div class="form-step active" data-step="1">
          <div class="form-header">
            <p class="form-title">Request free quotation</p>
            <p class="form-description">Configure your vehicle and wheel preferences below to receive a personalized quotation for your perfect wheel set.</p>
          </div>

          <!-- Wheel Slider -->
          <div class="wheel-slider-container">
            <div class="swiper wheel-slider">
              <div class="swiper-wrapper">
                <!-- Wheels will be populated dynamically -->
              </div>
            </div>
          </div>

          <div class="selector-group">
            <div class="selector-item">
              <label class="select-label">Inch size</label>
              <div class="custom-select" id="inch-select">
                <div class="select-header">
                  <span>I don't know</span>
                </div>
                <div class="select-options">
                  <div class="options-container">
                    <div class="option-item selected" data-value="unknown">
                      <span>I don't know</span>
                    </div>
                    <div class="option-item" data-value="18">
                      <span>18"</span>
                    </div>
                    <div class="option-item" data-value="19">
                      <span>19"</span>
                    </div>
                    <div class="option-item" data-value="20">
                      <span>20"</span>
                    </div>
                    <div class="option-item" data-value="21">
                      <span>21"</span>
                    </div>
                    <div class="option-item" data-value="22">
                      <span>22"</span>
                    </div>
                    <div class="option-item" data-value="23">
                      <span>23"</span>
                    </div>
                    <div class="option-item" data-value="24">
                      <span>24"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="selector-item">
              <label class="select-label">Wheel color</label>
              <div class="custom-select" id="color-select">
                <div class="select-header">
                  <span class="color-option">
                    <span class="color-dot" style="background-color: #1A1A1A"></span>
                    Satin Black
                  </span>
                </div>
                <div class="select-options">
                  <div class="options-container">
                    <!-- Wheel color options will be populated by JavaScript -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="selector-group">
            <div class="selector-item">
              <label class="select-label">Your car make</label>
              <div class="custom-select" id="make-select">
                <div class="select-header">
                  <span>Make</span>
                </div>
                <div class="select-options">
                  <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search make..." />
                  </div>
                  <div class="options-container"></div>
                </div>
              </div>
            </div>
            <div class="selector-item">
              <label class="select-label">Model</label>
              <div class="custom-select disabled" id="model-select">
                <div class="select-header">
                  <span>Model</span>
                </div>
                <div class="select-options">
                  <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search model..." />
                  </div>
                  <div class="options-container"></div>
                </div>
              </div>
            </div>
            <div class="selector-item">
              <label class="select-label">Year</label>
              <div class="custom-select disabled" id="year-select">
                <div class="select-header">
                  <span>Year</span>
                </div>
                <div class="select-options">
                  <div class="options-container"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-buttons">
            <button type="button" class="form-button" id="next-step">Next</button>
          </div>
        </div>

        <!-- Step 2: Personal Information -->
        <div class="form-step" data-step="2">
          <div class="selector-group">
            <div class="selector-item">
              <label class="form-label" for="first_name">First Name</label>
              <input type="text" id="first_name" name="first_name" class="form-input" required />
            </div>
            <div class="selector-item">
              <label class="form-label" for="last_name">Last Name</label>
              <input type="text" id="last_name" name="last_name" class="form-input" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input type="email" id="email" name="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" class="form-input" required />
          </div>

          <div class="form-buttons">
            <button type="button" class="form-button" id="prev-step">Previous</button>
            <button type="submit" class="form-button">Complete</button>
          </div>
        </div>

        <!-- Success Message -->
        <div class="success-message">
          <p class="form-title">Thank you for your request!</p>
          <p class="form-description">We have received your quotation request and will get back to you shortly with a personalized offer for your perfect wheel set.</p>
        </div>
      </form>
    `;

    this.container.innerHTML = formHtml;
  }

  async init() {
    console.log('Starting widget initialization');
    try {
      // First create the form structure
      console.log('Creating form structure');
      this.createFormStructure();

      // Hide form inputs initially in production
      const isDevelopment = window.location.href.includes('localhost') || window.location.href.includes('wheelsize-widget/index.html');
      if (!isDevelopment) {
        const formInputs = this.container.querySelectorAll('.selector-group, .form-buttons');
        formInputs.forEach(el => (el.style.display = 'none'));
      }

      // Initialize all selector references
      console.log('Initializing selectors');
      this.initializeSelectors();

      // Setup basic event listeners that don't depend on API data
      console.log('Setting up basic event listeners');
      this.setupBasicEventListeners();

      // Fetch and populate makes data
      console.log('Fetching makes data');
      await this.fetchMakes();
      console.log('Makes data fetched and populated');

      // Setup form navigation last
      console.log('Setting up form navigation');
      this.setupFormNavigation();

      // Add window helpers for slider initialization (only in production)
      if (!isDevelopment) {
        // Initially hide form inputs with GSAP
        const formInputs = this.container.querySelectorAll('.selector-group, .form-buttons');
        gsap.set(formInputs, { display: 'none', opacity: 0, y: 20 });

        window.initializeQuoteFormSlider = () => {
          console.log('Initializing wheel slider');
          this.initializeWheelSlider();
          // Animate form inputs in
          const formInputs = this.container.querySelectorAll('.selector-group, .form-buttons');
          gsap.to(formInputs, {
            display: 'flex',
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'y'
          });
        };

        window.destroyQuoteFormSlider = () => {
          console.log('Destroying wheel slider');
          if (this.wheelSwiper) {
            this.wheelSwiper.destroy();
            this.wheelSwiper = null;
          }
          // Remove slider elements
          const sliderWrapper = this.container.querySelector('.swiper-wrapper');
          const activeTooltip = this.container.querySelector('.active-tooltip');
          if (sliderWrapper) sliderWrapper.innerHTML = '';
          if (activeTooltip) activeTooltip.remove();

          // Hide form inputs with animation
          const formInputs = this.container.querySelectorAll('.selector-group, .form-buttons');
          gsap.set(formInputs, { display: 'none', opacity: 0, y: 20 });
        };
      } else {
        // In development, initialize immediately
        this.initializeWheelSlider();
      }

      console.log('Widget initialization completed successfully');
    } catch (error) {
      console.error('Error during widget initialization:', error);
      throw error;
    }
  }

  initializeWheelSlider() {
    // Check if we're in development environment
    const isDevelopment = window.location.href.includes('localhost') || window.location.href.includes('wheelsize-widget/index.html');

    let wheels;
    try {
      // Use static data in development, otherwise use Wized data
      if (isDevelopment) {
        wheels = [
          {
            id: 14,
            created_at: '2025-03-13T15:54:55.690691+00:00',
            model: 'ps20',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps20_site.png'
          },
          {
            id: 7,
            created_at: '2024-12-07T02:31:26.371913+00:00',
            model: 'ps7',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels/ps7_t.png'
          },
          {
            id: 16,
            created_at: '2025-03-13T22:34:05.029554+00:00',
            model: 'ps25',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels/ps25_t.png'
          },
          {
            id: 3,
            created_at: '2024-12-07T02:31:26.371913+00:00',
            model: 'ps3',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps3_t.png'
          },
          {
            id: 5,
            created_at: '2024-12-07T02:31:26.371913+00:00',
            model: 'ps5',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps5_t.png'
          },
          {
            id: 9,
            created_at: '2024-12-07T02:31:26.371913+00:00',
            model: 'ps9',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps9_t.png'
          },
          {
            id: 10,
            created_at: '2024-12-07T02:31:26.371913+00:00',
            model: 'ps10',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps10_t.png'
          },
          {
            id: 12,
            created_at: '2025-03-13T15:54:23.096055+00:00',
            model: 'ps14',
            series: 'precision series',
            thumbnail: 'https://zneejoqfgrqzvutkituy.supabase.co/storage/v1/object/public/thumbnails/wheels//ps14_site.png'
          }
        ];
      } else {
        // Wait for Wized data to be available
        if (!window.Wized || !window.Wized.data || !window.Wized.data.r || !window.Wized.data.r.get_wheels || !window.Wized.data.r.get_wheels.data) {
          console.error('Wized data not available yet. Retrying in 1 second...');
          return new Promise(resolve => {
            setTimeout(() => {
              this.initializeWheelSlider().then(resolve);
            }, 1000);
          });
        }
        wheels = window.Wized.data.r.get_wheels.data;
      }

      if (!Array.isArray(wheels) || wheels.length === 0) {
        throw new Error('No wheel data available');
      }

      const swiperWrapper = this.container.querySelector('.swiper-wrapper');

      // Find the index of PS3 wheel
      const defaultIndex = wheels.findIndex(wheel => wheel.model === 'ps3');

      // Create slides
      wheels.forEach(wheel => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.setAttribute('data-model', wheel.model);
        slide.innerHTML = `
          <div class="wheel-slide">
            <div class="wheel-label">${wheel.model}</div>
            <img src="${wheel.thumbnail}" alt="${wheel.model}" class="wheel-image">
          </div>
        `;
        swiperWrapper.appendChild(slide);
      });

      // Create active tooltip
      const activeTooltip = document.createElement('div');
      activeTooltip.className = 'active-tooltip';
      this.container.querySelector('.wheel-slider-container').appendChild(activeTooltip);

      // Initialize Swiper
      this.wheelSwiper = new Swiper('.wheel-slider', {
        slidesPerView: 3,
        centeredSlides: true,
        loop: true,
        initialSlide: defaultIndex,
        spaceBetween: -60,
        speed: 300,
        grabCursor: true,
        slideToClickedSlide: true,
        preventInteractionOnTransition: true,
        watchSlidesProgress: true,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1.5,
          slideShadows: false
        },
        breakpoints: {
          320: {
            slidesPerView: 3,
            spaceBetween: -40
          },
          480: {
            slidesPerView: 3,
            spaceBetween: -50
          },
          640: {
            slidesPerView: 3,
            spaceBetween: -60
          }
        },
        on: {
          init: swiper => {
            // Set initial active tooltip
            const activeSlide = swiper.slides[swiper.activeIndex];
            const model = activeSlide.getAttribute('data-model');
            activeTooltip.textContent = model;
            activeTooltip.classList.add('visible');

            // Add click handlers to slides
            swiper.slides.forEach(slide => {
              slide.addEventListener('click', () => {
                const clickedIndex = slide.getAttribute('data-swiper-slide-index');
                swiper.slideToLoop(parseInt(clickedIndex), 300);
              });
            });
          },
          slideChange: swiper => {
            // Update active tooltip
            const activeSlide = swiper.slides[swiper.activeIndex];
            const model = activeSlide.getAttribute('data-model');

            // Animate tooltip change
            activeTooltip.classList.remove('visible');
            setTimeout(() => {
              activeTooltip.textContent = model;
              activeTooltip.classList.add('visible');
            }, 300);
          }
        }
      });
    } catch (error) {
      console.error('Error initializing wheel slider:', error);
      throw error;
    }
  }

  initializeSelectors() {
    this.inchSelect = document.getElementById('inch-select');
    this.colorSelect = document.getElementById('color-select');
    this.makeSelect = document.getElementById('make-select');
    this.modelSelect = document.getElementById('model-select');
    this.yearSelect = document.getElementById('year-select');
  }

  setupBasicEventListeners() {
    // Populate wheel colors first
    this.populateWheelColors();

    // Setup dropdown functionality
    this.setupDropdowns();

    // Handle option selection for static dropdowns
    this.setupOptionSelection(this.inchSelect);
    this.setupOptionSelection(this.colorSelect);

    // Setup search functionality
    this.setupSearch();

    // Setup outside click handling
    this.setupOutsideClickHandler();
  }

  populateWheelColors() {
    const wheelColorOptions = this.config.wheelColors
      .map(
        color => `
        <div class="option-item${color.id === 'satin_black' ? ' selected' : ''}" data-value="${color.id}">
          <span class="color-option">
            <span class="color-dot" style="background-color: ${color.color}"></span>
            ${color.name}
          </span>
        </div>
      `
      )
      .join('');

    const colorOptionsContainer = this.colorSelect.querySelector('.options-container');
    colorOptionsContainer.innerHTML = wheelColorOptions;
  }

  setupDropdowns() {
    document.querySelectorAll('.custom-select').forEach(select => {
      const header = select.querySelector('.select-header');
      const options = select.querySelector('.select-options');

      header.addEventListener('click', () => {
        if (select.classList.contains('disabled')) return;

        const isClosing = options.classList.contains('active');

        // Close other dropdowns
        document.querySelectorAll('.select-options').forEach(otherOptions => {
          if (otherOptions !== options) {
            otherOptions.classList.remove('active');
            otherOptions.style.display = 'none';
          }
        });

        if (!isClosing) {
          options.style.display = 'block';
          requestAnimationFrame(() => {
            options.classList.add('active');
          });

          // Auto focus search input if exists
          const searchInput = options.querySelector('.search-input');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        } else {
          options.classList.remove('active');
          options.style.display = 'none';
        }
      });
    });

    // Handle keyboard navigation
    document.querySelectorAll('.custom-select').forEach(select => {
      const handleKeyboardNavigation = e => {
        const options = select.querySelector('.select-options');
        if (!options.classList.contains('active')) return;

        const visibleOptions = Array.from(select.querySelectorAll('.option-item')).filter(opt => opt.style.display !== 'none');
        const currentIndex = visibleOptions.findIndex(opt => opt.classList.contains('keyboard-focused'));

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex === -1) {
              visibleOptions[0]?.classList.add('keyboard-focused');
            } else {
              visibleOptions[currentIndex]?.classList.remove('keyboard-focused');
              visibleOptions[Math.min(currentIndex + 1, visibleOptions.length - 1)]?.classList.add('keyboard-focused');
            }
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex === -1) {
              visibleOptions[visibleOptions.length - 1]?.classList.add('keyboard-focused');
            } else {
              visibleOptions[currentIndex]?.classList.remove('keyboard-focused');
              visibleOptions[Math.max(currentIndex - 1, 0)]?.classList.add('keyboard-focused');
            }
            break;

          case 'Enter':
            e.preventDefault();
            const focusedOption = select.querySelector('.option-item.keyboard-focused');
            if (focusedOption) {
              focusedOption.click();
            } else if (visibleOptions.length > 0) {
              visibleOptions[0].click();
            }
            break;

          case 'Escape':
            e.preventDefault();
            options.classList.remove('active');
            break;
        }
      };

      select.addEventListener('keydown', handleKeyboardNavigation);
    });
  }

  setupSearch() {
    document.querySelectorAll('.search-input').forEach(input => {
      input.addEventListener('input', e => {
        const select = e.target.closest('.custom-select');
        const query = e.target.value.toLowerCase();
        const options = select.querySelectorAll('.option-item');

        options.forEach(option => {
          const text = option.textContent.toLowerCase();
          option.style.display = text.includes(query) ? '' : 'none';
        });
      });

      input.addEventListener('click', e => e.stopPropagation());
    });
  }

  setupOutsideClickHandler() {
    document.addEventListener('click', e => {
      if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.select-options').forEach(options => {
          options.classList.remove('active');
          options.style.display = 'none';
        });
      }
    });
  }

  setupOptionSelection(select) {
    select.querySelectorAll('.option-item').forEach(option => {
      option.addEventListener('click', e => {
        const value = e.currentTarget.dataset.value;
        const content = e.currentTarget.innerHTML;

        // Update selected state
        select.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
        e.currentTarget.classList.add('selected');

        // Update header content
        const header = select.querySelector('.select-header');
        header.innerHTML = content;

        // Close dropdown
        const options = select.querySelector('.select-options');
        options.classList.remove('active');
        options.style.display = 'none';
      });
    });
  }

  setupFormNavigation() {
    const form = document.getElementById('vehicle-form');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const steps = form.querySelectorAll('.form-step');
    const successMessage = form.querySelector('.success-message');

    nextBtn.addEventListener('click', () => {
      steps[0].classList.remove('active');
      steps[1].classList.add('active');
    });

    prevBtn.addEventListener('click', () => {
      steps[1].classList.remove('active');
      steps[0].classList.add('active');
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        vehicle: {
          make: this.selectedMake || 'Sample Make',
          model: this.selectedModel || 'Sample Model',
          year: this.selectedYear || '2024',
          inchSize: this.inchSelect.querySelector('.selected').dataset.value,
          wheelColor: this.colorSelect.querySelector('.selected').dataset.value
        },
        personal: {
          firstName: formData.get('first_name'),
          lastName: formData.get('last_name'),
          email: formData.get('email'),
          phone: formData.get('phone')
        }
      };

      try {
        // Submit to webhook
        const response = await fetch('https://n8n.srv865019.hstgr.cloud/webhook/0839299f-b628-4327-9b5f-59a13aca939b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        // Show success message
        steps[1].classList.remove('active');
        successMessage.classList.add('active');

        // Dispatch form submitted event
        const event = new CustomEvent('form-submitted', {
          detail: data
        });
        this.container.dispatchEvent(event);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try again.');
      }
    });
  }

  async fetchMakes() {
    try {
      const response = await fetch(`${this.BASE_URL}/makes/?user_key=${this.API_KEY}`);
      const result = await response.json();

      if (result && result.data && Array.isArray(result.data)) {
        this.makes = result.data;
        this.updateMakesDropdown();
        // Setup make selection after populating the dropdown
        this.setupMakeSelection();
      }
    } catch (error) {
      console.error('Error fetching makes:', error);
    }
  }

  updateMakesDropdown() {
    const optionsContainer = this.makeSelect.querySelector('.options-container');
    optionsContainer.innerHTML = this.makes
      .map(
        make => `
          <div class="option-item${make.slug === this.selectedMake ? ' selected' : ''}" data-value="${make.slug}">
            ${make.logo ? `<img src="${make.logo}" alt="${make.name}">` : ''}
            <span>${make.name}</span>
          </div>
        `
      )
      .join('');

    this.attachOptionClickHandlers(this.makeSelect, (value, name, logo) => {
      this.selectedMake = value;
      // Store the full make data for later use
      this.selectedMakeData = this.makes.find(make => make.slug === value);

      this.makeSelect.querySelector('.select-header').innerHTML = `
        ${logo ? `<img src="${logo}" alt="${name}">` : ''}
        <span>${name}</span>
      `;

      // Reset and enable model select
      this.modelSelect.classList.remove('disabled');
      this.modelSelect.querySelector('.select-header').innerHTML = '<span>Model</span>';
      this.yearSelect.classList.add('disabled');
      this.yearSelect.querySelector('.select-header').innerHTML = '<span>Year</span>';

      // Clear previous selections
      this.selectedModel = '';
      this.selectedYear = '';

      this.fetchModels().then(() => {
        // Auto open model dropdown after a short delay
        setTimeout(() => {
          this.modelSelect.querySelector('.select-header').click();
        }, 100);
      });
    });
  }

  setupMakeSelection() {
    this.makeSelect.querySelectorAll('.option-item').forEach(option => {
      option.addEventListener('click', async () => {
        this.selectedMake = option.dataset.value;

        // Update header content
        const content = option.innerHTML;
        this.makeSelect.querySelector('.select-header').innerHTML = content;

        // Close dropdown
        this.makeSelect.querySelector('.select-options').classList.remove('active');

        // Fetch models
        await this.fetchModels();
      });
    });
  }

  async fetchModels() {
    try {
      const response = await fetch(`${this.BASE_URL}/models/?make=${this.selectedMake}&user_key=${this.API_KEY}`);
      const result = await response.json();

      if (result && result.data && Array.isArray(result.data)) {
        this.models = result.data;
        this.updateModelsDropdown();
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }

  updateModelsDropdown() {
    const optionsContainer = this.modelSelect.querySelector('.options-container');
    optionsContainer.innerHTML = this.models
      .map(
        model => `
          <div class="option-item${model.slug === this.selectedModel ? ' selected' : ''}" data-value="${model.slug}">
            ${model.image ? `<img src="${model.image}" alt="${model.name}">` : ''}
            <span>${model.name}</span>
          </div>
        `
      )
      .join('');

    this.attachOptionClickHandlers(this.modelSelect, (value, name, image) => {
      this.selectedModel = value;
      this.modelSelect.querySelector('.select-header').innerHTML = `
        ${image ? `<img src="${image}" alt="${name}">` : ''}
        <span>${name}</span>
      `;

      // Enable year select
      this.yearSelect.classList.remove('disabled');
      this.selectedYear = '';

      this.fetchYears().then(() => {
        // Auto open year dropdown after a short delay
        setTimeout(() => {
          this.yearSelect.querySelector('.select-header').click();
        }, 100);
      });
    });
  }

  updateYearsDropdown() {
    const optionsContainer = this.yearSelect.querySelector('.options-container');
    optionsContainer.innerHTML = this.years
      .map(
        year => `
          <div class="option-item${year === this.selectedYear ? ' selected' : ''}" data-value="${year}">
            <span>${year}</span>
          </div>
        `
      )
      .join('');

    this.attachOptionClickHandlers(this.yearSelect, (value, name) => {
      this.selectedYear = value;
      this.yearSelect.querySelector('.select-header').innerHTML = `<span>${name}</span>`;
    });
  }
}

// Initialize the widget when the DOM is loaded
console.log('DOM Content Loaded - Initializing VehicleSelectorWidget');

const container = document.getElementById('multistep-form');
console.log('Container element found:', container);

if (!container) {
  console.error('Failed to initialize widget: Could not find element with ID "multistep-form"');
}

// Function to initialize widget
function initializeWidget() {
  try {
    const widget = new VehicleSelectorWidget('multistep-form', 'ac48b4044e72f0cdd6ba0ab955047049');
    console.log('Widget instance created successfully');

    // Example of listening to form submission
    document.getElementById('multistep-form').addEventListener('form-submitted', e => {
      console.log('Form submitted:', e.detail);
    });
  } catch (error) {
    console.error('Error initializing widget:', error);
  }
}

// Check if we're in development mode
const isDevelopment = window.location.href.includes('localhost') || window.location.href.includes('wheelsize-widget/index.html');

if (isDevelopment) {
  // In development, initialize immediately
  initializeWidget();
} else {
  // In production, wait for Wized
  window.Wized = window.Wized || [];
  window.Wized.push(async Wized => {
    console.log('Wized initialized, waiting for wheel data...');
    try {
      // Execute the get_wheels request if not already done
      if (!Wized.data.r.get_wheels) {
        Wized.requests.execute('get_wheels');
      }
      // Wait for the data
      await Wized.requests.waitFor('get_wheels');
      console.log('Wheel data loaded, initializing widget...');
      initializeWidget();
    } catch (error) {
      console.error('Error waiting for Wized data:', error);
    }
  });
}
