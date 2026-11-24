# React App Integration with Admin Panel API

## 📍 Current Status

✅ **Old Static Site** - `danceacademywhitemountains.com` - RESTORED (unchanged)
✅ **Admin Panel** - `api.danceacademywhitemountains.com/admin` - Running
✅ **API Backend** - `api.danceacademywhitemountains.com/api` - Running
📝 **React App** - `server.danceacademywhitemountains.com` - Needs API integration

---

## 🔧 Update Your React App

### 1. **Set API Base URL**

In your React project: `C:\GitRepo\dance-react`

Create or update your environment file:

**`.env`**
```env
VITE_API_URL=https://api.danceacademywhitemountains.com
```

Or if using Create React App:
```env
REACT_APP_API_URL=https://api.danceacademywhitemountains.com
```

---

### 2. **Create API Service**

**`src/services/api.js`** (or similar)
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.danceacademywhitemountains.com';

export const api = {
  // Gallery
  async getGallery() {
    const response = await fetch(`${API_URL}/api/gallery`);
    return response.json();
  },

  // Staff
  async getStaff() {
    const response = await fetch(`${API_URL}/api/staff`);
    return response.json();
  },

  // News
  async getNews() {
    const response = await fetch(`${API_URL}/api/news`);
    return response.json();
  },

  // Site Settings (logo, contact info)
  async getSettings() {
    const response = await fetch(`${API_URL}/api/settings`);
    return response.json();
  },

  // Programs
  async getPrograms() {
    const response = await fetch(`${API_URL}/api/programs`);
    return response.json();
  },

  // Testimonials
  async getTestimonials() {
    const response = await fetch(`${API_URL}/api/testimonials`);
    return response.json();
  },

  // Highlights
  async getHighlights() {
    const response = await fetch(`${API_URL}/api/highlights`);
    return response.json();
  },

  // Helper to get full image URL
  getImageUrl(path) {
    return `${API_URL}${path}`;
  }
};
```

---

### 3. **Example: Gallery Component**

```javascript
import { useState, useEffect } from 'react';
import { api } from './services/api';

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await api.getGallery();
        setItems(data);
      } catch (error) {
        console.error('Error loading gallery:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="gallery-grid">
      {items.map(item => (
        <div key={item._id} className="gallery-item">
          <img 
            src={api.getImageUrl(item.img)} 
            alt={item.title || 'Gallery image'} 
          />
          {item.title && <h3>{item.title}</h3>}
        </div>
      ))}
    </div>
  );
}
```

---

### 4. **Example: Staff Component**

```javascript
import { useState, useEffect } from 'react';
import { api } from './services/api';

function Staff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    api.getStaff().then(setStaff);
  }, []);

  return (
    <div className="staff-list">
      {staff.map(member => (
        <div key={member._id} className="staff-member">
          {member.img && (
            <img src={api.getImageUrl(member.img)} alt={member.name} />
          )}
          <h3>{member.name}</h3>
          <p className="title">{member.title}</p>
          {member.styles?.length > 0 && (
            <p>Specialties: {member.styles.join(', ')}</p>
          )}
          {member.bio?.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

### 5. **Example: News Component**

```javascript
import { useState, useEffect } from 'react';
import { api } from './services/api';

function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.getNews().then(setNews);
  }, []);

  return (
    <div className="news-list">
      {news.map(item => (
        <article key={item.id} className="news-item">
          <h3>{item.title}</h3>
          <time>{new Date(item.date || item.createdAt).toLocaleDateString()}</time>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}
```

---

### 6. **Example: Using Site Settings (Logo)**

```javascript
import { useState, useEffect } from 'react';
import { api } from './services/api';

function Header() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  return (
    <header>
      {settings?.logoUrl && (
        <img 
          src={api.getImageUrl(settings.logoUrl)} 
          alt={settings.siteName || 'Dance Academy'} 
        />
      )}
      <h1>{settings?.siteName || 'Dance Academy White Mountains'}</h1>
      {settings?.contactPhone && <p>{settings.contactPhone}</p>}
      {settings?.contactEmail && <p>{settings.contactEmail}</p>}
    </header>
  );
}
```

---

## 🏗️ Build & Deploy

### **On Your Local Machine:**

```bash
cd C:\GitRepo\dance-react

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

This creates a `dist` folder (Vite) or `build` folder (CRA).

---

### **Deploy to Server:**

**Option 1: Using SCP/SFTP**
```bash
# From your local machine
scp -r dist/* root@82.180.139.4:/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html/
```

**Option 2: Using Git**
1. Push to GitHub/GitLab
2. On server:
```bash
cd /home/derekmwallace19
git clone https://github.com/yourusername/dance-react.git
cd dance-react
npm install
npm run build
cp -r dist/* ../web/server.danceacademywhitemountains.com/public_html/
```

**Option 3: Manual Upload**
- Use FileZilla or WinSCP
- Upload contents of `dist/` to:
  `/home/derekmwallace19/web/server.danceacademywhitemountains.com/public_html/`

---

## 📊 Available API Endpoints

### **Public Endpoints (No Auth)**

| Endpoint | Description |
|----------|-------------|
| `GET /api/gallery` | All gallery images |
| `GET /api/staff` | All staff members |
| `GET /api/news` | All news items |
| `GET /api/settings` | Site settings (logo, contact info) |
| `GET /api/programs` | Dance programs |
| `GET /api/testimonials` | Testimonials |
| `GET /api/highlights` | Highlights |
| `GET /api/health` | API health check |

### **Response Examples**

**Gallery Item:**
```json
{
  "_id": "abc123",
  "title": "Recital 2024",
  "img": "/uploads/gallery/recital-123456.jpg",
  "uploadedAt": "2024-12-23T10:00:00Z"
}
```

**Staff Member:**
```json
{
  "_id": "def456",
  "name": "Jane Doe",
  "title": "Ballet Instructor",
  "img": "/uploads/staff/jane-123456.jpg",
  "styles": ["Ballet", "Contemporary"],
  "bio": ["Jane has been teaching for 15 years...", "She specializes in..."]
}
```

**News Item:**
```json
{
  "id": "ghi789",
  "title": "Spring Recital Announcement",
  "date": "2024-03-15",
  "body": "We're excited to announce...",
  "createdAt": "2024-12-23T10:00:00Z"
}
```

**Site Settings:**
```json
{
  "siteName": "Dance Academy White Mountains",
  "logoUrl": "/uploads/assets/logo-123456.png",
  "faviconUrl": "/uploads/assets/favicon.ico",
  "contactEmail": "info@danceacademy.com",
  "contactPhone": "(603) 555-1234",
  "address": "123 Main St, Conway, NH",
  "socialMedia": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/..."
  }
}
```

---

## ✅ Testing Checklist

After deploying your updated React app:

- [ ] Visit `https://server.danceacademywhitemountains.com`
- [ ] Check browser console for API errors
- [ ] Verify gallery images load
- [ ] Verify staff members display
- [ ] Verify news items show
- [ ] Check that logo displays (if uploaded in admin)
- [ ] Test on mobile devices

---

## 🔧 Troubleshooting

### **CORS Errors**
The backend is configured with `cors({ origin: "*" })` so CORS should work.

### **Images Not Loading**
Make sure you're using `api.getImageUrl(path)` helper:
```javascript
<img src={api.getImageUrl(item.img)} />
```

### **API Not Responding**
Check backend status:
```bash
pm2 logs dance-backend
```

### **Empty Data**
Add content through admin panel:
`https://api.danceacademywhitemountains.com/admin`

---

## 📝 Summary

1. ✅ Old site (`danceacademywhitemountains.com`) - Restored, unchanged
2. ✅ Admin panel - Ready at `api.danceacademywhitemountains.com/admin`
3. ✅ API Backend - Running, ready for React app
4. 📝 Update React app locally with API integration
5. 📝 Build and deploy to `server.danceacademywhitemountains.com`

---

**Admin Panel:** https://api.danceacademywhitemountains.com/admin
**API Docs:** /root/ADMIN_SETUP_GUIDE.md

Created: December 23, 2025
