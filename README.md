# Auth System — Frontend (Angular 17)

## Live Demo
- Frontend: https://YOUR-FRONTEND-URL.onrender.com
- Backend API: https://YOUR-BACKEND-URL.onrender.com/api-docs

## Stack
- Angular 17 (Standalone + Modules)
- Reactive Forms
- JWT Interceptor (auto-attaches Bearer token)
- Route Guards (authGuard, adminGuard)
- Fake Backend Interceptor for Stage A testing
- Lazy-loaded feature modules

## Local Setup

### 1. Install
```bash
cd frontend
npm install
```

### 2. Run (with Fake Backend)
```bash
npm start
# App runs on http://localhost:4200
# useFakeBackend: true in environment.ts enables the mock API
```

### 3. Switch to Real Backend (Stage B)
In `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  useFakeBackend: false   // <-- set to false
};
```

## Production Build
```bash
npm run build:prod
# Output: dist/auth-frontend/
```

## Deployment (Render.com Static Site)
1. Create a **Static Site** on Render
2. Build Command: `npm run build:prod`
3. Publish Directory: `dist/auth-frontend/browser`
4. Add Rewrite Rule: Source `/*` → Destination `/index.html` (Status 200)
   (This fixes deep-link 404s for SPA routing)
5. Update `src/environments/environment.prod.ts` with your backend URL

## Stages

### Stage A — Fake Backend
- Set `useFakeBackend: true` in environment.ts
- Register → alert shows verification token
- Copy token into `/account/verify-email?token=<TOKEN>`
- Login works with stored fake credentials
- First registered user gets Admin role

### Stage B — Live Backend
- Set `useFakeBackend: false`
- Update `environment.prod.ts` with real API URL
- Real email via Ethereal/Mailtrap
- Check Application → Cookies for refreshToken

## Features
- Registration with email verification
- JWT authentication with auto-refresh
- Refresh token rotation (HttpOnly cookie)
- RBAC: Admin panel restricted by role guard
- Password reset flow
- Profile editing
- Admin account management panel
