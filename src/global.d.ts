/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_PRIVATE_KEY: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}