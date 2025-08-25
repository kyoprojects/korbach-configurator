(function setCookies() {
  const params = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'gad_source', 'gbraid', 'wbraid', 'fbc', 'ad_id', 'campaign_id', 'adset_id', 'utm_content'];

  function setCookie(key, value) {
    if (value) {
      document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
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
})();
