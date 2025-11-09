# Frontend Setup – Workshop 3

This guide explains how to set up and run the frontend application for Workshop 3. The frontend interacts with two backend APIs: the authentication backend and the course management backend.

## Directory Structure

The repository is organized as follows:

Workshop/
├─ Workshop 1/
├─ Workshop 2/
├─ Workshop 3/
│ ├─ backend-auth/
│ ├─ backend-course/
│ └─ frontend-app/


All setup instructions should be executed from the `frontend-app` directory.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A running instance of both backend APIs

## Setup Instructions

1. Open a terminal and navigate to the frontend directory:

```bash
cd Workshop/Workshop\ 3/frontend-app
```
2. Install Dependencies:

```bash
npm install
```

3. Configure API endpoints (if necessary):

By default, the frontend uses the following base URLs configured via proxy:

- Course API: /course-api
- Auth API: /auth-api

Update src/api/ files if your backend URLs differ.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
[text](http://localhost:5173)

You should see the frontend running and ready to interact with the backends.

## Notes
- Ensure that both backend servers are running before launching the frontend.
- Tokens will be stored in localStorage for API authentication.
- For production builds, use:
```bash
npm run dev
npm run preview
```

This will generate optimized assets in the dist/ folder and serve them locally.

## References
- [text](https://vite.dev/)
- [text] https://axios-http.com/
- [text] https://mui.com/material-ui/all-components/
