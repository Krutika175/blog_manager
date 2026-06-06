# QuirkWrite

A full-stack blog management app built with React, Vite, Express, MongoDB, and Google OAuth.

## Structure

- `backend/` - Express server, MongoDB models, API routes, and OAuth auth flow.
- `frontend/` - React single-page app with dashboard, blog CRUD, and light/dark mode.

## Features

- Login with Google OAuth
- Create, read, update, delete blogs
- Light mode by default, with dark mode toggle
- MongoDB backend using the provided Atlas connection string

## Run locally

1. Install dependencies:
   - `npm install`
   - `npm --prefix backend install`
   - `npm --prefix frontend install`

2. Start the app from the repository root:
   - `npm.cmd run dev`
   - or double-click `run-dev.cmd`
   - or use the VS Code task: `Terminal > Run Task... > Run QuirkWrite Dev`

3. Open the combined app at:
   - `http://localhost:5173`

The frontend proxy forwards `/api` calls to the backend at port `4000`, so the app runs from a single host URL.

## Deployment

### Frontend on Vercel

1. Create a new Vercel project using the `frontend` folder as the project root.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Add the environment variable:
   - `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com`
4. Deploy and confirm the site loads.

### Backend on Render

1. Create a new Render Web Service from this repository.
2. Set the root directory to `backend`.
3. Configure the build command as `npm install` and start command as `npm start`.
4. Add the environment variables in Render:
   - `MONGODB_URI` with your Atlas connection string
   - `SESSION_SECRET` with a secure string
   - `CLIENT_HOME_URL=https://<your-frontend-site>.vercel.app`

### Best practices

- Keep secrets out of source control. Use Render and Vercel environment variables instead of committing `.env` values.
- For local development, continue to use `backend/.env`.
- If you deploy the frontend separately, make sure `VITE_API_BASE_URL` points to the Render backend URL.
