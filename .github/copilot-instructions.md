# Copilot Instructions — TheCodeHelperApplication

Purpose: Give AI coding agents the minimum, high-value context to be immediately productive in this repo.

- **Project type:** React Single-Page App built with Vite. See [vite.config.js](vite.config.js).
- **Dev scripts:** use `npm run dev` (Vite dev server), `npm run build` (production), `npm run preview` (serve `dist`), `npm run deploy` (gh-pages). See [package.json](package.json).

Big picture
- Frontend-only SPA that talks to a backend API under the path `${VITE_API_BASE_URL}/api` (see `src/utils/api.js`).
- UI is organized by pages (`src/pages/`) and shared UI/layout components (`src/components/`, `src/components/layout/`).
- Static assets and legacy scripts are stored in `public/js/` and `src/assets/` (CSS and images). Don't remove public scripts used by legacy markup.

Key integration points & patterns
- API client: `src/utils/api.js` (uses `axios`). It reads `import.meta.env.VITE_API_BASE_URL` and appends `/api`. All API calls use `apiRequest(method, endpoint, data)`; endpoints in code often omit the `/api` prefix (e.g. `apiRequest('POST', '/login', formData)`). See [src/utils/api.js](src/utils/api.js).
- Validation handling: `src/utils/handleValidationErrors.js` mutates the DOM to append `.error-text` elements and add `input-error` class — tests and UI rely on this behavior. See [src/utils/handleValidationErrors.js](src/utils/handleValidationErrors.js).
- Authentication: Login stores tokens and user data in `localStorage`:
  - `token` — access token
  - `user_id` — numeric id
  - `user_{id}` and `professional_{id}` — serialized user/professional objects
  - `redirectAfterLogin` — optional redirect path used after login
  See login flow in [src/pages/Login.jsx](src/pages/Login.jsx).

Routing & client navigation
- Uses `react-router-dom` for client routing (see `src/main.jsx` and page components under `src/pages/`). Use `useNavigate()` for programmatic redirects (pattern used in `Login.jsx`).

Conventions & repo-specific notes
- Many files have duplicate "copy" variants (e.g., `Footer.jsx` and `Footer copy.jsx`). Prefer editing the non-`copy` files. Avoid renaming or deleting `* copy` files unless you confirm they are unused.
- Styling: site styles are a mix of React CSS files in `src/assets/css` and global styles loaded from `public/`. Prefer existing class names and small, local CSS changes.
- DOM manipulation: Some utilities directly modify the DOM (see `handleValidationErrors`). When changing form components, ensure those DOM conventions (`.error-text`, `.input-error`) remain compatible.

Debugging & testing
- No test framework is present. Use `npm run dev` and browser devtools to debug runtime issues.
- To reproduce API errors, set `VITE_API_BASE_URL` in `.env` or pass via Vite environment (e.g., create `.env.local` with `VITE_API_BASE_URL=http://backend:8000`).

What developers typically change
- UI pages under `src/pages/` (routing, forms, auth flows)
- `src/utils/api.js` when updating API contract handling
- Layouts under `src/components/layout/` for app chrome

Helpful examples (search these when making changes)
- Login flow: [src/pages/Login.jsx](src/pages/Login.jsx)
- API client + env: [src/utils/api.js](src/utils/api.js)
- Validation UI: [src/utils/handleValidationErrors.js](src/utils/handleValidationErrors.js)

Practical AI agent rules
- Keep edits minimal and focused: change only the files required for the task.
- Preserve DOM-based error conventions and `localStorage` keys unless migrating them project-wide with coordinated frontend changes.
- When adding or changing env-vars, update README and mention `VITE_API_BASE_URL` explicitly.
- If proposing to remove legacy `public/js` scripts, confirm they are not referenced from any served HTML templates or `index.html`.

If anything in this guidance is unclear or you want me to expand a section (build, env, routing examples), tell me which part to iterate on.
