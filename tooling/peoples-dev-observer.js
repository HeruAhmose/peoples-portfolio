/**
 * Peoples Dev Observer
 *
 * Development-only, vendor-neutral diagnostics for the Peoples portfolio.
 * Captures bounded console, request metadata, runtime errors, navigation, and
 * semantic UI events without persisting request/response bodies, cookies,
 * authorization headers, query strings, or form values.
 */
(function () {
  "use strict";

  if (window.__PEOPLES_DEV_OBSERVER__) return;

  var ENDPOINT = "/__peoples_dev__/telemetry";
  var VERSION = 1;
  var REPORT_INTERVAL_MS = 2000;
  var MAX_TEXT = 120;
  var MAX_STRING = 1000;
  var MAX_CONSOLE = 250;
  var MAX_NETWORK = 150;
  var MAX_SESSION = 300;
  var SENSITIVE_KEY =
    /password|passcode|token|secret|api[-_]?key|authorization|cookie|session|credential/i;

  var store = {
    consoleLogs: [],
    networkRequests: [],
    sessionEvents: [],
    lastScrollAt: 0,
  };

  function truncate(value, limit) {
    var text = String(value == null ? "" : value);
    return text.length > limit ? text.slice(0, limit) + "…" : text;
  }

  function sanitize(value, depth, seen) {
    depth = depth || 0;
    seen = seen || [];
    if (depth > 5) return "[Max depth]";
    if (value == null) return value;
    if (typeof value === "string") return truncate(value, MAX_STRING);
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (typeof value === "bigint") return String(value);
    if (typeof value === "function") return "[Function]";
    if (value instanceof Error) {
      return {
        name: truncate(value.name, 80),
        message: truncate(value.message, MAX_STRING),
        stack: truncate(value.stack || "", 4000),
      };
    }
    if (typeof value !== "object") return truncate(value, MAX_STRING);
    if (seen.indexOf(value) !== -1) return "[Circular]";
    seen.push(value);

    if (Array.isArray(value)) {
      return value.slice(0, 50).map(function (item) {
        return sanitize(item, depth + 1, seen.slice());
      });
    }

    var output = {};
    try {
      Object.keys(value)
        .slice(0, 80)
        .forEach(function (key) {
          output[key] = SENSITIVE_KEY.test(key)
            ? "[REDACTED]"
            : sanitize(value[key], depth + 1, seen.slice());
        });
    } catch (_error) {
      return "[Unserializable object]";
    }
    return output;
  }

  function prune(buffer, limit) {
    if (buffer.length > limit) buffer.splice(0, buffer.length - limit);
  }

  function safeUrl(input) {
    try {
      var raw =
        typeof input === "string"
          ? input
          : input && input.url
            ? input.url
            : String(input || "");
      var parsed = new URL(raw, location.href);
      return parsed.origin === location.origin
        ? parsed.pathname
        : parsed.origin + parsed.pathname;
    } catch (_error) {
      return truncate(String(input || "").split("?")[0], 500);
    }
  }

  function isObserverRequest(input) {
    try {
      var raw =
        typeof input === "string"
          ? input
          : input && input.url
            ? input.url
            : String(input || "");
      var parsed = new URL(raw, location.href);
      return parsed.origin === location.origin && parsed.pathname === ENDPOINT;
    } catch (_error) {
      return false;
    }
  }

  function shouldIgnoreTarget(target) {
    try {
      return !!(
        target instanceof Element &&
        target.closest(
          '[data-peoples-observe="off"], .peoples-no-record, [data-private]'
        )
      );
    } catch (_error) {
      return false;
    }
  }

  function compactText(value) {
    return truncate(
      String(value || "")
        .trim()
        .replace(/\s+/g, " "),
      MAX_TEXT
    );
  }

  function describeElement(target) {
    if (!(target instanceof Element)) return null;
    var tag = target.tagName ? target.tagName.toLowerCase() : "unknown";
    var isFormControl =
      tag === "input" || tag === "textarea" || tag === "select";
    var testId =
      target.getAttribute("data-testid") ||
      target.getAttribute("data-test-id") ||
      target.getAttribute("data-test") ||
      null;
    var dataLoc = target.getAttribute("data-loc") || null;

    return {
      tag: tag,
      id: truncate(target.id || "", 120) || null,
      role: truncate(target.getAttribute("role") || "", 120) || null,
      ariaLabel:
        truncate(target.getAttribute("aria-label") || "", MAX_TEXT) || null,
      testId: truncate(testId || "", 120) || null,
      dataLoc: truncate(dataLoc || "", 240) || null,
      href:
        tag === "a" ? safeUrl(target.getAttribute("href") || "") || null : null,
      text: isFormControl
        ? null
        : compactText(target.textContent || target.innerText || "") || null,
    };
  }

  function recordSession(kind, payload) {
    store.sessionEvents.push({
      at: Date.now(),
      kind: kind,
      path: location.pathname,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      payload: sanitize(payload),
    });
    prune(store.sessionEvents, MAX_SESSION);
  }

  function installSessionObservers() {
    document.addEventListener(
      "click",
      function (event) {
        if (shouldIgnoreTarget(event.target)) return;
        recordSession("click", {
          target: describeElement(event.target),
          x: event.clientX,
          y: event.clientY,
        });
      },
      true
    );

    document.addEventListener(
      "change",
      function (event) {
        if (shouldIgnoreTarget(event.target)) return;
        var target = event.target;
        var valueLength = null;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          valueLength = String(target.value || "").length;
        }
        recordSession("change", {
          target: describeElement(target),
          valueLength: valueLength,
        });
      },
      true
    );

    document.addEventListener(
      "submit",
      function (event) {
        if (shouldIgnoreTarget(event.target)) return;
        recordSession("submit", { target: describeElement(event.target) });
      },
      true
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Enter" && event.key !== "Escape") return;
        if (shouldIgnoreTarget(event.target)) return;
        recordSession("keydown", {
          key: event.key,
          target: describeElement(event.target),
        });
      },
      true
    );

    window.addEventListener(
      "scroll",
      function () {
        var now = Date.now();
        if (now - store.lastScrollAt < 750) return;
        store.lastScrollAt = now;
        recordSession("scroll", {
          x: window.scrollX,
          y: window.scrollY,
          documentHeight: document.documentElement.scrollHeight,
        });
      },
      { passive: true }
    );

    function navigation(reason) {
      recordSession("navigate", { reason: reason, path: location.pathname });
    }

    var pushState = history.pushState;
    history.pushState = function () {
      var result = Reflect.apply(pushState, history, arguments);
      navigation("pushState");
      return result;
    };

    var replaceState = history.replaceState;
    history.replaceState = function () {
      var result = Reflect.apply(replaceState, history, arguments);
      navigation("replaceState");
      return result;
    };

    window.addEventListener("popstate", function () {
      navigation("popstate");
    });
    window.addEventListener("hashchange", function () {
      navigation("hashchange");
    });
  }

  function installConsoleObserver() {
    ["debug", "log", "info", "warn", "error"].forEach(function (level) {
      var original = console[level].bind(console);
      console[level] = function () {
        var args = Array.prototype.slice.call(arguments);
        store.consoleLogs.push({
          at: Date.now(),
          level: level,
          args: args.slice(0, 20).map(function (arg) {
            return sanitize(arg);
          }),
        });
        prune(store.consoleLogs, MAX_CONSOLE);
        return Reflect.apply(original, console, args);
      };
    });

    window.addEventListener("error", function (event) {
      var errorEntry = {
        at: Date.now(),
        level: "error",
        args: [
          {
            type: "UncaughtError",
            message: truncate(event.message || "", MAX_STRING),
            file: safeUrl(event.filename || ""),
            line: event.lineno,
            column: event.colno,
            error: sanitize(event.error),
          },
        ],
      };
      store.consoleLogs.push(errorEntry);
      prune(store.consoleLogs, MAX_CONSOLE);
      recordSession("runtime_error", errorEntry.args[0]);
    });

    window.addEventListener("unhandledrejection", function (event) {
      var reason = sanitize(event.reason);
      store.consoleLogs.push({
        at: Date.now(),
        level: "error",
        args: [{ type: "UnhandledRejection", reason: reason }],
      });
      prune(store.consoleLogs, MAX_CONSOLE);
      recordSession("unhandled_rejection", { reason: reason });
    });
  }

  function installNetworkObserver() {
    var originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      if (isObserverRequest(input)) return originalFetch(input, init);
      var startedAt = performance.now();
      var method =
        (init && init.method) ||
        (input && typeof input === "object" && input.method) ||
        "GET";
      var url = safeUrl(input);

      return originalFetch(input, init).then(
        function (response) {
          store.networkRequests.push({
            at: Date.now(),
            type: "fetch",
            method: String(method).toUpperCase(),
            url: url,
            status: response.status,
            ok: response.ok,
            contentType: truncate(
              response.headers.get("content-type") || "",
              160
            ),
            durationMs: Math.round(performance.now() - startedAt),
          });
          prune(store.networkRequests, MAX_NETWORK);
          if (!response.ok) {
            recordSession("network_error", {
              type: "fetch",
              method: String(method).toUpperCase(),
              url: url,
              status: response.status,
            });
          }
          return response;
        },
        function (error) {
          store.networkRequests.push({
            at: Date.now(),
            type: "fetch",
            method: String(method).toUpperCase(),
            url: url,
            status: null,
            durationMs: Math.round(performance.now() - startedAt),
            error: sanitize(error),
          });
          prune(store.networkRequests, MAX_NETWORK);
          recordSession("network_error", {
            type: "fetch",
            method: String(method).toUpperCase(),
            url: url,
            error: sanitize(error),
          });
          throw error;
        }
      );
    };

    var xhrMeta = new WeakMap();
    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      xhrMeta.set(this, {
        method: String(method || "GET").toUpperCase(),
        url: safeUrl(url),
        internal: isObserverRequest(url),
      });
      return Reflect.apply(originalOpen, this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      var xhr = this;
      var meta = xhrMeta.get(xhr);
      if (!meta || meta.internal)
        return Reflect.apply(originalSend, xhr, arguments);
      var startedAt = performance.now();

      xhr.addEventListener("loadend", function () {
        store.networkRequests.push({
          at: Date.now(),
          type: "xhr",
          method: meta.method,
          url: meta.url,
          status: xhr.status || null,
          ok: xhr.status >= 200 && xhr.status < 400,
          contentType: truncate(
            xhr.getResponseHeader("content-type") || "",
            160
          ),
          durationMs: Math.round(performance.now() - startedAt),
        });
        prune(store.networkRequests, MAX_NETWORK);
        if (xhr.status >= 400 || xhr.status === 0) {
          recordSession("network_error", {
            type: "xhr",
            method: meta.method,
            url: meta.url,
            status: xhr.status || null,
          });
        }
      });

      return Reflect.apply(originalSend, xhr, arguments);
    };
  }

  function drain(buffer) {
    return buffer.splice(0, buffer.length);
  }

  function flush() {
    if (
      store.consoleLogs.length === 0 &&
      store.networkRequests.length === 0 &&
      store.sessionEvents.length === 0
    ) {
      return;
    }

    var payload = JSON.stringify({
      version: VERSION,
      consoleLogs: drain(store.consoleLogs),
      networkRequests: drain(store.networkRequests),
      sessionEvents: drain(store.sessionEvents),
    });

    try {
      if (navigator.sendBeacon) {
        var sent = navigator.sendBeacon(
          ENDPOINT,
          new Blob([payload], { type: "application/json" })
        );
        if (sent) return;
      }
    } catch (_error) {
      // Fall through to fetch.
    }

    window
      .fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        credentials: "same-origin",
      })
      .catch(function () {
        // Development diagnostics are best-effort and must never break the app.
      });
  }

  Object.defineProperty(window, "__PEOPLES_DEV_OBSERVER__", {
    value: Object.freeze({ version: VERSION, flush: flush }),
    configurable: false,
    enumerable: false,
    writable: false,
  });

  installConsoleObserver();
  installNetworkObserver();
  installSessionObservers();
  setInterval(flush, REPORT_INTERVAL_MS);
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });
})();
