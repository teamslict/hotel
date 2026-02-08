/**
 * i18n.js - Internationalization Engine for Hotel Frontend
 * Supports: English (en), Tamil (ta), Sinhala (si), Arabic (ar)
 * 
 * Usage:
 * 1. Add data-i18n="key.path" to HTML elements
 * 2. Call i18n.init() on page load
 * 3. Use i18n.t('key.path') in JS
 */

const i18n = {
    // Current language
    locale: 'en',

    // Loaded translations
    translations: {},

    // Supported languages
    languages: [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
        { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ],

    /**
     * Initialize i18n
     */
    async init() {
        // Get saved language or detect
        this.locale = this.getSavedLocale() || this.detectLocale();

        // Load translations
        await this.loadTranslations(this.locale);

        // Apply translations to DOM
        this.translatePage();

        // Set document direction (RTL for Arabic)
        this.updateDocumentDirection();

        // Create language switcher if container exists
        this.createLanguageSwitcher();

        console.log(`[i18n] Initialized with locale: ${this.locale}`);
    },

    /**
     * Get saved locale from localStorage
     */
    getSavedLocale() {
        return localStorage.getItem('hotel_locale');
    },

    /**
     * Detect user's preferred locale
     */
    detectLocale() {
        const browserLang = navigator.language.split('-')[0];
        const supported = this.languages.map(l => l.code);
        return supported.includes(browserLang) ? browserLang : 'en';
    },

    /**
     * Load translations for a locale
     */
    async loadTranslations(locale) {
        try {
            const response = await fetch(`translations/${locale}.json`);
            if (!response.ok) throw new Error(`Failed to load ${locale}`);
            this.translations = await response.json();
        } catch (error) {
            console.error(`[i18n] Error loading translations:`, error);
            // Fallback to English
            if (locale !== 'en') {
                await this.loadTranslations('en');
            }
        }
    },

    /**
     * Translate the entire page
     */
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (translated && translated !== key) {
                // Handle placeholder attribute
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = translated;
                } else {
                    el.textContent = translated;
                }
            }
        });

        // Update hero title with hotel name interpolation
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            const hotelName = (typeof HOTEL_CONFIG !== 'undefined' && HOTEL_CONFIG?.hotelName)
                ? HOTEL_CONFIG.hotelName
                : 'Ceylon Paradise';
            heroTitle.textContent = this.t('hero.title', { hotelName });
        }

        // Update document title if exists
        const titleKey = document.querySelector('title[data-i18n]');
        if (titleKey) {
            document.title = this.t(titleKey.getAttribute('data-i18n'));
        }
    },

    /**
     * Get translation by key path
     * @param {string} key - Dot-notation key (e.g., 'booking.checkIn')
     * @param {object} params - Optional parameters for interpolation
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }

        if (typeof value !== 'string') return key;

        // Interpolate parameters (e.g., {hotelName})
        return value.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    },

    /**
     * Change locale
     */
    async setLocale(locale) {
        if (locale === this.locale) return;

        localStorage.setItem('hotel_locale', locale);
        this.locale = locale;

        await this.loadTranslations(locale);
        this.translatePage();
        this.updateSwitcher();
        this.updateDocumentDirection();

        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
    },

    /**
     * Update document direction for RTL languages (Arabic)
     */
    updateDocumentDirection() {
        const isRTL = this.locale === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = this.locale;
    },

    /**
     * Create language switcher dropdown
     */
    createLanguageSwitcher() {
        const container = document.getElementById('language-switcher');
        if (!container) return;

        const current = this.languages.find(l => l.code === this.locale) || this.languages[0];

        container.innerHTML = `
            <div class="lang-dropdown">
                <button class="lang-btn" id="lang-toggle">
                    <span class="lang-flag">${current.flag}</span>
                    <span class="lang-name">${current.name}</span>
                    <span class="lang-arrow">▼</span>
                </button>
                <div class="lang-menu" id="lang-menu">
                    ${this.languages.map(lang => `
                        <button class="lang-option ${lang.code === this.locale ? 'active' : ''}" data-locale="${lang.code}">
                            <span class="lang-flag">${lang.flag}</span>
                            <span class="lang-name">${lang.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Toggle dropdown
        const toggle = document.getElementById('lang-toggle');
        const menu = document.getElementById('lang-menu');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // Handle option clicks
        container.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLocale(btn.dataset.locale);
                menu.classList.remove('show');
            });
        });

        // Close on click outside
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    },

    /**
     * Update switcher display
     */
    updateSwitcher() {
        const toggle = document.getElementById('lang-toggle');
        if (!toggle) return;

        const current = this.languages.find(l => l.code === this.locale);
        toggle.innerHTML = `
            <span class="lang-flag">${current.flag}</span>
            <span class="lang-name">${current.name}</span>
            <span class="lang-arrow">▼</span>
        `;

        // Update active state
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.locale === this.locale);
        });
    }
};

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
