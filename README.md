# Final Project – Restaurant Web App

Modern React/Vite single-page application for a restaurant: browse the menu, manage cart/wishlist, book reservations, place and track orders, and operate an admin dashboard with live Firebase data.

## Features
- Public site: hero, chefs, grid/sections, contact, search, dish detail pages.
- Commerce: cart, wishlist, shipping, order confirmation, PayPal or cash on delivery payments, order tracking.
- Reservations: booking flow plus “My Reservations” (protected).
- Auth: email/password (Firebase) with guarded routes; language toggle (En/Ar); light/dark theme via context.
- Chat: embedded chat widget and Firestore-backed chat data.
- Admin (`/admin/*`): orders (accept/reject/update tracking), reservations, menu CRUD with image uploads to Firebase Storage, chat view, charts/metrics.

## Tech Stack
- React 19, Vite, React Router 7
- Redux Toolkit for state, React Toastify for notifications
- Bootstrap/Icons, Swiper/Carousel, Framer Motion for UI/UX
- Firebase (Auth, Firestore, Realtime DB, Storage)
- PayPal SDK, Chart.js via react-chartjs-2

## Getting Started
1) Install dependencies  
```bash
npm install
```
2) Run the dev server  
```bash
npm run dev
```
3) Build / preview  
```bash
npm run build
npm run preview
```
4) Lint  
```bash
npm run lint
```

## Configuration
Firebase keys are currently hard-coded in `src/firebase/firebase.jsx`. For your own project, move them to environment variables (e.g., `VITE_FIREBASE_API_KEY`, etc.) and import from `import.meta.env`. PayPal client ID should also be provided via env if you enable PayPal buttons.

## Admin Access
- Admin email is hard-coded as `admin@gmail.com`. Only this account can open `/admin/*`. Update the check in `src/Pages/AdminDashBoard/AdminDashboard.jsx` to change the admin policy.

## Project Structure (high level)
- `src/App.jsx` – routes/layout, global providers, toast/chat/footer.
- `src/Pages` – screens (Home, Menu, Dishes, Cart, Shipping, Reservations, Orders, OrderTracking, Auth, Admin dashboard, etc.).
- `src/Components` – shared UI (Nav, Footer, Hero, Grid, Banner, Chat widgets, etc.).
- `src/redux` – store and slices.
- `src/firebase` – Firebase initialization and exports.
- `Images` / `src/assets/Images` – static media.

## Data Notes
- Firestore collections used for orders, reservations, menu items/categories, chat messages, and user data.
- Order updates can propagate to user docs for tracking; Storage is used for menu item images.
