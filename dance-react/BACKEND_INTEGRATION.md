# Dance Academy Frontend - Backend Integration Guide

This frontend is prepared to integrate with a Node.js backend for full functionality including SSO, dynamic content management, and image uploads.

## 🏗️ Architecture Overview

### Frontend (This App)
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **State Management**: React hooks + Context API
- **Styling**: Custom CSS (mobile-responsive)

### Backend Requirements
The frontend expects a Node.js backend with the following capabilities:
- RESTful API endpoints
- Image upload/storage
- Authentication (SSO integration)
- Database for dynamic content

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Loading.jsx          # Loading spinner and error states
│   └── ProtectedRoute.jsx   # Route guard for admin pages
├── context/
│   └── AuthContext.jsx      # Authentication state management
├── hooks/
│   └── useApi.js            # Custom hooks for API calls
├── pages/
│   ├── LoginPage.jsx        # Staff/admin login
│   └── AdminDashboard.jsx   # Content management interface
├── services/
│   └── api.js               # API client and endpoint definitions
└── App.jsx                  # Main app with routing
```

---

## 🔌 API Integration

### Environment Configuration

Three environment files are included:
- `.env.development` - Local development (points to localhost:3000)
- `.env.production` - Production build (uses relative /api path)
- `.env.example` - Template for new environments

**Development**:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Production**:
```env
VITE_API_BASE_URL=/api
```

### API Endpoints Required

#### Public Endpoints (No Auth)
```
GET /api/programs          # List of dance programs/classes
GET /api/schedule          # Weekly class schedule
GET /api/gallery           # Gallery images
GET /api/news              # News/announcements
GET /api/staff             # Staff members and bios
GET /api/testimonials      # Family testimonials
GET /api/highlights        # Home page highlights
```

#### Auth Endpoints
```
POST /api/auth/login       # Staff/admin login
POST /api/auth/logout      # Logout
GET  /api/auth/me          # Get current user info
```

#### Admin Endpoints (Auth Required)
```
POST   /api/admin/gallery           # Upload gallery image
DELETE /api/admin/gallery/:id       # Delete gallery image
PUT    /api/admin/staff/:id/photo   # Update staff photo
POST   /api/admin/news              # Create news post
PUT    /api/admin/news/:id          # Update news post
DELETE /api/admin/news/:id          # Delete news post
```

---

## 🔐 Authentication Flow

1. **Login**: User submits credentials to `/api/auth/login`
2. **Token Storage**: JWT token stored in localStorage
3. **Protected Routes**: Token included in Authorization header
4. **Auto-redirect**: Unauthenticated users redirected to login

### Token Format
```javascript
headers: {
  'Authorization': 'Bearer <jwt-token>'
}
```

---

## 📦 Expected API Response Formats

### Programs
```json
[
  {
    "id": "string",
    "name": "Preschool Ballet",
    "age": "Ages 3-4",
    "bucket": "Ages 3-4",
    "style": "First steps in ballet",
    "schedule": "Mon 4:00-4:30 - Fri 10:30-11:00"
  }
]
```

### Staff
```json
[
  {
    "id": "string",
    "name": "Rebecca Eagle",
    "title": "Owner / Artistic Director",
    "img": "/uploads/staff/rebecca.jpg",
    "styles": ["Ballet", "Contemporary"],
    "bio": [
      "Director of TDA since 2008",
      "28+ years performing and teaching"
    ]
  }
]
```

### Gallery
```json
[
  {
    "id": "string",
    "title": "Spring recital",
    "img": "/uploads/gallery/spring-2024.jpg",
    "uploadedAt": "2024-03-15T10:00:00Z"
  }
]
```

### News
```json
[
  {
    "id": "string",
    "title": "Winter showcase tickets now open",
    "date": "Dec 10",
    "body": "Reserve seats early...",
    "createdAt": "2024-12-01T10:00:00Z"
  }
]
```

### Auth Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "string",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 🖼️ Image Handling

### Upload Requirements
- **Format**: multipart/form-data
- **Field name**: `image` or `photo`
- **Accepted types**: JPEG, PNG, WebP
- **Max size**: Recommend 5MB limit
- **Storage**: Images should be stored in `/public/uploads/` or CDN

### Frontend Upload Example
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('title', 'Spring Recital 2024');

await api.uploadGalleryImage(formData, authToken);
```

---

## 🚀 Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.development
# Edit .env.development with your backend URL
```

### 3. Start Development Server
```bash
npm run dev
```

The dev server includes a proxy to forward `/api` requests to your backend.

### 4. Start Your Backend
Ensure your Node.js backend is running on `http://localhost:3000`

---

## 🏭 Production Build

### Build for Production
```bash
npm run build
```

Output: `dist/` folder containing static assets

### Preview Production Build
```bash
npm run preview
```

### Deployment
The built static files can be:
1. Served by your Node.js backend as static assets
2. Deployed to CDN/static hosting with API proxy
3. Deployed to Render/Vercel with backend as separate service

---

## 🔄 Converting to API-driven Data

Currently, data is hardcoded in `App.jsx`. To make it dynamic:

### Example: Gallery Page
**Before** (static data):
```javascript
const gallery = [
  { title: 'Spring recital', img: '/images/gallery1.jpg' },
];
```

**After** (API-driven):
```javascript
import { useApiData } from '../hooks/useApi';
import api from '../services/api';
import { Loading, ErrorMessage } from '../components/Loading';

const GalleryPage = () => {
  const { data: gallery, loading, error } = useApiData(api.getGallery);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="section gallery">
      {/* render gallery */}
    </section>
  );
};
```

---

## 🛡️ Security Considerations

### Frontend
- ✅ Tokens stored in localStorage (consider httpOnly cookies for production)
- ✅ Protected routes prevent unauthorized access
- ✅ All admin actions require authentication

### Backend (Your Implementation)
- 🔒 Validate JWT tokens on protected endpoints
- 🔒 Implement rate limiting on auth endpoints
- 🔒 Validate file uploads (type, size, malware scan)
- 🔒 Sanitize user inputs
- 🔒 Use HTTPS in production
- 🔒 Implement CORS properly

---

## 📋 Implementation Checklist

### Phase 1: Basic Backend Setup
- [ ] Create Node.js/Express server
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Implement authentication (JWT/SSO)
- [ ] Create public API endpoints
- [ ] Test endpoints with Postman

### Phase 2: Image Handling
- [ ] Set up multer/file upload middleware
- [ ] Configure image storage (local/S3/Cloudinary)
- [ ] Create upload endpoints
- [ ] Implement image optimization

### Phase 3: Admin Features
- [ ] Implement admin endpoints
- [ ] Add authorization middleware
- [ ] Create database models/schemas
- [ ] Test admin operations

### Phase 4: Integration
- [ ] Connect frontend to backend
- [ ] Replace static data with API calls
- [ ] Test authentication flow
- [ ] Test image uploads
- [ ] Deploy to production

---

## 🐛 Troubleshooting

### CORS Issues
Add CORS middleware to your backend:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

### API Proxy Not Working
Check `vite.config.js` proxy configuration matches your backend port.

### Images Not Loading
Ensure backend serves static files:
```javascript
app.use('/uploads', express.static('public/uploads'));
```

---

## 📞 Support

For questions about:
- **Frontend implementation**: Check this README
- **Backend integration**: Follow API contract above
- **Deployment**: See deployment section

---

## 🎯 Next Steps

1. **Set up your Node.js backend** following the API contract
2. **Test endpoints** with Postman/Thunder Client
3. **Update frontend** to use API calls instead of static data
4. **Deploy both** frontend and backend to production

The frontend is ready - just connect it to your backend! 🚀
