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
    const selectAllButton = document.querySelector('.for-your-task__button-check');
    const undoAllButton = document.querySelector('.for-your-task__button-undo');
    const checkboxList = document.querySelectorAll('._js-for-your-task-item');
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
  };
  const getSorting = () => {
    const sortingButtons = document.querySelectorAll('.sorting__button');
    const sortingList = document.querySelector('.apartments__list');
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
  };
  getPopup();
  getSelects();
  getForYourTaskSelectAll();
  getSorting();
})();
