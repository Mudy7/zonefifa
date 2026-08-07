(() => {
  "use strict";

  const COOKIE_NAME = "zone_fifa_lang";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
  const SUPPORTED_LOCALES = new Set(["fr", "en"]);
  const TRANSLATABLE_ATTRIBUTES = ["aria-label", "title", "alt", "placeholder"];

  const translations = [
    ["Aller au contenu principal", "Skip to main content"],
    ["Parc Zone FIFA — accueil", "Parc Zone FIFA — home"],
    ["Parc Zone FIFA — retour en haut", "Parc Zone FIFA — back to top"],
    ["Logo du Parc Zone FIFA", "Parc Zone FIFA logo"],
    ["Ouvrir le menu", "Open menu"],
    ["Fermer le menu", "Close menu"],
    ["Navigation principale", "Main navigation"],
    [
      "Choisir la langue, langue actuelle : Français",
      "Choose language, current language: French",
    ],
    [
      "Choisir la langue, langue actuelle : Anglais",
      "Choose language, current language: English",
    ],
    ["Accueil", "Home"],
    ["Le parc", "The park"],
    ["Véhicules", "Vehicles"],
    ["Localisation", "Location"],
    ["Contacter le Parc Zone FIFA sur WhatsApp", "Contact Parc Zone FIFA on WhatsApp"],
    ["Voir les voitures", "View vehicles"],
    ["Localiser", "Locate"],
    ["sur AfricaCars, s’ouvre dans un nouvel onglet", "on AfricaCars, opens in a new tab"],
    [", s’ouvre dans un nouvel onglet", ", opens in a new tab"],
    ["sur Google Maps, s’ouvre dans un nouvel onglet", "on Google Maps, opens in a new tab"],
    [
      "Vue aérienne des nombreuses rangées de véhicules du Parc Zone FIFA au bord de l’océan",
      "Aerial view of the many rows of vehicles at Parc Zone FIFA beside the ocean",
    ],
    [
      "Le centre de véhicules d’occasion au Bénin.",
      "Benin’s destination for pre-owned vehicles.",
    ],
    [
      "Le Parc Zone FIFA, votre destination automobile de référence.",
      "Parc Zone FIFA, your trusted automotive destination.",
    ],
    ["Voir les voitures en ligne", "View vehicles online"],
    ["Localiser le parc", "Find the park"],
    ["Aperçu du parc", "Park overview"],
    ["Services sur place", "On-site services"],
    ["Véhicules variés", "A wide vehicle selection"],
    ["Achat sur place", "Buy on site"],
    ["Fiches avec QR code", "Vehicle pages with QR codes"],
    ["Plusieurs vendeurs réunis", "Multiple sellers in one place"],
    ["Comparaison facile", "Easy comparison"],
    ["Qualité et confiance", "Quality and trust"],
    ["Stock accessible en ligne", "Inventory available online"],
    ["Explorez nos véhicules", "Explore our vehicles"],
    [
      "Retrouvez en ligne notre sélection de véhicules du Parc Zone FIFA.",
      "Browse our Parc Zone FIFA vehicle selection online.",
    ],
    ["Voir tout le stock", "View all inventory"],
    ["Véhicules récents du Parc Zone FIFA", "Recent vehicles from Parc Zone FIFA"],
    ["Le stock en ligne n’a pas pu être chargé.", "The online inventory could not be loaded."],
    [
      "Vous pouvez toujours consulter tous les véhicules directement sur AfricaCars.",
      "You can still browse all vehicles directly on AfricaCars.",
    ],
    ["Réessayer", "Try again"],
    [
      "Activez JavaScript pour afficher les voitures ici, ou",
      "Enable JavaScript to display the vehicles here, or",
    ],
    ["consultez le stock sur AfricaCars", "browse the inventory on AfricaCars"],
    ["Allée centrale bordée de véhicules au Parc Zone FIFA", "Central vehicle-lined lane at Parc Zone FIFA"],
    ["Une destination automobile incontournable", "An essential automotive destination"],
    [
      "Le Parc Zone FIFA réunit dans une même zone des acteurs de la vente automobile et des véhicules destinés aussi bien au marché béninois qu’à l’exportation vers d’autres pays.",
      "Parc Zone FIFA brings together automotive sellers and vehicles for both the Beninese market and export to other countries in one location.",
    ],
    [
      "Miniatures de plusieurs concessions automobiles du parc",
      "Miniatures of several car dealerships in the park",
    ],
    ["Plusieurs vendeurs, un même lieu", "Multiple sellers, one location"],
    [
      "Plusieurs vendeurs proposent des véhicules variés à comparer sur place ou sur AfricaCars.",
      "Multiple sellers offer a varied selection to compare on site or on AfricaCars.",
    ],
    ["Les arrivages proviennent de différents marchés.", "New arrivals come from different markets."],
    ["Explorer les véhicules sur AfricaCars", "Explore vehicles on AfricaCars"],
    ["Catégories de véhicules", "Vehicle categories"],
    ["Berlines", "Sedans"],
    ["SUV & 4x4", "SUVs & 4x4s"],
    ["Pick-up", "Pickups"],
    [
      "Voir les berlines sur AfricaCars, s’ouvre dans un nouvel onglet",
      "View sedans on AfricaCars, opens in a new tab",
    ],
    [
      "Voir les SUV et 4x4 sur AfricaCars, s’ouvre dans un nouvel onglet",
      "View SUVs and 4x4s on AfricaCars, opens in a new tab",
    ],
    [
      "Voir les pick-up sur AfricaCars, s’ouvre dans un nouvel onglet",
      "View pickups on AfricaCars, opens in a new tab",
    ],
    ["Premium", "Premium"],
    [
      "Voir les véhicules premium sur AfricaCars, s’ouvre dans un nouvel onglet",
      "View premium vehicles on AfricaCars, opens in a new tab",
    ],
    ["Économiques", "Affordable"],
    [
      "Voir les voitures économiques sur AfricaCars, s’ouvre dans un nouvel onglet",
      "View affordable vehicles on AfricaCars, opens in a new tab",
    ],
    ["Export", "Export"],
    [
      "Explorer les véhicules destinés à l’export sur AfricaCars, s’ouvre dans un nouvel onglet",
      "Explore export vehicles on AfricaCars, opens in a new tab",
    ],
    ["Voir", "View"],
    ["Comment ça marche", "How it works"],
    ["De la recherche à la route", "From search to the road"],
    [
      "Trouvez en ligne ou sur place, échangez avec le vendeur, puis finalisez les documents adaptés à sa destination.",
      "Find a vehicle online or on site, talk to the seller, then complete the paperwork required for its destination.",
    ],
    ["Trouvez un véhicule", "Find a vehicle"],
    [
      "Parcourez les annonces sur AfricaCars ou découvrez les véhicules exposés au Parc Zone FIFA.",
      "Browse listings on AfricaCars or discover vehicles displayed at Parc Zone FIFA.",
    ],
    ["Rencontrez le vendeur", "Meet the seller"],
    [
      "Rendez-vous au parc, retrouvez le véhicule et échangez directement avec son vendeur.",
      "Visit the park, find the vehicle and speak directly with its seller.",
    ],
    ["Vérifiez avant de choisir", "Check before you choose"],
    [
      "Inspectez le véhicule et vérifiez que son numéro de châssis correspond aux documents remis par le vendeur.",
      "Inspect the vehicle and check that its chassis number matches the documents provided by the seller.",
    ],
    ["Concluez l’achat", "Complete the purchase"],
    [
      "Convenez du prix et récupérez l’acte de vente, la facture d’achat et toutes les pièces remises par le vendeur.",
      "Agree on the price and collect the sale agreement, purchase invoice and all documents provided by the seller.",
    ],
    ["Exportez ou immatriculez", "Export or register"],
    [
      "Pour l’export ou l’immatriculation au Bénin, préparez simplement les documents nécessaires avec le vendeur.",
      "For export or registration in Benin, simply prepare the required documents with the seller.",
    ],
    ["Trouvez, filtrez, scannez.", "Find, filter, scan."],
    [
      "Consultez les voitures du Parc Zone FIFA, affinez votre recherche et ouvrez la fiche d’un véhicule en scannant son QR code sur place.",
      "Browse Parc Zone FIFA vehicles, refine your search and open a vehicle page by scanning its QR code on site.",
    ],
    ["Explorer les voitures", "Explore vehicles"],
    ["Rechercher une voiture", "Search for a vehicle"],
    ["Marque⌄", "Make⌄"],
    ["Prix⌄", "Price⌄"],
    ["Année⌄", "Year⌄"],
    ["Véhicules à vendre", "Vehicles for sale"],
    ["Plus récentes⌄", "Newest⌄"],
    ["Prix sur contact", "Contact for price"],
    ["Automatique", "Automatic"],
    ["Manuelle", "Manual"],
    ["Essence", "Petrol"],
    ["Recherche", "Search"],
    ["Favoris", "Favorites"],
    ["Profil", "Profile"],
    ["Filtrer les voitures", "Filter vehicles"],
    ["État du véhicule", "Vehicle condition"],
    ["Tout", "All"],
    ["Occasion", "Used"],
    ["Neuf", "New"],
    ["Transmission automatique", "Automatic transmission"],
    ["Prix en baisse", "Price reduced"],
    ["Au parc", "At the park"],
    ["Scannez le QR code", "Scan the QR code"],
    ["La page du véhicule s’ouvre immédiatement.", "The vehicle page opens immediately."],
    ["Emplacement du véhicule", "Vehicle location"],
    ["Pourquoi Zone FIFA ?", "Why Zone FIFA?"],
    ["Achat sécurisé", "A secure purchase"],
    [
      "Nous encadrons les étapes essentielles de la transaction pour vous permettre d’acheter en toute sérénité.",
      "We guide you through the key stages of the transaction so you can buy with peace of mind.",
    ],
    ["Des véhicules à examiner sur place", "Vehicles you can inspect on site"],
    [
      "Découvrez les véhicules directement au parc, comparez-les et prenez le temps de vérifier celui qui vous convient.",
      "View vehicles directly at the park, compare them and take the time to inspect the one that suits you.",
    ],
    ["Transparence et confiance", "Transparency and trust"],
    [
      "Accédez à des informations claires pour comparer les véhicules et prendre une décision éclairée.",
      "Get clear information to compare vehicles and make an informed decision.",
    ],
    ["Conseils adaptés à vos besoins", "Guidance tailored to your needs"],
    [
      "Partagez votre budget et vos critères pour être orienté vers les véhicules qui vous correspondent.",
      "Share your budget and preferences to be guided towards vehicles that suit your needs.",
    ],
    ["Accompagnement administratif", "Administrative guidance"],
    [
      "Nous vous orientons dans les démarches et les documents nécessaires pour finaliser votre achat.",
      "We guide you through the procedures and documents needed to complete your purchase.",
    ],
    ["Un parc accessible et sécurisé", "An accessible and secure vehicle park"],
    [
      "Visitez nos véhicules dans un espace organisé à Ekpè–Djèffa, près de Cotonou.",
      "Visit our vehicles in an organized space in Ekpè–Djèffa, near Cotonou.",
    ],
    [
      "Vue panoramique des véhicules au Parc Zone FIFA",
      "Panoramic view of vehicles at Parc Zone FIFA",
    ],
    ["Sur place", "On site"],
    [
      "Comparez plusieurs véhicules en une visite",
      "Compare several vehicles in one visit",
    ],
    ["Large choix de véhicules importés", "Wide selection of imported vehicles"],
    [
      "Différentes origines, marques, carrosseries et configurations.",
      "Different origins, makes, body styles and configurations.",
    ],
    ["Plusieurs vendeurs sur place", "Multiple sellers on site"],
    [
      "Échangez avec différents vendeurs au cours d’une même visite.",
      "Speak with different sellers during a single visit.",
    ],
    ["Comparaison facile", "Easy comparison"],
    [
      "Observez plusieurs modèles et affinez votre choix selon vos besoins.",
      "Compare several models and refine your choice to suit your needs.",
    ],
    ["Achat local ou export", "Local purchase or export"],
    [
      "Recherchez un véhicule pour le Bénin ou pour une autre destination.",
      "Find a vehicle for Benin or another destination.",
    ],
    ["QR codes sur certains véhicules", "QR codes on selected vehicles"],
    [
      "Scannez-les avec votre téléphone pour consulter rapidement leur fiche et leurs détails sur AfricaCars.",
      "Scan them with your phone to quickly view their page and details on AfricaCars.",
    ],
    ["À proximité de Cotonou", "Near Cotonou"],
    ["Le parc se trouve dans le secteur d’Ekpè–Djèffa.", "The park is located in the Ekpè–Djèffa area."],
    ["Retrouvez le Parc Zone FIFA à Ekpè–Djèffa", "Find Parc Zone FIFA in Ekpè–Djèffa"],
    [
      "Le Parc Zone FIFA est situé au PK 13 sur la route de Porto-Novo, à Ekpè (Sèmè-Kpodji), près de Cotonou. Utilisez la carte pour préparer votre trajet.",
      "Parc Zone FIFA is located at PK 13 on the Porto-Novo road in Ekpè (Sèmè-Kpodji), near Cotonou. Use the map to plan your journey.",
    ],
    ["Adresse", "Address"],
    ["PK 13, route de Porto-Novo", "PK 13, Porto-Novo road"],
    ["Zone", "Area"],
    ["Ekpè, Sèmè-Kpodji", "Ekpè, Sèmè-Kpodji"],
    ["Coordonnées", "Coordinates"],
    ["Obtenir l’itinéraire", "Get directions"],
    ["Carte indiquant le Parc Zone FIFA à Ekpè–Djèffa", "Map showing Parc Zone FIFA in Ekpè–Djèffa"],
    ["Votre prochaine voiture vous attend au Parc Zone FIFA", "Your next vehicle awaits at Parc Zone FIFA"],
    [
      "Découvrez les véhicules disponibles en ligne ou préparez votre visite au parc.",
      "Discover available vehicles online or plan your visit to the park.",
    ],
    ["Découvrir les véhicules", "Discover vehicles"],
    [
      "Une zone de vente automobile près de Cotonou, avec des véhicules consultables en ligne sur AfricaCars.",
      "An automotive marketplace near Cotonou, with vehicles available to browse online on AfricaCars.",
    ],
    ["Navigation", "Navigation"],
    ["Liens utiles", "Useful links"],
    ["Visiter AfricaCars.bj", "Visit AfricaCars.bj"],
    ["Ouvrir Google Maps", "Open Google Maps"],
    ["Tous droits réservés.", "All rights reserved."],
    ["Parc Zone FIFA. Tous droits réservés.", "Parc Zone FIFA. All rights reserved."],
    ["Véhicules en ligne via", "Vehicles online via"],
    ["Véhicule du Parc Zone FIFA", "Parc Zone FIFA vehicle"],
    ["Aucun véhicule public pour le moment.", "No public vehicles at the moment."],
    [
      "Les nouvelles annonces apparaîtront automatiquement ici.",
      "New listings will automatically appear here.",
    ],
    ["Choisir la langue", "Choose language"],
    ["Français", "French"],
    ["Anglais", "English"],
  ];

  const normalize = (value) =>
    String(value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const frToEn = new Map();
  const enToFr = new Map();

  for (const [fr, en] of translations) {
    frToEn.set(normalize(fr), en);
    enToFr.set(normalize(en), fr);
  }

  function normalizeLocale(value) {
    const locale = String(value || "").trim().toLowerCase().split(/[-_]/)[0];
    return SUPPORTED_LOCALES.has(locale) ? locale : null;
  }

  function readCookieLocale() {
    const prefix = `${COOKIE_NAME}=`;
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));

    if (!cookie) return null;

    try {
      return normalizeLocale(decodeURIComponent(cookie.slice(prefix.length)));
    } catch {
      return null;
    }
  }

  function persistLocale(locale) {
    document.cookie = [
      `${COOKIE_NAME}=${encodeURIComponent(locale)}`,
      `Max-Age=${COOKIE_MAX_AGE}`,
      "Path=/",
      "SameSite=Lax",
    ].join("; ");
  }

  let locale = readCookieLocale() || "fr";
  const subscribers = new Set();
  let observer = null;
  let applying = false;

  function translateDynamicPhrase(value, destination) {
    const normalized = normalize(value);

    if (destination === "en") {
      let match = normalized.match(/^(.+?) — voir sur AfricaCars$/);
      if (match) return `${match[1]} — view on AfricaCars`;

      match = normalized.match(/^Photo de (.+)$/);
      if (match) return `Photo of ${match[1]}`;

      match = normalized.match(/^Version : (.+)$/);
      if (match) return `Trim: ${match[1]}`;
    } else {
      let match = normalized.match(/^(.+?) — view on AfricaCars$/);
      if (match) return `${match[1]} — voir sur AfricaCars`;

      match = normalized.match(/^Photo of (.+)$/);
      if (match) return `Photo de ${match[1]}`;

      match = normalized.match(/^Trim: (.+)$/);
      if (match) return `Version : ${match[1]}`;
    }

    return null;
  }

  function translateValue(value, destination = locale) {
    const source = normalize(value);
    if (!source) return value;

    const translated =
      (destination === "en" ? frToEn.get(source) : enToFr.get(source)) ||
      translateDynamicPhrase(source, destination);

    return translated ?? value;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.nodeValue) return;

    const parent = node.parentElement;
    if (parent?.closest("script, style, [data-i18n-ignore]")) return;

    const match = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match || !normalize(match[2])) return;

    const translated = translateValue(match[2]);
    if (translated === match[2]) return;

    node.nodeValue = `${match[1]}${translated}${match[3]}`;
  }

  function translateAttributes(element) {
    if (!(element instanceof Element)) return;

    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
      if (!element.hasAttribute(attribute)) continue;
      const value = element.getAttribute(attribute);
      const translated = translateValue(value);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  }

  function translateSubtree(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (!(root instanceof Element) && root !== document) return;
    if (
      root instanceof Element &&
      (root.matches("script, style, [data-i18n-ignore]") ||
        root.closest("[data-i18n-ignore]"))
    ) {
      return;
    }

    if (root instanceof Element) translateAttributes(root);

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node instanceof Element &&
            node.matches("script, style, [data-i18n-ignore]")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttributes(node);
      node = walker.nextNode();
    }
  }

  const pageMetadata = {
    fr: {
      title: "Parc Zone FIFA - Le centre de véhicules d’occasion au Bénin",
      description:
        "Découvrez le Parc Zone FIFA à Ekpè, près de Cotonou : véhicules d’occasion importés, plusieurs vendeurs, stock en ligne et itinéraire.",
      socialDescription:
        "Véhicules d’occasion importés, plusieurs vendeurs et stock en ligne : préparez votre visite au Parc Zone FIFA à Ekpè.",
      twitterDescription:
        "Véhicules d’occasion importés, plusieurs vendeurs et stock en ligne : préparez votre visite au Parc Zone FIFA à Ekpè.",
      imageAlt:
        "Vue aérienne du Parc Zone FIFA et de ses rangées de véhicules à Ekpè",
      ogLocale: "fr_BJ",
      placeName: "Ekpè, Sèmè-Kpodji, Bénin",
    },
    en: {
      title: "Parc Zone FIFA - Benin’s used vehicle center",
      description:
        "Discover Parc Zone FIFA in Ekpè, near Cotonou: imported used cars, multiple sellers, online inventory and directions.",
      socialDescription:
        "Imported used cars, multiple sellers and online inventory: plan your visit to Parc Zone FIFA in Ekpè.",
      twitterDescription:
        "Imported used cars, multiple sellers and online inventory: plan your visit to Parc Zone FIFA in Ekpè.",
      imageAlt:
        "Aerial view of Parc Zone FIFA and its rows of vehicles in Ekpè",
      ogLocale: "en_BJ",
      placeName: "Ekpè, Sèmè-Kpodji, Benin",
    },
  };

  function setMetaContent(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute("content", value);
  }

  function updateMetadata() {
    const metadata = pageMetadata[locale];

    document.documentElement.lang = locale === "fr" ? "fr-BJ" : "en-BJ";
    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:locale"]', metadata.ogLocale);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.socialDescription);
    setMetaContent('meta[property="og:image:alt"]', metadata.imageAlt);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.twitterDescription);
    setMetaContent('meta[name="twitter:image:alt"]', metadata.imageAlt);
    setMetaContent('meta[name="geo.placename"]', metadata.placeName);
  }

  function applyLocale() {
    if (applying) return;
    applying = true;

    try {
      updateMetadata();
      translateSubtree(document.body);
    } finally {
      applying = false;
    }
  }

  function setLocale(nextLocale) {
    const normalizedLocale = normalizeLocale(nextLocale);
    if (!normalizedLocale) return false;

    const changed = locale !== normalizedLocale;
    locale = normalizedLocale;
    persistLocale(locale);
    applyLocale();

    if (changed) {
      const detail = { locale };
      for (const listener of subscribers) {
        try {
          listener(locale);
        } catch (error) {
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
      window.dispatchEvent(new CustomEvent("zonefifa:localechange", { detail }));
    }

    return true;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  }

  function startObserver() {
    if (!document.body || observer) return;

    observer = new MutationObserver((mutations) => {
      if (applying) return;

      applying = true;
      try {
        for (const mutation of mutations) {
          if (mutation.type === "characterData") {
            translateTextNode(mutation.target);
            continue;
          }

          if (mutation.type === "attributes") {
            translateAttributes(mutation.target);
            continue;
          }

          for (const node of mutation.addedNodes) translateSubtree(node);
        }
      } finally {
        applying = false;
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });
  }

  const api = {
    get locale() {
      return locale;
    },
    setLocale,
    t(fr, en) {
      if (typeof en === "string") return locale === "en" ? en : fr;
      return translateValue(fr);
    },
    subscribe,
  };

  Object.defineProperty(window, "ZoneFifaI18n", {
    value: Object.freeze(api),
    configurable: false,
    enumerable: true,
    writable: false,
  });

  const initialize = () => {
    applyLocale();
    startObserver();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
