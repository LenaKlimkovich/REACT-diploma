/// <reference types="node" />

const globalProcess =
  typeof window !== "undefined" ? (window as any).process : undefined;

export const API_URL =
  (typeof process !== "undefined"
    ? process.env.REACT_APP_API_ENDPOINT
    : undefined) ||
  globalProcess?.env?.REACT_APP_API_ENDPOINT ||
  "http://127.0.0.1:7075/api";
