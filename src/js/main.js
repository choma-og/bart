import Swiper, { Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import '@/styles/style.scss';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/owl.carousel.min.js';
import axios from 'axios';
import IMask from 'imask';
import { gsap, ScrollTrigger } from 'gsap/all';

// При ширине экрана < 1250px переносим header__info (телефон и «Заказать звонок») в menu__body; header__love остаётся в хедере
(function initHeaderInfoMove() {
  const headerInfo = document.querySelector('.header__info');
  const menuBody = document.querySelector('.menu__body');
  const headerRight = document.querySelector('.header__right');
  if (!headerInfo || !menuBody || !headerRight) return;

  const BREAKPOINT = 1250;

  function apply() {
    if (window.innerWidth < BREAKPOINT) {
      if (!menuBody.contains(headerInfo)) {
        menuBody.appendChild(headerInfo);
      }
    } else {
      if (menuBody.contains(headerInfo)) {
        headerRight.appendChild(headerInfo);
      }
    }
  }

  window.addEventListener('resize', apply);
  apply();
})();

// Клик по menu__icon: toggle active на header, menu__icon, menu__body и _lock на body
(function initMenuToggle() {
  const header = document.querySelector('.header');
  const menuIcon = document.querySelector('.menu__icon');
  const menuBody = document.querySelector('.menu__body');
  const body = document.body;
  if (!menuIcon || !menuBody) return;

  menuIcon.addEventListener('click', () => {
    header?.classList.toggle('active');
    menuIcon.classList.toggle('active');
    menuBody.classList.toggle('active');
    const menuNowOpen = menuBody.classList.contains('active');
    if (menuNowOpen) {
      body.classList.add('_lock', '_menu-open');
    } else {
      body.classList.remove('_menu-open');
      const modalOpen = document.querySelector('.modal__body.active');
      if (!modalOpen) body.classList.remove('_lock');
    }
  });
})();

// Настройка модулей Swiper
Swiper.use([Navigation, Pagination, EffectFade, Autoplay, FreeMode, Thumbs]);

function createDynamicsSwiper() {
  return new Swiper('.dynamics-swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.dynamics-next',
      prevEl: '.dynamics-prev',
    },
    breakpoints: {
      650: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      976: {
        slidesPerView: 1.3,
        spaceBetween: 20,
      },
      1250: {
        slidesPerView: 1.3,
        spaceBetween: 60,
      },
    },
  });
}

function createNewsSwiper() {
  return new Swiper('.news-swiper', {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.news-next',
      prevEl: '.news-prev',
    },
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
        spaceBetween: 30,
      },
    },
  });
}

createNewsSwiper();

let dynamicsSwiper = null;

(function initDynamicsSwiperByYear() {
  const wrapper = document.querySelector('.dynamics-swiper .swiper-wrapper');
  const yearLinks = Array.from(document.querySelectorAll('.dynamics__years a[data-year]'));
  const dynamicsNav = document.querySelector('.dynamics-nav');

  function syncDynamicsNavVisibility() {
    if (!dynamicsNav) return;
    const prev = dynamicsNav.querySelector('.dynamics-prev');
    const next = dynamicsNav.querySelector('.dynamics-next');
    if (!prev || !next) return;

    // Когда свайп не нужен, Swiper вешает `swiper-button-disabled` на обе кнопки
    // (у тебя в разметке это выглядит как `swiper-button-lock swiper-button-disabled`).
    const hideNav = prev.classList.contains('swiper-button-disabled') && next.classList.contains('swiper-button-disabled');
    dynamicsNav.classList.toggle('is-hidden', hideNav);
  }

  // Если годов не настроили (или разметка сломана) — просто показываем все слайды.
  if (!wrapper || yearLinks.length === 0) {
    dynamicsSwiper = createDynamicsSwiper();
    return;
  }

  const slides = Array.from(wrapper.querySelectorAll('.swiper-slide.dynamics-slide[data-year]'));
  if (slides.length === 0) {
    dynamicsSwiper = createDynamicsSwiper();
    return;
  }

  // Сохраняем HTML исходных слайдов, чтобы потом быстро пересобирать wrapper под год.
  const slidesByYear = new Map();
  slides.forEach((slide) => {
    const year = slide.dataset.year;
    if (!year) return;
    if (!slidesByYear.has(year)) slidesByYear.set(year, []);
    slidesByYear.get(year).push(slide.outerHTML);
  });

  const activeLink = yearLinks.find((l) => l.classList.contains('active')) || yearLinks[0];
  const initialYear = activeLink?.dataset.year;

  function initOrReinit(year) {
    const yearSlides = slidesByYear.get(year);
    if (!yearSlides) return;

    if (dynamicsSwiper) {
      dynamicsSwiper.destroy(true, true);
      dynamicsSwiper = null;
    }

    wrapper.innerHTML = yearSlides.join('');
    dynamicsSwiper = createDynamicsSwiper();
    dynamicsSwiper.slideTo(0, 0);

    dynamicsSwiper.on('lock unlock slideChange', syncDynamicsNavVisibility);
    // На первом рендере классы на кнопках могут появиться в следующем тике.
    setTimeout(syncDynamicsNavVisibility, 0);
  }

  initOrReinit(initialYear);

  yearLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const year = link.dataset.year;
      if (!year) return;

      yearLinks.forEach((l) => l.classList.toggle('active', l === link));
      initOrReinit(year);
    });
  });
})();

// Fancybox: при клике на .dynamics-gallery открывать галерею картинок слайда
document.addEventListener('click', (e) => {
  const galleryLink = e.target.closest('.dynamics-gallery');
  if (!galleryLink) return;
  e.preventDefault();
  const galleryData = galleryLink.getAttribute('data-gallery');
  if (!galleryData) return;
  try {
    const urls = JSON.parse(galleryData);
    const items = urls.map((src) => ({ src }));
    Fancybox.show(items);
  } catch (err) {
    console.warn('dynamics-gallery: неверный data-gallery', err);
  }
});

// Случайные точки рядом с центром карты (Барнаул)
function randomPointNear(centerLng, centerLat, radiusLng = 0.012, radiusLat = 0.008) {
  return [
    centerLng + (Math.random() * 2 - 1) * radiusLng,
    centerLat + (Math.random() * 2 - 1) * radiusLat,
  ];
}

// Данные по категориям: названия для тултипов (одно имя на точку)
const LOCATION_CATEGORY_PLACES = {
  education: [
    'Школа №42',
    'Курсы английского',
    'Учебный центр «Знание»',
    'Лицей №86',
    'Школа искусств',
  ],
  kindergarten: [
    'Детский сад «Солнышко»',
    'Детский сад №5',
    'Детский сад «Ромашка»',
    'Центр развития «Кроха»',
  ],
  products: [
    'Магазин «Продукты»',
    'Супермаркет «Аникс»',
    '«Пятёрочка»',
    '«Магнит»',
    'Продуктовый рынок',
  ],
  cafe: [
    'Ресторан «Хочу Пури»',
    'Кафе «Барнаул»',
    'Кофейня «Шоколадница»',
    'Пекарня «Волконский»',
    'Кафе «Пушкин»',
  ],
};

function buildCategoryPoints(centerLng, centerLat, categoryId, count = 6) {
  const names = LOCATION_CATEGORY_PLACES[categoryId] || ['Объект'];
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      name: names[i % names.length],
      coords: randomPointNear(centerLng, centerLat),
    });
  }
  return points;
}

// Яндекс.Карта в блоке location: центр Барнаул, главный маркер, точки категорий с тултипами
function initLocationMap() {
  const mapEl = document.getElementById('map');
  const listEl = document.querySelector('.location__list');
  if (!mapEl) return;
  if (typeof window.ymaps3 === 'undefined') {
    setTimeout(initLocationMap, 100);
    return;
  }
  const CENTER = [83.7545, 53.3606];
  window.ymaps3.ready.then(() => {
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = window.ymaps3;
    const map = new YMap(
      mapEl,
      {
        location: {
          center: CENTER,
          zoom: 15,
        },
      },
      [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})],
    );
    // Главный маркер (пин с буквой «Б» или картинкой)
    const pinUrl = (import.meta.env.BASE_URL || '/') + 'img/pin.png';
    const markerEl = document.createElement('div');
    markerEl.className = 'location__marker';
    const img = document.createElement('img');
    img.src = pinUrl;
    img.alt = '';
    img.width = 40;
    img.height = 40;
    markerEl.appendChild(img);
    const mainMarker = new YMapMarker({ coordinates: CENTER }, markerEl);
    map.addChild(mainMarker);

    // Маркеры точек категорий (удаляем при смене категории)
    let categoryMarkers = [];

    function clearCategoryMarkers() {
      categoryMarkers.forEach((m) => map.removeChild(m));
      categoryMarkers = [];
    }

    function showCategoryPoints(categoryId) {
      clearCategoryMarkers();
      const points = buildCategoryPoints(CENTER[0], CENTER[1], categoryId);
      points.forEach(({ name, coords }) => {
        const wrap = document.createElement('div');
        wrap.className = 'location__point-wrap';
        const point = document.createElement('div');
        point.className = 'location__point';
        point.setAttribute('aria-label', name);
        const tooltip = document.createElement('div');
        tooltip.className = 'location__tooltip';
        tooltip.textContent = name;
        wrap.appendChild(tooltip);
        wrap.appendChild(point);

        const showTooltip = () => {
          wrap.classList.add('is-tooltip-visible');
        };
        const hideTooltip = () => {
          wrap.classList.remove('is-tooltip-visible');
        };
        point.addEventListener('mouseenter', showTooltip);
        point.addEventListener('mouseleave', hideTooltip);

        function onPointClick(e) {
          e.stopPropagation();
          e.preventDefault();
          document.querySelectorAll('.location__point-wrap.is-tooltip-visible').forEach((w) => {
            if (w !== wrap) w.classList.remove('is-tooltip-visible');
          });
          wrap.classList.toggle('is-tooltip-visible');
        }
        wrap.addEventListener('click', onPointClick);

        const yMarker = new YMapMarker({ coordinates: coords }, wrap);
        map.addChild(yMarker);
        categoryMarkers.push(yMarker);
      });
    }

    // Клик по категории: active на пункте, показать точки
    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const item = e.target.closest('.location__item');
        if (!item) return;
        const categoryId = item.getAttribute('data-category');
        if (!categoryId) return;
        listEl.querySelectorAll('.location__item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
        showCategoryPoints(categoryId);
      });
      // Показать точки для изначально активной категории
      const activeItem = listEl.querySelector('.location__item.active');
      const initialCategory = activeItem?.getAttribute('data-category') || 'education';
      showCategoryPoints(initialCategory);
    }

    // Закрыть тултип при клике вне точки. setTimeout(0) чтобы наш клик по точке успел открыть тултип и не был воспринят как «клик снаружи»
    document.addEventListener('click', (e) => {
      const clickedTarget = e.target;
      setTimeout(() => {
        if (clickedTarget.closest && clickedTarget.closest('.location__point-wrap')) return;
        mapEl
          .querySelectorAll('.location__point-wrap.is-tooltip-visible')
          .forEach((w) => w.classList.remove('is-tooltip-visible'));
      }, 0);
    });
  });
}
initLocationMap();

// Перенос навигации/компаса выбора квартиры:
// - ширина > 801px: переносим `.choose-appart__nav` и `.choose-appart__compas` внутрь `.choose-appart__info`
//   и скрываем (фактически убираем) `.choose-appart__wrapp`
// - ширина <= 801px: возвращаем всё обратно
(function initChooseAppartResponsiveDomMove() {
  const MAX_WIDTH = 801;
  const mq = window.matchMedia(`(min-width: ${MAX_WIDTH + 1}px)`);

  // Храним ссылки, чтобы при переносах не потерять узлы
  let navEl = null;
  let compasEl = null;
  let wrappEl = null;
  let infoEl = null;
  let placeholderEl = null;
  let moved = false;

  function getElements() {
    navEl = navEl || document.querySelector('.choose-appart__nav');
    compasEl = compasEl || document.querySelector('.choose-appart__compas');
    wrappEl = wrappEl || document.querySelector('.choose-appart__wrapp');
    infoEl = infoEl || document.querySelector('.choose-appart__info');
    return navEl && compasEl && wrappEl && infoEl;
  }

  function moveToInfo() {
    if (moved) return;
    if (!getElements()) return;

    placeholderEl = document.createElement('div');
    placeholderEl.className = 'choose-appart__wrapp-placeholder';
    placeholderEl.style.display = 'none';

    wrappEl.replaceWith(placeholderEl);

    const ref = infoEl.firstChild;
    if (ref) {
      infoEl.insertBefore(navEl, ref);
      infoEl.insertBefore(compasEl, ref);
    } else {
      infoEl.appendChild(navEl);
      infoEl.appendChild(compasEl);
    }

    moved = true;
  }

  function moveBack() {
    if (!moved) return;
    if (!getElements()) return;

    // Возвращаем элементы в исходную оболочку
    wrappEl.appendChild(navEl);
    wrappEl.appendChild(compasEl);

    if (placeholderEl && placeholderEl.parentNode) {
      placeholderEl.replaceWith(wrappEl);
    }
    placeholderEl = null;
    moved = false;
  }

  function apply() {
    if (mq.matches) moveToInfo();
    else moveBack();
  }

  // Если разметка появится чуть позже (редко, но бывает с partials) — ретраим несколько раз
  let tries = 0;
  const maxTries = 20;
  const timer = setInterval(() => {
    tries += 1;
    if (getElements()) {
      clearInterval(timer);
      apply();
      return;
    }
    if (tries >= maxTries) clearInterval(timer);
  }, 50);

  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply);
})();

// Навигация выбора квартиры: стрелки прокручивают список, переключение active, показ SVG этажа
(function initChooseAppartNav() {
  const nav = document.querySelector('.choose-appart__nav');
  const imgBlock = document.querySelector('.choose-appart__img');
  if (!nav) return;
  const list = nav.querySelector('.choose-appart__list');
  const arrowUp = nav.querySelector('div:first-child');
  const arrowDown = nav.querySelector('div:last-child');
  if (!list || !arrowUp || !arrowDown) return;

  const items = Array.from(list.querySelectorAll('li'));
  const step = 40 + 16;
  const floorPlans = imgBlock ? imgBlock.querySelectorAll('.choose-appart__floor-plan') : [];

  function setActive(li) {
    items.forEach((el) => el.classList.remove('active'));
    if (li) li.classList.add('active');
    switchFloorPlan(li ? parseInt(li.textContent.trim(), 10) : null);
  }

  function switchFloorPlan(floorNum) {
    floorPlans.forEach((plan) => {
      const planFloor = parseInt(plan.getAttribute('data-floor'), 10);
      plan.classList.toggle('is-active', planFloor === floorNum);
    });
  }

  function getActiveIndex() {
    const active = list.querySelector('li.active');
    return active ? items.indexOf(active) : 0;
  }

  // Показать SVG того этажа, который активен в списке при загрузке
  const initialActive = list.querySelector('li.active');
  if (initialActive) switchFloorPlan(parseInt(initialActive.textContent.trim(), 10));

  // Клик по пункту — ставим active на него
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) setActive(li);
  });

  // Стрелка вверх — предыдущий пункт, active и прокрутка
  arrowUp.addEventListener('click', () => {
    const idx = getActiveIndex();
    if (idx <= 0) return;
    const prev = items[idx - 1];
    setActive(prev);
    prev.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  // Стрелка вниз — следующий пункт, active и прокрутка
  arrowDown.addEventListener('click', () => {
    const idx = getActiveIndex();
    if (idx >= items.length - 1) return;
    const next = items[idx + 1];
    setActive(next);
    next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
})();

// Модалка квартиры при наведении на .choose-appart__link — данные из data-атрибутов, позиция у курсора
(function initFlatModal() {
  const modal = document.getElementById('flat-modal');
  const links = document.querySelectorAll('.choose-appart__link');
  if (!modal || !links.length) return;

  const offsetX = 16;
  const offsetY = 16;
  let rafId = null;
  let lastMove = null;

  function setModalContent(link) {
    const img = modal.querySelector('.flat-modal__img-el');
    const availability = modal.querySelector('.flat-modal__availability');
    const price = modal.querySelector('.flat-modal__price');
    const head = modal.querySelector('.flat-modal__head');
    const sqr = modal.querySelector('.flat-modal__sqr');
    const etaj = modal.querySelector('.flat-modal__etaj');
    if (img) img.src = link.getAttribute('data-flat-image') || '';
    if (availability) availability.textContent = link.getAttribute('data-flat-availability') || '';
    if (price) price.textContent = link.getAttribute('data-flat-price') || '';
    if (head) head.textContent = link.getAttribute('data-flat-head') || '';
    if (sqr) sqr.textContent = link.getAttribute('data-flat-sqr') || '';
    if (etaj) etaj.textContent = link.getAttribute('data-flat-etaj') || '';
  }

  function applyPosition(clientX, clientY) {
    const rect = modal.getBoundingClientRect();
    const right = clientX + offsetX + rect.width;
    const bottom = clientY + offsetY + rect.height;
    let left = clientX + offsetX;
    let top = clientY + offsetY;
    if (right > window.innerWidth) left = clientX - offsetX - rect.width;
    if (bottom > window.innerHeight) top = clientY - offsetY - rect.height;
    if (left < 0) left = offsetX;
    if (top < 0) top = offsetY;
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }

  function moveModal(e) {
    lastMove = { clientX: e.clientX, clientY: e.clientY };
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastMove) applyPosition(lastMove.clientX, lastMove.clientY);
    });
  }

  function showModal(link, e) {
    setModalContent(link);
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    if (e) applyPosition(e.clientX, e.clientY);
  }

  function hideModal() {
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', (e) => {
      showModal(link, e);
    });
    link.addEventListener('mousemove', moveModal);
    link.addEventListener('mouseleave', hideModal);
  });
})();

// Тултип генплана: этаж и число квартир из data-атрибутов, позиция у курсора
(function initGenplanTooltip() {
  const tooltip = document.getElementById('genplan-tooltip');
  const links = document.querySelectorAll('.genplan__link');
  if (!tooltip || !links.length) return;

  const floorEl = tooltip.querySelector('.genplan-tooltip__floor');
  const countEl = tooltip.querySelector('.genplan-tooltip__count');
  if (!floorEl || !countEl) return;

  const offsetX = 16;
  const offsetY = 16;
  let rafId = null;
  let lastMove = null;

  function pluralKvartira(n) {
    const num = Math.abs(Number(n)) % 100;
    const n10 = num % 10;
    if (num > 10 && num < 20) return 'квартир';
    if (n10 === 1) return 'квартира';
    if (n10 >= 2 && n10 <= 4) return 'квартиры';
    return 'квартир';
  }

  function setContent(link) {
    const floor = link.getAttribute('data-floor') || '';
    const free = link.getAttribute('data-free-flats') || '';
    floorEl.textContent = floor ? `${floor} этаж` : '';
    const cnt = parseInt(free, 10);
    countEl.textContent =
      free !== '' && !Number.isNaN(cnt) ? `${cnt} ${pluralKvartira(cnt)} в продаже` : '';
  }

  function applyPosition(clientX, clientY) {
    const rect = tooltip.getBoundingClientRect();
    const right = clientX + offsetX + rect.width;
    const bottom = clientY + offsetY + rect.height;
    let left = clientX + offsetX;
    let top = clientY + offsetY;
    if (right > window.innerWidth) left = clientX - offsetX - rect.width;
    if (bottom > window.innerHeight) top = clientY - offsetY - rect.height;
    if (left < 0) left = offsetX;
    if (top < 0) top = offsetY;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function moveTooltip(e) {
    lastMove = { clientX: e.clientX, clientY: e.clientY };
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastMove) applyPosition(lastMove.clientX, lastMove.clientY);
    });
  }

  function show(link, e) {
    setContent(link);
    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');
    if (e) applyPosition(e.clientX, e.clientY);
  }

  function hide() {
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', (e) => {
      show(link, e);
    });
    link.addEventListener('mousemove', moveTooltip);
    link.addEventListener('mouseleave', hide);
  });
})();

// Переключение «Квартира» / «На этаже»: активная кнопка и смена картинки
(function initAppartDetailTabs() {
  const container = document.querySelector('.appart-detail');
  if (!container) return;
  const links = container.querySelectorAll('.appart-detail__link[data-appart-tab]');
  const items = container.querySelectorAll('.appart-detail__img-item[data-appart-view]');
  if (!links.length || !items.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-appart-tab');
      if (!tab) return;
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      items.forEach((item) => {
        item.classList.toggle('is-active', item.getAttribute('data-appart-view') === tab);
      });
    });
  });
})();

// Модалка «Заказать звонок»: открытие по .js-open-call, закрытие по .modal__close и клику по оверлею
(function initCallModal() {
  const openBtns = document.querySelectorAll('.js-open-call');
  const modal = document.querySelector('.js-modal-call');
  if (!openBtns.length || !modal) return;

  const body = modal.querySelector('.modal__body');
  const content = modal.querySelector('.modal__content');
  const closeBtn = modal.querySelector('.modal__close');
  const checkbox = modal.querySelector('#flexCheckChecked');
  const submitBtn = modal.querySelector('.modal__link');
  const nameInput = modal.querySelector('.modal__name');
  const phoneInput = modal.querySelector('.modal__tel');

  function validateName() {
    const value = (nameInput?.value || '').trim();
    return value.length >= 2;
  }

  function validatePhone() {
    const value = (phoneInput?.value || '').replace(/\D/g, '');
    return value.length === 11 && value[0] === '7';
  }

  function setInputValid(input, valid) {
    if (!input) return;
    input.classList.toggle('is-invalid', !valid);
  }

  function validateAll() {
    const nameOk = validateName();
    const phoneOk = validatePhone();
    setInputValid(nameInput, nameOk);
    setInputValid(phoneInput, phoneOk);
    return nameOk && phoneOk;
  }

  function openModal(e) {
    e.preventDefault();
    body && body.classList.add('active');
    content && content.classList.add('active');
    document.body.classList.add('_lock');
    setInputValid(nameInput, true);
    setInputValid(phoneInput, true);
  }

  function closeModal(e) {
    if (e) e.preventDefault();
    body && body.classList.remove('active');
    content && content.classList.remove('active');
    // Снимаем _lock только если меню закрыто — иначе меню «держит» lock и класс потом висит
    const menuOpen = document.querySelector('.header')?.classList.contains('active');
    if (!menuOpen) document.body.classList.remove('_lock');
  }

  // Кнопка «Забронировать» активна только при отмеченном согласии
  if (checkbox && submitBtn) {
    checkbox.addEventListener('change', () => {
      submitBtn.disabled = !checkbox.checked;
    });
    submitBtn.disabled = !checkbox.checked;
  }

  // Валидация полей: при blur и при отправке, подсветка невалидных
  if (nameInput) {
    nameInput.addEventListener('blur', () => setInputValid(nameInput, validateName()));
    nameInput.addEventListener('input', () => setInputValid(nameInput, validateName()));
  }
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => setInputValid(phoneInput, validatePhone()));
    phoneInput.addEventListener('input', () => setInputValid(phoneInput, validatePhone()));
  }
  const callbackUrl = '/api/callback'; // URL бэкенда для заказа звонка

  if (submitBtn) {
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!validateAll()) return;
      const name = (nameInput?.value || '').trim();
      const phone = (phoneInput?.value || '').trim();
      submitBtn.disabled = true;
      try {
        await axios.post(
          callbackUrl,
          { name, phone },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        closeModal();
        nameInput && (nameInput.value = '');
        phoneInput && (phoneInput.value = '');
        checkbox && (checkbox.checked = false);
        submitBtn.disabled = !checkbox?.checked;
      } catch (err) {
        submitBtn.disabled = !checkbox?.checked;
      }
    });
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn && closeBtn.addEventListener('click', closeModal);

  // Закрытие по клику вне модалки только если нажатие было снаружи (не зажали внутри и не отпустили снаружи)
  let mouseDownOnOverlay = false;
  body &&
    body.addEventListener('mousedown', (e) => {
      mouseDownOnOverlay = e.target === body;
    });
  body &&
    body.addEventListener('click', (e) => {
      if (e.target === body && mouseDownOnOverlay) closeModal(e);
    });
  content && content.addEventListener('click', (e) => e.stopPropagation());
})();

// Модалка «Забронировать»: открытие по .js-bron, закрытие по .modal__close и клику по оверлею, валидация и отправка
(function initBronModal() {
  const openBtns = document.querySelectorAll('.js-bron.appart-detail__bron');
  const modal = document.querySelector('.js-modal-bron');
  if (!openBtns.length || !modal) return;

  const body = modal.querySelector('.modal__body');
  const content = modal.querySelector('.modal__content');
  const closeBtn = modal.querySelector('.modal__close');
  const checkbox = modal.querySelector('#flexCheckChecked2');
  const submitBtn = modal.querySelector('.modal__link');
  const nameInput = modal.querySelector('.modal__name');
  const phoneInput = modal.querySelector('.modal__tel');
  const objectInput = modal.querySelector('.modal__object');
  const pomeschInput = modal.querySelector('.modal__pomesch');

  const defaultObject = 'Малахов';
  const defaultPomesch = '1К-студия №123';
  const bronUrl = '/api/bron';

  function validateName() {
    const value = (nameInput?.value || '').trim();
    return value.length >= 2;
  }

  function validatePhone() {
    const value = (phoneInput?.value || '').replace(/\D/g, '');
    return value.length === 11 && value[0] === '7';
  }

  function setInputValid(input, valid) {
    if (!input) return;
    input.classList.toggle('is-invalid', !valid);
  }

  function validateAll() {
    const nameOk = validateName();
    const phoneOk = validatePhone();
    setInputValid(nameInput, nameOk);
    setInputValid(phoneInput, phoneOk);
    return nameOk && phoneOk;
  }

  function openModal(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const object = btn?.getAttribute('data-object') ?? defaultObject;
    const pomesch = btn?.getAttribute('data-pomesch') ?? defaultPomesch;
    if (objectInput) objectInput.value = object;
    if (pomeschInput) pomeschInput.value = pomesch;
    setInputValid(nameInput, true);
    setInputValid(phoneInput, true);
    body && body.classList.add('active');
    content && content.classList.add('active');
    document.body.classList.add('_lock');
  }

  function closeModal(e) {
    if (e) e.preventDefault();
    body && body.classList.remove('active');
    content && content.classList.remove('active');
    const menuOpen = document.querySelector('.header')?.classList.contains('active');
    if (!menuOpen) document.body.classList.remove('_lock');
  }

  function resetForm() {
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (checkbox) checkbox.checked = false;
    if (submitBtn) submitBtn.disabled = !checkbox?.checked;
  }

  if (checkbox && submitBtn) {
    checkbox.addEventListener('change', () => {
      submitBtn.disabled = !checkbox.checked;
    });
    submitBtn.disabled = !checkbox.checked;
  }

  if (nameInput) {
    nameInput.addEventListener('blur', () => setInputValid(nameInput, validateName()));
    nameInput.addEventListener('input', () => setInputValid(nameInput, validateName()));
  }
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => setInputValid(phoneInput, validatePhone()));
    phoneInput.addEventListener('input', () => setInputValid(phoneInput, validatePhone()));
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!validateAll()) return;
      const name = (nameInput?.value || '').trim();
      const phone = (phoneInput?.value || '').trim();
      const object = (objectInput?.value || '').trim();
      const pomesch = (pomeschInput?.value || '').trim();
      submitBtn.disabled = true;
      try {
        await axios.post(
          bronUrl,
          { name, phone, object, pomesch },
          { headers: { 'Content-Type': 'application/json' } },
        );
        closeModal();
        resetForm();
      } catch (err) {
        submitBtn.disabled = checkbox?.checked ?? false;
      }
    });
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn && closeBtn.addEventListener('click', closeModal);

  let mouseDownOnOverlay = false;
  body &&
    body.addEventListener('mousedown', (e) => {
      mouseDownOnOverlay = e.target === body;
    });
  body &&
    body.addEventListener('click', (e) => {
      if (e.target === body && mouseDownOnOverlay) closeModal(e);
    });
  content && content.addEventListener('click', (e) => e.stopPropagation());
})();

/*=============== INPUT MASK ===============*/
document.addEventListener('DOMContentLoaded', () => {
  let phones = document.querySelectorAll('[data-mask="phone"]');

  phones.forEach(function (element) {
    new IMask(element, {
      mask: '+{7}(000)000-00-00',
    });
  });
});
