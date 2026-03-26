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
import appartDetailPdfTemplate from '@/templates/appart-detail-pdf.html?raw';

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
    const hideNav =
      prev.classList.contains('swiper-button-disabled') &&
      next.classList.contains('swiper-button-disabled');
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
  const CENTER = [83.692711, 53.339188];
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
    // В ymaps3 перекрытие маркеров определяется zIndex маркера, а не только CSS внутри DOM-элемента.
    // Делаем главный пин самым верхним над всеми точками и тултипами.
    const mainMarker = new YMapMarker({ coordinates: CENTER, zIndex: 2000 }, markerEl);
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

        // Категорийные точки ниже главного маркера.
        const yMarker = new YMapMarker({ coordinates: coords, zIndex: 1000 }, wrap);
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
// - ширина < 800px: переносим весь `.choose-appart__wrapp` в `.apartment__container` сразу после `.apartment__inner`
(function initChooseAppartResponsiveDomMove() {
  const MAX_WIDTH = 801;
  const mq = window.matchMedia(`(min-width: ${MAX_WIDTH + 1}px)`);
  const mqWrappToApartmentContainer = window.matchMedia('(max-width: 799px)');

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

  function repositionWrappInApartmentContainer() {
    if (mq.matches) return;

    const wrapp =
      wrappEl && wrappEl.isConnected && wrappEl.classList.contains('choose-appart__wrapp')
        ? wrappEl
        : document.querySelector('.choose-appart__wrapp');
    if (!wrapp) return;

    const container = document.querySelector('.apartment__container');
    const inner = container && container.querySelector(':scope > .apartment__inner');
    const chooseinfo = document.querySelector('.apartment__chooseinfo');
    const info =
      infoEl && infoEl.isConnected ? infoEl : document.querySelector('.choose-appart__info');

    if (!container || !inner || !chooseinfo || !info) return;

    if (mqWrappToApartmentContainer.matches) {
      if (wrapp.parentNode !== container || wrapp.previousElementSibling !== inner) {
        inner.after(wrapp);
      }
    } else if (wrapp.parentNode === container) {
      chooseinfo.insertBefore(wrapp, info);
    }
  }

  function apply() {
    if (mq.matches) moveToInfo();
    else moveBack();
    repositionWrappInApartmentContainer();
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
  if (mqWrappToApartmentContainer.addEventListener) {
    mqWrappToApartmentContainer.addEventListener('change', apply);
  } else mqWrappToApartmentContainer.addListener(apply);
})();

// Навигация выбора квартиры: стрелки прокручивают список, переключение active, показ SVG этажа
(function initChooseAppartNav() {
  const apartmentSection = document.querySelector('section.apartment');
  const hasApartmentChooser =
    apartmentSection && apartmentSection.querySelector('.apartment__chooseinfo');
  const choosePageSection = document.querySelector('section.choose-appart');

  let nav;
  let imgBlock;
  if (hasApartmentChooser) {
    nav = apartmentSection.querySelector('.choose-appart__nav');
    imgBlock = apartmentSection.querySelector('.apartment__chooseinfo .choose-appart__img');
  } else if (choosePageSection) {
    nav = choosePageSection.querySelector('.choose-appart__nav');
    imgBlock = choosePageSection.querySelector('.choose-appart__img');
  } else {
    nav = document.querySelector('.choose-appart__nav');
    imgBlock = document.querySelector('.choose-appart__img');
  }
  if (!nav) return;
  const list = nav.querySelector('.choose-appart__list');
  const arrowUp = nav.querySelector('div:first-child');
  const arrowDown = nav.querySelector('div:last-child');
  if (!list || !arrowUp || !arrowDown) return;

  const items = Array.from(list.querySelectorAll('li'));
  const floorPlans = imgBlock ? imgBlock.querySelectorAll('.choose-appart__floor-plan') : [];

  function setActive(li) {
    items.forEach((el) => el.classList.remove('active'));
    if (li) li.classList.add('active');
    const floorNum = li ? parseInt(li.textContent.trim(), 10) : null;
    switchFloorPlan(Number.isNaN(floorNum) ? null : floorNum);
    if (li && !Number.isNaN(floorNum) && document.querySelector('.apartment__chooseinfo')) {
      document.dispatchEvent(
        new CustomEvent('apartment:choose-floor', { detail: { floor: floorNum } }),
      );
    }
  }

  function switchFloorPlan(floorNum) {
    floorPlans.forEach((plan) => {
      const planFloor = parseInt(plan.getAttribute('data-floor'), 10);
      plan.classList.toggle('is-active', planFloor === floorNum);
    });
  }

  /** Шаг прокрутки «на один этаж»: реальные размеры li + gap (без active — сдвигаем окно ровно на одну ячейку) */
  function getListScrollStepPx() {
    if (!items.length) return 45;
    const cs = getComputedStyle(list);
    const gap = parseFloat(cs.gap) || 0;
    const r = items[0].getBoundingClientRect();
    const row = cs.flexDirection === 'row' || cs.flexDirection === 'row-reverse';
    return Math.round((row ? r.width : r.height) + gap);
  }

  /** direction: −1 первая стрелка (в ряду — влево), +1 вторая (в ряду — вправо). Active не меняется. */
  function scrollListOneItem(direction) {
    const cs = getComputedStyle(list);
    const fd = cs.flexDirection;
    const step = getListScrollStepPx();
    const row = fd === 'row' || fd === 'row-reverse';

    if (row) {
      list.scrollBy({ left: direction * step, behavior: 'smooth' });
      return;
    }

    // column / column-reverse: в обоих случаях положительный scrollTop — «вниз» по контенту;
    // отдельная инверсия для column-reverse давала противоположные стрелкам вверх/вниз смещения.
    list.scrollBy({ top: direction * step, behavior: 'smooth' });
  }

  // Показать SVG того этажа, который активен в списке при загрузке
  const initialActive = list.querySelector('li.active');
  if (initialActive) switchFloorPlan(parseInt(initialActive.textContent.trim(), 10));

  // Клик по пункту — ставим active на него
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) setActive(li);
  });

  arrowUp.addEventListener('click', () => scrollListOneItem(-1));
  arrowDown.addEventListener('click', () => scrollListOneItem(1));
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

// Показать choose-appart__info по клику на генплан или выбору этажа в списке
(function initApartmentGenplanChooseInfo() {
  const apartmentInfo = document.querySelector('.apartment__info');
  if (!apartmentInfo) return;

  const genplanWrap = apartmentInfo.querySelector('.apartment__genplan');
  const chooseInfoWrap = apartmentInfo.querySelector('.apartment__chooseinfo');
  if (!genplanWrap || !chooseInfoWrap) return;

  const genplanLinks = apartmentInfo.querySelectorAll('.genplan__link');

  const chooseInfo = chooseInfoWrap.querySelector('.choose-appart__info');
  const backBtn = chooseInfo ? chooseInfo.querySelector('.choose-appart__back') : null;
  const floorEl = chooseInfo ? chooseInfo.querySelector('.choose-appart__floor') : null;
  const floorPlans = chooseInfo ? chooseInfo.querySelectorAll('.choose-appart__floor-plan') : [];

  const tooltip = document.getElementById('genplan-tooltip');

  function setActiveFloor(floorNum) {
    const floorStr = String(floorNum);
    if (floorEl) floorEl.textContent = `${floorStr}`;
    floorPlans.forEach((plan) => {
      const planFloor = plan.getAttribute('data-floor');
      plan.classList.toggle('is-active', planFloor === floorStr);
    });

    // Список может быть вынесен из `.apartment__chooseinfo` (например, в `.apartment__container`)
    const apartmentRoot = apartmentInfo.closest('.apartment');
    const listScope = apartmentRoot || apartmentInfo;
    const listItems = listScope.querySelectorAll('.choose-appart__list li.choose-appart__item');
    if (listItems && listItems.length) {
      const targetN = parseInt(floorStr, 10);
      listItems.forEach((li) => {
        const n = parseInt(String(li.textContent || '').trim(), 10);
        li.classList.toggle('active', n === targetN);
      });
    }
  }

  function showChooseInfo(floorNum) {
    apartmentInfo.classList.add('apartment__info--choose-active');
    genplanWrap.style.display = 'none';
    chooseInfoWrap.style.display = 'block';

    if (tooltip) {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }

    setActiveFloor(floorNum);
  }

  function clearChooseAppartFloorListActive() {
    const apartmentRoot = apartmentInfo.closest('.apartment');
    const listScope = apartmentRoot || apartmentInfo;
    listScope.querySelectorAll('.choose-appart__list li.choose-appart__item').forEach((li) => {
      li.classList.remove('active');
    });
  }

  function showGenplan() {
    apartmentInfo.classList.remove('apartment__info--choose-active');
    chooseInfoWrap.style.display = 'none';
    genplanWrap.style.display = 'block';
    clearChooseAppartFloorListActive();

    if (tooltip) {
      tooltip.classList.remove('is-visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showGenplan();
    });
  }

  document.addEventListener('apartment:choose-floor', (e) => {
    const raw = e.detail && e.detail.floor;
    if (raw === undefined || raw === null || raw === '') return;
    showChooseInfo(raw);
  });

  if (genplanLinks.length) {
    genplanLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const floorNum = link.getAttribute('data-floor');
        if (!floorNum) return;
        showChooseInfo(floorNum);
      });
    });
  }
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

// PDF для страницы квартиры: собираем отдельный print-шаблон (как на макете) и печатаем в PDF
(function initAppartDetailPdf() {
  const root = document.querySelector('.appart-detail');
  if (!root) return;
  const btn = root.querySelector('a.appart-detail__pdf');
  if (!btn) return;

  function escapeHtml(v) {
    return String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function textOf(selector) {
    const el = root.querySelector(selector);
    return (el?.textContent || '').trim();
  }

  function parseNumberLikeRu(str) {
    // "5 123 000 ₽" -> 5123000 ; "56,3 м2" -> 56.3
    const s = String(str || '')
      .replace(/\s+/g, ' ')
      .trim();
    const normalized = s
      .replace(/[^\d,.-]/g, '')
      .replace(/\s/g, '')
      .replace(',', '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  function formatRub(n) {
    try {
      return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
    } catch {
      return String(n) + ' ₽';
    }
  }

  function formatRubPerM2(n) {
    // 90994.67 -> "90 994,67 ₽"
    try {
      return (
        new Intl.NumberFormat('ru-RU', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(n) + ' ₽'
      );
    } catch {
      return String(n) + ' ₽';
    }
  }

  function getSvgOuterHtml(view) {
    const svg = root.querySelector(`.appart-detail__img-item[data-appart-view="${view}"] svg`);
    return svg ? svg.outerHTML : '';
  }

  function buildPrintHtml() {
    const title = textOf('.appart-detail__title');
    const sqrRaw = textOf('.appart-detail__sqr');
    const priceRaw = textOf('.appart-detail__price');

    const infoBlocks = Array.from(root.querySelectorAll('.appart-detail__information > div')).map(
      (d) => {
        const head = (d.querySelector('.appart-detail__head')?.textContent || '').trim();
        const value = (d.querySelector('.appart-detail__value')?.textContent || '').trim();
        return { head, value };
      },
    );

    const floor = infoBlocks.find((x) => /этаж/i.test(x.head || ''))?.value || '';
    const section = infoBlocks.find((x) => /блок/i.test(x.head || ''))?.value || '';

    const sqr = parseNumberLikeRu(sqrRaw);
    const price = parseNumberLikeRu(priceRaw);
    const pricePerM2 = price && sqr ? price / sqr : null;

    const phone =
      (document.querySelector('.footer__info--phone')?.textContent || '').trim() ||
      (document.querySelector('.header__phone')?.textContent || '').trim();
    const email = (document.querySelector('.footer__info--mail')?.textContent || '').trim();
    const addrLines = Array.from(document.querySelectorAll('.footer__info--text p'))
      .map((p) => (p.textContent || '').trim())
      .filter(Boolean);

    const apartSvg = getSvgOuterHtml('apart');
    const floorSvg = getSvgOuterHtml('floor');

    const priceStr = price ? formatRub(price) : priceRaw;
    const pricePerM2Str = pricePerM2 ? formatRubPerM2(pricePerM2) : '';

    const addrHtml = addrLines
      .map((l) => `<div class="pdf__muted">${escapeHtml(l)}</div>`)
      .join('');
    const phoneHtml = phone ? `<a href="#">${escapeHtml(phone)}</a>` : '';
    const emailHtml = email ? `<a href="#">${escapeHtml(email)}</a>` : '';
    const baseHref = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`;

    const replacements = {
      '%%BASE_HREF%%': baseHref,
      '%%TITLE%%': escapeHtml(title),
      '%%SQR%%': escapeHtml(sqrRaw),
      '%%FLOOR%%': escapeHtml(floor),
      '%%SECTION%%': escapeHtml(section),
      '%%PRICE%%': escapeHtml(priceStr),
      '%%PRICE_PER_M2%%': escapeHtml(pricePerM2Str || ''),
      '%%PHONE_HTML%%': phoneHtml,
      '%%EMAIL_HTML%%': emailHtml,
      '%%ADDR_HTML%%': addrHtml,
      // SVG вставляем как “сырой” HTML (без escape)
      '%%APART_SVG%%': apartSvg || '',
      '%%FLOOR_SVG%%': floorSvg || '',
    };

    let html = appartDetailPdfTemplate;
    Object.entries(replacements).forEach(([key, value]) => {
      html = html.split(key).join(value);
    });
    return html;
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const html = buildPrintHtml();
    // В Chrome/Edge фичи вроде `noreferrer` могут вернуть `null` вместо ссылки на окно,
    // из-за чего мы не сможем записать HTML (в итоге пользователь видит пустую страницу).
    const w = window.open('', '_blank');
    if (!w) return;
    try {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (err) {
      // Фоллбек: если запись в окно заблокировали — открываем как data: URL
      const encoded = encodeURIComponent(html);
      window.open(`data:text/html;charset=utf-8,${encoded}`, '_blank');
    }
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
