// Data
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

// Config: choose how to unlock lessons
// 'date' will unlock Day N on the Nth calendar day of September (local time).
// 'manual' unlocks by editing the array below.
const releaseStrategy = 'date'; // 'date' | 'manual'
const manualUnlockedDays = [1]; // e.g., [1,2,3] to unlock first 3 days when strategy='manual'

function trimTitle(title, max = 64) {
  if (title.length <= max) return title;
  return title.slice(0, max - 1) + '…';
}

function isDayUnlocked(dayIndex) {
  const day = dayIndex + 1;
  if (releaseStrategy === 'manual') {
    return manualUnlockedDays.includes(day);
  }
  // date strategy: unlock based on today's date in September
  const now = new Date();
  const month = now.getMonth() + 1; // 1..12
  const isSeptember = month === 9;
  const today = now.getDate();
  if (!isSeptember) {
    // Outside September: default to unlock Day 1 only
    return day === 1;
  }
  return day <= today;
}

function buildCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  const count = topics.length;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const d = i + 1;
    const unlocked = isDayUnlocked(i);

    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `Day ${d}: ${topics[i]}`);

    const cover = document.createElement('div');
    cover.className = 'card-cover';
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="white" stroke-width="1.6"/>
          </svg>
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
  const cardWidth = () => {
    const first = track.querySelector('.carousel-card');
    return first ? first.getBoundingClientRect().width + 14 : 220; // width + gap fallback
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:  cardWidth() * 2, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
  buildCarousel();
  setupCarouselButtons();
});