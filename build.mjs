// 더드림워커㈜ 사이트 v1 — 정적 페이지 생성: node build.mjs → *.html 8개
// 내용 원천: data.mjs · data-cases.mjs (v2 와 같은 파일. 20260910 최종 회사소개자료 44쪽 판독본)
// 레이아웃 · 컴포넌트는 포럼 사이트와 같은 v1 틀(styles.css) 그대로
import fs from 'node:fs';
import * as D from './data.mjs';

const V = '20261008v1';
const C = D.company;
// 이미 엔티티로 적힌 값(&amp;)은 그대로 두고 맨 & · < · > 만 바꾼다
const esc = (s = '') => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s = '') => esc(s).replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

const NAV = [
  ['about.html', '회사 소개'],
  ['ceo.html', '대표이사'],
  ['services.html', '사업 영역'],
  ['invest.html', '투자·보육'],
  ['cases.html', '투자 사례'],
  ['forum.html', '포럼 운영'],
  ['records.html', '실적·네트워크'],
];
const FORUM_EXT = 'https://forum.dreamventures.kr/';

// ── 공통 틀 ─────────────────────────────────────────────
const head = (p) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preload" href="fonts/Paperlogy-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/Paperlogy-600.woff2" as="font" type="font/woff2" crossorigin>
<title>${esc(p.title)}</title>
<meta name="description" content="${attr(p.desc)}">
<meta name="theme-color" content="#241c17">
<!-- 임시 프리뷰용. 실제 도메인에 올릴 때 이 줄을 지운다 -->
<meta name="robots" content="noindex,nofollow">
<link rel="icon" href="brand/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="brand/favicon.png">
<!-- 도메인 확정 후 canonical · og:url · og:image 를 채운다 -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="더드림워커㈜">
<meta property="og:title" content="${attr(p.title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:locale" content="ko_KR">
<script>document.documentElement.className+=' js'</script>
<link rel="stylesheet" href="styles.css?v=${V}">${p.ld || ''}
</head>`;

const header = (cur) => {
  const ask = cur === 'index.html' ? '#contact' : 'index.html#contact';
  const links = NAV.map(([h, l]) => `<a href="${h}"${h === cur ? ' aria-current="page"' : ''}>${l}</a>`);
  return `
<header class="nav" id="nav">
  <div class="wrap nav__in">
    <a class="brand" href="index.html" aria-label="더드림워커 홈">
      <img class="brand__mark brand__mark--wide" src="brand/mark.png" alt="" width="200" height="37">
      <span class="brand__ko">더드림워커㈜</span>
    </a>
    <nav class="nav__links" aria-label="주 메뉴">
      ${links.join('\n      ')}
    </nav>
    <div class="nav__cta">
      <a class="nbtn nbtn--line" href="${FORUM_EXT}" rel="noopener">더드림벤처포럼</a>
      <a class="nbtn nbtn--accent" href="${ask}">상담 문의</a>
    </div>
    <button class="nav__toggle" id="navToggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="drop"><i></i></button>
  </div>
  <div class="drop" id="drop">
    ${links.join('\n    ')}
    <a href="${FORUM_EXT}" rel="noopener">더드림벤처포럼 사이트</a>
    <a class="btn btn--accent" href="${ask}">상담 문의</a>
  </div>
</header>`;
};

const footer = () => `
<footer class="ft">
  <div class="wrap">
    <div class="ft__grid">
      <div class="ft__brand">
        <div class="brand">
          <img class="brand__mark brand__mark--wide" src="brand/mark.png" alt="" width="200" height="37">
          <span class="brand__ko">더드림워커㈜</span>
        </div>
        <p class="ft__about">창업기획 · 투자 · 협업 · 사업화 전문기업<br>대표이사 ${C.ceo}</p>
        <ul class="ft__ext">
          <li><a href="${FORUM_EXT}" rel="noopener">더드림벤처포럼</a></li>
          <li><a href="https://company.dreamventures.kr/" rel="noopener">주식회사 더드림벤처스</a></li>
          <li><a href="https://invest.dreamventures.kr/" rel="noopener">VentureLink 투자심사</a></li>
        </ul>
      </div>

      <div class="ft__col">
        <p class="ft__k">SITE</p>
        <ul>
          <li><a href="index.html">홈</a></li>
          ${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('\n          ')}
        </ul>
      </div>

      <div class="ft__col">
        <p class="ft__k">BUSINESS</p>
        <ul>
          <li><a href="services.html#rnd">국가R&amp;D 과제기획</a></li>
          <li><a href="services.html#cert">성능인증 · 우수제품</a></li>
          <li><a href="services.html#ir">투자유치</a></li>
          <li><a href="services.html#global">해외시장 진출</a></li>
          <li><a href="invest.html#fund">개인투자조합</a></li>
          <li><a href="invest.html#angel">엔젤클럽</a></li>
        </ul>
      </div>

      <div class="ft__col">
        <p class="ft__k">CONTACT</p>
        <dl>
          <div><dt>HEAD OFFICE</dt><dd>대전광역시 유성구 테크노3로 65<br>한신에스메카 343~344호</dd></div>
          <div><dt>SEJONG</dt><dd>${C.sejong}</dd></div>
          <div><dt>TEL</dt><dd><a href="${C.telHref}">${C.tel}</a></dd></div>
          <div><dt>EMAIL</dt><dd><a href="mailto:${C.email}">${C.email}</a></dd></div>
        </dl>
      </div>
    </div>

    <div class="ft__btm">
      <span>© 2026 THE DREAM WORKER</span>
      <span>사업자등록번호 ${C.bizNo}</span>
      <nav aria-label="하단 보조">
        <!-- 시안 비교용: 정식 배포 때 아래 한 줄 삭제 -->
        <a href="v2/index.html">다른 버전 보기</a>
        <a href="#top">맨 위로</a>
      </nav>
    </div>
  </div>
</footer>

<script src="site.js?v=${V}"></script>
</body>
</html>
`;

const page = (p) => `${head(p)}
<body id="top">
${p.announce || ''}${header(p.file)}

<main>
${p.body}
</main>
${footer()}`;

const pagehead = (h1, lead, crumbs = []) => `
  <section class="pagehead">
    <div class="mesh" aria-hidden="true"></div>
    <div class="wrap">
      <div class="pagehead__in rv">
        <p class="crumb"><a href="index.html">홈</a>${crumbs.map(([h, l]) => `<i>/</i><a href="${h}">${l}</a>`).join('')}<i>/</i>${h1}</p>
        <h1>${h1}</h1>
        <p class="b-lg">${lead}</p>
      </div>
    </div>
  </section>`;

// 밴드 하나. tone = canvas | soft | ink
const band = (id, tone, eyebrow, title, lead, body) => {
  const ink = tone === 'ink';
  return `
  <!-- ── ${title.replace(/<[^>]+>/g, '')} ── -->
  <section class="band band--${tone}"${id ? ` id="${id}"` : ''}>
    <div class="wrap">
      <div class="head rv">
        ${eyebrow ? `<p class="eyebrow${ink ? ' eyebrow--on-ink' : ''}">${eyebrow}</p>\n        ` : ''}<h2 class="d-lg">${title}</h2>${lead ? `\n        <p class="b-lg"${ink ? ' style="color:var(--on-ink-2)"' : ''}>${lead}</p>` : ''}
      </div>
${body}
    </div>
  </section>`;
};

// ── 조각 ─────────────────────────────────────────────────
const rows = (list, k = '') => `<div class="org rv">${k ? `<p class="org__k">${k}</p>` : ''}${list.map(([a, b]) => `<div class="org__row"><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
const lst = (items, cls = '') => `<ul class="lst${cls ? ' ' + cls : ''}">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const chips = (items, badge = false) => `<div class="chips rv">${items.map((x) => `<span class="${badge ? 'badge badge--on-ink' : 'chip'}">${x}</span>`).join('')}</div>`;
const sub = (t, small = '', ink = false) => `<h3 class="sub${ink ? ' sub--ink' : ''}">${t}${small ? ` <small>${small}</small>` : ''}</h3>`;
const lnk = (h, t) => `<p class="more"><a class="lnk" href="${h}">${t} →</a></p>`;
const note = (t) => `<p class="coms__note">${t}</p>`;
const det = (summary, body, open = false) => `<details class="det rv"${open ? ' open' : ''}><summary>${summary}</summary><div class="det__b">${body}</div></details>`;
const table = (label, headRow, bodyRows, monoCols = []) => `<div class="tbl-wrap rv" tabindex="0" role="region" aria-label="${attr(label)}"><table class="tbl"><thead><tr>${headRow.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${bodyRows.map((r) => `<tr>${r.map((c, i) => `<td${monoCols.includes(i) ? ' class="n"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const panel = (h, hr, body) => `<div class="panel rv"><div class="panel__h"><span>${h}</span><span>${hr}</span></div><div class="panel__b">${body}</div></div>`;
const drows = (list) => `<dl>${list.map(([a, b]) => `<div class="drow"><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`;
const tiles = (list) => `<div class="about">${list.map((t) => `<div class="tile rv"><p class="tile__k">${t.k}</p><h3>${t.h}</h3>${t.p ? `<p>${t.p}</p>` : ''}</div>`).join('')}</div>`;
const tlYears = (years) => `<div class="tl rv">${years.map((y) => `<div class="tl__y" id="y${y.y}"><b>${y.y}</b><ul>${y.rows.map((r) => `<li><i>${r[0] || '—'}</i><span>${esc(r[1])}${r[2] ? ` · ${esc(r[2])}` : ''}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
const tlFlat = (list) => `<div class="tl tl--flat rv">${list.map((r) => `<div class="tl__y"><b>${r[0] || '—'}</b><ul><li class="tl__one"><span><em>${esc(r[1])}</em>${r[2] ? ` · ${esc(r[2])}` : ''}</span></li></ul></div>`).join('')}</div>`;

// ── 홈 ───────────────────────────────────────────────────
const pages = [];
const nHist = D.history.reduce((n, y) => n + y.rows.length, 0);

pages.push({
  file: 'index.html',
  title: '더드림워커㈜ | 창업기획 · 투자 · 협업 · 사업화',
  desc: '더드림워커㈜는 창업기획 · 투자 · 협업 · 사업화 전문기업입니다. 국가R&D 과제기획, 성능인증, 투자유치, 해외시장 진출 컨설팅과 개인투자조합 구성, 더드림벤처포럼 운영을 맡습니다.',
  ld: `
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Organization",
  "name":"더드림워커 주식회사",
  "alternateName":"THE DREAM WORKER",
  "foundingDate":"2015-03-02",
  "description":"창업기획 · 투자 · 협업 · 사업화 전문기업",
  "address":{"@type":"PostalAddress","streetAddress":"테크노3로 65 한신에스메카 343~344호","addressLocality":"유성구","addressRegion":"대전광역시","addressCountry":"KR"},
  "email":"${C.email}",
  "telephone":"+82-70-7808-2650"
}
</script>`,
  announce: `
<div class="announce">
  <div class="wrap announce__in">
    <a href="forum.html"><b>2022.08~</b> 더드림벤처포럼 구성 · 운영 <span></span></a>
  </div>
</div>
`,
  body: `
  <!-- ── 히어로 ── -->
  <section class="hero">
    <div class="mesh" aria-hidden="true"></div>
    <div class="wrap">
      <div class="hero__in rv">
        <span class="badge">설립 2015 · 투자회사 ${C.portfolio}</span>
        <h1 class="d-xl">창업기획 · 투자 · 협업 · 사업화<br>전문기업</h1>
        <p class="b-lg hero__lead">국가R&amp;D사업 컨설팅, 기술인증 · 특허창출, 투자유치 컨설팅 · IR제작, 해외마케팅 컨설팅, 개인투자조합 구성 운영</p>
        <div class="hero__cta">
          <a class="btn btn--accent" href="#contact">상담 신청</a>
          <a class="btn btn--secondary" href="services.html">사업 영역 보기</a>
        </div>
        <p class="hero__note">문의 ${C.tel}</p>
      </div>
    </div>
  </section>

  <!-- ── 지표 스트립 ── -->
  <section class="strip">
    <div class="wrap">
      <div class="strip__in rv">
        <div><b class="num">2015</b><span>FOUNDED</span></div>
        <div><b class="num">${C.portfolio}</b><span>PORTFOLIO · ${C.portfolioNote}</span></div>
        <div><b class="num">${D.scope.length}개</b><span>SERVICE AREAS</span></div>
        <div><b class="num">${D.patents.length}건</b><span>REGISTERED PATENTS</span></div>
      </div>
    </div>
  </section>
${band('', 'soft', 'STRUCTURE', '사업 구조', D.motto, `      ${tiles(D.pillars.map((p, i) => ({ k: pad(i + 1), h: p.name, p: esc(p.items.join(', ')) })))}
      ${rows([
        ['설립', `${C.founded} 개인사업자 · ${C.incorporated} 법인전환`],
        ['대표이사', `${C.ceo} · 중소벤처기업부 주무관 10년(2005~2015)`],
        ['본사', `${C.hq} (${C.hqNote})`],
        ['세종지점', C.sejong],
        ['서울', C.seoul],
        ['투자회사', `${C.portfolio} (${C.portfolioNote})`],
        ['기업신용등급', C.credit],
      ], 'COMPANY')}
      ${lnk('about.html', '기업 현황 · 연혁 · 조직 보기')}`)}
${band('', 'canvas', 'SERVICES', '사업 범위', `${D.scope.length}개 영역`, `      <div class="scope rv">${D.scope.map(([n, t]) => `<div><b>${n}</b><p>${esc(t)}</p></div>`).join('')}</div>
      ${lnk('services.html', '영역별 수행 범위 보기')}`)}
${band('', 'ink', 'PROCESS', '사업화전략 컨설팅', D.strategyLead, `      <div class="flow">${D.strategy.map((s) => `<div class="step rv"><p class="step__no">${s.step.toUpperCase().replace('STEP', 'STEP ')}</p><h3>${s.name}</h3><p>${s.items.join(', ')}</p></div>`).join('')}</div>
      <div style="margin-top:var(--s-3xl)">${chips(D.consultSets[1].areas.map((a) => esc(a.n)), true)}</div>`)}
${band('', 'canvas', 'TRACK RECORD', '주요 실적', '2015년 이후 국가R&amp;D · 인증 · 전략 수립 · 투자 · 창업기획 실적', `      <div class="out">
        <div>
          ${panel('주요사업 실적 분야', `${D.records.length}개 분야`, `<div class="chips">${D.records.map(([k]) => `<span class="chip">${esc(k)}</span>`).join('')}</div>`)}
          ${panel('최근 연혁', '2026', drows(D.history.slice(-1)[0].rows.map(([d, t]) => [esc(t), `2026.${d.replace(/\.$/, '')}`])))}
        </div>
        <div>
          ${panel('수행기관 지정 · 선정', `${D.designations.length}건`, drows(D.designations.map(([d, t]) => [esc(t), d])))}
          <div class="callout rv"><b>중기부 10년</b><p>대표이사 중소벤처기업부 주무관(2005~2015) · 중소기업 R&amp;D, 성능인증, 창업, 자금, 수출, 판로, 인력지원 담당</p></div>
        </div>
      </div>
      ${lnk('records.html', '실적 전체와 협력 네트워크 보기')}`)}
${band('', 'soft', 'FAMILY', '가족기업', `${D.families.length}개사`, `      <div class="fams rv">${D.families.map(([n, s]) => `<div class="fam"><b>${esc(n)}</b><span>${esc(s)}</span></div>`).join('')}</div>
      ${note(esc(D.familiesBanner.replace(/\s*>+$/, '')))}
      ${lnk('cases.html', `투자 사례 ${D.cases.length}개사 보기`)}`)}

  <!-- ── 문의 (먹색 밴드) ── -->
  <section class="band band--ink" id="contact">
    <div class="wrap">
      <div class="head rv" style="max-width:34em">
        <h2 class="d-lg">문의</h2>
        <p class="b-lg" style="color:var(--on-ink-2)">국가R&amp;D 과제, 인증, 투자유치, 해외시장 진출, 개인투자조합</p>
      </div>
      <div class="hero__cta rv" style="justify-content:flex-start;margin-top:0">
        <a class="btn btn--accent" href="mailto:${C.email}?subject=%EC%83%81%EB%8B%B4%20%EB%AC%B8%EC%9D%98">이메일 보내기</a>
        <a class="btn btn--ghost-ink" href="${C.telHref}">${C.tel}</a>
      </div>
    </div>
  </section>
`,
});

// ── 회사 소개 ────────────────────────────────────────────
pages.push({
  file: 'about.html',
  title: '회사 소개 | 더드림워커㈜',
  desc: '더드림워커㈜ 기업 현황, 미션 및 전략, 2015년부터 2026년까지의 연혁, 조직도, 지식재산권',
  body: `${pagehead('회사 소개', `${C.founded} 개인사업자 설립 · ${C.incorporated} 법인전환 · 본사 대전, 지점 세종 · 서울`)}
${band('company', 'canvas', 'COMPANY', '기업 현황', D.motto, `      ${rows([
        ['회사명', C.legal], ['대표자', C.ceo], ['설립일자', `${C.founded} (${C.incorporated} 법인전환)`], ['임직원', C.staff],
        ['법인등록번호', `<span class="mono">${C.corpNo}</span>`], ['사업자등록번호', `<span class="mono">${C.bizNo}</span>`],
        ['본사', `${C.hq} (${C.hqNote})`], ['세종지점', C.sejong], ['서울', C.seoul],
        ['연락처', `<a href="${C.telHref}">${C.tel}</a>`], ['이메일', `<a href="mailto:${C.email}">${C.email}</a>`],
        ['투자회사 수', `${C.portfolio} (${C.portfolioNote})`], ['기업신용등급', C.credit],
      ], '2026.09 회사소개자료 기준')}
      ${sub('제공 서비스')}
      ${chips(D.offerings.map(esc))}`)}
${band('mission', 'soft', 'MISSION', '미션 및 전략', '기술사업화 컨설팅 · 창업기획 지주회사 · 기술사업화 플랫폼 · 더드림벤처포럼', `      ${tiles(D.pillars.map((p, i) => ({ k: pad(i + 1), h: p.name, p: esc(p.items.join(', ')) })))}`)}
${band('history', 'canvas', 'HISTORY', '연혁', `2015~2026 · ${nHist}건 · 월만 적힌 항목은 원자료에 일자가 없는 경우`, `      ${tlYears(D.history)}
      ${note('법인전환일은 기업 현황표에 2016.09.21, 연혁에 09.12로 적혀 있어 원문대로 둔다')}`)}
${band('org', 'soft', 'ORGANIZATION', '조직도', `임직원 ${C.staff} · 고문 ${D.advisorTotal}명`, `      ${rows([['대표이사', C.ceo], ...D.org.units.map((u) => [u.name, u.person]), ['고문', D.org.advisors.map(([k, n]) => `${k} ${n}명`).join(', ')]])}
      ${note('직원 · 고문 이름은 싣지 않음')}`)}
${band('ceo', 'ink', 'CEO', '대표이사', `${C.ceo} · 중소벤처기업부 주무관(2005~2015) · 2015년 더드림워커㈜ 설립 · 2022년 더드림벤처포럼 구성`, `      <div class="flow">
        ${D.ceo.current.slice(0, 4).map((r) => `<div class="step rv"><p class="step__no">${r[0]}</p><h3>${esc(r[1])}</h3>${r[2] ? `<p>${esc(r[2])}</p>` : ''}</div>`).join('\n        ')}
      </div>
      <p class="more"><a class="btn btn--on-ink btn--sm" href="ceo.html">이력 전체 보기</a></p>`)}
${band('ip', 'canvas', 'IP', '지식재산권 현황', `등록특허 ${D.patents.length}건`, `      ${table('지식재산권 표', ['권리', '등록번호', '등록일자', '명칭', '권리자'], D.patents.map((r) => ['특허', r[0], r[1], r[2], r[3]]), [1, 2])}
      ${sub('특허증')}
      <ul class="figs figs--doc rv">${D.patents.map((r, i) => `<li><figure><img src="img/patent/patent-${i + 1}.jpg" width="343" height="492" loading="lazy" alt="특허증 ${r[0]} ${attr(r[2])}"><figcaption><span class="mono">${r[0]}</span>${r[2]}</figcaption></figure></li>`).join('')}</ul>`)}
`,
});

// ── 대표이사 ─────────────────────────────────────────────
const cc = D.ceo.certificate;
pages.push({
  file: 'ceo.html',
  title: '대표이사 진병기 | 더드림워커㈜',
  desc: '더드림워커㈜ 진병기 대표이사 — 중소벤처기업부 주무관 10년, 더드림벤처포럼 구성 운영, 기술거래사 · 기업기술가치평가사 · 벤처캐피탈리스트 등 자격',
  body: `${pagehead('대표이사', '진병기 · 중소벤처기업부 주무관 10년 · 2015년 더드림워커㈜ 설립', [['about.html', '회사 소개']])}
${band('profile', 'canvas', 'PROFILE', '프로필', '', `      <div class="prof rv">
        <figure class="prof__ph"><img src="img/ceo.jpg" width="307" height="343" alt="진병기 대표이사 증명사진"><figcaption>진병기 · 대표이사</figcaption></figure>
        ${rows([['현직', '더드림워커㈜ 대표 (2015.03 ~)'], ['포럼', '더드림벤처포럼 구성 · 운영 (2022.08 ~)'], ['공직', '중소벤처기업부 주무관 (2005.02 ~ 2015.02, 7~6급)'], ['수상', D.ceo.awards.map(([y, a]) => `${a} (${y})`).join(', ')]])}
      </div>`)}
${band('career', 'soft', 'CAREER', '이력', '현직 · 대외활동, 엔젤클럽 · 투자자 과정, 공직 경력', `      ${sub('현직 · 대외활동', `${D.ceo.current.length}건`)}
      ${tlFlat(D.ceo.current)}
      ${sub('엔젤클럽 · 투자자 과정', `${D.ceo.angel.length}건`)}
      ${tlFlat(D.ceo.angel)}
      ${sub('공직 경력', `${D.ceo.public.length}건`)}
      ${tlFlat(D.ceo.public)}
      ${sub('중기벤처부 이력', '2005~2015')}
      ${chips(D.ceo.mss)}
      ${sub('경력증명서 기재 사항', `${cc.no} · ${cc.issued} · ${cc.issuer}`)}
      ${table('경력증명서 경력사항 표', ['근무기간', '직급', '부서 및 직위'], cc.rows, [0])}
      ${rows([['근무년한', cc.years], ['퇴직사유', cc.retire], ['용도', cc.use]])}
      ${note('경력증명서 원본 이미지는 생년월일과 주소가 적혀 있어 싣지 않음')}`)}
${band('committee', 'canvas', 'COMMITTEE', '평가 · 심의 위원', `${D.ceo.committees.length}건`, `      ${chips(D.ceo.committees)}
      ${sub('수상', `${D.ceo.awards.length}건`)}
      ${tlFlat(D.ceo.awards.map(([y, a]) => [y, a]))}`)}
${band('edu', 'soft', 'EDUCATION', '학력 · 교육', '', `      ${rows(D.ceo.degrees.map((d, i) => [i < 2 ? '학력' : '수료', d]))}
      ${sub('교육 과정', `${D.ceo.courses.length}개`)}
      ${chips(D.ceo.courses)}`)}
${band('certs', 'ink', 'CERTIFICATIONS', '자격', `${D.ceo.certs.length}개`, `      ${chips(D.ceo.certs, true)}`)}
${band('portfolio', 'canvas', 'PORTFOLIO', '투자 이력', `기업 투자 ${D.ceo.invested.length}곳 · 투자조합 참여`, `      ${sub('기업 투자')}
      ${chips(D.ceo.invested.map(esc))}
      ${sub('투자조합 참여')}
      ${rows(D.ceo.funds.map((f, i) => [pad(i + 1), f]))}
      ${note('표기는 원자료 그대로 — ㈜유이온인베스트먼트는 연혁 · 실적에 유니온인베스트먼트로 적혀 있음')}`)}
${band('skills', 'soft', 'EXPERTISE', '역량', '', `      ${rows(D.ceo.skills.map((s, i) => [pad(i + 1), esc(s)]))}`)}
`,
});

// ── 사업 영역 ────────────────────────────────────────────
const com = (n, h, items, p = '') => `<article class="com rv"><div class="com__top"><span class="com__no">${n}</span></div><h3>${h}</h3>${p ? `<p>${p}</p>` : ''}<div class="com__kpi">${items.map((x) => `<span class="kpi">${esc(x)}</span>`).join('')}</div></article>`;
const ov = D.overseas;
pages.push({
  file: 'services.html',
  title: '사업 영역 | 더드림워커㈜',
  desc: '더드림워커㈜ 사업 범위 16개, 종합컨설팅 8개 영역, 국가R&D 과제기획, 성능인증 · 우수제품인증, 사업화전략, 투자유치, 해외시장 진출',
  body: `${pagehead('사업 영역', `사업 범위 ${D.scope.length}개 · 정부지원사업과 투자를 연계한 컨설팅`)}
${band('scope', 'canvas', 'SCOPE', '사업 범위', '', `      <div class="scope rv">${D.scope.map(([n, t]) => `<div><b>${n}</b><p>${esc(t)}</p></div>`).join('')}</div>`)}
${band('consulting', 'soft', 'CONSULTING', '종합컨설팅', '같은 8개 영역 구성 · 컨설팅 종류마다 항목이 조금씩 다름', D.consultSets.map((t, i) => det(`${t.label} <span class="mono">${t.page}</span>`, `<p class="b-md">${esc(t.lead)}</p>${t.ex ? `<p class="b-sm" style="margin-top:var(--s-xs)">${esc(t.ex)}</p>` : ''}${t.start ? `<p class="tag-start">${esc(t.start)}</p>` : ''}<div class="coms" style="margin-top:var(--s-lg)">${t.areas.map((a, j) => com(pad(j + 1), esc(a.n), a.items)).join('')}</div>`, i === 0)).join('\n      '))}
${band('rnd', 'canvas', 'R&amp;D', '국가 R&amp;D지원사업 과제기획', esc(D.rnd.lead), `      <div class="out">
        <div>${panel('1. 기업, 산업, 시장, 기술 현황 분석', 'STEP', drows(D.rnd.analysis.map(([k, v]) => [esc(k), v ? esc(v) : '—'])).replace(/<dd>/g, '<dd class="dd--txt">'))}</div>
        <div>${panel('2. 기술개발 사업계획서 작성', '중기벤처부 기술개발사업', `<ol class="lst lst--num">${D.rnd.plan.map(([k, v]) => `<li><b>${esc(k)}</b>${v ? `<span>${esc(v)}</span>` : ''}</li>`).join('')}</ol>`)}</div>
      </div>
      ${sub('R&amp;D 사업별 예산', '단위 억 원 · 중기벤처부')}
      <div class="out out--3">${D.rnd.budget.map((b) => `<div>${panel(b.g, `${b.rows.length}개`, drows(b.rows.map(([k, v]) => [esc(k), v])))}</div>`).join('')}</div>
      ${sub('나에게 맞는 지원 사업 찾기', '수행기업 → 기업주도 여부로 단독형 · 협력형 구분')}
      <div class="out">${D.rnd.finder.map((f) => `<div>${panel(f.type, f.basis, drows(f.progs.map(([n, k, s]) => [esc(n), s.length ? `${k} · ${s.join(' · ')}` : '—'])).replace(/<dd>/g, '<dd class="dd--txt">'))}</div>`).join('')}</div>`)}
${band('cert', 'ink', 'CERTIFICATION', '성능인증 우수제품인증', esc(D.cert.lead), `      <div class="flow">${D.cert.steps.map((s, i) => `<div class="step rv"><p class="step__no">STEP ${i + 1}</p><h3>${s}</h3></div>`).join('')}</div>
      <div class="joins" style="margin-top:var(--s-3xl)">
        <div class="join join--featured rv"><p class="join__k">EPC</p><h3>성능인증(EPC)</h3><p>종합컨설팅 8개 영역 연계</p></div>
        <div class="join rv"><p class="join__k">STEP 2</p><h3>우수제품인증</h3><p>성능인증(EPC) → 우수제품인증</p></div>
        <div class="join rv"><p class="join__k">CONSULTING</p><h3>8개 영역</h3><p>${D.consultSets[3].areas.map((a) => esc(a.n)).join(', ')}</p></div>
      </div>`)}
${band('strategy', 'canvas', 'STRATEGY', '사업화전략 컨설팅', esc(D.strategyLead), `      ${rows(D.strategy.map((s) => [`${s.step} · ${s.name}`, s.items.join(', ')]))}`)}
${band('ir', 'soft', 'INVESTMENT RELATIONS', '투자유치 컨설팅', esc(D.irLead), `      <div class="joins">${D.ir.map((p, i) => `<div class="join${i === 1 ? ' join--featured' : ''} rv"><p class="join__k">${pad(i + 1)}</p><h3>${p.phase}</h3>${p.blocks.map(([h, items]) => `<p class="join__sub">${esc(h)}</p>${items.length ? `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`).join('')}</div>`).join('')}</div>`)}
${band('global', 'canvas', 'GLOBAL', '해외시장진출 및 투자유치 컨설팅', esc(ov.lead), `      ${lst(ov.points.map(esc), 'rv')}
      ${sub('국가별 협력')}
      <div class="net rv">${ov.countries.map(([c, t], i) => `<div class="net__r"><span class="net__n">${pad(i + 1)}</span><h3>${c}</h3><p>${esc(t)}</p></div>`).join('')}</div>
      ${note('2025. 5. 자료 기준: 말레이시아 JPSC Management Service · SENITH(2019.07 업무협약), 필리핀 PLO국제학교')}
      ${sub('주요 활동')}
      ${tlFlat(ov.events)}
      ${sub('행사 자료')}
      ${det(`베트남 탐방 · 빈증성 방문계획(안) <span class="mono">2023.12</span>`, `<p class="b-md"><b>${esc(ov.vietnam.title)}</b></p><p class="b-sm" style="margin-top:var(--s-xs)">${esc(ov.vietnam.summary)}</p><div style="margin-top:var(--s-md)">${table('베트남 방문 일정 표', ['일자', '예정스케줄'], ov.vietnam.schedule.map(([d, xs]) => [d, xs.map(esc).join('<br>')]), [0])}</div>`)}
      ${det(`${esc(ov.harbin1.title)} <span class="mono">2025.05</span>`, `${rows(ov.harbin1.rows.map(([k, v]) => [k, esc(v)]))}
${sub('행사 참가신청')}${rows([['신청기간', ov.harbin1.apply.period]])}
<div style="margin-top:var(--s-md)">${table('행사 참가비 표', ov.harbin1.apply.fee[0], ov.harbin1.apply.fee.slice(1))}</div>${note(ov.harbin1.apply.feeNote)}
${[['행사 참가자격', 'qual'], ['기업지원 사항', 'support'], ['참가업체 준비 사항', 'prep'], ['참고사항', 'notes'], ['참가신청/문의', 'contact']].map(([h, k]) => `${sub(h)}${lst(ov.harbin1.apply[k].map(esc))}`).join('')}`)}
      ${det(`${esc(ov.harbin2.title)} <span class="mono">2025.09</span>`, `<p class="b-sm">${ov.harbin2.no}</p><p class="b-md" style="margin-top:var(--s-xs)">${esc(ov.harbin2.intro)}</p>${sub('1. 행사 개요')}${rows(ov.harbin2.rows.map(([k, v]) => [k, esc(v)]))}`)}
      ${note('현장 사진(캄보디아 대경코퍼레이션 업무협약, 세계한인무역협회 협력, 베트남대사관 행사, 빈증성 탐방, 하얼빈 레드스퀘어)은 참석자 얼굴이 나와 싣지 않음')}`)}
`,
});

// ── 투자 · 보육 ──────────────────────────────────────────
const F = D.fund;
pages.push({
  file: 'invest.html',
  title: '투자·보육 | 더드림워커㈜',
  desc: '더드림워커㈜ 직접투자 · 공동창업, 창업기획자 구성 운영, 엔젤클럽 4개, 개인투자조합, 투자 사례 13개사, 가족기업 24개사',
  body: `${pagehead('투자·보육', '직접투자 · 공동창업, 창업기획자 · 엔젤클럽 · 개인투자조합 구성 운영')}
${band('direct', 'canvas', 'DIRECT INVESTMENT', '직접투자 &amp; 기술사업화', esc(D.consultSets[0].lead), `      ${sub('사례 기업')}
      ${chips(['㈜블루커뮤니케이션', '㈜코코즈', '㈜리벤처스', '㈜정우티앤씨', '㈜에코에이앤이', '㈜더오션', '㈜피케이', '(주)비즈니스전략연구소', '㈜시정'])}
      ${lnk('services.html#consulting', '연계 컨설팅 8개 영역 보기')}`)}
${band('ac', 'soft', 'ACCELERATOR', '엑셀러레이터(창업기획자) 구성 운영', esc(D.accelLead), `      ${rows(D.accelerators.map((n, i) => [pad(i + 1), esc(n)]))}
      ${det(`${D.accelManual.title} <span class="mono">${D.accelManual.label} · ${D.accelManual.date} · ${D.accelManual.by}</span>`, `${rows([['등록 및 관리근거', esc(D.accelManual.basis)], ['창업기획자란?', esc(D.accelManual.what)]])}${sub('주요업무')}${lst(D.accelManual.duties.map(([d, s]) => `${esc(d)}${s.length ? lst(s.map(esc), 'lst--dash') : ''}`))}`)}`)}
${band('angel', 'ink', 'ANGEL CLUB', '더드림엔젤클럽 구성 운영', esc(D.angelLead), `      <div class="flow">${D.angels.map((a) => `<div class="step rv"><p class="step__no">${a[0]}~</p><h3>${esc(a[1])}</h3><p class="step__sla">회원 ${a[2]} · ${esc(a[3])}</p></div>`).join('')}</div>
      <p class="step__sla" style="margin-top:var(--s-lg)">회원수는 쪽마다 다르게 적힌 곳이 있어 출처 쪽을 함께 적음</p>`)}
${band('angel-docs', 'canvas', 'ANGEL CLUB', '엔젤클럽 자료', '더드림엔젤클럽 · 더드림2엔젤클럽', `      ${det(`더드림엔젤클럽 <span class="mono">회원 49명</span>`, `${rows(D.angelClub1.info)}${note('회원 명단과 사무국 휴대전화는 싣지 않음')}`, true)}
      ${det(`더드림2엔젤클럽 <span class="mono">${D.angelClub2.doc}</span>`, `${rows(D.angelClub2.info)}${sub('결성 목적')}${lst(D.angelClub2.purpose.map(esc))}${sub('주요활동계획')}${lst(D.angelClub2.plans.map(esc))}${note('신청서의 회장 이름 · 휴대전화 · 개인 이메일은 싣지 않음')}`)}`)}
${band('fund', 'soft', 'FUND', '개인투자조합 구성 운영', esc(F.lead), `      <div class="out">
        <div>
          ${panel('개인투자조합 정의', 'DEFINITION', lst(F.def.map(esc)))}
          ${panel('투자 대상 기업', 'TARGET', drows(F.target.map(([k, v]) => [k, esc(v)])).replace(/<dd>/g, '<dd class="dd--txt">'))}
          ${panel('결성 등록 요건', 'REQUIREMENTS', drows(F.reqs) + lst(F.reqNotes.map(esc), 'lst--sm'))}
        </div>
        <div>
          ${panel('결성 등록 절차', `${F.steps.length}단계`, `<ol class="lst lst--num">${F.steps.map((s, i) => `<li><b>${i + 1}단계 · ${esc(s)}</b>${i === 2 ? '<span>1~3단계: GP주도 하, 자체 진행</span>' : ''}${i === 3 ? '<span>주의 사항: 접수결과 통보 전에는 조합원의 공개모집 또는 일체의 출자금 받는 것이 금지됨.</span>' : ''}</li>`).join('')}</ol>`)}
        </div>
      </div>
      ${sub('세제 혜택')}
      <div class="out">
        <div>${panel('1. 소득공제 혜택', '조세특례제한법 제 16조, 영 제 14조', `<p class="b-sm"><b>${F.taxHead}</b></p>${drows(F.taxItems).replace(/<dd>/g, '<dd class="dd--txt">')}${drows(F.tax.map(([a, b]) => [a, b]))}<p class="b-sm" style="margin-top:var(--s-sm)">${esc(F.taxNote)}</p>`)}</div>
        <div>${panel('2. 양도소득세 감면 혜택', '조세특례제한법 제 14조, 영 제 13조', `<p class="b-sm">${esc(F.cgt)}</p>`)}</div>
      </div>
      ${note(`${esc(F.plan)} · 세제 내용은 2026.09 회사소개자료에 실린 그대로이며 세법 개정 여부는 확인 필요`)}
      ${det('TIPS 연계 조합 <span class="mono">2025. 5. 자료 기준</span>', `<div class="joins">
        <div class="join rv"><p class="join__k">GP · 대전창조경제혁신센터</p><h3>TIPS 연계 조합</h3><p>더드림벤처포럼과 대전창조경제혁신센터 업무협력으로 결성</p><ul><li>출자금 총액 3억 이상</li><li>존속기간 등록일로부터 5년</li><li>3년 이내 창업기업 40% 이상 투자</li></ul></div>
        <div class="join rv"><p class="join__k">GP · ㈜아이빌트</p><h3>TIPS 연계 조합</h3><p>더드림벤처포럼과 ㈜아이빌트 업무협력으로 결성</p><ul><li>출자금 총액 3억 이상</li><li>존속기간 등록일로부터 5년</li><li>3년 이내 창업기업 40% 이상, 세종지역 창업기업 35% 이상 투자</li></ul></div>
        <div class="join rv"><p class="join__k">PARTNER</p><h3>TIPS 운영기관 협력</h3><p>대전창조경제혁신센터, ㈜아이빌트, ㈜플랜에이치벤처스와 협력해 TIPS 프로그램 연계 투자</p><ul><li>기술성 · 사업성 검토</li><li>조합 결성 계획 승인</li><li>결성 총회 후 기업 투자</li></ul></div>
      </div>${note('2026.09 회사소개자료에는 없는 내용. 2025. 5. 회사소개서에서 옮김')}`)}`)}
${band('cases', 'canvas', 'PORTFOLIO', '투자 및 기술사업화 사례', `진병기 투자 사례 ${D.cases.length}개사`, `      <div class="coms">${D.cases.map((c) => `<a class="com rv" href="cases.html#${c.id}"><div class="com__top"><span class="com__no">p.${c.page}</span>${c.est ? `<span class="com__cnt">설립 ${esc(c.est)}</span>` : ''}</div><h3>${esc(c.company)}</h3><p>${esc((c.rep.includes('_') ? c.rep.split('_').pop().trim() : ''))}</p></a>`).join('')}</div>
      ${lnk('cases.html', '투자 사례 전체 보기')}`)}
${band('family', 'soft', 'FAMILY', '가족기업', `${D.families.length}개사`, `      <div class="fams rv">${D.families.map(([n, s]) => `<div class="fam"><b>${esc(n)}</b><span>${esc(s)}</span></div>`).join('')}</div>
      ${note(esc(D.familiesBanner.replace(/\s*>+$/, '')))}`)}
`,
});

// ── 투자 사례 ────────────────────────────────────────────
const caseTable = (label, r) => {
  const multi = r.some((x) => Array.isArray(x) && x.length > 2);
  if (!multi) return rows(r.map((x) => [esc(x[0]), esc(x[1] ?? '')]));
  const [h, ...b] = r;
  return table(label, h.map(esc), b.map((x) => x.map(esc)));
};
const caseItem = (x) => { const s = String(x); const em = s.startsWith('[적색]'); return `<li${em ? ' class="em"' : ''}>${esc(em ? s.replace('[적색]', '').trim() : s).replace(/\n/g, '<br>')}</li>`; };
const caseSec = (c, s) => {
  const h = sub(esc(s.label));
  if (s.type === 'table') return h + caseTable(`${c.company} ${s.label}`, s.rows);
  if (s.type === 'list') return h + `<ul class="lst rv">${s.items.map(caseItem).join('')}</ul>`;
  if (s.type === 'cards') return h + `<div class="coms">${s.items.map((x) => `<article class="com rv">${x.stage ? `<div class="com__top"><span class="com__no">${esc(x.stage)}</span></div>` : ''}<h3>${esc(x.name)}</h3>${x.desc ? `<p>${esc(x.desc).replace(/\n/g, '<br>')}</p>` : ''}${x.tag ? `<div class="com__kpi"><span class="kpi">${esc(x.tag)}</span></div>` : ''}</article>`).join('')}</div>`;
  return (s.text && s.text !== s.label ? h : '') + `<p class="b-md case-txt rv">${esc(s.text || s.label).replace(/\n/g, '<br>')}</p>`;
};
pages.push({
  file: 'cases.html',
  title: '투자 사례 | 더드림워커㈜',
  desc: `더드림워커㈜ 진병기 대표 투자 및 기술사업화 사례 ${D.cases.length}개사 — 기업 개요, 연혁, 제품, 지식재산권`,
  body: `${pagehead('투자 사례', `투자 및 기술사업화 사례 _진병기 투자 · ${D.cases.length}개사 원자료 그대로`, [['invest.html', '투자·보육']])}
${band('case-all', 'canvas', 'INDEX', '전체 목록', '사업자 · 법인번호, 연락처, 주소, 재무 수치는 싣지 않음 · 원자료 쪽 번호를 각 기업에 표기', `      <div class="coms">${D.cases.map((c, i) => `<a class="com rv" href="#${c.id}"><div class="com__top"><span class="com__no">${pad(i + 1)}</span><span class="com__cnt">p.${c.page}</span></div><h3>${esc(c.company)}</h3><p>${esc([(c.rep.includes('_') ? c.rep.split('_').pop().trim() : ''), c.est && `설립 ${c.est}`].filter(Boolean).join(' · '))}</p></a>`).join('')}</div>`)}
${D.cases.map((c, i) => band(c.id, i % 2 ? 'canvas' : 'soft', `CASE ${pad(i + 1)} · p.${c.page}`, esc(c.company), esc(c.rep), `      ${c.sections.map((s) => caseSec(c, s)).join('\n      ')}
      ${c.images.length ? `<ul class="figs rv">${c.images.map((m) => `<li><img src="${m.src}" width="${m.w}" height="${m.h}" loading="lazy" alt="${attr(m.alt)}"></li>`).join('')}</ul>` : ''}
      ${lnk('#case-all', '전체 목록')}`)).join('')}
`,
});

// ── 포럼 운영 ────────────────────────────────────────────
const fs0 = D.forum.series;
function chart(idx, cls, label) {
  const W = 960, H = 340, L = 44, R = 12, T = 28, B = 74;
  const max = idx === 1 ? 100 : 700, step = idx === 1 ? 20 : 100;
  const bw = (W - L - R) / fs0.length, y = (v) => T + (H - T - B) * (1 - v / max);
  let g = '';
  for (let v = 0; v <= max; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="ch__grid"/><text x="${L - 8}" y="${y(v) + 4}" class="ch__ax" text-anchor="end">${v}</text>`;
  const bars = fs0.map((r, i) => {
    const x = L + i * bw + bw * 0.18, w = bw * 0.64, v = r[idx];
    return `<rect x="${x.toFixed(1)}" y="${y(v).toFixed(1)}" width="${w.toFixed(1)}" height="${(y(0) - y(v)).toFixed(1)}" class="${cls}"/><text x="${(x + w / 2).toFixed(1)}" y="${(y(v) - 6).toFixed(1)}" class="ch__v" text-anchor="middle">${v}</text><text transform="translate(${(x + w / 2).toFixed(1)} ${H - B + 14}) rotate(-55)" class="ch__ax" text-anchor="end">${r[0]}</text>`;
  }).join('');
  const a = fs0[0], z = fs0[fs0.length - 1];
  return `<div class="chart" tabindex="0" role="group" aria-label="${label} 막대그래프, 가로 스크롤 가능"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}: ${a[0]} ${a[idx]}명에서 ${z[0]} ${z[idx]}명"><title>${label}</title>${g}${bars}</svg></div>`;
}
const evRows = (label, r) => table(label, ['시간', '계획'], r.map(([a, b]) => [a, esc(b)]), [0]);
const M = D.forum.meetup, WS = D.forum.workshop;
pages.push({
  file: 'forum.html',
  title: '더드림벤처포럼 운영 | 더드림워커㈜',
  desc: `더드림워커㈜가 ${D.forum.start} 구성한 더드림벤처포럼 — 중소기업 · 투자자 · 대학 · 연구원 교류 네트워크, 회원 ${D.forum.members}, 데모데이`,
  body: `${pagehead('더드림벤처포럼 운영', `${D.forum.start} 구성 · 회원 ${D.forum.members} · 매월 1회 이상 오프라인 포럼 및 데모데이`)}
${band('about', 'canvas', 'FORUM', '더드림벤처포럼 운영', esc(D.forum.lead16), `      ${lst(D.forum.lead17.map(esc), 'rv')}
      ${rows([['구성', D.forum.start], ['회원', `${D.forum.members} · p.16 기준. p.17은 25.9.19 현재 705명, 대표 이력(p.8)은 710명`], ['운영', esc(D.forum.cadence)], ['포럼 사이트', `<a class="lnk" href="${FORUM_EXT}" rel="noopener">forum.dreamventures.kr ↗</a>`]])}`)}
${band('roles', 'soft', 'ROLES', '역할', '', `      ${tiles(D.forum.roles.map(([n, s]) => ({ k: n, h: ['교류 네트워크', '정보 공유 커뮤니티', '투자 및 투자유치 플랫폼', '사업 협업 플랫폼'][Number(n) - 1], p: esc(s) })))}`)}
${band('trend', 'canvas', 'TREND', '참석 · 회원 추이', `${fs0[0][3]} ~ ${fs0[fs0.length - 1][3]} · ${fs0.length}회 · 투자포럼방 회원 ${fs0[0][2]}명 → ${fs0[fs0.length - 1][2]}명`, `      <div class="out out--1">
        ${panel('더드림투자포럼방 회원수', '단위 명', chart(2, 'ch__b ch__b--ink', '더드림투자포럼방 회원수'))}
        ${panel('더드림벤처포럼 참석인원', '단위 명', chart(1, 'ch__b', '더드림벤처포럼 참석인원'))}
      </div>
      ${note('작은 화면에서는 그래프를 옆으로 밀어 보기')}
      ${det(`더드림벤처포럼 회원 및 더드림벤처포럼 데모데이 참석자 <span class="mono">${fs0.length}회</span>`, table('포럼 자료 표', ['구분', '더드림벤처포럼 참석인원수(명)', '더드림투자포럼방 회원수(명)', '비고'], fs0.map((r) => [r[0], r[1], r[2], r[3]]), [1, 2, 3]))}`)}
${band('events', 'soft', 'EVENTS', '개최 자료', esc(D.forum.cadence), `      ${sub('더드림 벤처 포럼 개최 자료')}
      ${chips(D.forum.sessions.map((s) => `${s} 더드림 벤처 포럼 개최`))}
      ${det(`${esc(M.title)} <span class="mono">2023.09</span>`, `${sub('Ⅰ. 목적')}${lst(M.purpose.map(esc))}${sub('Ⅱ. 더드림투자밋업 개요')}${rows(M.rows.map(([k, v]) => [k, esc(v)]))}${sub('세부일정', '투자밋업')}${evRows('투자밋업 세부일정 표', M.schedule)}${note(`${M.attendees}과 진행자 이름, 문의처 휴대전화는 싣지 않음`)}`)}
      ${det(`${esc(WS.title)} <span class="mono">2023.10</span>`, `${sub('Ⅰ. 목적')}${lst(WS.purpose.map(esc))}${sub('Ⅱ. 더드림벤처포럼 및 데모데이 (1박2일 워크숍) 개요')}${rows(WS.rows.map(([k, v]) => [k, esc(v)]))}${WS.schedule.map(([g, r]) => `${sub('세부일정', esc(g))}${evRows(`워크숍 세부일정 표 ${g}`, r)}`).join('')}${note(`${WS.attendees}과 진행자 이름, 문의처 휴대전화는 싣지 않음`)}`)}
      ${note('포럼 · 워크숍 현장 사진은 참석자 얼굴이 나와 싣지 않음')}`)}
`,
});

// ── 실적 · 네트워크 ──────────────────────────────────────
// 2025. 5. 회사소개서의 수출바우처 수행 19건. 2026.09 자료에는 없는 표라 기준일을 달아 남김
const voucher = [
  ['중소기업 중장기 성장전략 수립', '2018-06-08', '2018-12-07', '2018'], ['중소기업 중장기 성장전략 수립', '2019-01-02', '2019-04-30', '2018'],
  ['중소기업 중장기 성장전략 수립', '2018-08-14', '2019-02-13', '2018'], ['중소기업 중장기 성장전략 수립', '2018-07-23', '2018-12-31', '2018'],
  ['해외마케팅 전략 수립', '2019-09-16', '2019-11-20', '2019'], ['중소기업 중장기 성장전략 수립', '2019-06-27', '2019-10-31', '2019'],
  ['중소기업 기술개발 및 사업화전략 컨설팅', '2019-12-04', '2020-02-24', '2019'], ['중소기업 중장기 성장전략 수립', '2020-06-19', '2020-09-30', '2020'],
  ['중소기업 중장기 성장전략 수립', '2021-06-03', '2021-10-15', '2021'], ['중소기업 기술개발 및 사업화전략 컨설팅', '2021-06-01', '2021-10-31', '2021'],
  ['중소기업 중장기 성장전략 수립', '2021-07-30', '2021-10-31', '2021'], ['중소기업 중장기 성장전략 수립', '2021-07-21', '2021-10-31', '2021'],
  ['중소기업 기술개발 및 사업화전략 컨설팅', '2022-02-19', '2022-03-31', '2021'], ['중소기업 기술개발 및 사업화전략 컨설팅', '2021-05-07', '2021-09-30', '2021'],
  ['중소기업 중장기 성장전략 수립', '2021-07-28', '2021-10-31', '2021'], ['중소기업 중장기 성장전략 수립', '2022-11-18', '2023-02-28', '2022'],
  ['중소기업 중장기 성장전략 수립', '2022-10-28', '2023-02-28', '2022'], ['중소기업 중장기 성장전략 수립', '2023-04-01', '2023-04-30', '2022'],
  ['중소기업 중장기 성장전략 수립', '2023-04-28', '2023-09-30', '2023'],
];
pages.push({
  file: 'records.html',
  title: '실적·네트워크 | 더드림워커㈜',
  desc: '더드림워커㈜ 주요사업 실적 10개 분야, 수출바우처 수행, 수행기관 지정, 중소기업 · 기관 · 대학 · 연구원 · 전문기관 · 투자사 네트워크',
  body: `${pagehead('실적·네트워크', '2015년 이후 주요사업 실적, 수행기관 지정, 협력 네트워크')}
${band('records', 'canvas', 'TRACK RECORD', '주요사업 실적', '원자료 표 그대로 · 업체명의 * 표시는 원자료에서 가린 부분', `      <div class="tbl-wrap rv" tabindex="0" role="region" aria-label="주요사업 실적 표"><table class="tbl tbl--rec"><thead><tr><th scope="col">비고</th><th scope="col">업체 / 사업명</th></tr></thead><tbody>${D.records.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>`)}
${band('voucher', 'soft', 'EXPORT VOUCHER', '수출바우처 수행', '중기부 수출바우처사업 사업화전략 수행실적 19건 · 2025. 5. 회사소개서 기준', `      <div class="out">
        <div>${panel('서비스 유형', '2018~2023', drows([['중소기업 중장기 성장전략 수립', '14건'], ['중소기업 기술개발 및 사업화전략 컨설팅', '4건'], ['해외마케팅 전략 수립', '1건']]))}</div>
        <div>${panel('연도별', '합계 19건', drows([['2018', '4건'], ['2019', '3건'], ['2020', '1건'], ['2021', '7건'], ['2022', '3건'], ['2023', '1건']]))}</div>
      </div>
      ${det('수행 건별 보기', table('수출바우처 수행 건별 표', ['번호', '서비스명', '시작', '종료', '연도'], voucher.map((r, i) => [pad(i + 1), ...r]), [2, 3, 4]))}
      ${note('2026.09 회사소개자료에는 없는 표. 참여기업명과 서비스요금은 원자료에서 가려져 있어 싣지 않음')}`)}
${band('designation', 'canvas', 'DESIGNATION', '수행기관 지정', '연혁(p.5)과 해외시장진출(p.27)의 지정 · 선정 항목', `      ${rows([...D.designations.map(([d, t, o]) => [d, `${esc(t)}${o ? ` · ${esc(o)}` : ''}`]), ['—', '수출바우처 해외마케팅 전문수행기관']])}`)}
${band('network', 'soft', 'NETWORK', '네트워크', '', `      <div class="net rv">${D.network.map((n, i) => `<div class="net__r"><span class="net__n">${pad(i + 1)}</span><h3>${esc(n.label)}</h3><p>${esc(n.body)}</p></div>`).join('')}</div>
      ${lnk('services.html#global', '해외 협력 보기')}`)}
`,
});

for (const p of pages) fs.writeFileSync(p.file, page(p));
console.log('built', pages.map((p) => p.file).join(' '));
