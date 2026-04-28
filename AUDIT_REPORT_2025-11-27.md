# VGL Project — Audit Report (27 Nov 2025)

**Short note:**
Yeh report simple hinglish mein hai — seedha, saaf aur practical. Aaj jo mainne dekha aur jo fix kiye, sab likha hai. Neeche major → minor cheezen, jo already solve hua aur jo abhi karna chahiye.

---

**Summary (Ek nazar):**
- Project: Laravel backend + React (Vite) frontend.
- Aaj focus: admin login, CORS, Sanctum/auth, certificate create/delete, image upload, Tiptap editor, PayPal flow.
- Outcome: Backend + frontend ke kuch major bugs solve hue; PayPal cancel redirect fixed; certificate numbering fixed to avoid reusing soft-deleted numbers; editor content and image handling improved.

---

**Kya maine check kiya (rough list):**
- Backend files: `routes/web.php`, `routes/api.php`, `app/Http/Controllers/AdminAuthController.php`, `app/Http/Controllers/CertificateController.php`, `app/Http/Controllers/CertificateOrderController.php`, `app/Models/Certificate.php`, `config/auth.php`, `config/sanctum.php`, `config/cors.php`, `bootstrap/app.php`, `.env`.
- Frontend files: `src/App.tsx`, `src/pages/AdminLogin.tsx`, `src/pages/CertificateView.tsx`, `src/contexts/AuthContext.tsx`, `src/components/CertificateForm.tsx`, `src/components/Input.tsx`, `src/components/TiptapEditor.tsx`, `src/components/BlogForm.tsx`, `src/components/BlogView.tsx`, `src/components/PaymentList.tsx`, other small components.

---

**Major fixes done today (jo already solve ho chuke):**
1. CORS & API access
   - Problem: Frontend dev (vite on 5173) could not talk to backend (8000) due to CORS and inconsistent middleware.
   - Fix: reconciled middleware and config. `config/cors.php` updated (supports_credentials true, allowed origins includes frontend). Custom `HandleCors` updated to include proper headers for preflight and standard requests.
   - Result: API calls allowed from frontend (dev).

2. Admin auth (Sanctum & guards)
   - Problem: `admin-api` guard used wrong driver (`token`) so Sanctum token auth not working as expected.
   - Fix: changed `admin-api` guard to use `sanctum` in `config/auth.php`, added `admin` to `config/sanctum.php` guard list, cleared config cache.
   - Result: Token creation and auth flows now match Sanctum usage.

3. Admin login flow on frontend
   - Problem: Login succeeded but frontend didn't redirect; also noisy console logs exposed tokens.
   - Fixes:
     - Added `navigate('/admin')` after successful `login()` in `AdminLogin.tsx`.
     - Removed console logs that printed token or sensitive info in `AuthContext.tsx`.
   - Result: Clean, secure flow and automatic redirect to admin dashboard on login.

4. Certificate numbering and soft deletes
   - Problem: When a certificate was soft-deleted, `nextNumber()` could reuse numbers (causing unique constraint errors).
   - Fix: `CertificateController::nextNumber()` now considers `withTrashed()` so number keeps increasing and does not reuse deleted numbers.
   - Result: No "already taken" errors when creating new cert after deletion.

5. Certificate create immediate refresh
   - Problem: After creating certificate via modal, list didn't refresh until tab change or manual refresh.
   - Fix: After `CertificateForm` success, call `fetchData()` in `AdminDashboard` to immediately refresh certificates list.
   - Result: Real-time update of list after creation.

6. File upload directories
   - Problem: `public/uploads/certificates` missing causing upload or move errors.
   - Fix: Created `public/uploads` and `public/uploads/certificates` and ensured backend writes there.

7. Image handling in editor + BlogView
   - Problem: Tiptap editor `content` prop didn't update editor on changes; image URLs sometimes relative and didn't show.
   - Fixes:
     - Tiptap editor: added `useEffect` to update editor when `content` prop changes.
     - Image prompt: if user enters `/uploads/...` the frontend now converts to full URL (prefix `VITE_BASE_URL`) so images uploaded to backend show correctly.
     - Blog detail page image styles added.

8. Input component bug fix
   - Problem: `Input.tsx` got corrupted (duplicate attributes) and caused MIME / module load error.
   - Fix: Restored clean Input component; made `onChange` optional and added `readOnly` prop support.
   - Result: No more runtime module errors and certificate number field can be read-only.

9. Certificate form validation & error UI
   - Problem: Backend returned 422 or 500 but frontend showed vague messages.
   - Fix: Improved error handling in `CertificateForm.tsx` to show backend validation messages and server errors via `toast` and local `errors` state.

10. PayPal cancel & redirect
   - Problem: PayPal cancel returned to backend route without port or wrong URL and gave 404; after return certificate view not loaded properly.
   - Fixes:
     - Ensured `FRONTEND_URL` in `.env` set to `http://localhost:5173` and `APP_URL` uses port `8000`.
     - Added explicit cancel route behavior in `web.php` to find order, mark `status=cancelled`, and redirect to frontend `certificate/:number?payment=cancelled`.
     - On frontend, changed `CertificateView` to fetch the certificate by its `:number` param via `/api/search/{certificate_number}` endpoint instead of loading all certs and relying on client state.
   - Result: Cancel flow now lands on frontend certificate page and shows the certificate. (Further notes below.)

---

**Minor fixes done:**
- Removed debug console logs that exposed sensitive data.
- Small styling tweaks for blog images and certificate page to ensure images show nicely.
- Added server-side try/catch logging during cert create to expose errors in laravel logs.

---

**Files changed today (important ones):**
- backend/config/auth.php
- backend/config/sanctum.php
- backend/config/cors.php
- backend/.env (APP_URL updated, FRONTEND_URL present)
- backend/bootstrap/app.php (middleware changes)
- backend/routes/web.php (paypal/cancel handler adjusted)
- backend/app/Http/Controllers/CertificateController.php (withTrashed + error logging)
- backend/app/Http/Controllers/CertificateOrderController.php (checked cancel/return logic)
- frontend/src/contexts/AuthContext.tsx (login/store token handling, removed logs)
- frontend/src/pages/AdminLogin.tsx (navigate on success)
- frontend/src/pages/CertificateView.tsx (use API search, load by URL param)
- frontend/src/components/CertificateForm.tsx (error handling, immediate onSuccess fetch)
- frontend/src/components/Input.tsx (fixed corruption, readOnly/onChange optional)
- frontend/src/components/TiptapEditor.tsx (update editor on prop change, improved image add)
- frontend/src/pages/AdminDashboard.tsx (fetchData on modal close; blog modal handling)
- frontend/src/components/BlogForm.tsx / BlogView.tsx (image handling + styling)
- frontend/src/components/PaymentList.tsx (button styles checked)

---

**Remaining issues / recommendations (priority order)**

**Major (please do soon):**
1. Token storage & security
   - Abhi token is stored in `localStorage`. Yeh XSS risk hai. Recommend:
     - Use httpOnly cookies for Sanctum first-party SPA auth OR
     - If storing token in localStorage is required, at least reduce scope, rotate tokens, and implement strict CSP + sanitize inputs.

2. Production CORS / environment
   - `config/cors.php` allows wide domains in dev. For production, lock down allowed origins, enable HTTPS only, and set `supports_credentials` carefully.
   - Make sure `APP_URL`, `FRONTEND_URL`, `PAYPAL_*` are correct for prod and not committed to repo.

3. CSRF and API mode
   - You used custom `HandleCors`. Consider relying on Laravel's official CORS middleware and remove custom one to avoid header mismatches.
   - Ensure CSRF protection for first-party session auth endpoints (for Sanctum SPA session mode) if switching to cookie-based auth.

4. File storage & security
   - Right now files are saved to `public/uploads/certificates`. Recommend moving to a safer disk or at least scanning images, validating file types and names, and add thumbnails.
   - Add storage lifecycle (cleanup) or S3 for production.

5. Validation & error UX
   - Some server errors caused 500 earlier. Add better server-side guards and user-facing friendly messages. Also make sure to log full stack traces only to logs (not to client).

6. Tests
   - No automated tests visible. Add unit tests for controllers (certificate create, nextNumber), and integration/E2E for PayPal flow.

**Medium:**
1. XSS and sanitization for blog content
   - Tiptap stores HTML. Sanitize HTML on server output or use trusted-html patterns. Otherwise content may include scripts.
2. Logging & monitoring
   - Centralize logs and error tracking (Sentry or similar) for server errors.
3. PayPal flow robustness
   - Add reconciliation checks for returned tokens and retry logic.

**Low / Nice to have:**
1. Linting / Prettier / TS strictness (some TS implicit any warnings exist). Improve types.
2. Accessibility checks for modals and forms.
3. Add unit/visual tests for UI components.
4. Optimize images on upload (resize, webp) and use CDN.

---

**How to reproduce/check important items I fixed (quick steps):**
- Admin login + redirect:
  1. Run backend: `php artisan serve` (http://localhost:8000)
  2. Run frontend: `npm run dev` (Vite on http://localhost:5173)
  3. Go to Admin -> login with seeded admin (e.g., `admin@certificate.com` / `admin123`) and confirm redirect to `/admin`.

- Create certificate:
  1. Admin Dashboard -> Add Certificate -> upload image -> fill fields -> Create
  2. Check that the list updates immediately (no manual refresh).

- PayPal cancel flow:
  1. Start a physical order -> it opens PayPal sandbox page
  2. Click `Cancel and return to Laravel` → should redirect back to `http://localhost:8000/paypal/cancel/{order}` then redirect to frontend `http://localhost:5173/certificate/{certificate_number}?payment=cancelled`
  3. Certificate page should load and show cancelled status.

- Certificate numbering when deleted:
  1. Soft-delete a certificate (via admin delete)
  2. Create a new certificate — number should increase, not reuse deleted number.

---

**Files / lines you may want to review again (I touched these):**
- `backend/config/auth.php` — check guard changes
- `backend/config/sanctum.php` — confirm guard list
- `backend/routes/web.php` — PayPal cancel/return logic; I added redirect helper
- `backend/app/Http/Controllers/CertificateController.php` — `nextNumber()` and store logic
- `frontend/src/contexts/AuthContext.tsx` — token storage (consider httpOnly cookies)
- `frontend/src/components/Input.tsx` — now supports readOnly
- `frontend/src/pages/CertificateView.tsx` — now fetches a single certificate by number

---

**Suggested immediate next steps (practical & small):**
1. Replace localStorage token usage with httpOnly cookie flow if you want stronger security (requires Sanctum SPA session setup). (High)
2. Add server-side HTML sanitization for blog content before saving or when rendering. (High)
3. Add automated tests for certificate create/nextNumber and PayPal cancel/return. (Medium)
4. Move file uploads to dedicated storage or S3 for production. (Medium)
5. Add CI step that runs lint + tests and blocks PRs. (Medium)

---

**Questions for you before I continue:**
- Kya aap chahenge ki main `localStorage` token ko httpOnly cookie flow mein convert kar dun (thoda backend + frontend change)?
- Koi priority: security pe kaam karna (tokens/images) ya UX (editor, image gallery) pe zyada focus karna?

---

Agar aap approve karte ho, main yeh kar sakta hoon next:
- Implement httpOnly cookie auth with Sanctum (step-by-step and test)
- Add HTML sanitization for blog content and re-check Tiptap behavior
- Add a basic test suite for certificate controller and PayPal flow


*Report created automatically on 27 Nov 2025.*
