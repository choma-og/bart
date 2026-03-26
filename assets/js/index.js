import { S as Swiper, N as Navigation, P as Pagination, E as EffectFade, A as Autoplay, f as freeMode, T as Thumb, F, a as axios, I as IMask } from "./vendor.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
const appartDetailPdfTemplate = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <base href="%%BASE_HREF%%" />
    <title>%%TITLE%%</title>
    <style>
      @font-face {
        font-family: "Helios";
        font-style: normal;
        font-weight: 400;
        src: url("assets/ttf/heliosext.ttf") format("truetype");
        font-display: swap;
      }
      @page {
        size: A4 landscape;
        margin: 12mm;
      }
      html,
      body {
        height: 100%;
      }
      body {
        font-family: 'Helios', sans-serif;
        font-weight: 400;
        line-height: 1.4;
        font-size: 18px;
        margin: 0;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .col-1 {
        width: 8.33%;
      }
      .pl-1 {
        padding-left: 8.33%;
      }
      .col-2 {
        width: 16.67%;
      }
      .col-3 {
        width: 24.99%;
      }
      .col-4 {
        width: 33.33%;
      }
      .col-5 {
        width: 46.47%;
      }
      .col-6 {
        width: 50%;
      }
      .col-7 {
        width: 58.33%;
      }
      .col-8 {
        width: 66.66%;
      }
      .col-9 {
        width: 75%;
      }
      .col-10 {
        width: 83.33%;
      }
      .col-11 {
        width: 91.67%;
      }
      .col-12 {
        width: 100%;
      }
      .row {
        display: flex;
        justify-content: space-between;
      }
      .pdf-block {
        padding: 30px;
      }
      /* .pdf {
        display: grid;
        grid-template-columns: 1fr 1.1fr;
        gap: 16mm;
        align-items: stretch;
      }
      .pdf__left {
        padding: 8mm 0;
      }
      .pdf__brand {
        font-weight: 800;
        letter-spacing: 0.06em;
        font-size: 24px;
        margin-bottom: 16mm;
      }
      .pdf__title {
        font-weight: 700;
        font-size: 36px;
        margin: 0 0 8mm;
      }
      .pdf__sqr {
        font-size: 28px;
        margin: 0 0 10mm;
      }

      .pdf__label {
        font-size: 13px;
        color: #aeaab7;
        margin-bottom: 2mm;
      }
      .pdf__value {
        font-size: 18px;
      }
      .pdf__priceRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10mm;
        align-items: end;
        margin-top: 6mm;
      }
      .pdf__price {
        font-size: 34px;
        font-weight: 700;
      }
      .pdf__per {
        text-align: left;
      }
      .pdf__muted {
        font-size: 13px;
        color: #928d9d;
        line-height: 1.35;
      }
      .pdf__contacts {
        margin-top: 18mm;
        display: grid;
        gap: 2mm;
      }
      .pdf__contacts .pdf__head {
        font-size: 13px;
        color: #aeaab7;
        margin-bottom: 3mm;
      }
      .pdf__contacts a {
        color: #26202e;
        text-decoration: none;
      }
      .pdf__contacts a:hover {
        text-decoration: underline;
      }
      .pdf__right {
        position: relative;
        padding: 6mm 0;
      }
      .pdf__planBig {
        width: 100%;
        height: auto;
        display: block;
      }
      .pdf__planBig svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .pdf__planSmallWrap {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 38%;
      }
      .pdf__planSmallTitle {
        text-align: center;
        font-size: 14px;
        color: #928d9d;
        margin: 0 0 4mm;
      }
      .pdf__planSmall svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .pdf__topNote {
        text-align: center;
        font-size: 14px;
        color: #928d9d;
        margin-bottom: 8mm;
      } */
      .pdf-info__logo {
        margin-bottom: 40px;
       }
       .pdf {
        height: 100vh;
       }
      .pdf__descr {
        max-width: 240px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 10mm;
      }
      .pdf__title {
        font-size: clamp(26px, 1.111rem + 1.27vw, 36px);
        line-height: 1.2;
        color: #26202E;
        margin-bottom: 30px;
        font-family: "Helios", sans-serif;
        font-weight: 400;
      }
      .pdf-info {
        background-color: #EAE8EC;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 40px;
      }
      .pdf__sqr {
        color: #26202E;
        font-size: 24px;
        display: block;
        margin-bottom: 30px;
        font-family: "Helios", sans-serif;
      }
      .appart-detail__value {
          font-size: 20px;
          color: #26202E;
          font-family: "Helios", sans-serif;
      }

      .appart-detail__head {
          font-size: 14px;
          color: #AEAAB7;
          font-family: "Helios", sans-serif;
      }
      .pdf__street {
        color: #928D9D;
        font-size: 12px;
        font-family: "Helios", sans-serif;
      }
      .pdf__price {
        color: #26202E;
        font-size: 24px;
        font-family: "Helios", sans-serif;
      }
      .pdf__street-1 {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .pdf__street-3 {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      .pdf__planSmall {

      }
      .pdf__street-2 {
        position: absolute;
        bottom: 40%;
        right: 0%;
        transform: translate(0%, 0%);
        writing-mode: vertical-rl;
      }
      .pdf__priceRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        align-items: flex-end;
        max-width: 300px;
      }
      .pdf__head {
        color: #928D9D;
        font-size: 10px;
        margin-bottom: 16px;
        font-family: "Helios", sans-serif;
      }
      .pdf__phone {
        font-family: "Helios", sans-serif;
        display: block;
        color: #26202E;
        margin-bottom: 10px;
        font-size: 16px;
      }
      .pdf__mail {
        font-family: "Helios", sans-serif;
        color: #928D9D;
        font-size: 12px;
        display: block;
        margin-bottom: 10px;
      }
      .pdf__adress {
        font-family: "Helios", sans-serif;
        font-size: 12px;
        color: #928D9D;
        margin: 0;
      }
      .pdf__planBig {
        width: 320px;
      }
      .pdf-images {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
      }
      .pdf-compas {
        position: absolute;
        top: 30px;
        right: 30px;
      }
      .pdf__planSmallWrap {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      .pdf__planSmallTitle {
        color: #928D9D;
        font-size: 12px;
        font-family: "Helios", sans-serif;
      }
      .pdf-detail__img {
          position: relative;
          top:25%;
          left: 30%;
          transform: translate(-50%, -50%);
          width: -moz-fit-content;
          width: fit-content;
          height: -moz-fit-content;
          height: fit-content;
          margin-bottom: 40px;
      }
      .pdf__location {
        position: absolute;
        top: 50%;
        left: 80%;
        transform: translate(-50%, -50%);
        height: 460px;
        width: 500px;
        pointer-events: none;
      }
      @media print {
        a {
          color: #26202e;
          text-decoration: none;
        }
      }

    </style>
  </head>
  <body>

    <section class="pdf col-12 row">
      <div class="col-6 pdf-info pdf-block">
        <div class="pdf-info__top">
          <svg class="pdf-info__logo" width="100" height="16" viewBox="0 0 100 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1060_6420)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3583 15.265H37.9558L40.0967 11.5409H32.5308L36.9658 4.34974L43.0933 15.2658H51.0283L41.9567 -0.00113297H34.0217L24.3575 15.265H24.3583ZM53.095 -0.00113297L50.9533 3.72292H54.4008V15.265H61.2483V11.2882H69.3283C77.9808 11.2882 77.9625 -0.00113297 69.3283 -0.00113297L53.095 -0.00113297ZM61.2483 7.56414V3.72292H66.3292C69.7133 3.72292 69.6692 7.56414 66.3292 7.56414H61.2483ZM0 15.265H17.3183C24.7192 15.265 24.7142 5.81342 17.4575 5.81342H6.8475V3.72292H20.715L22.8558 -0.00113297H0V15.265ZM6.8475 11.5409V9.09143H14.5642C16.4658 9.09143 16.3808 11.5409 14.5642 11.5409H6.8475ZM100 -0.00113297H78.835L76.6942 3.72292H84.9242V15.265H91.7717V3.72292H97.86L100.001 -0.00113297H100Z" fill="#26202E"/>
            </g>
            <defs>
            <clipPath id="clip0_1060_6420">
            <rect width="100" height="15.2017" fill="white"/>
            </clipPath>
            </defs>
          </svg>
          <h2 class="pdf__title">%%TITLE%%</h2>
          <div class="pdf__sqr">%%SQR%%</div>
          <div class="pdf__descr">
            <div>
              <div class="appart-detail__head">Этаж</div>
              <div class="appart-detail__value">%%FLOOR%%</div>
            </div>
            <div>
              <div class="appart-detail__head">Блок-секция</div>
              <div class="appart-detail__value">%%SECTION%%</div>
            </div>
          </div>
          <div class="pdf__priceRow">
            <div class="pdf__price">%%PRICE%%</div>
            <div class="pdf__per">
              <div class="appart-detail__head">За м²</div>
              <div class="appart-detail__value">%%PRICE_PER_M2%%</div>
            </div>
          </div>
        </div>
        <div class="pdf-info__bottom">
        <div class="pdf__contacts">
          <div class="pdf__head">Офис продаж</div>
            <span class="pdf__phone">%%PHONE_HTML%%</span>
            <span class="pdf__mail">%%EMAIL_HTML%%</span>
            <p class="pdf__adress">%%ADDR_HTML%%</p>
          </div>
        </div>
      </div>
      <div class="col-6 pdf-images pdf-block">
        <svg class="pdf-compas" width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1060_6423)">
          <mask id="path-1-inside-1_1060_6423" fill="white">
          <path d="M17.1607 0.793211L15.1086 8.59L22.836 6.51945L17.1607 0.793211Z"/>
          </mask>
          <path d="M15.1086 8.59L10.2733 7.31735L8.08025 15.6496L16.4027 13.4196L15.1086 8.59ZM17.1607 0.793211L20.712 -2.72649L14.5525 -8.94126L12.3254 -0.479438L17.1607 0.793211ZM22.836 6.51945L24.1301 11.3491L32.4523 9.11916L26.3873 2.99975L22.836 6.51945ZM15.1086 8.59L19.9439 9.86265L21.996 2.06586L17.1607 0.793211L12.3254 -0.479438L10.2733 7.31735L15.1086 8.59ZM17.1607 0.793211L13.6094 4.31292L19.2847 10.0392L22.836 6.51945L26.3873 2.99975L20.712 -2.72649L17.1607 0.793211ZM22.836 6.51945L21.5419 1.68982L13.8145 3.76037L15.1086 8.59L16.4027 13.4196L24.1301 11.3491L22.836 6.51945Z" fill="#625B6D" mask="url(#path-1-inside-1_1060_6423)"/>
          <circle cx="23.9556" cy="24.1444" r="17.5" transform="rotate(-15 23.9556 24.1444)" stroke="#625B6D"/>
          <path d="M28.6062 24.7272C28.3782 26.8992 26.6622 28.3272 24.1902 28.3272C21.2262 28.3272 19.4262 26.5152 19.4262 23.7432C19.4262 20.9712 21.2262 19.1592 24.2022 19.1592C26.6382 19.1592 28.3302 20.5392 28.5102 22.5552H27.2262C26.9862 21.1632 25.8582 20.3232 24.1902 20.3232C21.9822 20.3232 20.7102 21.6072 20.7102 23.7432C20.7102 25.8792 21.9942 27.1632 24.2022 27.1632C25.9182 27.1632 27.1182 26.1912 27.3222 24.7272H28.6062Z" fill="#26202E"/>
          </g>
          <defs>
          <clipPath id="clip0_1060_6423">
          <rect width="46" height="46" fill="white"/>
          </clipPath>
          </defs>
        </svg>

        <div class="pdf-detail__img">
          <div class="pdf__planBig">
            %%APART_SVG%%
          </div>
          <div class="pdf__location">
            <span class="pdf__street-1 pdf__street">Павловский тракт</span>
            <span class="pdf__street-2 pdf__street">Ул. Малахова</span>
            <span class="pdf__street-3 pdf__street">Ул. Взлетная</span>
          </div>
        </div>

          <div class="pdf__planSmallWrap">
            <div class="pdf__planSmallTitle">Квартира на этаже</div>
            <div class="pdf__planSmall">
              %%FLOOR_SVG%%
            </div>
          </div>
      </div>
    </section>
    <script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          window.focus();
          window.print();
        }, 50);
      });
      window.addEventListener('afterprint', () => {
        setTimeout(() => window.close(), 50);
      });
    <\/script>
  </body>
</html>

`;
(function initHeaderInfoMove() {
  const headerInfo = document.querySelector(".header__info");
  const menuBody = document.querySelector(".menu__body");
  const headerRight = document.querySelector(".header__right");
  if (!headerInfo || !menuBody || !headerRight)
    return;
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
  window.addEventListener("resize", apply);
  apply();
})();
(function initMenuToggle() {
  const header = document.querySelector(".header");
  const menuIcon = document.querySelector(".menu__icon");
  const menuBody = document.querySelector(".menu__body");
  const body = document.body;
  if (!menuIcon || !menuBody)
    return;
  menuIcon.addEventListener("click", () => {
    header == null ? void 0 : header.classList.toggle("active");
    menuIcon.classList.toggle("active");
    menuBody.classList.toggle("active");
    const menuNowOpen = menuBody.classList.contains("active");
    if (menuNowOpen) {
      body.classList.add("_lock", "_menu-open");
    } else {
      body.classList.remove("_menu-open");
      const modalOpen = document.querySelector(".modal__body.active");
      if (!modalOpen)
        body.classList.remove("_lock");
    }
  });
})();
Swiper.use([Navigation, Pagination, EffectFade, Autoplay, freeMode, Thumb]);
function createDynamicsSwiper() {
  return new Swiper(".dynamics-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".dynamics-next",
      prevEl: ".dynamics-prev"
    },
    breakpoints: {
      650: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      976: {
        slidesPerView: 1.3,
        spaceBetween: 20
      },
      1250: {
        slidesPerView: 1.3,
        spaceBetween: 60
      }
    }
  });
}
function createNewsSwiper() {
  return new Swiper(".news-swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".news-next",
      prevEl: ".news-prev"
    },
    breakpoints: {
      650: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      976: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1250: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
}
createNewsSwiper();
let dynamicsSwiper = null;
(function initDynamicsSwiperByYear() {
  const wrapper = document.querySelector(".dynamics-swiper .swiper-wrapper");
  const yearLinks = Array.from(document.querySelectorAll(".dynamics__years a[data-year]"));
  const dynamicsNav = document.querySelector(".dynamics-nav");
  function syncDynamicsNavVisibility() {
    if (!dynamicsNav)
      return;
    const prev = dynamicsNav.querySelector(".dynamics-prev");
    const next = dynamicsNav.querySelector(".dynamics-next");
    if (!prev || !next)
      return;
    const hideNav = prev.classList.contains("swiper-button-disabled") && next.classList.contains("swiper-button-disabled");
    dynamicsNav.classList.toggle("is-hidden", hideNav);
  }
  if (!wrapper || yearLinks.length === 0) {
    dynamicsSwiper = createDynamicsSwiper();
    return;
  }
  const slides = Array.from(wrapper.querySelectorAll(".swiper-slide.dynamics-slide[data-year]"));
  if (slides.length === 0) {
    dynamicsSwiper = createDynamicsSwiper();
    return;
  }
  const slidesByYear = /* @__PURE__ */ new Map();
  slides.forEach((slide) => {
    const year = slide.dataset.year;
    if (!year)
      return;
    if (!slidesByYear.has(year))
      slidesByYear.set(year, []);
    slidesByYear.get(year).push(slide.outerHTML);
  });
  const activeLink = yearLinks.find((l) => l.classList.contains("active")) || yearLinks[0];
  const initialYear = activeLink == null ? void 0 : activeLink.dataset.year;
  function initOrReinit(year) {
    const yearSlides = slidesByYear.get(year);
    if (!yearSlides)
      return;
    if (dynamicsSwiper) {
      dynamicsSwiper.destroy(true, true);
      dynamicsSwiper = null;
    }
    wrapper.innerHTML = yearSlides.join("");
    dynamicsSwiper = createDynamicsSwiper();
    dynamicsSwiper.slideTo(0, 0);
    dynamicsSwiper.on("lock unlock slideChange", syncDynamicsNavVisibility);
    setTimeout(syncDynamicsNavVisibility, 0);
  }
  initOrReinit(initialYear);
  yearLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const year = link.dataset.year;
      if (!year)
        return;
      yearLinks.forEach((l) => l.classList.toggle("active", l === link));
      initOrReinit(year);
    });
  });
})();
document.addEventListener("click", (e) => {
  const galleryLink = e.target.closest(".dynamics-gallery");
  if (!galleryLink)
    return;
  e.preventDefault();
  const galleryData = galleryLink.getAttribute("data-gallery");
  if (!galleryData)
    return;
  try {
    const urls = JSON.parse(galleryData);
    const items = urls.map((src) => ({ src }));
    F.show(items);
  } catch (err) {
    console.warn("dynamics-gallery: неверный data-gallery", err);
  }
});
function randomPointNear(centerLng, centerLat, radiusLng = 0.012, radiusLat = 8e-3) {
  return [
    centerLng + (Math.random() * 2 - 1) * radiusLng,
    centerLat + (Math.random() * 2 - 1) * radiusLat
  ];
}
const LOCATION_CATEGORY_PLACES = {
  education: [
    "Школа №42",
    "Курсы английского",
    "Учебный центр «Знание»",
    "Лицей №86",
    "Школа искусств"
  ],
  kindergarten: [
    "Детский сад «Солнышко»",
    "Детский сад №5",
    "Детский сад «Ромашка»",
    "Центр развития «Кроха»"
  ],
  products: [
    "Магазин «Продукты»",
    "Супермаркет «Аникс»",
    "«Пятёрочка»",
    "«Магнит»",
    "Продуктовый рынок"
  ],
  cafe: [
    "Ресторан «Хочу Пури»",
    "Кафе «Барнаул»",
    "Кофейня «Шоколадница»",
    "Пекарня «Волконский»",
    "Кафе «Пушкин»"
  ]
};
function buildCategoryPoints(centerLng, centerLat, categoryId, count = 6) {
  const names = LOCATION_CATEGORY_PLACES[categoryId] || ["Объект"];
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      name: names[i % names.length],
      coords: randomPointNear(centerLng, centerLat)
    });
  }
  return points;
}
function initLocationMap() {
  const mapEl = document.getElementById("map");
  const listEl = document.querySelector(".location__list");
  if (!mapEl)
    return;
  if (typeof window.ymaps3 === "undefined") {
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
          zoom: 15
        }
      },
      [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
    );
    const pinUrl = "/bart/img/pin.png";
    const markerEl = document.createElement("div");
    markerEl.className = "location__marker";
    const img = document.createElement("img");
    img.src = pinUrl;
    img.alt = "";
    img.width = 40;
    img.height = 40;
    markerEl.appendChild(img);
    const mainMarker = new YMapMarker({ coordinates: CENTER, zIndex: 2e3 }, markerEl);
    map.addChild(mainMarker);
    let categoryMarkers = [];
    function clearCategoryMarkers() {
      categoryMarkers.forEach((m) => map.removeChild(m));
      categoryMarkers = [];
    }
    function showCategoryPoints(categoryId) {
      clearCategoryMarkers();
      const points = buildCategoryPoints(CENTER[0], CENTER[1], categoryId);
      points.forEach(({ name, coords }) => {
        const wrap = document.createElement("div");
        wrap.className = "location__point-wrap";
        const point = document.createElement("div");
        point.className = "location__point";
        point.setAttribute("aria-label", name);
        const tooltip = document.createElement("div");
        tooltip.className = "location__tooltip";
        tooltip.textContent = name;
        wrap.appendChild(tooltip);
        wrap.appendChild(point);
        const showTooltip = () => {
          wrap.classList.add("is-tooltip-visible");
        };
        const hideTooltip = () => {
          wrap.classList.remove("is-tooltip-visible");
        };
        point.addEventListener("mouseenter", showTooltip);
        point.addEventListener("mouseleave", hideTooltip);
        function onPointClick(e) {
          e.stopPropagation();
          e.preventDefault();
          document.querySelectorAll(".location__point-wrap.is-tooltip-visible").forEach((w) => {
            if (w !== wrap)
              w.classList.remove("is-tooltip-visible");
          });
          wrap.classList.toggle("is-tooltip-visible");
        }
        wrap.addEventListener("click", onPointClick);
        const yMarker = new YMapMarker({ coordinates: coords, zIndex: 1e3 }, wrap);
        map.addChild(yMarker);
        categoryMarkers.push(yMarker);
      });
    }
    if (listEl) {
      listEl.addEventListener("click", (e) => {
        const item = e.target.closest(".location__item");
        if (!item)
          return;
        const categoryId = item.getAttribute("data-category");
        if (!categoryId)
          return;
        listEl.querySelectorAll(".location__item").forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
        showCategoryPoints(categoryId);
      });
      const activeItem = listEl.querySelector(".location__item.active");
      const initialCategory = (activeItem == null ? void 0 : activeItem.getAttribute("data-category")) || "education";
      showCategoryPoints(initialCategory);
    }
    document.addEventListener("click", (e) => {
      const clickedTarget = e.target;
      setTimeout(() => {
        if (clickedTarget.closest && clickedTarget.closest(".location__point-wrap"))
          return;
        mapEl.querySelectorAll(".location__point-wrap.is-tooltip-visible").forEach((w) => w.classList.remove("is-tooltip-visible"));
      }, 0);
    });
  });
}
initLocationMap();
(function initChooseAppartResponsiveDomMove() {
  const MAX_WIDTH = 801;
  const mq = window.matchMedia(`(min-width: ${MAX_WIDTH + 1}px)`);
  const mqWrappToApartmentContainer = window.matchMedia("(max-width: 799px)");
  let navEl = null;
  let compasEl = null;
  let wrappEl = null;
  let infoEl = null;
  let placeholderEl = null;
  let moved = false;
  function getElements() {
    navEl = navEl || document.querySelector(".choose-appart__nav");
    compasEl = compasEl || document.querySelector(".choose-appart__compas");
    wrappEl = wrappEl || document.querySelector(".choose-appart__wrapp");
    infoEl = infoEl || document.querySelector(".choose-appart__info");
    return navEl && compasEl && wrappEl && infoEl;
  }
  function moveToInfo() {
    if (moved)
      return;
    if (!getElements())
      return;
    placeholderEl = document.createElement("div");
    placeholderEl.className = "choose-appart__wrapp-placeholder";
    placeholderEl.style.display = "none";
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
    if (!moved)
      return;
    if (!getElements())
      return;
    wrappEl.appendChild(navEl);
    wrappEl.appendChild(compasEl);
    if (placeholderEl && placeholderEl.parentNode) {
      placeholderEl.replaceWith(wrappEl);
    }
    placeholderEl = null;
    moved = false;
  }
  function repositionWrappInApartmentContainer() {
    if (mq.matches)
      return;
    const wrapp = wrappEl && wrappEl.isConnected && wrappEl.classList.contains("choose-appart__wrapp") ? wrappEl : document.querySelector(".choose-appart__wrapp");
    if (!wrapp)
      return;
    const container = document.querySelector(".apartment__container");
    const inner = container && container.querySelector(":scope > .apartment__inner");
    const chooseinfo = document.querySelector(".apartment__chooseinfo");
    const info = infoEl && infoEl.isConnected ? infoEl : document.querySelector(".choose-appart__info");
    if (!container || !inner || !chooseinfo || !info)
      return;
    if (mqWrappToApartmentContainer.matches) {
      if (wrapp.parentNode !== container || wrapp.previousElementSibling !== inner) {
        inner.after(wrapp);
      }
    } else if (wrapp.parentNode === container) {
      chooseinfo.insertBefore(wrapp, info);
    }
  }
  function apply() {
    if (mq.matches)
      moveToInfo();
    else
      moveBack();
    repositionWrappInApartmentContainer();
  }
  let tries = 0;
  const maxTries = 20;
  const timer = setInterval(() => {
    tries += 1;
    if (getElements()) {
      clearInterval(timer);
      apply();
      return;
    }
    if (tries >= maxTries)
      clearInterval(timer);
  }, 50);
  if (mq.addEventListener)
    mq.addEventListener("change", apply);
  else
    mq.addListener(apply);
  if (mqWrappToApartmentContainer.addEventListener) {
    mqWrappToApartmentContainer.addEventListener("change", apply);
  } else
    mqWrappToApartmentContainer.addListener(apply);
})();
(function initChooseAppartNav() {
  const apartmentSection = document.querySelector("section.apartment");
  const hasApartmentChooser = apartmentSection && apartmentSection.querySelector(".apartment__chooseinfo");
  const choosePageSection = document.querySelector("section.choose-appart");
  let nav;
  let imgBlock;
  if (hasApartmentChooser) {
    nav = apartmentSection.querySelector(".choose-appart__nav");
    imgBlock = apartmentSection.querySelector(".apartment__chooseinfo .choose-appart__img");
  } else if (choosePageSection) {
    nav = choosePageSection.querySelector(".choose-appart__nav");
    imgBlock = choosePageSection.querySelector(".choose-appart__img");
  } else {
    nav = document.querySelector(".choose-appart__nav");
    imgBlock = document.querySelector(".choose-appart__img");
  }
  if (!nav)
    return;
  const list = nav.querySelector(".choose-appart__list");
  const arrowUp = nav.querySelector("div:first-child");
  const arrowDown = nav.querySelector("div:last-child");
  if (!list || !arrowUp || !arrowDown)
    return;
  const items = Array.from(list.querySelectorAll("li"));
  const floorPlans = imgBlock ? imgBlock.querySelectorAll(".choose-appart__floor-plan") : [];
  function setActive(li) {
    items.forEach((el) => el.classList.remove("active"));
    if (li)
      li.classList.add("active");
    const floorNum = li ? parseInt(li.textContent.trim(), 10) : null;
    switchFloorPlan(Number.isNaN(floorNum) ? null : floorNum);
    if (li && !Number.isNaN(floorNum) && document.querySelector(".apartment__chooseinfo")) {
      document.dispatchEvent(
        new CustomEvent("apartment:choose-floor", { detail: { floor: floorNum } })
      );
    }
  }
  function switchFloorPlan(floorNum) {
    floorPlans.forEach((plan) => {
      const planFloor = parseInt(plan.getAttribute("data-floor"), 10);
      plan.classList.toggle("is-active", planFloor === floorNum);
    });
  }
  function getListScrollStepPx() {
    if (!items.length)
      return 45;
    const cs = getComputedStyle(list);
    const gap = parseFloat(cs.gap) || 0;
    const r = items[0].getBoundingClientRect();
    const row = cs.flexDirection === "row" || cs.flexDirection === "row-reverse";
    return Math.round((row ? r.width : r.height) + gap);
  }
  function scrollListOneItem(direction) {
    const cs = getComputedStyle(list);
    const fd = cs.flexDirection;
    const step = getListScrollStepPx();
    const row = fd === "row" || fd === "row-reverse";
    if (row) {
      list.scrollBy({ left: direction * step, behavior: "smooth" });
      return;
    }
    list.scrollBy({ top: direction * step, behavior: "smooth" });
  }
  const initialActive = list.querySelector("li.active");
  if (initialActive)
    switchFloorPlan(parseInt(initialActive.textContent.trim(), 10));
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li)
      setActive(li);
  });
  arrowUp.addEventListener("click", () => scrollListOneItem(-1));
  arrowDown.addEventListener("click", () => scrollListOneItem(1));
})();
(function initFlatModal() {
  const modal = document.getElementById("flat-modal");
  const links = document.querySelectorAll(".choose-appart__link");
  if (!modal || !links.length)
    return;
  const offsetX = 16;
  const offsetY = 16;
  let rafId = null;
  let lastMove = null;
  function setModalContent(link) {
    const img = modal.querySelector(".flat-modal__img-el");
    const availability = modal.querySelector(".flat-modal__availability");
    const price = modal.querySelector(".flat-modal__price");
    const head = modal.querySelector(".flat-modal__head");
    const sqr = modal.querySelector(".flat-modal__sqr");
    const etaj = modal.querySelector(".flat-modal__etaj");
    if (img)
      img.src = link.getAttribute("data-flat-image") || "";
    if (availability)
      availability.textContent = link.getAttribute("data-flat-availability") || "";
    if (price)
      price.textContent = link.getAttribute("data-flat-price") || "";
    if (head)
      head.textContent = link.getAttribute("data-flat-head") || "";
    if (sqr)
      sqr.textContent = link.getAttribute("data-flat-sqr") || "";
    if (etaj)
      etaj.textContent = link.getAttribute("data-flat-etaj") || "";
  }
  function applyPosition(clientX, clientY) {
    const rect = modal.getBoundingClientRect();
    const right = clientX + offsetX + rect.width;
    const bottom = clientY + offsetY + rect.height;
    let left = clientX + offsetX;
    let top = clientY + offsetY;
    if (right > window.innerWidth)
      left = clientX - offsetX - rect.width;
    if (bottom > window.innerHeight)
      top = clientY - offsetY - rect.height;
    if (left < 0)
      left = offsetX;
    if (top < 0)
      top = offsetY;
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }
  function moveModal(e) {
    lastMove = { clientX: e.clientX, clientY: e.clientY };
    if (rafId !== null)
      return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastMove)
        applyPosition(lastMove.clientX, lastMove.clientY);
    });
  }
  function showModal(link, e) {
    setModalContent(link);
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    if (e)
      applyPosition(e.clientX, e.clientY);
  }
  function hideModal() {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  }
  links.forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      showModal(link, e);
    });
    link.addEventListener("mousemove", moveModal);
    link.addEventListener("mouseleave", hideModal);
  });
})();
(function initGenplanTooltip() {
  const tooltip = document.getElementById("genplan-tooltip");
  const links = document.querySelectorAll(".genplan__link");
  if (!tooltip || !links.length)
    return;
  const floorEl = tooltip.querySelector(".genplan-tooltip__floor");
  const countEl = tooltip.querySelector(".genplan-tooltip__count");
  if (!floorEl || !countEl)
    return;
  const offsetX = 16;
  const offsetY = 16;
  let rafId = null;
  let lastMove = null;
  function pluralKvartira(n) {
    const num = Math.abs(Number(n)) % 100;
    const n10 = num % 10;
    if (num > 10 && num < 20)
      return "квартир";
    if (n10 === 1)
      return "квартира";
    if (n10 >= 2 && n10 <= 4)
      return "квартиры";
    return "квартир";
  }
  function setContent(link) {
    const floor = link.getAttribute("data-floor") || "";
    const free = link.getAttribute("data-free-flats") || "";
    floorEl.textContent = floor ? `${floor} этаж` : "";
    const cnt = parseInt(free, 10);
    countEl.textContent = free !== "" && !Number.isNaN(cnt) ? `${cnt} ${pluralKvartira(cnt)} в продаже` : "";
  }
  function applyPosition(clientX, clientY) {
    const rect = tooltip.getBoundingClientRect();
    const right = clientX + offsetX + rect.width;
    const bottom = clientY + offsetY + rect.height;
    let left = clientX + offsetX;
    let top = clientY + offsetY;
    if (right > window.innerWidth)
      left = clientX - offsetX - rect.width;
    if (bottom > window.innerHeight)
      top = clientY - offsetY - rect.height;
    if (left < 0)
      left = offsetX;
    if (top < 0)
      top = offsetY;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  function moveTooltip(e) {
    lastMove = { clientX: e.clientX, clientY: e.clientY };
    if (rafId !== null)
      return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (lastMove)
        applyPosition(lastMove.clientX, lastMove.clientY);
    });
  }
  function show(link, e) {
    setContent(link);
    tooltip.classList.add("is-visible");
    tooltip.setAttribute("aria-hidden", "false");
    if (e)
      applyPosition(e.clientX, e.clientY);
  }
  function hide() {
    tooltip.classList.remove("is-visible");
    tooltip.setAttribute("aria-hidden", "true");
  }
  links.forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      show(link, e);
    });
    link.addEventListener("mousemove", moveTooltip);
    link.addEventListener("mouseleave", hide);
  });
})();
(function initApartmentGenplanChooseInfo() {
  const apartmentInfo = document.querySelector(".apartment__info");
  if (!apartmentInfo)
    return;
  const genplanWrap = apartmentInfo.querySelector(".apartment__genplan");
  const chooseInfoWrap = apartmentInfo.querySelector(".apartment__chooseinfo");
  if (!genplanWrap || !chooseInfoWrap)
    return;
  const genplanLinks = apartmentInfo.querySelectorAll(".genplan__link");
  const chooseInfo = chooseInfoWrap.querySelector(".choose-appart__info");
  const backBtn = chooseInfo ? chooseInfo.querySelector(".choose-appart__back") : null;
  const floorEl = chooseInfo ? chooseInfo.querySelector(".choose-appart__floor") : null;
  const floorPlans = chooseInfo ? chooseInfo.querySelectorAll(".choose-appart__floor-plan") : [];
  const tooltip = document.getElementById("genplan-tooltip");
  function setActiveFloor(floorNum) {
    const floorStr = String(floorNum);
    if (floorEl)
      floorEl.textContent = `${floorStr}`;
    floorPlans.forEach((plan) => {
      const planFloor = plan.getAttribute("data-floor");
      plan.classList.toggle("is-active", planFloor === floorStr);
    });
    const apartmentRoot = apartmentInfo.closest(".apartment");
    const listScope = apartmentRoot || apartmentInfo;
    const listItems = listScope.querySelectorAll(".choose-appart__list li.choose-appart__item");
    if (listItems && listItems.length) {
      const targetN = parseInt(floorStr, 10);
      listItems.forEach((li) => {
        const n = parseInt(String(li.textContent || "").trim(), 10);
        li.classList.toggle("active", n === targetN);
      });
    }
  }
  function showChooseInfo(floorNum) {
    apartmentInfo.classList.add("apartment__info--choose-active");
    genplanWrap.style.display = "none";
    chooseInfoWrap.style.display = "block";
    if (tooltip) {
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
    }
    setActiveFloor(floorNum);
  }
  function clearChooseAppartFloorListActive() {
    const apartmentRoot = apartmentInfo.closest(".apartment");
    const listScope = apartmentRoot || apartmentInfo;
    listScope.querySelectorAll(".choose-appart__list li.choose-appart__item").forEach((li) => {
      li.classList.remove("active");
    });
  }
  function showGenplan() {
    apartmentInfo.classList.remove("apartment__info--choose-active");
    chooseInfoWrap.style.display = "none";
    genplanWrap.style.display = "block";
    clearChooseAppartFloorListActive();
    if (tooltip) {
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
    }
  }
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showGenplan();
    });
  }
  document.addEventListener("apartment:choose-floor", (e) => {
    const raw = e.detail && e.detail.floor;
    if (raw === void 0 || raw === null || raw === "")
      return;
    showChooseInfo(raw);
  });
  if (genplanLinks.length) {
    genplanLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const floorNum = link.getAttribute("data-floor");
        if (!floorNum)
          return;
        showChooseInfo(floorNum);
      });
    });
  }
})();
(function initAppartDetailTabs() {
  const container = document.querySelector(".appart-detail");
  if (!container)
    return;
  const links = container.querySelectorAll(".appart-detail__link[data-appart-tab]");
  const items = container.querySelectorAll(".appart-detail__img-item[data-appart-view]");
  if (!links.length || !items.length)
    return;
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.getAttribute("data-appart-tab");
      if (!tab)
        return;
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      items.forEach((item) => {
        item.classList.toggle("is-active", item.getAttribute("data-appart-view") === tab);
      });
    });
  });
})();
(function initAppartDetailPdf() {
  const root = document.querySelector(".appart-detail");
  if (!root)
    return;
  const btn = root.querySelector("a.appart-detail__pdf");
  if (!btn)
    return;
  function escapeHtml(v) {
    return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function textOf(selector) {
    const el = root.querySelector(selector);
    return ((el == null ? void 0 : el.textContent) || "").trim();
  }
  function parseNumberLikeRu(str) {
    const s = String(str || "").replace(/\s+/g, " ").trim();
    const normalized = s.replace(/[^\d,.-]/g, "").replace(/\s/g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  function formatRub(n) {
    try {
      return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
    } catch {
      return String(n) + " ₽";
    }
  }
  function formatRubPerM2(n) {
    try {
      return new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(n) + " ₽";
    } catch {
      return String(n) + " ₽";
    }
  }
  function getSvgOuterHtml(view) {
    const svg = root.querySelector(`.appart-detail__img-item[data-appart-view="${view}"] svg`);
    return svg ? svg.outerHTML : "";
  }
  function buildPrintHtml() {
    var _a, _b, _c, _d, _e;
    const title = textOf(".appart-detail__title");
    const sqrRaw = textOf(".appart-detail__sqr");
    const priceRaw = textOf(".appart-detail__price");
    const infoBlocks = Array.from(root.querySelectorAll(".appart-detail__information > div")).map(
      (d) => {
        var _a2, _b2;
        const head = (((_a2 = d.querySelector(".appart-detail__head")) == null ? void 0 : _a2.textContent) || "").trim();
        const value = (((_b2 = d.querySelector(".appart-detail__value")) == null ? void 0 : _b2.textContent) || "").trim();
        return { head, value };
      }
    );
    const floor = ((_a = infoBlocks.find((x) => /этаж/i.test(x.head || ""))) == null ? void 0 : _a.value) || "";
    const section = ((_b = infoBlocks.find((x) => /блок/i.test(x.head || ""))) == null ? void 0 : _b.value) || "";
    const sqr = parseNumberLikeRu(sqrRaw);
    const price = parseNumberLikeRu(priceRaw);
    const pricePerM2 = price && sqr ? price / sqr : null;
    const phone = (((_c = document.querySelector(".footer__info--phone")) == null ? void 0 : _c.textContent) || "").trim() || (((_d = document.querySelector(".header__phone")) == null ? void 0 : _d.textContent) || "").trim();
    const email = (((_e = document.querySelector(".footer__info--mail")) == null ? void 0 : _e.textContent) || "").trim();
    const addrLines = Array.from(document.querySelectorAll(".footer__info--text p")).map((p) => (p.textContent || "").trim()).filter(Boolean);
    const apartSvg = getSvgOuterHtml("apart");
    const floorSvg = getSvgOuterHtml("floor");
    const priceStr = price ? formatRub(price) : priceRaw;
    const pricePerM2Str = pricePerM2 ? formatRubPerM2(pricePerM2) : "";
    const addrHtml = addrLines.map((l) => `<div class="pdf__muted">${escapeHtml(l)}</div>`).join("");
    const phoneHtml = phone ? `<a href="#">${escapeHtml(phone)}</a>` : "";
    const emailHtml = email ? `<a href="#">${escapeHtml(email)}</a>` : "";
    const baseHref = `${window.location.origin}${"/bart/"}`;
    const replacements = {
      "%%BASE_HREF%%": baseHref,
      "%%TITLE%%": escapeHtml(title),
      "%%SQR%%": escapeHtml(sqrRaw),
      "%%FLOOR%%": escapeHtml(floor),
      "%%SECTION%%": escapeHtml(section),
      "%%PRICE%%": escapeHtml(priceStr),
      "%%PRICE_PER_M2%%": escapeHtml(pricePerM2Str || ""),
      "%%PHONE_HTML%%": phoneHtml,
      "%%EMAIL_HTML%%": emailHtml,
      "%%ADDR_HTML%%": addrHtml,
      // SVG вставляем как “сырой” HTML (без escape)
      "%%APART_SVG%%": apartSvg || "",
      "%%FLOOR_SVG%%": floorSvg || ""
    };
    let html = appartDetailPdfTemplate;
    Object.entries(replacements).forEach(([key, value]) => {
      html = html.split(key).join(value);
    });
    return html;
  }
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const html = buildPrintHtml();
    const w = window.open("", "_blank");
    if (!w)
      return;
    try {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (err) {
      const encoded = encodeURIComponent(html);
      window.open(`data:text/html;charset=utf-8,${encoded}`, "_blank");
    }
  });
})();
(function initCallModal() {
  const openBtns = document.querySelectorAll(".js-open-call");
  const modal = document.querySelector(".js-modal-call");
  if (!openBtns.length || !modal)
    return;
  const body = modal.querySelector(".modal__body");
  const content = modal.querySelector(".modal__content");
  const closeBtn = modal.querySelector(".modal__close");
  const checkbox = modal.querySelector("#flexCheckChecked");
  const submitBtn = modal.querySelector(".modal__link");
  const nameInput = modal.querySelector(".modal__name");
  const phoneInput = modal.querySelector(".modal__tel");
  function validateName() {
    const value = ((nameInput == null ? void 0 : nameInput.value) || "").trim();
    return value.length >= 2;
  }
  function validatePhone() {
    const value = ((phoneInput == null ? void 0 : phoneInput.value) || "").replace(/\D/g, "");
    return value.length === 11 && value[0] === "7";
  }
  function setInputValid(input, valid) {
    if (!input)
      return;
    input.classList.toggle("is-invalid", !valid);
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
    body && body.classList.add("active");
    content && content.classList.add("active");
    document.body.classList.add("_lock");
    setInputValid(nameInput, true);
    setInputValid(phoneInput, true);
  }
  function closeModal(e) {
    var _a;
    if (e)
      e.preventDefault();
    body && body.classList.remove("active");
    content && content.classList.remove("active");
    const menuOpen = (_a = document.querySelector(".header")) == null ? void 0 : _a.classList.contains("active");
    if (!menuOpen)
      document.body.classList.remove("_lock");
  }
  if (checkbox && submitBtn) {
    checkbox.addEventListener("change", () => {
      submitBtn.disabled = !checkbox.checked;
    });
    submitBtn.disabled = !checkbox.checked;
  }
  if (nameInput) {
    nameInput.addEventListener("blur", () => setInputValid(nameInput, validateName()));
    nameInput.addEventListener("input", () => setInputValid(nameInput, validateName()));
  }
  if (phoneInput) {
    phoneInput.addEventListener("blur", () => setInputValid(phoneInput, validatePhone()));
    phoneInput.addEventListener("input", () => setInputValid(phoneInput, validatePhone()));
  }
  const callbackUrl = "/api/callback";
  if (submitBtn) {
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateAll())
        return;
      const name = ((nameInput == null ? void 0 : nameInput.value) || "").trim();
      const phone = ((phoneInput == null ? void 0 : phoneInput.value) || "").trim();
      submitBtn.disabled = true;
      try {
        await axios.post(
          callbackUrl,
          { name, phone },
          {
            headers: { "Content-Type": "application/json" }
          }
        );
        closeModal();
        nameInput && (nameInput.value = "");
        phoneInput && (phoneInput.value = "");
        checkbox && (checkbox.checked = false);
        submitBtn.disabled = !(checkbox == null ? void 0 : checkbox.checked);
      } catch (err) {
        submitBtn.disabled = !(checkbox == null ? void 0 : checkbox.checked);
      }
    });
  }
  openBtns.forEach((btn) => btn.addEventListener("click", openModal));
  closeBtn && closeBtn.addEventListener("click", closeModal);
  let mouseDownOnOverlay = false;
  body && body.addEventListener("mousedown", (e) => {
    mouseDownOnOverlay = e.target === body;
  });
  body && body.addEventListener("click", (e) => {
    if (e.target === body && mouseDownOnOverlay)
      closeModal(e);
  });
  content && content.addEventListener("click", (e) => e.stopPropagation());
})();
(function initBronModal() {
  const openBtns = document.querySelectorAll(".js-bron.appart-detail__bron");
  const modal = document.querySelector(".js-modal-bron");
  if (!openBtns.length || !modal)
    return;
  const body = modal.querySelector(".modal__body");
  const content = modal.querySelector(".modal__content");
  const closeBtn = modal.querySelector(".modal__close");
  const checkbox = modal.querySelector("#flexCheckChecked2");
  const submitBtn = modal.querySelector(".modal__link");
  const nameInput = modal.querySelector(".modal__name");
  const phoneInput = modal.querySelector(".modal__tel");
  const objectInput = modal.querySelector(".modal__object");
  const pomeschInput = modal.querySelector(".modal__pomesch");
  const defaultObject = "Малахов";
  const defaultPomesch = "1К-студия №123";
  const bronUrl = "/api/bron";
  function validateName() {
    const value = ((nameInput == null ? void 0 : nameInput.value) || "").trim();
    return value.length >= 2;
  }
  function validatePhone() {
    const value = ((phoneInput == null ? void 0 : phoneInput.value) || "").replace(/\D/g, "");
    return value.length === 11 && value[0] === "7";
  }
  function setInputValid(input, valid) {
    if (!input)
      return;
    input.classList.toggle("is-invalid", !valid);
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
    const object = (btn == null ? void 0 : btn.getAttribute("data-object")) ?? defaultObject;
    const pomesch = (btn == null ? void 0 : btn.getAttribute("data-pomesch")) ?? defaultPomesch;
    if (objectInput)
      objectInput.value = object;
    if (pomeschInput)
      pomeschInput.value = pomesch;
    setInputValid(nameInput, true);
    setInputValid(phoneInput, true);
    body && body.classList.add("active");
    content && content.classList.add("active");
    document.body.classList.add("_lock");
  }
  function closeModal(e) {
    var _a;
    if (e)
      e.preventDefault();
    body && body.classList.remove("active");
    content && content.classList.remove("active");
    const menuOpen = (_a = document.querySelector(".header")) == null ? void 0 : _a.classList.contains("active");
    if (!menuOpen)
      document.body.classList.remove("_lock");
  }
  function resetForm() {
    if (nameInput)
      nameInput.value = "";
    if (phoneInput)
      phoneInput.value = "";
    if (checkbox)
      checkbox.checked = false;
    if (submitBtn)
      submitBtn.disabled = !(checkbox == null ? void 0 : checkbox.checked);
  }
  if (checkbox && submitBtn) {
    checkbox.addEventListener("change", () => {
      submitBtn.disabled = !checkbox.checked;
    });
    submitBtn.disabled = !checkbox.checked;
  }
  if (nameInput) {
    nameInput.addEventListener("blur", () => setInputValid(nameInput, validateName()));
    nameInput.addEventListener("input", () => setInputValid(nameInput, validateName()));
  }
  if (phoneInput) {
    phoneInput.addEventListener("blur", () => setInputValid(phoneInput, validatePhone()));
    phoneInput.addEventListener("input", () => setInputValid(phoneInput, validatePhone()));
  }
  if (submitBtn) {
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateAll())
        return;
      const name = ((nameInput == null ? void 0 : nameInput.value) || "").trim();
      const phone = ((phoneInput == null ? void 0 : phoneInput.value) || "").trim();
      const object = ((objectInput == null ? void 0 : objectInput.value) || "").trim();
      const pomesch = ((pomeschInput == null ? void 0 : pomeschInput.value) || "").trim();
      submitBtn.disabled = true;
      try {
        await axios.post(
          bronUrl,
          { name, phone, object, pomesch },
          { headers: { "Content-Type": "application/json" } }
        );
        closeModal();
        resetForm();
      } catch (err) {
        submitBtn.disabled = (checkbox == null ? void 0 : checkbox.checked) ?? false;
      }
    });
  }
  openBtns.forEach((btn) => btn.addEventListener("click", openModal));
  closeBtn && closeBtn.addEventListener("click", closeModal);
  let mouseDownOnOverlay = false;
  body && body.addEventListener("mousedown", (e) => {
    mouseDownOnOverlay = e.target === body;
  });
  body && body.addEventListener("click", (e) => {
    if (e.target === body && mouseDownOnOverlay)
      closeModal(e);
  });
  content && content.addEventListener("click", (e) => e.stopPropagation());
})();
document.addEventListener("DOMContentLoaded", () => {
  let phones = document.querySelectorAll('[data-mask="phone"]');
  phones.forEach(function(element) {
    new IMask(element, {
      mask: "+{7}(000)000-00-00"
    });
  });
});
