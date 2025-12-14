/**
 * Theme.js - Dynamic Tenant Initialization
 * 
 * This script MUST be loaded BEFORE rooms.js and booking.js.
 * It fetches the hotel config from the backend and applies theming.
 * Other scripts can await `tenantReadyPromise` before making API calls.
 */

// Global variables accessible by other scripts
let tenantReadyPromise = null;
let TENANT_ID = null;
let HOTEL_CONFIG = null;

/**
 * Initialize the tenant by fetching config from the backend.
 * Returns a Promise that resolves when the tenant is loaded.
 */
function initializeTenant() {
    tenantReadyPromise = new Promise(async (resolve, reject) => {
        const subdomain = CONFIG.getSubdomain();

        if (!subdomain) {
            console.error('Could not determine subdomain');
            reject(new Error('No subdomain'));
            return;
        }

        console.log(`[Theme] Initializing tenant for subdomain: ${subdomain}`);

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/config?subdomain=${subdomain}`);

            if (!res.ok) {
                throw new Error(`Hotel not found (${res.status})`);
            }

            const data = await res.json();
            TENANT_ID = data.tenantId;
            HOTEL_CONFIG = data.config;

            console.log(`[Theme] Tenant loaded: ${TENANT_ID}`, HOTEL_CONFIG);

            // Apply theming
            applyTheme(data.config);
            updateContent(data.config);

            resolve({ tenantId: TENANT_ID, config: HOTEL_CONFIG });

        } catch (error) {
            console.error('[Theme] Could not initialize tenant:', error);

            // Show error message to user
            const main = document.querySelector('main') || document.body;
            main.innerHTML = `
                <div style="text-align: center; padding: 100px 20px; font-family: sans-serif;">
                    <h1 style="color: #dc3545;">Hotel Not Found</h1>
                    <p>The hotel "${subdomain}" could not be found.</p>
                    <p style="color: #666; font-size: 14px;">Please check the URL and try again.</p>
                </div>
            `;
            reject(error);
        }
    });

    return tenantReadyPromise;
}

/**
 * Apply CSS custom properties for theming
 */
function applyTheme(config) {
    const root = document.documentElement;

    if (config.primaryColor) {
        root.style.setProperty('--primary-color', config.primaryColor);
        root.style.setProperty('--theme-primary', config.primaryColor);
    }
    if (config.secondaryColor) {
        root.style.setProperty('--secondary-color', config.secondaryColor);
        root.style.setProperty('--theme-secondary', config.secondaryColor);
    }
    if (config.accentColor) {
        root.style.setProperty('--accent-color', config.accentColor);
    }
    if (config.fontFamily) {
        root.style.setProperty('--font-family', config.fontFamily);
        document.body.style.fontFamily = config.fontFamily;
    }
}

/**
 * Update static content in the DOM with dynamic values
 */
function updateContent(config) {
    // Page Title
    if (config.metaTitle || config.hotelName) {
        document.title = config.metaTitle || config.hotelName;
    }

    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.metaDescription) {
        metaDesc.setAttribute('content', config.metaDescription);
    }

    // Favicon
    if (config.faviconUrl) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = config.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Logo (navbar)
    const logo = document.querySelector('.site-logo a');
    if (logo && config.hotelName) {
        logo.textContent = config.hotelName;
    }
    const logoImg = document.querySelector('.navbar-brand img, .site-logo img');
    if (logoImg && config.logoUrl) {
        logoImg.src = config.logoUrl;
        logoImg.alt = config.hotelName || 'Hotel Logo';
    }

    // Hero Section
    const heroSection = document.querySelector('.site-hero, #hero, .hero-section');
    if (heroSection && config.heroImageUrl) {
        heroSection.style.backgroundImage = `url(${config.heroImageUrl})`;
    }

    const heroTitle = document.querySelector('.site-hero .heading, #hero-title, .hero-title');
    if (heroTitle && config.heroTitle) {
        heroTitle.textContent = config.heroTitle;
    }

    const heroSubtitle = document.querySelector('.site-hero .custom-caption, #hero-subtitle, .hero-subtitle');
    if (heroSubtitle && config.heroSubtitle) {
        heroSubtitle.innerHTML = config.heroSubtitle;
    }

    // Footer
    const footerText = document.querySelector('.footer-text, footer .copyright');
    if (footerText && config.footerText) {
        footerText.innerHTML = config.footerText;
    }

    // Contact Info
    const contactEmail = document.querySelector('.contact-email, [data-content="email"]');
    if (contactEmail && config.contactEmail) {
        contactEmail.textContent = config.contactEmail;
        if (contactEmail.tagName === 'A') {
            contactEmail.href = `mailto:${config.contactEmail}`;
        }
    }

    const contactPhone = document.querySelector('.contact-phone, [data-content="phone"]');
    if (contactPhone && config.contactPhone) {
        contactPhone.textContent = config.contactPhone;
        if (contactPhone.tagName === 'A') {
            contactPhone.href = `tel:${config.contactPhone}`;
        }
    }

    const addressEl = document.querySelector('.contact-address, [data-content="address"]');
    if (addressEl && config.address) {
        addressEl.innerHTML = config.address;
    }

    // Social Links
    const socialLinks = {
        facebook: config.facebookUrl,
        instagram: config.instagramUrl,
        twitter: config.twitterUrl,
        youtube: config.youtubeUrl
    };

    Object.entries(socialLinks).forEach(([platform, url]) => {
        if (url) {
            const link = document.querySelector(`.social a[href*="${platform}"], .social .fa-${platform}`);
            if (link) {
                const anchor = link.closest('a') || link;
                anchor.href = url;
            }
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    initializeTenant();
});
