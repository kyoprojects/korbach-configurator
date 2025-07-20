(function setCookies() {
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  function setCookie(key, value) {
    if (value && !getCookie(key)) {
      document.cookie = key + '=' + value + '; path=/; max-age=' + 60 * 60 * 24 * 30; // 30 days
    }
  }

  // Get URL parameters
  const utm_source = getParam('utm_source') || '';
  const utm_medium = getParam('utm_medium') || '';
  const utm_campaign = getParam('utm_campaign') || '';
  const utm_term = getParam('utm_term') || '';
  const gclid = getParam('gclid') || '';
  const fbclid = getParam('fbclid') || '';
  const wbraid = getParam('wbraid') || '';
  const gbraid = getParam('gbraid') || '';
  const referrer = document.referrer;

  // Save all parameters to cookies
  setCookie('utm_source', utm_source);
  setCookie('utm_medium', utm_medium);
  setCookie('utm_campaign', utm_campaign);
  setCookie('utm_term', utm_term);
  setCookie('gclid', gclid);
  setCookie('fbclid', fbclid);
  setCookie('wbraid', wbraid);
  setCookie('gbraid', gbraid);
  if (referrer) {
    setCookie('referrer', referrer);
  }

  // Fallback via referrer
  if (!utm_source && referrer) {
    if (referrer.includes('google')) {
      setCookie('utm_source', 'google');
      setCookie('utm_medium', 'organic');
    } else if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) {
      setCookie('utm_source', 'facebook');
      setCookie('utm_medium', 'social');
    } else {
      setCookie('utm_source', 'referral');
      setCookie('utm_medium', 'referrer');
    }
  }

  // Fallback if nothing is known
  if (!utm_source && !referrer) {
    setCookie('utm_source', 'direct');
    setCookie('utm_medium', 'none');
  }
})();

(function handleTypeformLinks() {
  // Unified Typeform URL handling
  document.addEventListener('DOMContentLoaded', function () {
    function getCookie(name) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) return parts.pop().split(';').shift();
      return '';
    }

    function updateTypeformUrl(url) {
      const typeformUrl = new URL(url);

      // Get current page's URL parameters
      const currentUrl = new URL(window.location.href);

      // Priority order: Current URL params > Cookie values
      const params = {
        utm_source: currentUrl.searchParams.get('utm_source') || getCookie('utm_source'),
        utm_medium: currentUrl.searchParams.get('utm_medium') || getCookie('utm_medium'),
        utm_campaign: currentUrl.searchParams.get('utm_campaign') || getCookie('utm_campaign'),
        utm_term: currentUrl.searchParams.get('utm_term') || getCookie('utm_term'),
        gclid: currentUrl.searchParams.get('gclid') || getCookie('gclid'),
        gbraid: currentUrl.searchParams.get('gbraid') || getCookie('gbraid'),
        wbraid: currentUrl.searchParams.get('wbraid') || getCookie('wbraid'),
        gad_source: currentUrl.searchParams.get('gad_source') || getCookie('gad_source')
      };

      // Add referrer if it exists
      const storedReferrer = getCookie('referrer');
      if (storedReferrer) {
        params.referrer = storedReferrer;
      }

      // Add Facebook click ID if present
      const fbc = getCookie('_fbc');
      if (fbc) {
        params.fbc = fbc;
      }

      // Only set parameters that have actual values
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== 'undefined' && value.trim() !== '') {
          typeformUrl.searchParams.set(key, value);
        }
      });

      return typeformUrl.toString();
    }

    // Handle all Typeform links
    const links = document.querySelectorAll('a[href*="typeform.com"]');
    links.forEach(link => {
      // Update href immediately
      link.href = updateTypeformUrl(link.href);

      // Also handle click events to ensure parameters are fresh
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const updatedUrl = updateTypeformUrl(this.href);
        window.open(updatedUrl, '_blank');
      });
    });

    // Handle special start-aanvraag button if present
    const startBtn = document.querySelector('.start-aanvraag-button');
    if (startBtn) {
      startBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const baseUrl = 'https://5s6k5998mgc.typeform.com/to/cPk13kSo';
        const updatedUrl = updateTypeformUrl(baseUrl);
        window.open(updatedUrl, '_blank');
      });
    }
  });
})();
