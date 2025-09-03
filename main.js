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

// Converte 1..3999 para algarismos romanos
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

// Substitui sua função atual por esta:
function numberHeadingsAndBuildTOC() {
  const headings = document.querySelectorAll('.section > h2');
  const toc = document.getElementById('toc');
  if (toc) toc.innerHTML = '';

  headings.forEach((h2, idx) => {
    const label = h2.getAttribute('data-title') || h2.textContent.trim();
    const roman = toRoman(idx + 1);

    // id estável a partir do label (sem numeração)
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    h2.id = id;

    // mostra romano no H2
    h2.innerHTML = `<span class="sec-num">${roman}.</span> ${label}`;

    // entrada no ToC
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

// Mantém seu scroll-spy, só garantindo a classe .active
function initScrollSpy() {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = `#${entry.target.id}`;
      const link = links.find(a => a.getAttribute('href') === id);
      if (!link) return;

      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '0px 0px -70% 0px',
    threshold: 0.1
  });

  sections.forEach(sec => observer.observe(sec));

  // estado inicial
  links[0]?.classList.add('active');
}


function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('#toc a'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = links.find(a => a.getAttribute('href') === id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {
    rootMargin: '-50% 0px -40% 0px', // ativa por volta do meio da tela
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

// no final do DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
  buildCarousel();
  setupCarouselButtons();
  initCodeBoxes();
  numberHeadingsAndBuildTOC();
  initScrollSpy(); // <- adiciona isso
});

