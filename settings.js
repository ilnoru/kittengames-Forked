document.addEventListener('DOMContentLoaded', function() {
  const settingsModal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const closeBtn = document.getElementsByClassName('close')[0];
  const themeSelect = document.getElementById('theme-select');
  const iconInput = document.getElementById('icon-input');
  const titleInput = document.getElementById('title-input');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const removeCloakBtn = document.getElementById('remove-cloak-btn');
  const modalOverlay = document.getElementById('modal-overlay'); // Add this line

  function setTheme(theme) {
    const link = document.querySelector('link[href^="themes/"]');
    link.href = `themes/${theme}.css`;
    localStorage.setItem('selectedTheme', theme);
    themeSelect.value = theme;
  }

  function loadSavedSettings() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }

    // Load cloak settings
    const iconUrl = localStorage.getItem('iconUrl');
    const pageTitle = localStorage.getItem('pageTitle');
    if (iconUrl) {
      iconInput.value = iconUrl;
    }
    if (pageTitle) {
      titleInput.value = pageTitle;
    }
    // Apply the loaded cloak settings
    applyCloak();
  }

  function saveSettings() {
    // Automatically get favicon URL based on entered URL
    const enteredUrl = iconInput.value.trim();
    const fullUrl = addHttpsIfMissing(enteredUrl);
    const faviconUrl = getFaviconUrl(fullUrl);
    
    localStorage.setItem('iconUrl', faviconUrl);
    localStorage.setItem('pageTitle', titleInput.value);
    applyCloak();
  }

  function addHttpsIfMissing(url) {
    // Check if the URL starts with http:// or https://
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  function getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch (e) {
      console.error("Invalid URL format", e);
      return url;  // Fallback to entered URL in case of error
    }
  }

  function applyCloak() {
    const iconUrl = localStorage.getItem('iconUrl');
    const pageTitle = localStorage.getItem('pageTitle');
    if (iconUrl) {
      const iconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      iconLink.type = 'image/x-icon';
      iconLink.rel = 'shortcut icon';
      iconLink.href = iconUrl;
      document.getElementsByTagName('head')[0].appendChild(iconLink);
    }
    if (pageTitle) {
      document.title = pageTitle;
    }
  }

  function removeCloak() {
    localStorage.removeItem('iconUrl');
    localStorage.removeItem('pageTitle');
    window.location.reload();
  }

  loadSavedSettings();

  settingsBtn.onclick = function() {
    settingsModal.style.display = "block";
    loadSavedSettings();
    modalOverlay.style.display = "block";
  }

  closeBtn.onclick = function() {
    settingsModal.style.display = "none";
    modalOverlay.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
      modalOverlay.style.display = "none";
    }
  }

  themeSelect.addEventListener('change', function() {
    const theme = this.value;
    setTheme(theme);
  });

  saveSettingsBtn.onclick = saveSettings;
  removeCloakBtn.onclick = removeCloak;
});
