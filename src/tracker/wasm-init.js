// WASM Tracker Initialization
// This loads the WebAssembly tracker module and sets up event handling

(async window => {
  const {
    screen: { width, height },
    navigator: { language, doNotTrack: ndnt, msDoNotTrack: msdnt },
    location,
    document,
    history,
    top,
    doNotTrack,
  } = window;

  const { currentScript, referrer } = document;
  if (!currentScript) return;

  const { hostname, href, origin } = location;
  const localStorage = href.startsWith('data:') ? undefined : window.localStorage;

  const _data = 'data-';
  const _false = 'false';
  const _true = 'true';
  const attr = currentScript.getAttribute.bind(currentScript);

  const website = attr(`${_data}website-id`);
  const hostUrl = attr(`${_data}host-url`);
  const beforeSend = attr(`${_data}before-send`);
  const tag = attr(`${_data}tag`) || undefined;
  const autoTrack = attr(`${_data}auto-track`) !== _false;
  const dnt = attr(`${_data}do-not-track`) === _true;
  const excludeSearch = attr(`${_data}exclude-search`) === _true;
  const excludeHash = attr(`${_data}exclude-hash`) === _true;
  const domain = attr(`${_data}domains`) || '';
  const credentials = attr(`${_data}fetch-credentials`) || 'omit';

  const domains = domain.split(',').map(n => n.trim());
  const host =
    hostUrl || '__COLLECT_API_HOST__' || currentScript.src.split('/').slice(0, -1).join('/');
  const endpoint = `${host.replace(/\/$/, '')}__COLLECT_API_ENDPOINT__`;
  const screen = `${width}x${height}`;
  const eventRegex = /data-umami-event-([\w-_]+)/;
  const eventNameAttribute = `${_data}umami-event`;
  const delayDuration = 300;

  let currentUrl = href;
  let currentRef = referrer;
  let identity;

  // Load WASM module
  const wasmUrl = `${host.replace(/\/$/, '')}/tracker.wasm.js`;

  try {
    const wasmModule = await import(wasmUrl);
    const { Tracker, TrackerConfig, normalize_url } = wasmModule;

    // Create tracker config
    const config = new TrackerConfig(
      website,
      host,
      endpoint,
      tag,
      autoTrack,
      dnt,
      excludeSearch,
      excludeHash,
      domains,
      credentials,
    );

    // Create tracker instance
    const tracker = new Tracker(config);
    tracker.init();

    // Helper functions
    const normalize = raw => {
      if (!raw) return raw;
      try {
        const u = new URL(raw, location.href);
        if (excludeSearch) u.search = '';
        if (excludeHash) u.hash = '';
        return u.toString();
      } catch {
        return raw;
      }
    };

    const getPayload = () => ({
      website,
      screen,
      language,
      title: document.title,
      hostname,
      url: currentUrl,
      referrer: currentRef,
      tag,
      id: identity ? identity : undefined,
    });

    const hasDoNotTrack = () => {
      const dnt = doNotTrack || ndnt || msdnt;
      return dnt === 1 || dnt === '1' || dnt === 'yes';
    };

    const track = async data => {
      if (hasDoNotTrack() || !website) return;

      const payload = { ...getPayload(), ...data };

      if (beforeSend && typeof beforeSend === 'function') {
        const result = beforeSend(payload);
        if (result === false) return;
        Object.assign(payload, result);
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.identity) {
            identity = data.identity;
            if (localStorage) {
              localStorage.setItem('umami_identity', identity);
            }
          }
        }
      } catch (error) {
        console.error('Tracker error:', error);
      }
    };

    // Event handlers
    const handlePush = (_state, _title, url) => {
      if (!url) return;

      currentRef = currentUrl;
      currentUrl = normalize(new URL(url, location.href).toString());

      if (currentUrl !== currentRef) {
        setTimeout(() => track(), delayDuration);
      }
    };

    const handlePathChanges = () => {
      const hook = (_this, method, callback) => {
        const orig = _this[method];
        return (...args) => {
          callback.apply(null, args);
          return orig.apply(_this, args);
        };
      };

      history.pushState = hook(history, 'pushState', handlePush);
      history.replaceState = hook(history, 'replaceState', handlePush);
    };

    const handleClicks = () => {
      const trackElement = async el => {
        const targetElement =
          el.tagName === 'A' || el.tagName === 'BUTTON' ? el : el.closest('a, button');
        if (!targetElement) return;

        const element =
          targetElement.tagName === 'BUTTON'
            ? targetElement
            : targetElement.closest('[data-umami-event]');
        if (!element) return;

        const name = element.getAttribute(eventNameAttribute);
        const eventData = Array.from(element.attributes)
          .filter(attr => attr.name.match(eventRegex))
          .reduce((obj, attr) => {
            const match = attr.name.match(eventRegex);
            if (match) {
              obj[match[1]] = attr.value;
            }
            return obj;
          }, {});

        if (name) {
          await track({ event: name, data: eventData });
        }
      };

      if (autoTrack) {
        document.addEventListener('click', e => trackElement(e.target), true);
      }
    };

    // Initialize auto tracking
    if (autoTrack) {
      handlePathChanges();
      handleClicks();

      // Track initial page load
      setTimeout(() => track(), delayDuration);

      // Load identity from localStorage if available
      if (localStorage) {
        identity = localStorage.getItem('umami_identity');
      }
    }

    // Expose tracker API to window
    window.umami = {
      track: (event, data) => track({ event, data }),
      identify: data => {
        identity = data;
        if (localStorage) {
          localStorage.setItem('umami_identity', JSON.stringify(data));
        }
      },
    };
  } catch (error) {
    console.error('Failed to load Umami WASM tracker:', error);
    // Fallback to JavaScript version if WASM fails
  }
})(window);
