
(function () {
  "use strict";

  // Configuration
  const STORAGE_KEY = "meridian_lang";
  const DEFAULT_LANG = "en";

  // DOM elements
  const langSelect = document.getElementById("langSelect");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  // Load translations for the selected language

async function loadTranslations(lang) {
  const url = new URL(`./i18n/${lang}.json`, document.baseURI);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Could not load translations: ${response.status} ${url.href}`
    );
  }

  return response.json();
}


  // Apply translations to the page
  function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");

      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    });

    // Translate input placeholders
    document
      .querySelectorAll("[data-i18n-placeholder]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");

        if (translations[key] !== undefined) {
          el.setAttribute("placeholder", translations[key]);
        }
      });

    // Update the browser tab title
    if (translations.meta_title) {
      document.title = translations.meta_title;
    }
  }

  // Change the active language
async function setLanguage(lang) {
  try {
    const translations = await loadTranslations(lang);

    applyTranslations(translations);

    document.documentElement.setAttribute("lang", lang);

    if (langSelect) {
      langSelect.value = lang;
    }

    localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    console.error(`Failed to switch to "${lang}":`, err);

    // Restore the currently applied language in the selector.
    if (langSelect) {
      langSelect.value =
        document.documentElement.getAttribute("lang") || DEFAULT_LANG;
    }
  }
}

  // Language selector
  if (langSelect) {
    langSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  }

  // Mobile navigation toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");

      navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    // Close the menu when a navigation link is clicked
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");

        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Demo contact form
  if (contactForm && formNote) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formNote.hidden = false;

      contactForm.reset();
    });
  }

  // Restore the saved language, or use English
  const savedLang =
    localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  setLanguage(savedLang);
})();
