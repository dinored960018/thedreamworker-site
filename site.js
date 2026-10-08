// 5개 페이지 공통 — 모바일 내비 토글, 스크롤 등장
(function () {
  var tg = document.getElementById('navToggle');
  var dp = document.getElementById('drop');
  if (tg && dp) {
    tg.addEventListener('click', function () {
      var open = dp.dataset.open === '1';
      dp.dataset.open = open ? '0' : '1';
      tg.setAttribute('aria-expanded', String(!open));
      tg.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
    });
    dp.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) {
        dp.dataset.open = '0';
        tg.setAttribute('aria-expanded', 'false');
        tg.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }

  var items = document.querySelectorAll('.rv');
  var show = function (el) {
    el.classList.add('on');
  };

  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(items, show);
    return;
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function (n) {
        return n.classList.contains('rv');
      });
      e.target.style.transitionDelay = Math.min(sibs.indexOf(e.target), 5) * 45 + 'ms';
      show(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  Array.prototype.forEach.call(items, function (el) { io.observe(el); });

  // 빠르게 스크롤하면 옵저버가 프레임을 건너뛰어 opacity:0 인 채로 남는 요소가 생긴다.
  // 화면에 걸친 것을 주기적으로 훑어 강제로 켠다
  var t;
  var sweep = function () {
    clearTimeout(t);
    t = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll('.rv:not(.on)'), function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) { show(el); io.unobserve(el); }
      });
    }, 140);
  };
  addEventListener('scroll', sweep, { passive: true });
  addEventListener('resize', sweep, { passive: true });
  addEventListener('load', sweep);
})();
