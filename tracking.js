(function setCookies() {
  const params = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'gad_source', 'gbraid', 'wbraid', 'fbc', 'ad_id', 'campaign_id', 'adset_id', 'utm_content'];

  function setCookie(key, value) {
    if (value) {
      document.cookie = `${key}=${value}; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')}; max-age=${60 * 60 * 24 * 30}`;
    }
  }

  // Get URL and referrer
  const url = new URL(window.location.href);
  const referrer = document.referrer;

  // Get parameters from both query and fragment
  const fragmentParams = new URLSearchParams(window.location.hash.replace('#', ''));

  // Set URL parameters
  params.forEach(param => {
    const underscored = `_${param}`;
    const value = url.searchParams.get(param) || url.searchParams.get(underscored) || fragmentParams.get(param) || fragmentParams.get(underscored);
    if (value) setCookie(param, value);
  });

  // Store referrer if present
  if (referrer) {
    setCookie('referrer', referrer);
  }
})();

(function handleTypeformLinks() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : '';
  }

  function updateTypeformUrl(url) {
    const typeformUrl = new URL(url);
    const currentUrl = new URL(window.location.href);
    const params = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'gad_source', 'gbraid', 'wbraid', 'fbc', 'referrer', 'ad_id', 'campaign_id', 'adset_id', 'utm_content'];

    // Handle parameters from both query and fragment
    params.forEach(param => {
      const underscored = `_${param}`;
      const value = currentUrl.searchParams.get(param) || currentUrl.searchParams.get(underscored) || getCookie(param);
      if (value) typeformUrl.searchParams.set(param, value);
    });

    return typeformUrl.toString();
  }

  // Handle Typeform links
  document.querySelectorAll('a[href*="typeform.com"]').forEach(link => {
    link.href = updateTypeformUrl(link.href);
  });

  // Handle configurator.korbachforged.com links
  document.querySelectorAll('[tracking-input]').forEach(link => {
    console.log('configurator link', link);
    link.href = updateTypeformUrl(link.href);
  });
})();

(function handleHiddenTrackingInput() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : '';
  }

  function populateTrackingData() {
    const hiddenInput = document.getElementById('tracking_data');
    if (hiddenInput) {
      const params = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'gad_source', 'gbraid', 'wbraid', 'fbc', 'referrer', 'ad_id', 'campaign_id', 'adset_id', 'utm_content'];
      const trackingData = {};

      params.forEach(param => {
        const value = getCookie(param);
        trackingData[param] = value || null;
      });

      hiddenInput.value = JSON.stringify(trackingData);
      console.log('Tracking data populated:', trackingData);
    }
  }

  // Try immediately
  populateTrackingData();

  // Also try after a delay to catch dynamically created inputs
  setTimeout(populateTrackingData, 1000);
  setTimeout(populateTrackingData, 3000);
})();
