import Swiper, { Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@/styles/style.scss';
import axios from 'axios';
import { gsap, ScrollTrigger } from 'gsap/all';


// Настройка модулей Swiper
Swiper.use([Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs]);

function createNewsSwiper() {
  return new Swiper('.sertificate__slider', {
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      650: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      976: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1250: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}

createNewsSwiper();

function initQuestionsAccordion() {
  const items = document.querySelectorAll('.questions__item');
  if (!items.length) return;

  items.forEach((item) => {
    const head = item.querySelector('.questions__head');
    const answer = item.querySelector('.questions__answer');
    if (!head || !answer) return;

    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('questions__item--open');

      items.forEach((other) => {
        if (other === item) return;
        other.classList.remove('questions__item--open');
        const otherHead = other.querySelector('.questions__head');
        const otherAnswer = other.querySelector('.questions__answer');
        otherHead?.setAttribute('aria-expanded', 'false');
        otherAnswer?.setAttribute('aria-hidden', 'true');
      });

      item.classList.toggle('questions__item--open', !isOpen);
      head.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
    });
  });
}

initQuestionsAccordion();

function initPageNavigation() {
  const links = document.querySelectorAll('[data-goto]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const selector = link.getAttribute('data-goto');
      if (!selector) return;

      const target = document.querySelector(selector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

initPageNavigation();
