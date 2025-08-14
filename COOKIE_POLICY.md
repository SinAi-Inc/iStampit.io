# Cookie Policy (Session Authentication)

This document describes how iStampit uses browser cookies for user authentication between the public marketing site (`istampit.io`) and the centralized authentication service (`auth.istampit.io`).

## 1. Cookie Purpose

We issue a single session cookie after a successful login via the auth service (`auth.istampit.io`). This cookie authenticates subsequent requests to protected application APIs and is scoped for cross‑subdomain usage.

## 2. Scope & Domain

The session cookie is set with the `Domain=.istampit.io` attribute so that future subdomains (e.g. `app.istampit.io`) can share authentication. Public, unauthenticated pages at `istampit.io` do not read the cookie directly in client JavaScript; they fetch session state through lightweight JSON endpoints.

## 3. Lifetime

The session cookie lifetime is short-lived (rolling) to reduce risk if intercepted. Idle sessions eventually expire server-side; renewed activity may refresh expiration (sliding window). Exact TTL values may evolve; see CHANGELOG for adjustments.

## 4. Security Attributes

- HttpOnly: Prevents JavaScript access, mitigating XSS token theft.
- Secure: Sent only over HTTPS.
- SameSite=Lax: Allows top-level navigations (e.g., user clicking a link or submitting a form) while blocking most cross-site CSRF vectors.
- Path=/ : Enables all application routes.

## 5. SameSite Rationale

`SameSite=Lax` is chosen because:

- It supports typical navigation or popup flows from `istampit.io` (marketing site) to `auth.istampit.io` (auth) without degrading UX.
- It provides stronger CSRF mitigation than `None`.

If future embedded contexts (iframes, third‑party initiations) require cross-site POSTs, we may switch to `SameSite=None; Secure` accompanied by explicit CSRF tokens and Origin/Referer validation.

## 6. Cross-Domain Considerations

With a parent-domain cookie (`Domain=.istampit.io`), subdomains share session state. Public site components that need authenticated data still avoid direct cookie parsing in the browser; instead they rely on a CORS-enabled `/api/session` endpoint at `auth.istampit.io`.

## 7. Recommended Validation Checklist (Pre-Public Launch)

Run in Chrome, Firefox, and Safari (Desktop + iOS):

1. Login and capture `Set-Cookie` header: confirm `HttpOnly; Secure; SameSite=Lax` attributes present.
2. Perform a popup or navigation from `istampit.io` to a protected route on an application subdomain: cookie is sent.
3. Open a new tab and request an authenticated API endpoint: cookie is sent.
4. Perform cross-site fetch from a third-party origin (if applicable): cookie not sent (expected).
5. Let session idle past TTL: cookie becomes invalid server-side; refresh prompts re-auth.
6. Test logout: cookie invalidated (server) and no further authenticated access.

## 8. Future Enhancements

- Add CSRF double-submit token or SameSite=None upgrade if embedding flows emerge.
- Introduce device/session management UI (list + revoke).
- Add short-lived access token + refresh token rotation strategy if scaling beyond current model.

## 9. Contact / Changes

Security questions: [security@istampit.io](mailto:security@istampit.io)

Material changes to this policy will be noted in the repository CHANGELOG and tagged releases.
