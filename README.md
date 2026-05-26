# sinterklaas-client

Next.js 16 frontend for the Sinterklaas Secret Santa app. Uses the App Router, React 19, and Tailwind CSS v4.

## Stack

- **Next.js 16** (App Router, `src/app/` directory)
- **React 19**
- **Tailwind CSS v4** via `@tailwindcss/postcss`

## Running locally

```bash
npm install
npm run dev   # starts on http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint
```

## Environment variables

Create a `.env.local` file in this directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GROUP_ID=<MongoDB ObjectId of your event>
```

`NEXT_PUBLIC_API_URL` — base URL for all API calls to `sinterklaas-api`.  
`NEXT_PUBLIC_GROUP_ID` — the event/group that the app operates on. Obtain this by POSTing to `/api/groups` on the backend and copying the returned `id`.

## Pages and routes

| Route | Description |
|---|---|
| `/` | Home / landing page |
| `/dashboard` | Group dashboard — lists all members and lets you browse their wishlists |
| `/wishlists/[userId]` | Wishlist detail for a specific user |
| `/profile/edit` | Edit your display name and email |
| `/profile/partner` | Link or unlink a partner |
| `/profile/children` | Register and manage children |
| `/admin/members` | Admin: view and remove group members |
| `/admin/invite` | Admin: generate an invitation link |
| `/admin/draw` | Admin: run and view Secret Sinterklaas name assignments |

## Key source directories

```
src/
  app/          # Next.js App Router pages and layout
  components/
    nav/        # Navbar with profile and admin controls
    wishlist/   # Wishlist item card, list, add form, error banner
  lib/          # API client modules (groupApi, userApi, wishlistApi)
```
