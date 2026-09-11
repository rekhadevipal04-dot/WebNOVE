/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_RECIPIENT_EMAIL?: string;
  readonly EMAILJS_SERVICE_ID?: string;
  readonly EMAILJS_TEMPLATE_ID?: string;
  readonly EMAILJS_PUBLIC_KEY?: string;
  readonly EMAILJS_RECIPIENT_EMAIL?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
