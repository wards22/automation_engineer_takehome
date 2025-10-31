# GitHub Pages Setup Guide

This guide walks through enabling GitHub Pages to host the mock insurance portal.

---

## Step-by-Step Instructions

### 1. Push Repository to GitHub

First, create the repository on GitHub and push your code:

```bash
# Create repository on GitHub.com first, then:
git remote add origin https://github.com/BluesprigHealthcare/automation_engineer_takehome.git
git push -u origin main
```

### 2. Enable GitHub Pages

#### Option A: Using GitHub Actions (Recommended - Modern Method)

1. Go to your repository on GitHub.com
2. Click **Settings** (top navigation bar, far right)
3. In the left sidebar, scroll down and click **Pages** (under "Code and automation" section)
4. Under **Source**, you'll see either:
   - **"Deploy from a branch"** (older interface), OR
   - **"GitHub Actions"** option (newer interface)

**If you see "GitHub Actions":**
- Select **GitHub Actions** as the source
- GitHub will automatically detect the static HTML files
- Click **Configure** next to "Static HTML" workflow
- Commit the workflow file that appears

**If you see "Deploy from a branch":**
- Under **Source**, select **Deploy from a branch**
- Under **Branch**, select:
  - Branch: `main`
  - Folder: `/root` or `/(root)`
- Click **Save**

#### Option B: Manual Branch Configuration (If Available)

If you still see the branch selector:

1. Go to **Settings** → **Pages**
2. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: /(root)
3. Click **Save**

### 3. Configure for Mock Portal Subdirectory

Since our portal is in `/mock-portal`, we have two options:

#### Option 1: Move mock-portal to root (Simplest)

After enabling Pages with root directory, your portal will be at:
`https://bluesprighealthcare.github.io/automation_engineer_takehome/mock-portal/`

**No additional configuration needed!**

#### Option 2: Use GitHub Actions for Custom Path (Advanced)

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy Mock Portal

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './mock-portal'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

This will deploy ONLY the mock-portal directory as the root of your Pages site.

### 4. Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow running (either "pages build and deployment" or your custom workflow)
3. Wait for it to complete (usually 30-60 seconds)
4. Look for a green checkmark ✅

### 5. Find Your Portal URL

#### Method 1: Settings → Pages
- Go back to **Settings** → **Pages**
- At the top, you'll see: "Your site is live at `https://...`"
- Copy this URL

#### Method 2: Actions Tab
- Click on the completed workflow
- Look for the deployment URL in the workflow summary

### 6. Test the Portal

Visit your URL (one of these depending on your setup):
- **Option 1**: `https://bluesprighealthcare.github.io/automation_engineer_takehome/mock-portal/`
- **Option 2**: `https://bluesprighealthcare.github.io/automation_engineer_takehome/` (if using custom workflow)

You should see the Insurance Eligibility Portal login page.

### 7. Update README.md

Once you have the live URL, update the main README.md:

```bash
# Edit README.md and replace the placeholder URL
# Change this line:
Use this test site for browser automation: `https://insurance-portal-mock.example.com`

# To this (use your actual URL):
Use this test site for browser automation: `https://bluesprighealthcare.github.io/automation_engineer_takehome/mock-portal/`

# Commit the change
git add README.md
git commit -m "docs: update mock portal URL with live GitHub Pages link"
git push
```

---

## Troubleshooting

### "I don't see the Pages option in Settings"

**Possible causes:**
1. **Repository is private** - Pages may require a paid plan for private repos
   - Solution: Make repository public, OR upgrade to GitHub Pro/Team
2. **You don't have admin access** - Need admin permissions
   - Solution: Ask repository owner to enable it

### "Pages is enabled but showing 404"

1. Check the **Actions** tab - is the deployment workflow successful?
2. Verify the path - try both:
   - `https://[username].github.io/[repo]/`
   - `https://[username].github.io/[repo]/mock-portal/`
3. Make sure `index.html` exists in the directory being deployed
4. Wait a few minutes - sometimes it takes time to propagate

### "The portal loads but looks broken"

Check the browser console for errors. Common issues:
- CSS/JS paths are relative and correct
- No CORS issues (shouldn't be an issue for static sites)

### "Workflow failed"

1. Go to **Actions** tab
2. Click on the failed workflow
3. Read the error message
4. Common fixes:
   - Ensure repository has **Pages** enabled in Settings
   - Check that the workflow has proper permissions
   - Verify the path in the workflow matches your directory structure

---

## Alternative: Using a Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file to `/mock-portal/`:
   ```
   portal.yourcompany.com
   ```

2. Configure DNS with your provider:
   - Type: `CNAME`
   - Name: `portal` (or your subdomain)
   - Value: `bluesprighealthcare.github.io`

3. In GitHub Settings → Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

---

## Quick Reference

### Current GitHub UI (as of 2024-2025)

```
Repository → Settings (top nav) → Pages (left sidebar under "Code and automation")
```

### What You Should See

```
GitHub Pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build and deployment

Source
  ⦿ Deploy from a branch
  ○ GitHub Actions

Branch
  [main ▼]  [/(root) ▼]  [Save]

Your site is live at https://bluesprighealthcare.github.io/automation_engineer_takehome/
```

---

## Need Help?

If you're still having trouble:

1. Check GitHub's official documentation: https://docs.github.com/en/pages
2. Verify your repository is public (or you have a paid plan for private Pages)
3. Try the "GitHub Actions" deployment method instead of branch deployment
4. Contact GitHub support if the Pages option is completely missing

---

## Summary: Simplest Path

1. ✅ Push code to GitHub
2. ✅ Settings → Pages
3. ✅ Source: "Deploy from a branch"
4. ✅ Branch: main, Folder: /(root)
5. ✅ Save
6. ✅ Wait for Actions workflow to complete
7. ✅ Portal will be at: `https://[org].github.io/[repo]/mock-portal/`
8. ✅ Update README.md with this URL
