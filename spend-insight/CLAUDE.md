# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SpendInsight** is a personal finance management application built with React. It provides spending analytics, transaction tracking, expense categorization, and financial reporting. Authentication via Auth0, state management with Redux, and styling with Tailwind CSS.

## Tech Stack

- **Frontend**: React 18.2, React Router 6
- **State Management**: Redux Toolkit + React-Redux
- **Authentication**: Auth0 (@auth0/auth0-react)
- **Styling**: Tailwind CSS with dark mode support (HSL color variables)
- **Charts**: Chart.js, Recharts, Victory
- **API Client**: Axios (baseURL: `http://localhost:3001/api/v1` for dev)
- **Build Tool**: Create React App (react-scripts 5)
- **UI Components**: React Bootstrap, Headless UI, custom UI layer (src/components/ui/)

## Architecture

### Pages (src/pages/)
- **Home.js** - Landing page with login flow (unauthenticated)
- **Dashboard.js** - Analytics overview, spending charts and summaries
- **Transactions.js** - Transaction list, filtering, and management
- **CategoryManagement.js** - Create/edit/delete spending categories
- **LabelManagement.js** - Create/edit/delete transaction labels
- **UserDetails.js** - User profile and settings
- **Reports.js** - Financial reports and exports

### State Management (src/store/)
- **authSlice.js** - Auth state (user info, login/logout via Auth0)
- **transactionSlice.js** - Transaction data and operations
- **store.js** - Redux store configuration (serializableCheck disabled for Auth0 objects)

### Components (src/components/)
- **Layout**: Sidebar.js (navigation), Header.js, Footer.js
- **Auth**: LoginButton.js, LogoutButton.js, Profile.js
- **Transactions**: TransactionItem.js, IncomeItem.js
- **UI**: Modal.js (src/components/ui/)

### API Integration (src/api/api.js)
- Dual setup: Axios for app API, fetch for Auth0 Management API
- Auth0 OAuth token refresh via `fetchManagementApiToken()`
- Bearer token auth for all requests
- `.env` contains `REACT_APP_CLIENT_ID` and `REACT_APP_CLIENT_SECRET`

### Styling (Tailwind CSS)
- **Dark mode**: `darkMode: 'class'` - toggle via `document.documentElement.classList`
- **Color system**: HSL variables (`--primary`, `--background`, etc.) - see tailwind.config.js
- **Responsive**: Mobile-first, uses Tailwind's md: breakpoint for tablet+ layouts

## Common Development Tasks

### Start Development Server
```bash
npm start
```
Runs on `http://localhost:3000` with HTTPS enabled. Auto-reload on file changes. Watch console for lint errors.

### Run Tests
```bash
npm test
```
Launches Jest in watch mode. Press `a` to run all tests, `f` to run only failed tests.

### Build for Production
```bash
npm run build
```
Creates optimized build in `build/` folder. Code is minified and hashed for cache busting.

### Add Dependencies
Use `npm install <package>` but note: CRA has strict peer dependency rules. If conflicts arise, check compatibility before forcing resolution.

## Key Patterns & Conventions

### Auth Flow
1. `App.js` reads `useAuth0()` hook at root level
2. On auth state change, dispatches `authActions.login(user)` or `authActions.logout()` to Redux
3. Protected routes check `isAuthenticated` and redirect to `/` (Home) if false
4. Auth token passed to API calls via `Authorization: Bearer ${token}` header

### Redux Usage
- Slices follow Redux Toolkit conventions (immer, auto-generated actions)
- Dispatch actions from component via `useDispatch()`
- Access state via `useSelector()` - avoid deep subscriptions, use selectors
- Auth data stored despite non-serializable warning (Config option: `serializableCheck: false`)

### Component Patterns
- Page components receive `user` prop from App.js routes
- State fetching typically done in `useEffect()` with `dispatch()` or Axios calls
- Loading states managed via Redux slices or local component state
- UI modals via `Modal.js` - check usage pattern before adding

### Styling Notes
- Use Tailwind utility classes; avoid inline CSS
- Dark mode support: wrap conditional styles with dark: prefix (e.g., `dark:bg-card`)
- Color variables: use `bg-primary`, `text-foreground`, etc. (defined in tailwind.config.js)
- Responsive: default to mobile layout, use `md:` for tablet+ adjustments

### API Integration
- Axios: Used for app backend calls. Base URL configured in `src/api/api.js`
- Auth0 Management API: Direct fetch with Management token for user operations
- Error handling: API errors logged to console; consider adding user-facing error toasts
- Token expiry: Managed by Auth0; useAuth0() hook handles refresh automatically

## Common Gotchas

- **HTTPS Dev Server**: `npm start` sets `HTTPS=true` on Windows; may prompt for self-signed cert
- **Auth0 Secrets in .env**: `REACT_APP_CLIENT_ID` and `REACT_APP_CLIENT_SECRET` are exposed to browser - use only public/non-sensitive flows
- **Tailwind Dark Mode**: Changes apply to `<html>` element; ensure CSS loads before toggle
- **Redux Serialization**: Non-serializable warnings from Auth0 objects are expected and suppressed
- **API BaseURL**: Hardcoded to `http://localhost:3001/api/v1` (dev); switch URL in `api.js` for different environments

## Project Layout
```
src/
├── pages/              # Route-level page components
├── components/         # Reusable components (layout, UI, forms)
│   └── ui/            # Modal and custom UI components
├── store/             # Redux slices and store configuration
├── api/               # API client setup (Axios, Auth0)
├── App.js             # Root component with routing and auth setup
├── AppRouter.js       # Unused; routing in App.js instead
├── index.js           # React entry point
└── index.css          # Global styles (Tailwind imports)
public/               # Static assets
```

## When Adding Features

- **New page**: Create in `src/pages/`, add Route in `App.js`, add Sidebar link in `Sidebar.js`
- **New API endpoint**: Add to `src/api/api.js`, then dispatch Redux action to store result
- **New component**: Place in `src/components/` if reusable, inline in page if page-specific
- **Dark mode support**: Test both light and dark; use `dark:` Tailwind classes for contrast
- **Auth-protected features**: Guard routes in App.js; useAuth0() and Redux auth state should agree
