(function () {
  'use strict';
  let unlock = true;
  function bodyLock(delay) {
    const body = document.querySelector('body');
    if (body.classList.contains('_lock')) {
      bodyLockRemove(delay);
    } else {
      bodyLockAdd(delay);
    }
  }
  function bodyLockRemove(delay) {
    const body = document.querySelector('body');
    if (unlock) {
      const lockPadding = document.querySelectorAll('._lp');
      setTimeout(() => {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('_lock');
      }, delay);

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }
  function bodyLockAdd(delay) {
    const body = document.querySelector('body');
    if (unlock) {
      const lockPadding = document.querySelectorAll('._lp');
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector('.wrapper').offsetWidth +
          'px';
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector('.wrapper').offsetWidth +
        'px';
      body.classList.add('_lock');

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }
  const getPopup = () => {
    const popupLink = document.querySelectorAll('._popup-link');
    const popups = document.querySelectorAll('.popup');
    for (let index = 0; index < popupLink.length; index++) {
      const el = popupLink[index];
      el.addEventListener('click', function (e) {
        if (unlock) {
          const item = el.getAttribute('href').replace('#', '');
          const video = el.getAttribute('data-video');
          popupOpen(item, video);
        }
        e.preventDefault();
      });
    }
    for (let index = 0; index < popups.length; index++) {
      const popup = popups[index];
      popup.addEventListener('click', function (e) {
        if (!e.target.closest('.popup__body')) {
          popupClose(e.target.closest('.popup'));
        }
      });
    }
    function popupOpen(item, video = '') {
      const activePopup = document.querySelectorAll('.popup._active');
      if (activePopup.length > 0) {
        popupClose('', false);
      }
      const curentPopup = document.querySelector('.popup_' + item);
      if (curentPopup && unlock) {
        if (video !== '' && video != null) {
          const popupVideo = document.querySelector('.popup_video');
          popupVideo.querySelector('.popup__video').innerHTML =
            '<iframe src="https://www.youtube.com/embed/' +
            video +
            '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        }
        if (!document.querySelector('.menu__body._active')) {
          bodyLockAdd(500);
        }
        curentPopup.classList.add('_active');
        history.pushState('', '', '#' + item);
      }
    }
    function popupClose(item, bodyUnlock = true) {
      if (unlock) {
        if (!item) {
          for (let index = 0; index < popups.length; index++) {
            const popup = popups[index];
            const video = popup.querySelector('.popup__video');
            if (video) {
              video.innerHTML = '';
            }
            popup.classList.remove('_active');
          }
        } else {
          const video = item.querySelector('.popup__video');
          if (video) {
            video.innerHTML = '';
          }
          item.classList.remove('_active');
        }
        if (!document.querySelector('.menu__body._active') && bodyUnlock) {
          bodyLockRemove(500);
        }
        history.pushState('', '', window.location.href.split('#')[0]);
      }
    }
    const popupCloseIcon = document.querySelectorAll(
      '.popup__close,._popup-close'
    );
    if (popupCloseIcon) {
      for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function () {
          popupClose(el.closest('.popup'));
        });
      }
    }
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Escape') {
        popupClose();
      }
    });
  };
  const getSelects = () => {
    const selectItems = document.querySelectorAll('.js-select');
    if (selectItems.length > 0) {
      selectItems.forEach(item => {
        new Choices(item, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false,
        });
      });
    }
  };
  const getForYourTaskSelectAll = () => {
    const selectAllButton = document.querySelector(
      '.for-your-task__button-check'
    );
    const undoAllButton = document.querySelector('.for-your-task__button-undo');
    const checkboxList = document.querySelectorAll('._js-for-your-task-item');
    if (checkboxList.length > 0) {
      selectAllButton.addEventListener('click', () => {
        checkboxList.forEach(item => {
          if (!item.checked) {
            item.checked = true;
          }
        });
      });
      undoAllButton.addEventListener('click', () => {
        checkboxList.forEach(item => {
          if (item.checked) {
            item.checked = false;
          }
        });
      });
    }
  };
  const getSorting = () => {
    const sortingButtons = document.querySelectorAll('.sorting__button');
    const sortingList = document.querySelector('.apartments__list');
    if (sortingButtons.length > 0) {
      let tabName;
      const selectTabNav = function () {
        sortingButtons.forEach(item => {
          item.classList.remove('_active');
        });
        this.classList.add('_active');
        tabName = this.getAttribute('data-tabs-class');
        selectTabContent(tabName);
      };
      const selectTabContent = function (tab) {
        sortingList.classList.remove('_normal');
        sortingList.classList.remove('_classic');
        sortingList.classList.remove('_gallery');
        sortingList.classList.add(tab);
      };
      if (sortingButtons.length > 0) {
        sortingButtons.forEach(item => {
          item.addEventListener('click', selectTabNav);
        });
      }
    }
  };
  const getMap = () => {
    const complexMap = document.querySelector('#complex-map');
    const selectionMap = document.querySelector('#selection-map');
    if (complexMap) {
      ymaps.ready(function () {
        const map = new ymaps.Map(complexMap, {
          center: [59.850509, 30.304028],
          zoom: 14,
          controls: [],
        });
        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        );
        const myPlacemark = new ymaps.Placemark(
          map.getCenter(),
          {
            hintContent: 'Офис Intergator.Digital',
          },
          {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: './static/images/common/icon-marker.svg',
            // Размеры метки.
            iconImageSize: [31, 40],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [15, 40],
          }
        );
        map.geoObjects.add(myPlacemark);
      });
    }
    if (selectionMap) {
      ymaps.ready(function () {
        const map = new ymaps.Map(selectionMap, {
          center: [59.850509, 30.304028],
          zoom: 14,
          controls: [],
        });
        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        );
        const myPlacemark = new ymaps.Placemark(
          map.getCenter(),
          {
            hintContent: 'Офис Intergator.Digital',
          },
          {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: './static/images/common/icon-marker.svg',
            // Размеры метки.
            iconImageSize: [31, 40],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [15, 40],
          }
        );
        map.geoObjects.add(myPlacemark);
      });
    }
  };
  const getTabs = () => {
    const complexTabsLink = document.querySelectorAll('.tabs__complex-link');
    const complexTabsContent = document.querySelectorAll(
      '.tabs__complex-content'
    );

    const getTab = function (links, content) {
      let tabName;
      const selectTabNav = function () {
        links.forEach(item => {
          item.classList.remove('_active');
        });
        this.classList.add('_active');
        tabName = this.getAttribute('data-tabs-class');
        selectTabContent(tabName);
      };
      const selectTabContent = function (tab) {
        content.forEach(item => {
          const classList = item.classList;
          if (classList.contains(tab)) {
            classList.add('_active');
          } else {
            classList.remove('_active');
          }
        });
      };

      if (links.length > 0) {
        links.forEach(item => {
          item.addEventListener('click', selectTabNav);
        });
      }
    };

    getTab(complexTabsLink, complexTabsContent);
  };
  const getGallery = () => {
    const lgGalleryMethodsDemo = document.getElementById('gallery-complex');
    if (lgGalleryMethodsDemo) {
      let methodsInstance;
      lgGalleryMethodsDemo.addEventListener('lgInit', () => {
        const previousBtn =
          '<button type="button" aria-label="Previous slide" class="lg-prev"></button>';
        const nextBtn =
          '<button type="button" aria-label="Next slide" class="lg-next"></button>';
        const closeBtn =
          '<button type="button" aria-label="Close Gallery" class="lg-close"></button>';
        const lgContainer = document.querySelector('.lg');
        const lgToolbar = document.querySelector('.lg-toolbar');

        lgContainer.insertAdjacentHTML('beforeend', nextBtn);
        lgContainer.insertAdjacentHTML('beforeend', previousBtn);
        lgContainer.insertAdjacentHTML('beforeend', closeBtn);
        document.querySelector('.lg-next').addEventListener('click', () => {
          methodsInstance.goToNextSlide();
        });
        document.querySelector('.lg-prev').addEventListener('click', () => {
          methodsInstance.goToPrevSlide();
        });
        document.querySelector('.lg-close').addEventListener('click', () => {
          methodsInstance.closeGallery();
        });
      });

      methodsInstance = lightGallery(lgGalleryMethodsDemo, {
        addClass: 'gallery',
        download: false,
        plugins: [lgThumbnail],
        thumbnail: true,
        thumbHeight: '60px',
        thumbWidth: 60,
        thumbMargin: 20,
        counter: false,
        height: '900px',
        width: '1600px',
        showCloseIcon: false,
        controls: false,
      });
    }
  };
  getPopup();
  getSelects();
  getForYourTaskSelectAll();
  getSorting();
  // getMap();
  getTabs();
  getGallery();
})();
