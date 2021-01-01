import { configuration } from "./configuration";

const parseIfValidFrontendOrigin = (input: any): URL | null => {
  if (input) {
    try {
      const url = new URL(input);

      if (configuration.frontend.allowedOrigins.includes(url.origin)) {
        return url;
      }
    } catch {}
  }

  return null;
};

const isAllowedToUseArguments = (args: any, context: any): boolean => {
  if (args.guildId && args.guildId !== context.currentUser.guildId)
    return false;
  if (args.memberId && args.memberId !== context.currentUser.memberId)
    return false;
  if (typeof args.input === "object")
    return isAllowedToUseArguments(args.input, context);
  return true;
};

const throwIfNotVerified = (context: any): void => {
  if (!context.currentUser || context.currentUser.studentVerified !== true) {
    throw new Error('You are not a verified member of CompSoc.')
  }
}

export { parseIfValidFrontendOrigin, isAllowedToUseArguments, throwIfNotVerified };
