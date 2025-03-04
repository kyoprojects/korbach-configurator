(function () {
  // Function to load a script dynamically
  function loadScript(url) {
    const timestamp = new Date().getTime();
    const script = document.createElement('script');
    script.src = `${url}?ts=${timestamp}`;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

  const currentUrl = window.location.href;
  const path = window.location.pathname;

  let baseUrl;
  if (currentUrl.includes('https://www.reachboost.io/')) {
    baseUrl = 'https://kyoprojects.github.io/reachboost';
  } else {
    baseUrl = 'http://localhost:3000/reachboost';
  }

  const scriptUrl = `${baseUrl}${path}.js`;

  // Run immediately if the page is already loaded
  if (document.readyState !== 'loading') {
    console.log('Document ready, loading scripts...');
    loadScript('http://localhost:3000/korbach-configurator/global.js');
  } else {
    // Wait for page load
    document.addEventListener('DOMContentLoaded', function () {
      console.log('DOMContentLoaded, injecting global.js...');
      loadScript('http://localhost:3000/korbach-configurator/global.js');

      // Wait for Wized to initialize
      window.Wized = window.Wized || [];
      window.Wized.push(Wized => {
        console.log('Wized initialized, injecting connfi.js...');
        loadScript('http://localhost:3000/korbach-configurator/confi.js');
      });
    });
  }
})();

//

document.addEventListener('DOMContentLoaded', () => {
  (function () {
    function injectScript(src) {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
      console.log('appended ', src);
    }

    const currentUrl = window.location.href;
    const path = window.location.pathname;

    let baseUrl;
    if (currentUrl.includes('https://www.reachboost.io/')) {
      baseUrl = 'https://kyoprojects.github.io/reachboost';
    } else {
      baseUrl = 'http://localhost:3000/reachboost';
    }

    const scriptUrl = `${baseUrl}${path}.js`;

    injectScript(`${baseUrl}/global.js`);
    injectScript(scriptUrl);
  })();
});
