Great — we’ll **restart completely from zero** and deploy your project to **Cloudflare Pages using Wrangler CLI**.
This guide assumes **nothing is installed yet** on your Windows laptop.

Follow the steps **exactly in order**.

---

# 1️⃣ Install Node.js

Your project requires **Node.js 18 or higher**. 

### Step 1

Go to:

```
https://nodejs.org
```

### Step 2

Download **LTS version**.

### Step 3

Run the installer and keep everything **default → Next → Install**.

### Step 4

After installation, open **Command Prompt**.

Press:

```
Windows + R
```

Type:

```
cmd
```

### Step 5

Verify Node installation.

```bash
node -v
npm -v
```

You should see something like:

```
v20.x.x
10.x.x
```

---

# 2️⃣ Install Git

Download Git:

```
https://git-scm.com/download/win
```

Install using default settings.

Check installation:

```bash
git --version
```

Example output:

```
git version 2.xx.x
```

---

# 3️⃣ Install Wrangler CLI (Cloudflare tool)

Run:

```bash
npm install -g wrangler
```

Verify:

```bash
wrangler --version
```

Example:

```
wrangler 3.x.x
```

---

# 4️⃣ Create Cloudflare Account

Go to:

```
https://dash.cloudflare.com
```

Create a free account and verify email.

---

# 5️⃣ Login to Cloudflare from Terminal

Run:

```bash
wrangler login
```

What happens:

1. Browser opens
2. Cloudflare authorization page appears
3. Click **Allow**

Terminal will show:

```
Successfully logged in.
```

---

# 6️⃣ Go to Your Project Folder

Example if your project is here:

```
C:\Users\Lenovo\Downloads\inzblog
```

Run:

```bash
cd C:\Users\Lenovo\Downloads\inzblog
```

Check files:

```bash
dir
```

You should see:

```
package.json
src
public
vite.config.ts
```

---

# 7️⃣ Remove Old Packages (very important)

Because you previously had SWC errors.

Run:

```bash
rmdir /s /q node_modules
del package-lock.json
```

Clean cache:

```bash
npm cache clean --force
```

---

# 8️⃣ Install Project Dependencies

Run:

```bash
npm install
```

Wait until installation finishes.

---

# 9️⃣ Create Environment File

Run:

```bash
copy .env.example .env
```

Open it:

```bash
notepad .env
```

Add your Supabase values.

Example:

```
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

Save and close.

These values come from **Supabase Dashboard → Settings → API**. 

---

# 🔟 Build the Project

Run:

```bash
npm run build
```

If successful you will see something like:

```
✓ built in 3.5s
```

Check build folder:

```bash
dir dist
```

You should see:

```
index.html
assets
```

This is your **production website**.

---

# 1️⃣1️⃣ Create Cloudflare Pages Project

Run:

```bash
wrangler pages project create inzblog
```

Example output:

```
Project created successfully
```

---

# 1️⃣2️⃣ Deploy Website

Run:

```bash
wrangler pages deploy dist --project-name=inzblog
```

After deployment finishes you will see something like:

```
✨ Deployment complete!
```

Cloudflare will give a URL like:

```
https://inzblog.pages.dev
```

Your website is now **live on the internet** 🚀

---

# 1️⃣3️⃣ Open Your Website

Open browser and visit:

```
https://inzblog.pages.dev
```

Your blog platform should load.

---

# 1️⃣4️⃣ Add Environment Variables in Cloudflare

Go to:

```
Cloudflare Dashboard
→ Workers & Pages
→ inzblog
→ Settings
→ Environment Variables
```

Add:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

Redeploy if needed.

---

# 1️⃣5️⃣ Add Custom Domain (Optional)

In Cloudflare dashboard:

```
Workers & Pages
→ inzblog
→ Custom Domains
→ Set up custom domain
```

Example:

```
blog.yoursite.com
```

If your domain is already on Cloudflare DNS it will connect automatically.

Otherwise Cloudflare will give a DNS record like:

```
CNAME blog → inzblog.pages.dev
```

Add that to your domain DNS.

SSL will be **automatic and free**.

---

# 1️⃣6️⃣ Updating Your Website Later

Whenever you change code run:

```bash
npm run build
```

Then deploy again:

```bash
wrangler pages deploy dist --project-name=inzblog
```

Your site updates instantly.

---

# 🧾 Full Command List (Quick Reference)

```
node -v
npm -v
git --version

npm install -g wrangler
wrangler login

cd C:\Users\Lenovo\Downloads\inzblog

rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

npm install

copy .env.example .env
notepad .env

npm run build

wrangler pages project create inzblog
wrangler pages deploy dist --project-name=inzblog
```

---

✅ After this you will have:

* Free hosting
* Global CDN
* SSL certificate
* Custom domain support
* React + Supabase running

Your site will run **24/7 globally**.

---

