import { configuration } from "./configuration";

const parseIfValidFrontendOrigin = (input: any): URL | null => {
  if (input) {
    try {
      const url = new URL(input);

      if (configuration.frontend.allowedOrigins.includes(input)) {
        return url;
      }
    } catch {}
  }

  return null;
}

export {
  parseIfValidFrontendOrigin
}
