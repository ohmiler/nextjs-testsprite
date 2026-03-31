This is a simple Next.js auth app with Tailwind CSS and SQLite.

## Features

- User registration with hashed passwords
- Email/password login
- SQLite persistence in `data/app.db`
- Secure HttpOnly session cookies
- Protected dashboard route and logout flow

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## How It Works

- The app creates `users` and `sessions` tables automatically on first load.
- Sessions are stored in SQLite and linked to a random token kept in a secure cookie.
- Unauthenticated users are redirected away from `/dashboard`.

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Notes

- The SQLite database file is ignored by git.
- In development, cookies are not marked `secure` so login works on `http://localhost`.
- In production, the session cookie is marked `secure` automatically.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
