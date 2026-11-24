# Deployment Guide - VS Code

## 🚀 Quick Deploy from VS Code

### Option 1: VS Code Tasks (Recommended)

**One-Click Deployment:**
1. Press `Ctrl+Shift+P` (Command Palette)
2. Type "Run Task"
3. Select "Deploy to Production"

**Available Tasks:**
- **Build React App** - Builds production bundle
- **Deploy to Production** - Uploads to server
- **Build and Deploy** - Does both in sequence
- **Run Development Server** - Starts local dev server

Or use keyboard shortcut: `Ctrl+Shift+B` → Select task

---

### Option 2: PowerShell Script

**From VS Code Terminal:**
```powershell
# Deploy with default settings
.\deploy.ps1

# Preview locally, then deploy once you confirm it looks right
.\preview-and-deploy.ps1

# Or with custom server
.\deploy.ps1 -Server "82.180.139.4" -User "root"
```

---

### Option 3: Manual Terminal Commands

**From VS Code integrated terminal:**
```powershell
# 1. Build the app
npm run build

# 2. Deploy via SCP
scp -r dist/* root@82.180.139.4:/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html/
```

---

## 🔧 Setup Requirements

### First-Time Setup

**1. Install SSH Client (if not already installed)**
Windows 10/11 usually has OpenSSH installed. Verify:
```powershell
ssh -V
```

**2. Configure SSH Key (Optional but Recommended)**
```powershell
# Generate SSH key
ssh-keygen -t rsa -b 4096

# Copy to server (replace with your server)
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh root@82.180.139.4 "cat >> ~/.ssh/authorized_keys"
```

This allows deployment without password prompts.

**3. Test Connection**
```powershell
ssh root@82.180.139.4 "echo 'Connection successful'"
```

---

## 📝 Deployment Checklist

Before deploying:
- [ ] Updated `.env` with correct API URL
- [ ] Tested locally with `npm run dev`
- [ ] No console errors in browser
- [ ] API endpoints working
- [ ] Images loading correctly
- [ ] Build succeeds: `npm run build`

After deploying:
- [ ] Visit https://server.danceacademywhitemountains.com
- [ ] Check browser console for errors
- [ ] Test login at /login
- [ ] Verify API connections
- [ ] Test on mobile device

---

## 🐛 Troubleshooting

### "Permission Denied" Error
```powershell
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "scp: command not found"
Install OpenSSH:
- Settings → Apps → Optional Features → Add OpenSSH Client

### Build Errors
```powershell
# Clear node_modules and reinstall
Remove-Item node_modules -Recurse -Force
npm install
npm run build
```

### SSH Connection Issues
```powershell
# Test SSH connection
ssh root@82.180.139.4

# If using password, make sure you have credentials
# If using SSH key, verify key is copied to server
```

---

## 🔄 Alternative: Git-Based Deployment

**Setup on Server:**
```bash
# SSH into server
ssh root@82.180.139.4

# Clone repo (first time only)
cd /home/derekmwallace19
git clone https://github.com/yourusername/dance-react.git
cd dance-react
npm install

# Build and deploy
npm run build
cp -r dist/* ../web/server.danceacademywhitemountains.com/public_html/
```

**Deploy Updates:**
```bash
git pull
npm install
npm run build
cp -r dist/* ../web/server.danceacademywhitemountains.com/public_html/
```

---

## 📊 Deployment Targets

| Environment | URL | Path |
|-------------|-----|------|
| **Production** | server.danceacademywhitemountains.com | `/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html/` |
| **API Backend** | api.danceacademywhitemountains.com | Running on PM2 |
| **Admin Panel** | api.danceacademywhitemountains.com/admin | Part of backend |

---

## 🎯 Quick Reference

```powershell
# Development
npm run dev          # Start dev server

# Build
npm run build        # Create production build

# Local preview of production build
npm run preview:local # Preview the built site on http://127.0.0.1:4173

# Deploy
.\deploy.ps1         # Build + Deploy to server
.\preview-and-deploy.ps1  # Build, preview locally, then deploy after confirmation

# Preview build locally
npm run preview      # Test production build locally
```

---

Created: December 23, 2025
