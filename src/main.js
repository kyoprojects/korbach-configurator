import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

// Preloader Animation Controller
class PreloaderController {
  constructor() {
    this.timeline = gsap.timeline();
    this.init();
  }

  init() {
    this.startSequence();
  }

  async startSequence() {
    await this.holdBlackScreen();
    await this.animateLogo();
    await this.animateText();

    // Remove preloader after sequence
    setTimeout(() => {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.remove();
      }
    }, 1000);
  }

  async holdBlackScreen() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  async animateLogo() {
    return new Promise(resolve => {
      const logoScene = document.querySelector('#logo-scene');
      const logo = logoScene.querySelector('.logo');

      logoScene.classList.add('active');

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            gsap.to(logo, {
              opacity: 0,
              scale: 1.2,
              duration: 0.5,
              onComplete: () => {
                logoScene.classList.remove('active');
                resolve();
              }
            });
          }, 1000);
        }
      });

      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      }).to(
        logo.querySelector('::after'),
        {
          width: '100%',
          duration: 0.8,
          ease: 'power2.inOut'
        },
        '-=0.5'
      );
    });
  }

  async animateText() {
    return new Promise(resolve => {
      const textScene = document.querySelector('#text-scene');
      const text = textScene.querySelector('.animated-text');

      textScene.classList.add('active');

      const words = text.textContent.split(' ');
      text.innerHTML = words
        .map(
          word =>
            `<span style="display: inline-block; overflow: hidden;">
                    <span style="display: inline-block;">${word}</span>
                </span>`
        )
        .join(' ');

      gsap.to(text, {
        opacity: 1,
        duration: 0.1
      });

      gsap.fromTo(
        text.querySelectorAll('span > span'),
        {
          y: '100%',
          opacity: 0
        },
        {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.out',
          onComplete: resolve
        }
      );
    });
  }
}

// Initialize preloader when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new PreloaderController();
});
