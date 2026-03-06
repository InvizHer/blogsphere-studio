

---

````markdown
## Deploy to Cloudflare Pages (Using Command Prompt / Wrangler CLI)

This project can be deployed to **Cloudflare Pages** using the **Wrangler CLI** from the command prompt.  
Cloudflare Pages provides **free global CDN hosting, automatic SSL, and fast deployment** for static web applications.

---

## Prerequisites

Before deploying, make sure you have the following installed:

- **Node.js v18 or later**
- **npm**
- **Git**
- **Cloudflare account**

Verify installations:

```bash
node -v
npm -v
git --version
````

---

## 1. Install Wrangler CLI

Wrangler is the official command line tool used to deploy projects to Cloudflare.

Install Wrangler globally:

```bash
npm install -g wrangler
```

Verify installation:

```bash
wrangler --version
```

---

## 2. Login to Cloudflare

Authenticate Wrangler with your Cloudflare account.

```bash
wrangler login
```

A browser window will open asking you to authorize Wrangler.

---

## 3. Navigate to the Project Directory

Open **Command Prompt / Terminal** and move to your project folder.

Example:

```bash
cd C:\Users\YourUsername\Downloads\inkwell
```

---

## 4. Install Project Dependencies

Install all required dependencies:

```bash
npm install
```

---

## 5. Configure Environment Variables

Create the `.env` file from the example template:

```bash
copy .env.example .env
```

Open the `.env` file and update the Supabase credentials.

Example:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
VITE_SUPABASE_PROJECT_ID=your_project_ref
```

You can find these values in:

```
Supabase Dashboard → Settings → API
```

---

## 6. Build the Project

Create the optimized production build:

```bash
npm run build
```

This command generates the production files inside the `dist/` folder.

---

## 7. Create a Cloudflare Pages Project

Create a new Cloudflare Pages project using Wrangler.

```bash
wrangler pages project create inkwell
```

---

## 8. Deploy the Website

Deploy the production build to Cloudflare Pages.

```bash
wrangler pages deploy dist --project-name=inkwell
```

After deployment completes, Cloudflare will provide a URL like:

```
https://inkwell.pages.dev
```

Your website is now live.

---

## Updating the Website

Whenever you make changes to the project, rebuild and redeploy.

```bash
npm run build
wrangler pages deploy dist --project-name=inkwell
```

---

## SPA Routing Configuration

This project uses **client-side routing**.
To prevent 404 errors when refreshing pages, a routing rule is included.

File:

```
public/_redirects
```

Content:

```
/*    /index.html   200
```

This ensures all routes correctly load the React application.

---

## Custom Domain Setup

You can connect a custom domain from the Cloudflare dashboard.

Steps:

1. Go to **Cloudflare Dashboard**
2. Open **Workers & Pages**
3. Select your project
4. Click **Custom Domains**
5. Click **Set up a custom domain**
6. Enter your domain name
7. Follow the DNS configuration instructions

Cloudflare automatically provisions **free SSL certificates**.

---

## Environment Variables in Cloudflare Dashboard

Environment variables can also be configured directly in the dashboard.

Steps:

1. Go to **Workers & Pages → Your Project**
2. Click **Settings**
3. Open **Environment Variables**
4. Add the required variables:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

After updating environment variables, redeploy the site.

---

## Deployment Architecture

```
User
 ↓
Cloudflare Pages (Frontend Hosting)
 ↓
React + Vite Application
 ↓
Supabase Backend (Database, Authentication, Storage)
```

This setup provides:

* Free hosting
* Global CDN
* Automatic SSL
* Fast static site delivery
* Scalable backend services

```

---


```
