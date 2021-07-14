(function () {
  'use strict';
  let unlock = true;
  function dynamicAdaptiv() {
    // Dynamic Adapt v.1
    // HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
    // e.x. data-da=".item,992,2"
    // Andrikanych Yevhen 2020
    // https://www.youtube.com/c/freelancerlifestyle

    function DynamicAdapt(type) {
      this.type = type;
    }

    DynamicAdapt.prototype.init = function () {
      const _this = this;
      // массив объектов
      this.оbjects = [];
      this.daClassname = '_dynamic_adapt_';
      // массив DOM-элементов
      this.nodes = document.querySelectorAll('[data-da]');

      // наполнение оbjects объктами
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(',');
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
        оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
      }

      this.arraySort(this.оbjects);

      // массив уникальных медиа-запросов
      this.mediaQueries = Array.prototype.map.call(
        this.оbjects,
        function (item) {
          return (
            '(' +
            this.type +
            '-width: ' +
            item.breakpoint +
            'px),' +
            item.breakpoint
          );
        },
        this
      );
      this.mediaQueries = Array.prototype.filter.call(
        this.mediaQueries,
        function (item, index, self) {
          return Array.prototype.indexOf.call(self, item) === index;
        }
      );

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];

        // массив объектов с подходящим брейкпоинтом
        const оbjectsFilter = Array.prototype.filter.call(
          this.оbjects,
          function (item) {
            return item.breakpoint === mediaBreakpoint;
          }
        );
        matchMedia.addListener(function () {
          _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
      }
    };

    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
      if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
          const оbject = оbjects[i];
          оbject.index = this.indexInParent(оbject.parent, оbject.element);
          this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
      } else {
        for (let i = 0; i < оbjects.length; i++) {
          const оbject = оbjects[i];
          if (оbject.element.classList.contains(this.daClassname)) {
            this.moveBack(оbject.parent, оbject.element, оbject.index);
          }
        }
      }
    };

    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
      }
      if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
      }
      destination.children[place].insertAdjacentElement('beforebegin', element);
    };

    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
      } else {
        parent.insertAdjacentElement('beforeend', element);
      }
    };

    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
      const array = Array.prototype.slice.call(parent.children);
      return Array.prototype.indexOf.call(array, element);
    };

    // Функция сортировки массива по breakpoint и place
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
      if (this.type === 'max') {
        Array.prototype.sort.call(arr, function (a, b) {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
              return 0;
            }

            if (a.place === 'first' || b.place === 'last') {
              return -1;
            }

            if (a.place === 'last' || b.place === 'first') {
              return 1;
            }

            return a.place - b.place;
          }

          return a.breakpoint - b.breakpoint;
        });
      } else {
        Array.prototype.sort.call(arr, function (a, b) {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
              return 0;
            }

            if (a.place === 'first' || b.place === 'last') {
              return 1;
            }

            if (a.place === 'last' || b.place === 'first') {
              return -1;
            }

            return b.place - a.place;
          }

          return b.breakpoint - a.breakpoint;
        });
        return;
      }
    };

    const da = new DynamicAdapt('max');
    da.init();
  }
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
  function getResize() {
    const breakpointTablet = window.matchMedia('(min-width: 1280px)');
    const apartmentsList = document.querySelector('.apartments__list');
    const apartmentsButtons = document.querySelectorAll('.sorting__button');
    if (breakpointTablet.matches === false) {
      apartmentsList.classList.add('_gallery');
    };
    window.addEventListener('resize', () => {
      if (breakpointTablet.matches === false) {
        if (apartmentsList) {
          apartmentsList.classList.remove('_classic');
          apartmentsList.classList.remove('_normal');
          apartmentsList.classList.add('_gallery');
          apartmentsButtons.forEach(item => {
            item.classList.remove('_active');
          });
          apartmentsButtons[2].classList.add('_active');
        }
      }
    });
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
  dynamicAdaptiv();
  getResize();
  getPopup();
  getSelects();
  getForYourTaskSelectAll();
  getSorting();
  // getMap();
  getTabs();
  getGallery();
})();
