(function setCookies() {
  const params = ['gclid', 'gad_source', 'gbraid', 'wbraid', 'fbc'];

  function setCookie(key, value) {
    if (value) {
      document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }

  // Get URL and referrer
  const url = new URL(window.location.href);
  const referrer = document.referrer;

  // Set URL parameters
  params.forEach(param => {
    const value = url.searchParams.get(param);
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
    const params = ['gclid', 'gad_source', 'gbraid', 'wbraid', 'fbc', 'referrer'];

    // Handle parameters
    params.forEach(param => {
      const value = currentUrl.searchParams.get(param) || getCookie(param);
      if (value) typeformUrl.searchParams.set(param, value);
    });

    return typeformUrl.toString();
  }

  // Handle all Typeform links
  document.querySelectorAll('a[href*="typeform.com"]').forEach(link => {
    link.href = updateTypeformUrl(link.href);
    console.log('llinkk = ', link);
  });
})();
