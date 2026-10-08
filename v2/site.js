// 더드림워커㈜ v2 — 모바일 메뉴, 탭, 분야 고르기, 기업 찾기, 이메일 복사
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // 모바일 메뉴
  const btn = $('.menu-btn'), panel = $('#mnav');
  if (btn && panel) {
    const label = $('.menu-btn__t', btn);
    const set = (open, focusBtn) => {
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      label.textContent = open ? '닫기' : '메뉴';
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) $('a', panel)?.focus();
      else if (focusBtn) btn.focus();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (panel.hidden) return;
      if (e.key === 'Escape') { set(false, true); return; }
      if (e.key === 'Tab') {
        const f = [btn, ...$$('a', panel)], i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    $$('a', panel).forEach((a) => a.addEventListener('click', () => set(false)));
    matchMedia('(min-width: 1121px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }

  // 탭 (WAI-ARIA 탭 패턴, 자동 활성화)
  const select = (tab, focus) => {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        select(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
  });
  // #y2019 같은 주소 → 해당 연도 탭 열기
  const openHash = () => {
    const id = location.hash.slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    const p = el.closest('[role="tabpanel"]');
    if (p && p.hidden) { select(document.getElementById(p.getAttribute('aria-labelledby'))); requestAnimationFrame(() => el.scrollIntoView()); }
  };
  openHash();
  addEventListener('hashchange', openHash);

  // 분야 고르기
  const fl = $('[data-filter-list]');
  if (fl) {
    const bs = $$('[data-filter]'), st = $('[data-filter-status]');
    bs.forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.filter;
      bs.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let n = 0;
      $$('li', fl).forEach((li) => { const on = k === 'all' || li.dataset.cat === k; li.hidden = !on; n += on; });
      st.textContent = `${b.firstChild.textContent.trim()} ${n}개 표시`;
    }));
  }

  // 기업 찾기
  $$('[data-search]').forEach((inp) => {
    const list = $(inp.dataset.search), cnt = $('[data-search-count]'), empty = $('[data-search-empty]');
    const items = $$('li', list);
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase().replace(/\s+/g, '');
      let n = 0;
      items.forEach((li) => { const on = !q || li.textContent.toLowerCase().replace(/\s+/g, '').includes(q); li.hidden = !on; n += on; });
      cnt.textContent = `${n}개사`;
      empty.hidden = n > 0;
    });
  });

  // 이메일 복사
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const msg = b.parentElement.querySelector('.copy-msg');
    try { await navigator.clipboard.writeText(b.dataset.copy); msg.textContent = '복사했습니다'; }
    catch { msg.textContent = `복사할 수 없는 환경입니다: ${b.dataset.copy}`; }
  }));
})();
