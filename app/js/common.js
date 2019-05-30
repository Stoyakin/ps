"use strict";

function qs(query, root = document) {
  return root.querySelector(query);
}

function qsAll(query, root = document) {
  return root.querySelectorAll(query);
}

function getParent(el, findParent) {
  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.classList && el.classList.contains(findParent)) return el;
  }
  return false;
}

window.onload = () => qs('body').classList.add('page-loaded');

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) qs('body').classList.add('ios');

document.addEventListener("DOMContentLoaded", function (event) {

  window.ps = {};

  if (qs('.js-swiper-slider')) {
    window.ps.slider = new Swiper('.js-swiper-slider', {
      loop: false,
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 500,
      mousewheel: false,
      grabCursor: false,
      keyboard: false,
      simulateTouch: false,
      allowSwipeToNext: false,
      allowSwipeToPrev: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      on: {
        slideChangeTransitionEnd: function () {
          qs('.swiper-count-item').innerText = this.activeIndex + 1;
        },
      },
    });
  }

  window.ps.form = {

    init: function () {

      const _th = this,
        inputs = qsAll('.from-search__input'),
        forms = qsAll('form');

      function emptyCheck(event) {
        event.target.value.trim() === '' ?
          event.target.classList.remove('notempty') :
          event.target.classList.add('notempty')
      }

      for (let item of inputs) {
        item.addEventListener('keyup', emptyCheck)
        item.addEventListener('blur', emptyCheck)
      }

      for (let form of forms) {
        form.addEventListener('submit', (e) => {
          return !_th.checkForm(form) && e.preventDefault()
        })
      }

      return this
    },

    checkForm: function (form) {
      let checkResult = true;
      const warningElems = form.querySelectorAll('.error');

      if (warningElems.length) {
        for (let warningElem of warningElems) {
          warningElem.classList.remove('error')
        }
      }

      for (let elem of form.querySelectorAll('input, textarea, select')) {
        if (elem.getAttribute('data-req')) {
          switch (elem.getAttribute('data-type')) {
            case 'tel':
              var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
              if (!re.test(elem.value)) {
                elem.parentNode.classList.add('error')
                checkResult = false
              }
              break;
            case 'email':
              var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
              if (!re.test(elem.value)) {
                elem.parentNode.classList.add('error')
                checkResult = false
              }
              break;
            case 'file':
              if (elem.value.trim() === '') {
                elem.parentNode.classList.add('error')
                checkResult = false
              }
              break;
            default:
              if (elem.value.trim() === '') {
                elem.classList.add('error')
                checkResult = false
              }
              break;
          }
        }
      }

      return checkResult
    }

  }.init();

  window.ps.obj = {

    fadeOut: function fadeOut(selector, duration, cb = null) {
      if (!selector)
        return;
      let element,
        op = 1;
      if (typeof selector === 'string' || selector instanceof String) {
        element = document.querySelector(selector);
      } else {
        element = selector;
      }
      let timer = setInterval(function () {
        if (op <= 0.1) {
          clearInterval(timer);
          element.style.display = 'none';
          if (cb) cb();
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
      }, duration / 50 || 20);
    },

    fadeIn: function fadeIn(selector, duration, type, cb = null) {
      if (!selector)
        return;
      let element,
        op = 0.1,
        typeBlock = type ? type : 'block';
      if (typeof selector === 'string' || selector instanceof String) {
        element = document.querySelector(selector);
      } else {
        element = selector;
      }
      element.style.opacity = 0;
      element.style.display = typeBlock;
      let timer = setInterval(function () {
        if (op >= 1) {
          clearInterval(timer);
          if (cb) cb();
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
      }, duration / 50 || 20);
    },

    init: function init() {

      const _self = this;

      for (let item of qsAll('.js-help-next')) {
        item.addEventListener('click', function (e) {
          const parents = getParent(this, 'tutorial__item'),
            nextElement = parents.nextElementSibling,
            aside = getParent(this, 'main__aside');
          if (nextElement) {
            if (nextElement.classList.contains('tutorial__item--step2')){
              aside.classList.remove('show-step1');
              aside.classList.add('show-step2');
            }
            if (nextElement.classList.contains('tutorial__item--mirror')){
              aside.classList.remove('show-step1', 'show-step2');
              aside.classList.add('dark');
            }
            _self.fadeOut(parents, 300, function () {
              _self.fadeIn(nextElement, 300, 'flex');
            });
          }
          e.preventDefault();
        });
      }

      for (let item of qsAll('.js-help-close')) {
        item.addEventListener('click', function (e) {
          const parents = getParent(this, 'tutorial__item');
          _self.fadeOut(parents, 300);
          qs('.main__aside').classList.remove('active', 'show-step1', 'show-step2', 'dark');
          e.preventDefault();
        });
      }

      return this;
    }

  }.init();

});
