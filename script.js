"use strict";

document.documentElement.classList.add("js");

const reasonsSection = document.querySelector(".reasons");
const purchaseProcessSection = document.querySelector(".purchase-process");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const languageTrigger = document.querySelector("[data-language-trigger]");
const languageMenu = document.querySelector("[data-language-menu]");
const languageCode = document.querySelector("[data-language-code]");
const mobileLanguageToggle = document.querySelector(
  "[data-mobile-language-toggle]",
);
const mobileLanguageTarget = document.querySelector(
  "[data-mobile-language-target]",
);
const languageOptions = Array.from(
  document.querySelectorAll("[data-language-option]"),
);
const mobileBreakpoint = window.matchMedia("(max-width: 1180px)");
const mobileConnectorBreakpoint = window.matchMedia("(max-width: 680px)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const localizedText = (fr, en) => window.ZoneFifaI18n?.t(fr, en) ?? fr;
const trackedNavigationLinks = Array.from(
  navigation?.querySelectorAll('a[href^="#"]') ?? [],
);
const navigationTimeline = [
  { element: document.querySelector("#accueil"), href: "#accueil" },
  { element: document.querySelector("#vehicules"), href: "#vehicules" },
  { element: document.querySelector("#le-parc"), href: "#le-parc" },
  {
    element: document.querySelector(".digital-experience"),
    href: "#vehicules",
  },
  { element: document.querySelector(".reasons"), href: "#le-parc" },
  {
    element: document.querySelector(".purchase-process"),
    href: "#vehicules",
  },
  { element: document.querySelector("#localisation"), href: "#localisation" },
  { element: document.querySelector(".final-cta"), href: "#localisation" },
].filter(({ element }) => element instanceof HTMLElement);

function setMenuState(isOpen, { returnFocus = false } = {}) {
  if (!menuToggle || !navigation || !header) return;

  if (!isOpen) setLanguageMenuState(false);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen
      ? localizedText("Fermer le menu", "Close menu")
      : localizedText("Ouvrir le menu", "Open menu"),
  );
  navigation.classList.toggle("is-open", isOpen);
  header.classList.toggle("menu-visible", isOpen);
  document.body.classList.toggle("menu-open", isOpen && mobileBreakpoint.matches);

  if (returnFocus) menuToggle.focus();
}

function currentLanguage() {
  return window.ZoneFifaI18n?.locale === "en" ? "en" : "fr";
}

function languageName(language, interfaceLanguage = currentLanguage()) {
  const names = {
    fr: { fr: "Français", en: "Anglais" },
    en: { fr: "French", en: "English" },
  };

  return names[interfaceLanguage][language];
}

function setLanguageMenuState(open, { focus = null } = {}) {
  if (!languageTrigger || !languageMenu) return;

  languageTrigger.setAttribute("aria-expanded", String(open));
  languageMenu.hidden = !open;

  if (!open) {
    if (focus === "trigger") languageTrigger.focus();
    return;
  }

  const selectedIndex = languageOptions.findIndex(
    (option) => option.getAttribute("aria-checked") === "true",
  );
  const focusIndex =
    focus === "last"
      ? languageOptions.length - 1
      : Math.max(selectedIndex, 0);
  languageOptions[focusIndex]?.focus();
}

function syncLanguageControl() {
  if (!languageTrigger || !languageMenu || !languageCode) return;

  const language = currentLanguage();
  const isEnglish = language === "en";
  const mobileMenuOpen = menuToggle?.getAttribute("aria-expanded") === "true";
  languageCode.textContent = language.toUpperCase();
  if (mobileLanguageTarget) {
    mobileLanguageTarget.textContent = isEnglish ? "FR" : "EN";
  }
  mobileLanguageToggle?.setAttribute(
    "aria-label",
    isEnglish ? "Switch to French" : "Passer en anglais",
  );
  languageTrigger.setAttribute(
    "aria-label",
    isEnglish
      ? `Choose language, current language: ${languageName(language)}`
      : `Choisir la langue, langue actuelle : ${languageName(language)}`,
  );
  languageMenu.setAttribute(
    "aria-label",
    isEnglish ? "Choose language" : "Choisir la langue",
  );
  menuToggle?.setAttribute(
    "aria-label",
    mobileMenuOpen
      ? localizedText("Fermer le menu", "Close menu")
      : localizedText("Ouvrir le menu", "Open menu"),
  );

  languageOptions.forEach((option) => {
    option.setAttribute(
      "aria-checked",
      String(option.dataset.languageOption === language),
    );
  });
}

function updateNavigationState() {
  if (!header || !trackedNavigationLinks.length) return;

  const isOverview = window.scrollY <= 12;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const probeY =
    window.scrollY + Math.max(110, Math.min(viewportHeight * 0.34, 360));
  let activeHref = "#accueil";

  navigationTimeline.forEach(({ element, href }) => {
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    if (elementTop <= probeY) activeHref = href;
  });

  header.classList.toggle("is-nav-overview", isOverview);
  header.classList.toggle("is-nav-focused", !isOverview);

  trackedNavigationLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === activeHref;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  updateNavigationState();
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen);
});

languageTrigger?.addEventListener("click", () => {
  const isOpen = languageTrigger.getAttribute("aria-expanded") !== "true";
  setLanguageMenuState(isOpen);
});

mobileLanguageToggle?.addEventListener("click", () => {
  const nextLanguage = currentLanguage() === "en" ? "fr" : "en";
  window.ZoneFifaI18n?.setLocale(nextLanguage);
  syncLanguageControl();
});

languageTrigger?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

  event.preventDefault();
  setLanguageMenuState(true, {
    focus: event.key === "ArrowUp" ? "last" : "selected",
  });
});

languageMenu?.addEventListener("keydown", (event) => {
  const currentIndex = languageOptions.indexOf(document.activeElement);
  let nextIndex = currentIndex;

  if (event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % languageOptions.length;
  } else if (event.key === "ArrowUp") {
    nextIndex =
      (currentIndex - 1 + languageOptions.length) % languageOptions.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = languageOptions.length - 1;
  } else if (event.key === "Tab") {
    setLanguageMenuState(false);
    return;
  } else {
    return;
  }

  event.preventDefault();
  languageOptions[nextIndex]?.focus();
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedLanguage =
      option.dataset.languageOption === "en" ? "en" : "fr";
    window.ZoneFifaI18n?.setLocale(selectedLanguage);
    syncLanguageControl();
    setLanguageMenuState(false, { focus: "trigger" });
  });
});

navigation?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a");
  if (link && mobileBreakpoint.matches) setMenuState(false);
});

document.addEventListener("click", (event) => {
  if (
    !mobileBreakpoint.matches ||
    !navigation?.classList.contains("is-open") ||
    !(event.target instanceof Node) ||
    header?.contains(event.target)
  ) {
    return;
  }
  setMenuState(false);
});

document.addEventListener("pointerdown", (event) => {
  if (
    languageTrigger?.getAttribute("aria-expanded") === "true" &&
    event.target instanceof Node &&
    !languageSwitcher?.contains(event.target)
  ) {
    setLanguageMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (languageTrigger?.getAttribute("aria-expanded") === "true") {
    event.preventDefault();
    setLanguageMenuState(false, { focus: "trigger" });
    return;
  }

  if (navigation?.classList.contains("is-open")) {
    setMenuState(false, { returnFocus: true });
  }
});

mobileBreakpoint.addEventListener("change", (event) => {
  if (!event.matches) setMenuState(false);
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader, { passive: true });
window.ZoneFifaI18n?.subscribe(syncLanguageControl);
syncLanguageControl();
updateHeader();

const dividerGlowAreas = document.querySelectorAll(
  ".live-inventory, .about, .digital-experience, " +
    ".reasons, .purchase-process, .location, .final-cta, .site-footer",
);

const mainContent = document.querySelector("#contenu");
const pageRouteLayer = document.querySelector("[data-page-route-layer]");
const pageRouteGroups = new Map(
  Array.from(document.querySelectorAll("[data-page-route]")).map((group) => [
    group.getAttribute("data-page-route"),
    group,
  ]),
);
const pageRouteGradients = new Map(
  Array.from(document.querySelectorAll("[data-page-route-gradient]")).map(
    (gradient) => [
      gradient.getAttribute("data-page-route-gradient"),
      gradient,
    ],
  ),
);
const pageRouteRevealTargets = new Map(
  Array.from(document.querySelectorAll("[data-route-reveal]")).map((target) => [
    target.getAttribute("data-route-reveal"),
    target,
  ]),
);
const pageRouteMetrics = new Map();
const PAGE_ROUTE_ENTRY_VIEWPORT_RATIO = 0.78;
const PAGE_ROUTE_HANDOFF_VIEWPORT_RATIO = 0.22;
const DIVIDER_LIGHT_ENTRY_VIEWPORT_RATIO = 0.9;
const DIVIDER_LIGHT_EXIT_VIEWPORT_RATIO = 0.42;
let pageRouteLayoutFrame;
let pageRouteResizeObserver;
let pageRouteMotionFrame;
let pageRouteMotionDeadline = 0;

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function horizontalLightPosition(progress) {
  return -10 + clamp(progress) * 122;
}

function elementHasLayout(element) {
  if (!(element instanceof Element)) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function routeAnchor(element, mainRect, xRatio, yRatio) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - mainRect.left + rect.width * xRatio,
    y: rect.top - mainRect.top + rect.height * yRatio,
  };
}

function roundedRoutePath(rawPoints, preferredRadius = 42) {
  const points = rawPoints.filter((point, index, list) => {
    if (!index) return true;
    const previous = list[index - 1];
    return Math.abs(point.x - previous.x) > 0.5 || Math.abs(point.y - previous.y) > 0.5;
  });
  if (points.length < 2) return "";

  const command = (point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  const output = [`M ${command(points[0])}`];

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const corner = points[index];
    const next = points[index + 1];
    const incomingLength = Math.hypot(
      corner.x - previous.x,
      corner.y - previous.y,
    );
    const outgoingLength = Math.hypot(next.x - corner.x, next.y - corner.y);
    if (incomingLength < 1 || outgoingLength < 1) {
      output.push(`L ${command(corner)}`);
      continue;
    }

    const radius = Math.min(
      preferredRadius,
      incomingLength * 0.45,
      outgoingLength * 0.45,
    );
    const before = {
      x: corner.x + ((previous.x - corner.x) / incomingLength) * radius,
      y: corner.y + ((previous.y - corner.y) / incomingLength) * radius,
    };
    const after = {
      x: corner.x + ((next.x - corner.x) / outgoingLength) * radius,
      y: corner.y + ((next.y - corner.y) / outgoingLength) * radius,
    };

    output.push(`L ${command(before)}`);
    output.push(`Q ${command(corner)} ${command(after)}`);
  }

  output.push(`L ${command(points.at(-1))}`);
  return output.join(" ");
}

function directRoutePoints(start, end, turnRatio = 0.5) {
  const gap = end.y - start.y;
  const minimumLeg = Math.min(46, Math.max(20, gap * 0.24));
  const turnY = clamp(
    start.y + gap * turnRatio,
    start.y + minimumLeg,
    end.y - minimumLeg,
  );
  return [
    start,
    { x: start.x, y: turnY },
    { x: end.x, y: turnY },
    end,
  ];
}

function edgeDetourRoutePoints(start, end, laneX) {
  const gap = end.y - start.y;
  const topTurnY = start.y + Math.min(44, Math.max(24, gap * 0.14));
  const bottomTurnY = end.y - Math.min(54, Math.max(30, gap * 0.16));
  return [
    start,
    { x: start.x, y: topTurnY },
    { x: laneX, y: topTurnY },
    { x: laneX, y: bottomTurnY },
    { x: end.x, y: bottomTurnY },
    end,
  ];
}

function innerRouteLane(start, end, mainRect, preferredClearance = 72) {
  const shell = document.querySelector(".shell");
  const shellRect = shell?.getBoundingClientRect();
  const shellRight = shellRect
    ? shellRect.right - mainRect.left
    : mainContent.clientWidth - 20;
  const furthestAnchor = Math.max(start.x, end.x);
  const available = Math.max(24, shellRight - furthestAnchor - 10);
  return furthestAnchor + Math.min(preferredClearance, available);
}

function inventoryRouteSource() {
  const cards = Array.from(
    document.querySelectorAll(".vehicle-grid .vehicle-card"),
  ).filter(elementHasLayout);
  return cards[3] || cards.at(-1) || document.querySelector(".vehicle-grid");
}

function setPageRoute(key, points, radius) {
  const group = pageRouteGroups.get(key);
  if (!(group instanceof SVGGElement) || points.length < 2) return;

  const pathData = roundedRoutePath(points, radius);
  if (!pathData) {
    group.style.display = "none";
    pageRouteMetrics.delete(key);
    return;
  }

  group.style.display = "";
  group.querySelectorAll("path").forEach((path) => {
    path.setAttribute("d", pathData);
  });
  pageRouteMetrics.set(key, {
    top: Math.min(...points.map((point) => point.y)),
    bottom: Math.max(...points.map((point) => point.y)),
  });
}

function hidePageRoute(key) {
  const group = pageRouteGroups.get(key);
  if (group instanceof SVGGElement) group.style.display = "none";
  pageRouteMetrics.delete(key);
}

function stagedLightEnvelope(rawProgress, progress) {
  if (rawProgress < 0 || rawProgress > 1) return 0;
  return (
    0.26 +
    Math.pow(Math.max(0, Math.sin(progress * Math.PI)), 0.42) * 0.74
  );
}

function pageRouteLightEnvelope(rawProgress, progress) {
  if (rawProgress <= 0 || rawProgress >= 1) return 0;
  return Math.pow(Math.sin(progress * Math.PI), 0.68);
}

function updateHeroDirectoryFlowLight(viewportHeight) {
  const directory = document.querySelector(".hero-directory");
  if (!(directory instanceof HTMLElement) || !elementHasLayout(directory)) return;

  const rect = directory.getBoundingClientRect();
  const directoryTop = rect.top + window.scrollY;
  const directoryBottom = rect.bottom + window.scrollY;
  const travelStart = directoryTop - viewportHeight * 0.9;
  const travelEnd = directoryBottom - viewportHeight * 0.28;
  const masterRaw =
    (window.scrollY - travelStart) / Math.max(1, travelEnd - travelStart);
  const horizontalRaw = masterRaw / 0.36;
  const horizontal = clamp(horizontalRaw);
  const verticalRaw = (masterRaw - 0.36) / 0.64;
  const vertical = clamp(verticalRaw);
  const horizontalEnvelope = stagedLightEnvelope(horizontalRaw, horizontal);
  const verticalEnvelope = stagedLightEnvelope(verticalRaw, vertical);

  directory.style.setProperty(
    "--hero-directory-flow-x",
    `${horizontalLightPosition(horizontal)}%`,
  );
  directory.style.setProperty(
    "--hero-directory-flow-y",
    `${-8 + vertical * 116}%`,
  );
  directory.style.setProperty(
    "--hero-directory-horizontal-alpha",
    (horizontalEnvelope * 0.9).toFixed(3),
  );
  directory.style.setProperty(
    "--hero-directory-horizontal-mid-alpha",
    (horizontalEnvelope * 0.56).toFixed(3),
  );
  directory.style.setProperty(
    "--hero-directory-vertical-alpha",
    (verticalEnvelope * 0.86).toFixed(3),
  );
  directory.style.setProperty(
    "--hero-directory-vertical-mid-alpha",
    (verticalEnvelope * 0.42).toFixed(3),
  );
}

function updateReasonsLocationFlowLight(viewportHeight) {
  const reasons = document.querySelector(".reasons");
  const grid = reasons?.querySelector(".benefit-grid");
  const target = document.querySelector(".map-frame");
  if (
    !(reasons instanceof HTMLElement) ||
    !(grid instanceof HTMLElement) ||
    !(target instanceof HTMLElement) ||
    !elementHasLayout(reasons) ||
    !elementHasLayout(grid) ||
    !elementHasLayout(target)
  ) {
    return null;
  }

  const gridRect = grid.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const gridTop = gridRect.top + window.scrollY;
  const gridBottom = gridRect.bottom + window.scrollY;
  const targetTop = targetRect.top + window.scrollY;
  const travelStart =
    gridTop - viewportHeight * DIVIDER_LIGHT_ENTRY_VIEWPORT_RATIO;
  const travelEnd =
    gridBottom - viewportHeight * DIVIDER_LIGHT_EXIT_VIEWPORT_RATIO;
  const verticalRaw =
    (window.scrollY - travelStart) / Math.max(1, travelEnd - travelStart);
  const vertical = clamp(verticalRaw);
  const connectorEnd = targetTop - viewportHeight * 0.18;
  const connectorRaw =
    (window.scrollY - travelEnd) /
    Math.max(1, connectorEnd - travelEnd);
  const connector = clamp(connectorRaw);

  const verticalEnvelope = pageRouteLightEnvelope(verticalRaw, vertical);
  reasons.style.setProperty(
    "--reasons-grid-flow-y",
    `${-8 + vertical * 116}%`,
  );
  reasons.style.setProperty(
    "--reasons-grid-vertical-alpha",
    (verticalEnvelope * 0.86).toFixed(3),
  );
  reasons.style.setProperty(
    "--reasons-grid-vertical-mid-alpha",
    (verticalEnvelope * 0.42).toFixed(3),
  );

  return {
    incomingEndScroll: travelStart,
    outgoingFlow: {
      rawProgress: connectorRaw,
      progress: connector,
    },
  };
}

function updatePurchaseStepFlow(viewportHeight) {
  const steps = purchaseProcessSection?.querySelector(".purchase-steps");
  const cards = Array.from(steps?.querySelectorAll(".purchase-step") ?? []);
  const target = document.querySelector(".map-frame");
  if (
    !(steps instanceof HTMLElement) ||
    !(target instanceof HTMLElement) ||
    !cards.length ||
    !elementHasLayout(steps) ||
    !elementHasLayout(target)
  ) {
    cards.forEach((card) => {
      card.style.setProperty("--purchase-light-alpha", "0");
    });
    return null;
  }

  const stepsRect = steps.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const stepsTop = stepsRect.top + window.scrollY;
  const stepsBottom = stepsRect.bottom + window.scrollY;
  const targetTop = targetRect.top + window.scrollY;
  const isMobileStepFlow = mobileConnectorBreakpoint.matches;
  const entryViewportRatio = isMobileStepFlow
    ? PAGE_ROUTE_ENTRY_VIEWPORT_RATIO
    : DIVIDER_LIGHT_ENTRY_VIEWPORT_RATIO;
  const exitViewportRatio = isMobileStepFlow
    ? PAGE_ROUTE_HANDOFF_VIEWPORT_RATIO
    : DIVIDER_LIGHT_EXIT_VIEWPORT_RATIO;
  const travelStart =
    stepsTop - viewportHeight * entryViewportRatio;
  const travelEnd =
    stepsBottom - viewportHeight * exitViewportRatio;
  const stepsRaw =
    (window.scrollY - travelStart) / Math.max(1, travelEnd - travelStart);

  if (isMobileStepFlow) {
    const overlapRatio = 1.28;
    const stepInterval = 1 / (cards.length - 1 + overlapRatio);
    const stepDuration = stepInterval * overlapRatio;

    cards.forEach((card, index) => {
      const localRaw = (stepsRaw - index * stepInterval) / stepDuration;
      const localProgress = clamp(localRaw);
      const envelope = stagedLightEnvelope(localRaw, localProgress);
      card.style.setProperty(
        "--purchase-light-y",
        `${-10 + localProgress * 120}%`,
      );
      card.style.setProperty(
        "--purchase-light-alpha",
        (envelope * 0.96).toFixed(3),
      );
    });
  } else {
    const sharedProgress = clamp(stepsRaw);
    const sharedEnvelope = pageRouteLightEnvelope(stepsRaw, sharedProgress);

    cards.forEach((card) => {
      card.style.setProperty(
        "--purchase-light-y",
        `${-10 + sharedProgress * 120}%`,
      );
      card.style.setProperty(
        "--purchase-light-alpha",
        (sharedEnvelope * 0.96).toFixed(3),
      );
    });
  }

  const connectorEnd =
    targetTop - viewportHeight * PAGE_ROUTE_HANDOFF_VIEWPORT_RATIO;
  const connectorRaw =
    (window.scrollY - travelEnd) /
    Math.max(1, connectorEnd - travelEnd);
  return {
    rawProgress: connectorRaw,
    progress: clamp(connectorRaw),
  };
}

function updateDigitalFilterStory(viewportHeight) {
  const section = document.querySelector(".digital-experience");
  const stage = section?.querySelector(".digital-stage");
  const panel = stage?.querySelector(".digital-filter-panel");
  const conditionToggle = panel?.querySelector(".digital-condition-toggle");
  const conditions = Array.from(
    conditionToggle?.querySelectorAll("span") ?? [],
  );
  const switches = Array.from(panel?.querySelectorAll(".digital-switch") ?? []);
  if (
    !(section instanceof HTMLElement) ||
    !(stage instanceof HTMLElement) ||
    !(panel instanceof HTMLElement) ||
    !(conditionToggle instanceof HTMLElement) ||
    conditions.length < 2 ||
    !switches.length ||
    !elementHasLayout(stage)
  ) {
    return;
  }

  const stageRect = stage.getBoundingClientRect();
  const travelDistance = Math.max(
    viewportHeight * 0.78,
    stageRect.height * 0.94,
  );
  const progress = clamp(
    (viewportHeight * 0.82 - stageRect.top) / travelDistance,
  );
  const activeConditionIndex = progress >= 0.24 ? 1 : 0;
  const switchThresholds = [0.42, 0.61, 0.8];

  conditionToggle.style.setProperty(
    "--condition-index",
    String(activeConditionIndex),
  );
  conditions.forEach((condition, index) => {
    condition.classList.toggle("is-active", index === activeConditionIndex);
  });
  switches.forEach((filterSwitch, index) => {
    const isOn = progress >= (switchThresholds[index] ?? 0.8);
    filterSwitch.classList.toggle("is-on", isOn);
    filterSwitch
      .closest(".digital-filter-row")
      ?.classList.toggle("is-filter-active", isOn);
  });
}

function updateInventoryFlowLight(viewportHeight) {
  const inventory = document.querySelector(".live-inventory");
  const heading = inventory?.querySelector(".inventory-heading");
  const grid = document.querySelector(".vehicle-grid");
  const target = document.querySelector(".about-intro-image");
  const source = inventoryRouteSource();
  if (
    !(inventory instanceof HTMLElement) ||
    !(heading instanceof HTMLElement) ||
    !(grid instanceof HTMLElement) ||
    !(source instanceof HTMLElement) ||
    !elementHasLayout(heading) ||
    !elementHasLayout(grid) ||
    !elementHasLayout(source) ||
    !elementHasLayout(target)
  ) {
    return null;
  }

  const headingRect = heading.getBoundingClientRect();
  const gridRect = grid.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const headingTop = headingRect.top + window.scrollY;
  const targetTop = targetRect.top + window.scrollY;
  const travelStart = headingTop - viewportHeight * 0.7;
  const travelEnd = targetTop - viewportHeight * 0.24;
  const masterRaw =
    (window.scrollY - travelStart) / Math.max(1, travelEnd - travelStart);
  const topRaw = masterRaw / 0.23;
  const top = clamp(topRaw);
  const verticalRaw = (masterRaw - 0.23) / 0.39;
  const vertical = clamp(verticalRaw);
  const bottomRaw = (masterRaw - 0.62) / 0.14;
  const bottom = clamp(bottomRaw);
  const connectorRaw = (masterRaw - 0.76) / 0.24;
  const connector = clamp(connectorRaw);

  const topEnvelope = stagedLightEnvelope(topRaw, top);
  const verticalEnvelope = stagedLightEnvelope(verticalRaw, vertical);
  const bottomEnvelope = stagedLightEnvelope(bottomRaw, bottom);
  const sourceX =
    ((sourceRect.left + sourceRect.width * 0.5 - gridRect.left) /
      gridRect.width) *
    100;
  const sourceRightX =
    ((sourceRect.right - gridRect.left) / gridRect.width) * 100;
  const bottomX = sourceRightX + (sourceX - sourceRightX) * bottom;

  inventory.style.setProperty(
    "--inventory-top-flow-x",
    `${horizontalLightPosition(top)}%`,
  );
  inventory.style.setProperty(
    "--inventory-bottom-flow-x",
    `${bottomX.toFixed(3)}%`,
  );
  inventory.style.setProperty(
    "--inventory-flow-y",
    `${-8 + vertical * 116}%`,
  );
  inventory.style.setProperty(
    "--inventory-top-alpha",
    (topEnvelope * 0.9).toFixed(3),
  );
  inventory.style.setProperty(
    "--inventory-top-mid-alpha",
    (topEnvelope * 0.56).toFixed(3),
  );
  inventory.style.setProperty(
    "--inventory-bottom-alpha",
    (bottomEnvelope * 0.9).toFixed(3),
  );
  inventory.style.setProperty(
    "--inventory-bottom-mid-alpha",
    (bottomEnvelope * 0.56).toFixed(3),
  );
  inventory.style.setProperty(
    "--inventory-vertical-core-alpha",
    (verticalEnvelope * 0.86).toFixed(3),
  );
  inventory.style.setProperty(
    "--inventory-vertical-mid-alpha",
    (verticalEnvelope * 0.42).toFixed(3),
  );

  return {
    rawProgress: connectorRaw,
    progress: connector,
  };
}

function updatePageRouteLights() {
  if (!(mainContent instanceof HTMLElement)) return;

  const mainRect = mainContent.getBoundingClientRect();
  const mainTop = mainRect.top + window.scrollY;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const purchaseMapFlow = updatePurchaseStepFlow(viewportHeight);
  if (!pageRouteMetrics.size) return;
  const inventoryFlow = updateInventoryFlowLight(viewportHeight);
  const reasonsLocationFlows =
    updateReasonsLocationFlowLight(viewportHeight);

  pageRouteMetrics.forEach((metric, key) => {
    const group = pageRouteGroups.get(key);
    if (!(group instanceof SVGGElement)) return;

    const routeTop = mainTop + metric.top;
    const routeBottom = mainTop + metric.bottom;
    const travelStart =
      routeTop - viewportHeight * PAGE_ROUTE_ENTRY_VIEWPORT_RATIO;
    const travelEnd =
      routeBottom - viewportHeight * PAGE_ROUTE_HANDOFF_VIEWPORT_RATIO;
    const defaultRawProgress =
      (window.scrollY - travelStart) / Math.max(1, travelEnd - travelStart);
    let controlledFlow =
      key === "inventory-about"
        ? inventoryFlow
        : key === "proximity-map"
          ? reasonsLocationFlows?.outgoingFlow
          : key === "purchase-map"
            ? purchaseMapFlow
            : null;
    if (
      key === "stores-phone" &&
      Number.isFinite(reasonsLocationFlows?.incomingEndScroll)
    ) {
      const incomingRaw =
        (window.scrollY - travelStart) /
        Math.max(
          1,
          reasonsLocationFlows.incomingEndScroll - travelStart,
        );
      controlledFlow = {
        rawProgress: incomingRaw,
        progress: clamp(incomingRaw),
      };
    }
    const rawProgress = controlledFlow
      ? controlledFlow.rawProgress
      : defaultRawProgress;
    const progress = controlledFlow
      ? controlledFlow.progress
      : clamp(rawProgress);
    const envelope = pageRouteLightEnvelope(rawProgress, progress);
    const revealTarget = pageRouteRevealTargets.get(key);
    if (
      revealTarget instanceof HTMLElement &&
      rawProgress >= 0.88 &&
      !revealTarget.classList.contains("is-visible")
    ) {
      revealTarget.classList.add("is-visible", "is-route-hit");
      keepPageRoutesAttached();
    }

    const light = group.querySelector(".page-route-light");
    const gradient = pageRouteGradients.get(key);
    if (!(light instanceof SVGPathElement) || !(gradient instanceof SVGElement)) {
      return;
    }

    const routeLength = light.getTotalLength();
    if (!routeLength) return;
    const lightPosition = light.getPointAtLength(routeLength * progress);
    const lightRadius = Math.min(150, Math.max(64, routeLength * 0.32));
    const coreStop = gradient.querySelector(".page-route-stop-core");
    const midStop = gradient.querySelector(".page-route-stop-mid");

    gradient.setAttribute("cx", lightPosition.x.toFixed(2));
    gradient.setAttribute("cy", lightPosition.y.toFixed(2));
    gradient.setAttribute("r", lightRadius.toFixed(2));
    coreStop?.setAttribute("stop-opacity", (envelope * 0.9).toFixed(3));
    midStop?.setAttribute("stop-opacity", (envelope * 0.56).toFixed(3));
  });
}

function layoutPageRoutes() {
  pageRouteLayoutFrame = undefined;
  if (
    !(mainContent instanceof HTMLElement) ||
    !(pageRouteLayer instanceof SVGSVGElement)
  ) {
    return;
  }

  const compactPageRoutes = mobileConnectorBreakpoint.matches;
  if (compactPageRoutes) {
    pageRouteRevealTargets.forEach((target) => {
      target.classList.add("is-visible");
    });
  }

  const mainRect = mainContent.getBoundingClientRect();
  const width = Math.max(1, mainContent.clientWidth);
  const height = Math.max(1, mainContent.scrollHeight);
  pageRouteLayer.setAttribute("width", String(width));
  pageRouteLayer.setAttribute("height", String(height));
  pageRouteLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
  pageRouteLayer.style.height = `${height}px`;

  const vehicleSource = inventoryRouteSource();
  const vehicleGrid = document.querySelector(".vehicle-grid");
  const parcImage = document.querySelector(".about-intro-image");
  if (
    !compactPageRoutes &&
    elementHasLayout(vehicleSource) &&
    elementHasLayout(vehicleGrid) &&
    elementHasLayout(parcImage)
  ) {
    const sourceAnchor = routeAnchor(vehicleSource, mainRect, 0.5, 1);
    const gridAnchor = routeAnchor(vehicleGrid, mainRect, 0.5, 1);
    const start = { x: sourceAnchor.x, y: gridAnchor.y };
    const end = routeAnchor(parcImage, mainRect, 0.5, 0);
    setPageRoute(
      "inventory-about",
      directRoutePoints(start, end, 0.48),
      window.innerWidth <= 680 ? 26 : 42,
    );
    pageRouteResizeObserver?.observe(vehicleSource);
    pageRouteResizeObserver?.observe(vehicleGrid);
    pageRouteResizeObserver?.observe(parcImage);
  } else {
    hidePageRoute("inventory-about");
  }

  const storeTarget = document.querySelector(".seller-store-two");
  if (
    !compactPageRoutes &&
    elementHasLayout(parcImage) &&
    elementHasLayout(storeTarget)
  ) {
    const start = routeAnchor(parcImage, mainRect, 0.5, 1);
    const end = routeAnchor(storeTarget, mainRect, 0.5, 0.055);
    const points =
      window.innerWidth <= 680
        ? edgeDetourRoutePoints(
            start,
            end,
            innerRouteLane(start, end, mainRect, 76),
          )
        : directRoutePoints(start, end, 0.5);
    setPageRoute(
      "about-stores",
      points,
      window.innerWidth <= 680 ? 24 : 42,
    );
    pageRouteResizeObserver?.observe(storeTarget);
  } else {
    hidePageRoute("about-stores");
  }

  const phoneTarget = document.querySelector(".digital-phone");
  if (
    !compactPageRoutes &&
    window.innerWidth > 900 &&
    elementHasLayout(storeTarget) &&
    elementHasLayout(phoneTarget) &&
    elementHasLayout(reasonsSection)
  ) {
    // Start inside the opaque lower portion of the transparent store artwork.
    // With the artwork layered above the route, the line emerges exactly from
    // the visible building base instead of from the image canvas boundary.
    const start = routeAnchor(storeTarget, mainRect, 0.5, 0.9);
    const phoneTop = routeAnchor(phoneTarget, mainRect, 0.5, 0);
    const phoneBottom = routeAnchor(phoneTarget, mainRect, 0.5, 1);
    const dividerTop = routeAnchor(reasonsSection, mainRect, 0, 0);
    const dividerEnd = {
      x: phoneBottom.x,
      y: dividerTop.y,
    };
    const dividerRight = routeAnchor(reasonsSection, mainRect, 1, 0);
    const points = directRoutePoints(start, phoneTop, 0.54);
    points.push(phoneBottom, dividerEnd, dividerRight);
    setPageRoute(
      "stores-phone",
      points,
      42,
    );
    pageRouteResizeObserver?.observe(phoneTarget);
    pageRouteResizeObserver?.observe(reasonsSection);
  } else {
    hidePageRoute("stores-phone");
  }

  const proximitySource = document.querySelector(
    '[data-route-source="proximity-map"]',
  );
  const mapTarget = document.querySelector(".map-frame");
  const purchaseProcessSplitsProximityRoute =
    purchaseProcessSection instanceof HTMLElement &&
    proximitySource instanceof Element &&
    mapTarget instanceof Element &&
    Boolean(
      proximitySource.compareDocumentPosition(purchaseProcessSection) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ) &&
    Boolean(
      purchaseProcessSection.compareDocumentPosition(mapTarget) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    );
  if (
    !compactPageRoutes &&
    !purchaseProcessSplitsProximityRoute &&
    elementHasLayout(proximitySource) &&
    elementHasLayout(mapTarget)
  ) {
    const start = routeAnchor(proximitySource, mainRect, 0.5, 1);
    const end = routeAnchor(mapTarget, mainRect, 0.5, 0);
    const points =
      window.innerWidth <= 900
        ? edgeDetourRoutePoints(
            start,
            end,
            innerRouteLane(
              start,
              end,
              mainRect,
              window.innerWidth <= 680 ? 72 : 86,
            ),
          )
        : directRoutePoints(start, end, 0.5);
    setPageRoute(
      "proximity-map",
      points,
      window.innerWidth <= 900 ? 26 : 42,
    );
    pageRouteResizeObserver?.observe(proximitySource);
    pageRouteResizeObserver?.observe(mapTarget);
  } else {
    hidePageRoute("proximity-map");
  }

  const lastPurchaseStep = purchaseProcessSection?.querySelector(
    ".purchase-step:last-child",
  );
  if (elementHasLayout(lastPurchaseStep) && elementHasLayout(mapTarget)) {
    const start = routeAnchor(lastPurchaseStep, mainRect, 0.5, 1);
    const end = routeAnchor(mapTarget, mainRect, 0.5, 0);
    setPageRoute(
      "purchase-map",
      directRoutePoints(start, end, window.innerWidth <= 900 ? 0.36 : 0.48),
      window.innerWidth <= 900 ? 26 : 42,
    );
    pageRouteResizeObserver?.observe(lastPurchaseStep);
    pageRouteResizeObserver?.observe(mapTarget);
  } else {
    hidePageRoute("purchase-map");
  }

  pageRouteLayer.classList.add("is-ready");
  updatePageRouteLights();
}

function requestPageRouteLayout() {
  if (pageRouteLayoutFrame) return;
  pageRouteLayoutFrame = window.requestAnimationFrame(layoutPageRoutes);
}

function keepPageRoutesAttached(duration = 1100) {
  pageRouteMotionDeadline = Math.max(
    pageRouteMotionDeadline,
    performance.now() + duration,
  );
  if (pageRouteMotionFrame) return;

  const followMotion = () => {
    pageRouteMotionFrame = undefined;
    requestPageRouteLayout();
    if (performance.now() < pageRouteMotionDeadline) {
      pageRouteMotionFrame = window.requestAnimationFrame(followMotion);
    }
  };

  pageRouteMotionFrame = window.requestAnimationFrame(followMotion);
}

if (
  mainContent instanceof HTMLElement &&
  pageRouteLayer instanceof SVGSVGElement
) {
  if ("ResizeObserver" in window) {
    pageRouteResizeObserver = new ResizeObserver(requestPageRouteLayout);
    pageRouteResizeObserver.observe(mainContent);
  }

  const inventoryGrid = document.querySelector("[data-vehicle-grid]");
  if (inventoryGrid && "MutationObserver" in window) {
    new MutationObserver(requestPageRouteLayout).observe(inventoryGrid, {
      childList: true,
      subtree: true,
    });
  }

  mainContent.addEventListener("load", requestPageRouteLayout, true);
  mainContent.addEventListener(
    "transitionrun",
    (event) => {
      if (
        event.propertyName === "transform" &&
        event.target instanceof Element &&
        event.target.matches(
          ".about-intro, .about-intro-image, .seller-district, " +
            ".seller-district-art, .seller-store, .digital-stage, .digital-phone, " +
            ".purchase-step, .map-frame",
        )
      ) {
        keepPageRoutesAttached();
      }
    },
    true,
  );
  mainContent.addEventListener("transitionend", requestPageRouteLayout, true);
  window.addEventListener("resize", requestPageRouteLayout, { passive: true });
  window.addEventListener("load", requestPageRouteLayout, { once: true });
  document.fonts?.ready.then(requestPageRouteLayout);
  requestPageRouteLayout();
}

let dividerScrollFrame;

function updateDividerScrollLight() {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  updateHeroDirectoryFlowLight(viewportHeight);
  updateDigitalFilterStory(viewportHeight);

  dividerGlowAreas.forEach((area) => {
    const rect = area.getBoundingClientRect();
    const progress = Math.min(
      1,
      Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
    );
    const isNearViewport = rect.bottom > -120 && rect.top < viewportHeight + 120;
    const sweep = horizontalLightPosition(progress);
    const travelCurve = Math.pow(
      Math.max(0, Math.sin(progress * Math.PI)),
      0.46,
    );
    const strength = isNearViewport ? 0.22 + travelCurve * 0.78 : 0;

    area.style.setProperty("--scroll-glow-x", `${sweep}%`);
    area.style.setProperty("--scroll-glow-y", `${progress * 100}%`);
    area.style.setProperty("--scroll-route-offset", (1 - progress).toFixed(3));
    area.style.setProperty("--scroll-glow-strength", strength.toFixed(3));
    area.style.setProperty("--scroll-glow-core-alpha", strength.toFixed(3));
    area.style.setProperty("--scroll-glow-mid-alpha", (strength * 0.76).toFixed(3));
    area.style.setProperty("--scroll-glow-low-alpha", (strength * 0.32).toFixed(3));
    area.style.setProperty("--scroll-glow-border-alpha", (0.22 + strength * 0.6).toFixed(3));
    area.style.setProperty("--scroll-glow-shadow-alpha", (strength * 0.58).toFixed(3));
    area.style.setProperty("--scroll-glow-blur", `${3 + strength * 9}px`);
    area.classList.toggle("is-scroll-lit", isNearViewport);
  });

  updatePageRouteLights();
  dividerScrollFrame = undefined;
}

function requestDividerScrollLight() {
  if (dividerScrollFrame) return;
  dividerScrollFrame = window.requestAnimationFrame(updateDividerScrollLight);
}

if (!prefersReducedMotion.matches) {
  window.addEventListener("scroll", requestDividerScrollLight, { passive: true });
  window.addEventListener("resize", requestDividerScrollLight, { passive: true });
  requestDividerScrollLight();
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const whatsappButton = document.querySelector("[data-whatsapp-contact]");

whatsappButton?.addEventListener("click", () => {
  const contact = String.fromCharCode(
    50, 50, 57, 48, 49, 57, 55, 52, 52, 50, 52, 52, 56,
  );
  const url = new URL(`https://wa.me/${contact}`);
  url.searchParams.set(
    "text",
    "Bonjour, je souhaite obtenir des informations sur le Parc Zone FIFA.",
  );
  window.open(url.href, "_blank", "noopener,noreferrer");
  if (mobileBreakpoint.matches) setMenuState(false);
});

function configureReveal(element, effect = "up", delay = 0) {
  if (!(element instanceof HTMLElement)) return;
  element.setAttribute("data-reveal", "");
  element.dataset.revealEffect = effect;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
}

const revealPresets = [
  {
    selector:
      ".hero-copy, .inventory-heading, .about-intro-copy, .seller-district-copy, " +
      ".digital-experience-copy, .location-copy",
    effect: "left",
  },
  {
    selector:
      ".hero-directory, .about-intro-image, .seller-district-art, .digital-stage, " +
      ".online-photo-card, .map-frame",
    effect: "visual",
  },
  {
    selector:
      ".benefit-grid article, .purchase-step, " +
      ".vehicle-card:not(.vehicle-card-skeleton)",
    effect: "card",
  },
  {
    selector:
      ".section-heading, .final-cta-inner, .footer-brand, .footer-links, .footer-bottom",
    effect: "up",
  },
];

revealPresets.forEach(({ selector, effect }) => {
  document.querySelectorAll(selector).forEach((element) => configureReveal(element, effect));
});

[
  ".hero-directory-list li",
  ".benefit-grid article",
  ".purchase-step",
  ".footer-links",
].forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    const delay = (index % 6) * 85;
    element.style.setProperty("--reveal-delay", `${delay}ms`);
    element.style.setProperty("--child-delay", `${delay}ms`);
  });
});

let revealObserver;

function observeReveal(element) {
  if (!(element instanceof Element)) return;
  if (prefersReducedMotion.matches || !revealObserver) {
    element.classList.add("is-visible");
    return;
  }
  revealObserver.observe(element);
}

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );
}

document.querySelectorAll("[data-reveal]").forEach((element) => {
  const isRouteControlled = element.hasAttribute("data-route-reveal");
  if (
    isRouteControlled &&
    !prefersReducedMotion.matches &&
    !mobileConnectorBreakpoint.matches
  ) {
    return;
  }
  observeReveal(element);
});

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-section-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -18% 0px", threshold: 0.06 },
  );

  document.querySelectorAll("main > section").forEach((section) => {
    sectionObserver.observe(section);
  });
} else {
  document.querySelectorAll("main > section").forEach((section) => {
    section.classList.add("is-section-visible");
  });
}

// IntersectionObserver can wait for the first user-driven scroll after a hard
// refresh or a browser scroll-position restore. Prime the hero and anything
// already on screen so the moving pieces are present as soon as the page paints.
let initialMotionSyncFrame;

function isInViewport(element) {
  if (!(element instanceof Element)) return false;

  const rect = element.getBoundingClientRect();
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.right > 0 &&
    rect.left < viewportWidth &&
    rect.bottom > 0 &&
    rect.top < viewportHeight
  );
}

function syncInitialMotionState() {
  document
    .querySelectorAll("[data-reveal]:not(.is-visible)")
    .forEach((element) => {
      // The moving directory sits just below the mobile fold. Start every hero
      // reveal on load so it is already visible and moving when reached.
      if (!element.closest(".hero") && !isInViewport(element)) return;

      element.classList.add("is-visible");
      revealObserver?.unobserve(element);
    });

  document
    .querySelectorAll("main > section:not(.is-section-visible)")
    .forEach((section) => {
      if (isInViewport(section)) section.classList.add("is-section-visible");
    });

  requestDividerScrollLight();
  requestPageRouteLayout();
}

function requestInitialMotionSync() {
  if (initialMotionSyncFrame) return;

  // Two frames guarantee the hidden reveal state has painted before the
  // visible state is applied, keeping the entrance transition on refresh.
  initialMotionSyncFrame = window.requestAnimationFrame(() => {
    initialMotionSyncFrame = window.requestAnimationFrame(() => {
      initialMotionSyncFrame = undefined;
      syncInitialMotionState();
    });
  });
}

requestInitialMotionSync();
window.addEventListener("load", requestInitialMotionSync, { once: true });
window.addEventListener("pageshow", requestInitialMotionSync);
document.fonts?.ready.then(requestInitialMotionSync);

const AFRICACARS_ORIGIN = "https://africacars.bj";
const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const INVENTORY_CANDIDATE_LIMIT = 12;
const INVENTORY_DISPLAY_LIMIT = 8;
const PUBLIC_INVENTORY_ENDPOINT =
  `${AFRICACARS_ORIGIN}/zone-fifa-inventory?limit=${INVENTORY_CANDIDATE_LIMIT}`;
const INVENTORY_ENDPOINTS = isLocalPreview
  ? [
      `http://localhost:4000/zone-fifa-inventory?limit=${INVENTORY_CANDIDATE_LIMIT}&source=production`,
      PUBLIC_INVENTORY_ENDPOINT,
    ]
  : [PUBLIC_INVENTORY_ENDPOINT];
const LOCAL_INVENTORY_TIMEOUT_MS = 3000;
const PUBLIC_INVENTORY_TIMEOUT_MS = 10000;
const inventoryGrid = document.querySelector("[data-vehicle-grid]");
const inventoryError = document.querySelector("[data-inventory-error]");
const inventoryRetry = document.querySelector("[data-inventory-retry]");
const mobileInventoryQuery = window.matchMedia("(max-width: 680px)");
const MOBILE_INVENTORY_LIMIT = 4;

let inventoryController;
let inventoryVehicles = [];

function safeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : null;
}

function safeAfricaCarsUrl(value, fallbackPath = "/cars-for-sale/cotonou") {
  try {
    const url = new URL(String(value || fallbackPath), AFRICACARS_ORIGIN);
    if (url.protocol !== "https:" || url.hostname !== "africacars.bj") {
      return `${AFRICACARS_ORIGIN}${fallbackPath}`;
    }
    return url.href;
  } catch {
    return `${AFRICACARS_ORIGIN}${fallbackPath}`;
  }
}

function safeImageUrl(value) {
  try {
    const url = new URL(String(value || ""));
    const isTrustedHost =
      url.hostname === "africacars.bj" ||
      url.hostname.endsWith(".digitaloceanspaces.com");
    return url.protocol === "https:" && isTrustedHost ? url.href : "";
  } catch {
    return "";
  }
}

function safeImageSrcset(value) {
  if (!value) return "";

  return String(value)
    .split(",")
    .map((candidate) => {
      const match = candidate.trim().match(/^(\S+)(?:\s+(\d+)w)?$/);
      if (!match) return "";
      const imageUrl = safeImageUrl(match[1]);
      return imageUrl ? `${imageUrl}${match[2] ? ` ${match[2]}w` : ""}` : "";
    })
    .filter(Boolean)
    .join(", ");
}

function vehicleImageUrl(vehicle) {
  const rawImage =
    typeof vehicle?.image === "object" ? vehicle.image?.src : vehicle?.image;
  return safeImageUrl(rawImage || vehicle?.imageUrl);
}

function isGenuineInventoryVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object") return false;

  const id = Number(vehicle.id);
  if (!Number.isSafeInteger(id) || id <= 0 || !vehicleImageUrl(vehicle)) {
    return false;
  }

  try {
    const href = new URL(String(vehicle.href || vehicle.url || ""));
    const listingSlug = href.pathname.match(/^\/cars\/([^/]+)\/?$/)?.[1] || "";
    return (
      href.protocol === "https:" &&
      href.hostname === "africacars.bj" &&
      (listingSlug === String(id) || listingSlug.startsWith(`${id}-`))
    );
  } catch {
    return false;
  }
}

function displayName(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";

  const acronyms = new Map([
    ["bmw", "BMW"],
    ["gmc", "GMC"],
    ["mg", "MG"],
    ["suv", "SUV"],
    ["4x4", "4x4"],
  ]);

  return normalized
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLocaleLowerCase("fr");
      if (acronyms.has(lower)) return acronyms.get(lower);
      return lower
        .split("-")
        .map((part) => part ? `${part.charAt(0).toLocaleUpperCase("fr")}${part.slice(1)}` : "")
        .join("-");
    })
    .join(" ");
}

function vehicleTitle(vehicle) {
  const composed = [
    safeInteger(vehicle?.year),
    displayName(vehicle?.make),
    displayName(vehicle?.model),
  ]
    .filter((part) => part !== null && part !== "")
    .join(" ");
  if (composed) return composed;

  const provided = displayName(vehicle?.title);
  return (
    provided ||
    localizedText("Véhicule du Parc Zone FIFA", "Parc Zone FIFA vehicle")
  );
}

function positivePrice(value) {
  const price = Number(value);
  return Number.isFinite(price) && price > 0 ? price : null;
}

function formatPrice(value) {
  const price = positivePrice(value);
  if (price === null) {
    return localizedText("Prix sur contact", "Contact for price");
  }
  const locale = currentLanguage() === "en" ? "en-GB" : "fr-FR";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(price)} F CFA`;
}

function formatTransmission(value) {
  const normalized = String(value || "").trim().toLocaleLowerCase("fr");
  if (["auto", "automatic", "automatique"].includes(normalized)) {
    return localizedText("Automatique", "Automatic");
  }
  if (["manual", "manuelle"].includes(normalized)) {
    return localizedText("Manuelle", "Manual");
  }
  return "";
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text != null) element.textContent = text;
  return element;
}

function createVehicleCard(vehicle) {
  const title = vehicleTitle(vehicle);
  const card = createElement("a", "vehicle-card");
  card.href = safeAfricaCarsUrl(
    vehicle?.href || vehicle?.url,
    `/cars/${encodeURIComponent(String(vehicle?.id || ""))}`,
  );
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute(
    "aria-label",
    localizedText(
      `${title} — voir sur AfricaCars`,
      `${title} — view on AfricaCars`,
    ),
  );

  const media = createElement("span", "vehicle-card-media");
  const image = document.createElement("img");
  const rawSrcset =
    typeof vehicle?.image === "object"
      ? vehicle.image?.srcset
      : vehicle?.imageSrcset || vehicle?.srcset;
  image.src = vehicleImageUrl(vehicle);
  const srcset = safeImageSrcset(rawSrcset);
  if (srcset) image.srcset = srcset;
  image.sizes = "(max-width: 680px) 50vw, (max-width: 900px) 50vw, (max-width: 1180px) 33vw, 320px";
  image.alt = localizedText(`Photo de ${title}`, `Photo of ${title}`);
  image.width = 600;
  image.height = 338;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener(
    "error",
    () => {
      image.removeAttribute("srcset");
      image.remove();
      media.classList.add("vehicle-card-media-unavailable");
      media.append(
        createElement(
          "span",
          "vehicle-card-photo-unavailable",
          localizedText("Photo indisponible", "Photo unavailable"),
        ),
      );
    },
    { once: true },
  );
  media.append(image);

  const type = displayName(vehicle?.type);
  if (type) media.append(createElement("span", "vehicle-card-badge", type));

  const copy = createElement("span", "vehicle-card-copy");
  const titleGroup = createElement("span", "vehicle-card-title");
  titleGroup.append(createElement("h3", "", title));

  const transmission = formatTransmission(vehicle?.transmission);
  if (transmission) {
    const meta = createElement("span", "vehicle-card-meta");
    meta.append(createElement("span", "", transmission));
    titleGroup.append(meta);
  }

  const footer = createElement("span", "vehicle-card-footer");
  const trim = String(vehicle?.trim || "").trim();
  if (trim) {
    footer.append(
      createElement(
        "span",
        "vehicle-card-trim",
        localizedText(
          `Version : ${displayName(trim)}`,
          `Trim: ${displayName(trim)}`,
        ),
      ),
    );
  }
  footer.append(createElement("strong", "vehicle-card-price", formatPrice(vehicle?.price)));

  copy.append(titleGroup, footer);
  card.append(media, copy);
  return card;
}

function renderInventorySkeletons() {
  if (!inventoryGrid) return;
  const cards = Array.from({ length: 4 }, () => {
    const card = createElement("article", "vehicle-card vehicle-card-skeleton");
    card.setAttribute("aria-hidden", "true");
    card.append(createElement("span", "vehicle-card-media"));
    const copy = createElement("span", "vehicle-card-copy");
    copy.append(createElement("span"), createElement("span"), createElement("span"));
    card.append(copy);
    return card;
  });
  inventoryGrid.replaceChildren(...cards);
}

function normalizeInventoryPayload(payload) {
  const rawVehicles = Array.isArray(payload?.vehicles)
    ? payload.vehicles
    : Array.isArray(payload?.items)
      ? payload.items
      : [];
  const genuineVehicles = rawVehicles.filter(isGenuineInventoryVehicle);
  const vehicles = [
    ...genuineVehicles.filter((vehicle) => positivePrice(vehicle?.price) !== null),
    ...genuineVehicles.filter((vehicle) => positivePrice(vehicle?.price) === null),
  ].slice(0, INVENTORY_DISPLAY_LIMIT);
  return { vehicles };
}

function renderInventoryVehicles(vehicles) {
  if (!inventoryGrid) return;

  const visibleVehicles = mobileInventoryQuery.matches
    ? vehicles.slice(0, MOBILE_INVENTORY_LIMIT)
    : vehicles;
  const cards = visibleVehicles.map((vehicle, index) => {
    const card = createVehicleCard(vehicle);
    configureReveal(card, "card", (index % 4) * 90);
    return card;
  });
  inventoryGrid.replaceChildren(...cards);
  cards.forEach(observeReveal);
}

async function fetchInventoryPayload(controller) {
  let lastError;

  for (const [index, endpoint] of INVENTORY_ENDPOINTS.entries()) {
    if (controller.signal.aborted) {
      throw new DOMException("Inventory request aborted", "AbortError");
    }

    const attemptController = new AbortController();
    const abortAttempt = () => attemptController.abort();
    const timeoutMs =
      isLocalPreview && index === 0
        ? LOCAL_INVENTORY_TIMEOUT_MS
        : PUBLIC_INVENTORY_TIMEOUT_MS;
    const timeoutId = window.setTimeout(() => attemptController.abort(), timeoutMs);
    controller.signal.addEventListener("abort", abortAttempt, { once: true });

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "omit",
        mode: "cors",
        signal: attemptController.signal,
      });

      if (!response.ok) {
        throw new Error(`Inventory request failed (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw error;
      lastError = error;
    } finally {
      window.clearTimeout(timeoutId);
      controller.signal.removeEventListener("abort", abortAttempt);
    }
  }

  throw lastError || new Error("Inventory request failed");
}

async function loadInventory() {
  if (!inventoryGrid) return;

  inventoryController?.abort();
  const controller = new AbortController();
  inventoryController = controller;

  inventoryError?.setAttribute("hidden", "");
  inventoryGrid.hidden = false;
  inventoryGrid.setAttribute("aria-busy", "true");
  renderInventorySkeletons();

  try {
    const { vehicles } = normalizeInventoryPayload(
      await fetchInventoryPayload(controller),
    );
    inventoryVehicles = vehicles;

    if (!vehicles.length) {
      const emptyState = createElement("div", "inventory-error");
      const copy = document.createElement("div");
      copy.append(
        createElement(
          "strong",
          "",
          localizedText(
            "Aucun véhicule public pour le moment.",
            "No public vehicles at the moment.",
          ),
        ),
        createElement(
          "p",
          "",
          localizedText(
            "Les annonces avec leurs photos réelles apparaîtront automatiquement ici.",
            "Listings with their genuine photos will automatically appear here.",
          ),
        ),
      );
      emptyState.append(copy);
      inventoryGrid.replaceChildren(emptyState);
      return;
    }

    renderInventoryVehicles(vehicles);
  } catch (error) {
    if (inventoryController !== controller) return;

    if (error?.name === "AbortError") {
      console.warn("Le chargement de l’inventaire AfricaCars a expiré.");
    } else {
      console.warn("Impossible de charger l’inventaire AfricaCars.", error);
    }

    inventoryGrid.hidden = true;
    inventoryError?.removeAttribute("hidden");
  } finally {
    if (inventoryController === controller) {
      inventoryGrid.setAttribute("aria-busy", "false");
    }
  }
}

inventoryRetry?.addEventListener("click", loadInventory);
mobileInventoryQuery.addEventListener("change", () => {
  if (inventoryVehicles.length) renderInventoryVehicles(inventoryVehicles);
});
window.ZoneFifaI18n?.subscribe(() => {
  if (inventoryVehicles.length) renderInventoryVehicles(inventoryVehicles);
});
loadInventory();
