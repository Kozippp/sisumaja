const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

interface GrecaptchaApi {
  ready: (callback: () => void) => void;
  execute: (key: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi;
  }
}

let recaptchaScriptPromise: Promise<void> | null = null;

function loadRecaptcha(): Promise<void> {
  if (!siteKey || typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-kozip-recaptcha]"
    );

    const handleLoad = () => resolve();
    const handleError = () => {
      recaptchaScriptPromise = null;
      reject(new Error("Failed to load reCAPTCHA"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.kozipRecaptcha = "true";
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

/** Start loading after the visitor interacts with the form, not during page load. */
export function warmRecaptcha(): void {
  void loadRecaptcha().catch(() => {
    // The form endpoint also has a honeypot and server-side spam heuristics.
  });
}

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!siteKey || typeof window === "undefined") {
    return null;
  }

  await loadRecaptcha();

  return new Promise<string | null>((resolve, reject) => {
    if (!window.grecaptcha) {
      resolve(null);
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha?.execute(siteKey, { action }).then(resolve).catch(reject);
    });
  });
}
