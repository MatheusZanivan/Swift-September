// --------- Configuração dos tópicos (home) ---------
const topics = [
  "Swift language fundamentals",
  "Optionals, generics, and protocol-oriented programming",
  "Memory management with ARC (retain cycles, capture lists)",
  "Swift concurrency basics (async/await, Task, TaskGroup, cancellation)",
  "Actors and actor isolation (@MainActor)",
  "GCD and OperationQueue vs Swift Concurrency",
  "Error handling patterns (throws, Result, async errors)",
  "SwiftUI data flow (State, Binding, ObservedObject, StateObject, EnvironmentObject, @Observable)",
  "SwiftUI layout & navigation (Layout protocol, stacks/grids, NavigationStack/NavPath)",
  "UIKit essentials (UIViewController lifecycle, Auto Layout, trait collections)",
  "Interop: SwiftUI + UIKit (UIHostingController, UIViewRepresentable/UIViewControllerRepresentable)",
  "Networking (URLSession, REST/GraphQL, WebSockets, reachability)",
  "Codable and JSON decoding",
  "Persistence with SwiftData vs Core Data (models, queries, migrations)",
  "Secure storage and filesystem (Keychain, files, sandboxing)",
  "Design patterns (Delegation, Observer/NotificationCenter, Strategy, Adapter, Singleton)",
  "Architecture patterns (MVC, MVVM, VIPER, Clean, Coordinator)",
  "Dependency Injection and modularization",
  "Package management & builds (SPM vs CocoaPods/Carthage, XCFrameworks)",
  "Testing (XCTest unit/UI, mocks/stubs, snapshot testing)",
  "CI/CD, code signing & provisioning (Fastlane, Xcode Cloud, GitHub Actions)",
  "App & Scene lifecycle, background work (BackgroundTasks)",
  "Deep linking and navigation (URL schemes, Universal Links)",
  "Notifications (local/push, notification extensions)",
  "Widgets, Live Activities, and App Intents (WidgetKit, ActivityKit)",
  "Accessibility and localization (VoiceOver, Dynamic Type, RTL, dark mode)",
  "Performance & profiling (Instruments, leaks, rendering)",
  "Core Animation & rendering, SwiftUI performance",
  "Privacy & data handling (ATT, permissions, privacy manifests)",
  "Release, distribution & observability (App Store, TestFlight, analytics, crash reporting)"
];

const releaseStrategy = 'date'; // 'date' | 'manual'
const manualUnlockedDays = [1];

function trimTitle(title, max = 64) {
  if (title.length <= max) return title;
  return title.slice(0, max - 1) + '…';
}

function isDayUnlocked(dayIndex) {
  const day = dayIndex + 1;
  if (releaseStrategy === 'manual') {
    return manualUnlockedDays.includes(day);
  }
  const now = new Date();
  const isSeptember = now.getMonth() + 1 === 9;
  const today = now.getDate();
  return isSeptember ? day <= today : day === 1;
}

function setCoverForDay(coverEl, dayNumber) {
  const candidate = `./images/day${dayNumber}Cover.png`;
  const img = new Image();
  img.onload = () => {
    coverEl.style.backgroundImage = `url('${candidate}')`;
    coverEl.style.backgroundPosition = "center 20%";
    coverEl.style.backgroundSize = "cover";
    coverEl.style.backgroundRepeat = "no-repeat";
  };
  img.onerror = () => {
    coverEl.style.backgroundImage = ''; // mantém o fallback do CSS
    coverEl.style.backgroundPosition = "center";
  };
  img.src = candidate;
}

function buildCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  if (!track) return;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < topics.length; i++) {
    const d = i + 1;
    const unlocked = isDayUnlocked(i);
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `Day ${d}: ${topics[i]}`);

    const cover = document.createElement('div');
    cover.className = 'card-cover';
    setCoverForDay(cover, d);
    card.appendChild(cover);

    const content = document.createElement('div');
    content.className = 'card-content';
    content.innerHTML = `
      <span class="day-label">Day ${d}</span>
      <div class="topic-title">${trimTitle(topics[i])}</div>
    `;
    card.appendChild(content);

    if (unlocked) {
      const a = document.createElement('a');
      a.href = `day${d}.html`;
      a.className = 'card-link';
      a.setAttribute('aria-label', `Open Day ${d} lesson`);
      card.appendChild(a);
    } else {
      const overlay = document.createElement('div');
      overlay.className = 'locked-overlay';
      overlay.innerHTML = `
        <span class="locked-badge" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="white" stroke-width="1.6"/><rect x="5" y="10" width="14" height="10" rx="2" stroke="white" stroke-width="1.6"/></svg>
          Locked
        </span>
        <span class="visually-hidden">Locked lesson</span>
      `;
      card.appendChild(overlay);
    }

    frag.appendChild(card);
  }

  track.appendChild(frag);
}

function setupCarouselButtons() {
  const track = document.querySelector('[data-carousel-track]');
  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return;

  const cardWidth = () => {
    const first = track.querySelector('.carousel-card');
    return first ? first.getBoundingClientRect().width + 14 : 220;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' }));
}

// ------------------------------
// CodeBox (cópia de código)
// ------------------------------
function initCodeBoxes() {
  document.querySelectorAll('.codebox').forEach(box => {
    if (!box.querySelector('.codebox-copy')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'codebox-copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M9 9h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" stroke="white" stroke-width="1.6"/><path d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1" stroke="white" stroke-width="1.6"/></svg>`;
      box.appendChild(btn);
    }

    if (!box.querySelector('.codebox-toast')) {
      const toast = document.createElement('div');
      toast.className = 'codebox-toast';
      toast.textContent = 'Copied';
      box.appendChild(toast);
    }
  });
}

function getCodeTextFromBox(box) {
  const preCode = box.querySelector('pre code');
  if (preCode) return preCode.innerText;
  const pre = box.querySelector('pre');
  if (pre) return pre.innerText;
  const code = box.querySelector('code');
  return code ? code.innerText : '';
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      return false;
    }
  }
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.codebox-copy');
  if (!btn) return;
  const box = btn.closest('.codebox');
  if (!box) return;

  const text = getCodeTextFromBox(box);
  if (!text) return;

  const ok = await copyText(text);
  const toast = box.querySelector('.codebox-toast');
  if (toast) {
    const original = toast.textContent;
    toast.textContent = ok ? 'Copied' : 'Copy failed';
    box.classList.add('copied');
    setTimeout(() => {
      box.classList.remove('copied');
      toast.textContent = original;
    }, 1600);
  }
});

// ------------------------------
// Numeração romana + ToC
// ------------------------------
function toRoman(n) {
  const map = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],
    [1,'I']
  ];
  let res = '';
  for (const [val, sym] of map) {
    while (n >= val) { res += sym; n -= val; }
  }
  return res;
}

function numberHeadingsAndBuildTOC() {
  const headings = document.querySelectorAll('.section > h2');
  const toc = document.getElementById('toc');
  if (toc) toc.innerHTML = '';

  headings.forEach((h2, idx) => {
    const label = h2.getAttribute('data-title') || h2.textContent.trim();
    const roman = toRoman(idx + 1);

    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    h2.id = id;
    h2.innerHTML = `<span class="sec-num">${roman}.</span>${label}`;

    if (toc) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = `${roman}. ${label}`;
      li.appendChild(a);
      toc.appendChild(li);
    }
  });
}

// ------------------------------
// Scroll Spy (menu flutuante)
// ------------------------------
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('#toc a'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  let sectionBounds = [];

  function recalcBounds() {
    sectionBounds = sections.map(sec => {
      const rect = sec.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const bottom = top + sec.offsetHeight;
      return { id: sec.id, top, bottom };
    });
  }

  function setActiveByScroll() {
    if (!sectionBounds.length) return;
    const probe = window.scrollY + window.innerHeight * 0.5;

    if (window.scrollY <= 2) {
      activate(sectionBounds[0].id);
      return;
    }

    const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      activate(sectionBounds[sectionBounds.length - 1].id);
      return;
    }

    let currentId = sectionBounds[0].id;
    for (const sb of sectionBounds) {
      if (probe >= sb.top) currentId = sb.id;
      else break;
    }
    activate(currentId);
  }

  function activate(id) {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
      links.forEach(l => l.classList.remove('active'));
      a.classList.add('active');
    });
  });

  recalcBounds();
  setActiveByScroll();
  window.addEventListener('scroll', setActiveByScroll, { passive: true });
  window.addEventListener('resize', () => { recalcBounds(); setActiveByScroll(); });
  window.setTimeout(() => { recalcBounds(); setActiveByScroll(); }, 300);
}

// ------------------------------
// 1) Normalizar indentação de todos os <code>
// ------------------------------
function normalizeAllCodeIndentation() {
  document.querySelectorAll('pre code, code').forEach(codeEl => {
    // pega texto já decodificado (innerText) e normaliza
    let text = codeEl.innerText.replace(/\t/g, '  ');        // tabs -> 2 espaços
    text = text.replace(/\s+$/gm, '');                        // trim fim de linha
    text = text.replace(/^\s*\n+|\n+\s*$/g, '');              // remove linhas vazias no início/fim

    const lines = text.split('\n');
    const indents = lines
      .filter(l => l.trim().length > 0)
      .map(l => (l.match(/^ +/) || [''])[0].length);

    const minIndent = indents.length ? Math.min(...indents) : 0;
    const dedented = lines
      .map(l => (l.startsWith(' '.repeat(minIndent)) ? l.slice(minIndent) : l))
      .join('\n');

    codeEl.textContent = dedented;
  });
}

// ------------------------------
// 2) Breadcrumbs sem espaços extras ("<Home/Day X")
// ------------------------------
function initBreadcrumbs() {
  const nav = document.querySelector('.breadcrumbs ul');
  if (!nav) return;

  // Detecta o dia a partir da URL (dayN.html)
  const m = (location.pathname.match(/day(\d+)\.html$/i) || []);
  const day = m[1] ? parseInt(m[1], 10) : null;

  nav.innerHTML = ''; // limpa qualquer HTML quebrado

  const li = document.createElement('li');
  li.className = 'crumb';

  const chev = document.createElement('span');
  chev.className = 'chev';
  chev.setAttribute('aria-hidden', 'true');
  chev.textContent = '<'; // colado

  const home = document.createElement('a');
  home.href = './index.html';
  home.textContent = 'Home';

  const sep = document.createElement('span');
  sep.className = 'sep';
  sep.textContent = '/';

  const current = document.createElement('span');
  current.setAttribute('aria-current', 'page');
  current.textContent = day ? `Day ${day}` : document.title || 'Current';

  li.appendChild(chev);
  li.appendChild(home);
  li.appendChild(sep);
  li.appendChild(current);
  nav.appendChild(li);
}

// ------------------------------
// 3) Capa lateral automática por página (left-rail)
// ------------------------------
function initDayCover() {
  const cover = document.querySelector('.left-rail .floating-cover');
  if (!cover) return;

  // tenta via URL
  let dayNumber = null;
  const m = (location.pathname.match(/day(\d+)\.html$/i) || []);
  if (m[1]) dayNumber = parseInt(m[1], 10);

  // fallback: tenta achar "Day N" no breadcrumbs
  if (!dayNumber) {
    const current = document.querySelector('.breadcrumbs [aria-current="page"]');
    if (current) {
      const mm = current.textContent.match(/Day\s+(\d+)/i);
      if (mm && mm[1]) dayNumber = parseInt(mm[1], 10);
    }
  }

  if (dayNumber) {
    setCoverForDay(cover, dayNumber);
  }
}

// ------------------------------
// Inicialização
// ------------------------------
document.addEventListener('DOMContentLoaded', () => {
  buildCarousel();
  setupCarouselButtons();
  initCodeBoxes();
  normalizeAllCodeIndentation();   // 1) corrige indentação dos códigos
  numberHeadingsAndBuildTOC();
  initBreadcrumbs();               // 2) breadcrumbs "<Home/Day X" sem espaços extras
  initDayCover();                  // 3) capa lateral automática por dia
  initScrollSpy();
});
