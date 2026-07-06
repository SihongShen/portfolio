import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Negotiates the locale (NEXT_LOCALE cookie, then Accept-Language) and
// redirects unprefixed paths like / or /projects to /en/... or /zh/...
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
