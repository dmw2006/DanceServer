import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, getImageUrl, API_BASE_URL, isImageAttachment, newsAttachments, attachmentFileName } from '../services/api';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div>
          <img className="brand-logo" src="/images/Logowcolor.png" alt="The Dance Academy" />
          <div className="admin-user">
            <h4>{user?.name || 'Admin User'}</h4>
            <p className="muted">{user?.role || 'Administrator'}</p>
          </div>
        </div>

        <nav className="admin-nav">
          <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>🏠 Home</button>
          <button className={activeTab === 'classes' ? 'active' : ''} onClick={() => setActiveTab('classes')}>🎭 Classes</button>
          <button className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>📰 News</button>
          <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>👥 Staff</button>
          <button className={activeTab === 'handbook' ? 'active' : ''} onClick={() => setActiveTab('handbook')}>📘 Handbook</button>
          <button className={activeTab === 'studioPro' ? 'active' : ''} onClick={() => setActiveTab('studioPro')}>💳 Studio Pro</button>
          <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => setActiveTab('contact')}>📍 Contact</button>
          <button onClick={() => navigate('/')}>🚪 Exit Admin</button>
        </nav>

        <button className="btn ghost full" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h2>
            {activeTab === 'home' && '🏠 Home Page Management'}
            {activeTab === 'classes' && '🎭 Classes Page Management'}
            {activeTab === 'staff' && '👥 Staff Management'}
            {activeTab === 'news' && '📰 News Management'}
            {activeTab === 'handbook' && '📘 Handbook Page'}
            {activeTab === 'studioPro' && '💳 Studio Pro Page'}
            {activeTab === 'contact' && '📍 Contact Page'}
          </h2>
          <p className="muted">
            {activeTab === 'home' && 'Edit the homepage slideshow and highlights'}
            {activeTab === 'classes' && 'Edit class programs and weekly schedule'}
            {activeTab === 'staff' && 'Add and edit staff profiles, photos and bios, with a live preview of the public Staff page'}
            {activeTab === 'news' && 'Create and edit news announcements'}
            {activeTab === 'handbook' && 'Review handbook content and open the public handbook page'}
            {activeTab === 'studioPro' && 'Review Studio Pro integration and launch links'}
            {activeTab === 'contact' && 'Review contact information and map link presentation'}
          </p>
          <div className="preview-toolbar">
            <button type="button" className="btn ghost" onClick={() => navigate('/')}>Exit Admin</button>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'home' && <HomeSectionManager />}
          {activeTab === 'classes' && <ClassesSectionManager />}
          {activeTab === 'staff' && <StaffPhotoManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'handbook' && <HandbookSectionManager />}
          {activeTab === 'studioPro' && <StudioProSectionManager />}
          {activeTab === 'contact' && <ContactSectionManager />}
        </div>
      </main>
    </div>
  );
}

function HeroSlidesManager() {
  const { token } = useAuthContext();
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      setSlides(await api.getHeroSlides());
    } catch (err) {
      console.error('Error loading slides:', err);
      setError('Failed to load slideshow pictures');
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const result = await api.uploadImages(files, token);
      for (const [i, path] of result.paths.entries()) {
        await api.createHeroSlide({ image: path, order: slides.length + i });
      }
      await loadSlides();
    } catch (err) {
      console.error('Slideshow upload error:', err);
      setError(`Failed to upload pictures: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    try {
      await Promise.all(
        reordered.map((slide, i) => (slide.order === i ? null : api.updateHeroSlide(slide._id, { order: i })))
      );
      await loadSlides();
    } catch (err) {
      console.error('Error reordering slides:', err);
      setError(`Failed to reorder: ${err.message || 'Unknown error'}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this picture from the slideshow?')) return;
    try {
      await api.deleteHeroSlide(id);
      await loadSlides();
    } catch (err) {
      console.error('Error deleting slide:', err);
      setError(`Failed to delete: ${err.message || 'Unknown error'}`);
    }
  }

  return (
    <div>
      <h3>Home Page Slideshow</h3>
      <p className="muted" style={{ marginBottom: '12px' }}>
        Pictures rotate automatically on the home page, in the order shown here.
      </p>
      {error && <p className="error-message" style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
      <label className="btn primary" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '20px' }}>
        {uploading ? 'Uploading...' : 'Add Pictures'}
        <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
        {slides.map((slide, index) => (
          <div key={slide._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px', background: '#fff' }}>
            <img src={getImageUrl(slide.image)} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'contain', background: '#0e0b18', borderRadius: '6px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span className="muted">#{index + 1}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button type="button" className="btn ghost" onClick={() => handleMove(index, -1)} disabled={index === 0} title="Move earlier">←</button>
                <button type="button" className="btn ghost" onClick={() => handleMove(index, 1)} disabled={index === slides.length - 1} title="Move later">→</button>
                <button type="button" className="btn ghost" style={{ color: 'red' }} onClick={() => handleDelete(slide._id)} title="Remove">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length === 0 && (
        <p className="muted" style={{ marginTop: '12px' }}>
          No pictures yet, so the home page shows its default photo. Add pictures to start the slideshow.
        </p>
      )}
    </div>
  );
}

function HomeSectionManager() {
  return (
    <div>
      <div style={{ marginBottom: '24px', padding: '14px 16px', background: '#eef6ff', border: '1px solid #cfe1ff', borderRadius: '10px' }}>
        <strong>Home section editors</strong>
        <p className="muted" style={{ marginTop: '6px' }}>Use these tools to control what appears on the public home page.</p>
      </div>
      <HeroSlidesManager />
      <div style={{ height: '28px' }} />
      <HighlightsManager />
    </div>
  );
}

function ClassesSectionManager() {
  return (
    <div>
      <div style={{ marginBottom: '24px', padding: '14px 16px', background: '#eef6ff', border: '1px solid #cfe1ff', borderRadius: '10px' }}>
        <strong>Classes section editors</strong>
        <p className="muted" style={{ marginTop: '6px' }}>Programs and schedule both feed the public Classes experience.</p>
      </div>
      <ProgramsManager />
      <div style={{ height: '28px' }} />
      <ScheduleManager />
    </div>
  );
}

function HandbookSectionManager() {
  return (
    <div className="placeholder-content">
      <p>Handbook content is currently static in the public site.</p>
      <p className="muted">To change policy text today, update the handbook content in the website code.</p>
      <a className="btn ghost" href="/handbook" target="_blank" rel="noreferrer">Open Public Handbook</a>
    </div>
  );
}

function StudioProSectionManager() {
  return (
    <div className="placeholder-content">
      <p>Studio Pro links are configured and active.</p>
      <p className="muted">Open the public page to verify button behavior after updates.</p>
      <a className="btn ghost" href="/studio-pro" target="_blank" rel="noreferrer">Open Public Studio Pro Page</a>
    </div>
  );
}

function ContactSectionManager() {
  return (
    <div className="placeholder-content">
      <p>Contact page is active with map and location details.</p>
      <p className="muted">Open the public page to validate phone, email, and location display after updates.</p>
      <a className="btn ghost" href="/contact" target="_blank" rel="noreferrer">Open Public Contact Page</a>
    </div>
  );
}

function GalleryManager() {
  const { token } = useAuthContext();
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', thumbnail: '' });

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      const data = await api.getGallery();
      setGallery(data);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError('Failed to load gallery');
    }
  }

  async function handleThumbnailUpload(e, isNewCategory = false) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.uploadImage(file, token);
      if (isNewCategory) {
        setEditForm({ ...editForm, thumbnail: result.path });
      } else {
        setEditForm({ ...editForm, thumbnail: result.path });
      }
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload thumbnail: ${err.message || 'Unknown error'}. ${err.message?.includes('Invalid token') ? 'Please log out and log back in.' : ''}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    try {
      await api.createGalleryItem({
        title: editForm.title,
        thumbnail: editForm.thumbnail,
        images: [],
        order: gallery.length
      });
      setEditForm({ title: '', thumbnail: '' });
      await loadGallery();
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  }

  async function handleEditCategory(category) {
    setEditingCategory(category._id);
    setEditForm({ title: category.title, thumbnail: category.thumbnail });
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();
    try {
      await api.updateGalleryItem(editingCategory, editForm);
      setEditingCategory(null);
      setEditForm({ title: '', thumbnail: '' });
      await loadGallery();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(`Failed to update category: ${err.message || 'Unknown error'}`);
    }
  }

  async function handleImageUpload(categoryId, e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    try {
      const result = await api.uploadImages(files, token);
      const category = gallery.find(c => c._id === categoryId);
      const updatedImages = [...category.images, ...result.paths];
      await api.updateGalleryItem(categoryId, { images: updatedImages });
      await loadGallery();
      e.target.value = ''; // Reset file input
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(`Failed to upload images: ${err.message || 'Unknown error'}. ${err.message?.includes('Invalid token') ? 'Please log out and log back in.' : ''}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImageFromCategory(categoryId, imageIndex) {
    if (!confirm('Remove this image?')) return;

    try {
      const category = gallery.find(c => c._id === categoryId);
      const updatedImages = category.images.filter((_, i) => i !== imageIndex);
      await api.updateGalleryItem(categoryId, { images: updatedImages });
      await loadGallery();
    } catch (err) {
      console.error('Error removing image:', err);
      setError('Failed to remove image');
    }
  }

  async function handleDeleteCategory(id) {
    if (!confirm('Delete this category and all its images?')) return;

    try {
      await api.deleteGalleryItem(id);
      await loadGallery();
      if (selectedCategory === id) setSelectedCategory(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete category');
    }
  }

  return (
    <div>
      {error && <p className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
      
      {editingCategory ? (
        <form onSubmit={handleUpdateCategory} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Edit Category</h3>
          <input
            type="text"
            placeholder="Category title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
            style={{ marginBottom: '10px' }}
          />
          <div style={{ marginBottom: '10px' }}>
            <label className="btn primary" style={{ cursor: 'pointer', marginRight: '10px' }}>
              {uploading ? 'Uploading...' : 'Upload New Thumbnail'}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {editForm.thumbnail && (
              <img src={getImageUrl(editForm.thumbnail)} alt="Thumbnail preview" style={{ height: '60px', borderRadius: '4px', marginLeft: '10px' }} />
            )}
          </div>
          <button type="submit" className="btn primary" style={{ marginRight: '10px' }}>Save Changes</button>
          <button type="button" className="btn ghost" onClick={() => {
            setEditingCategory(null);
            setEditForm({ title: '', thumbnail: '' });
          }}>Cancel</button>
        </form>
      ) : (
        <form onSubmit={handleAddCategory} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Add New Category</h3>
          <input
            type="text"
            placeholder="Category title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
            style={{ marginBottom: '10px' }}
          />
          <div style={{ marginBottom: '10px' }}>
            <label className="btn primary" style={{ cursor: 'pointer', marginRight: '10px' }}>
              {uploading ? 'Uploading...' : 'Upload Thumbnail'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailUpload(e, true)}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {editForm.thumbnail && (
              <img src={getImageUrl(editForm.thumbnail)} alt="Thumbnail preview" style={{ height: '60px', borderRadius: '4px', marginLeft: '10px' }} />
            )}
          </div>
          <button type="submit" className="btn primary" disabled={!editForm.title || !editForm.thumbnail}>Add Category</button>
        </form>
      )}

      <div className="gallery-categories">
        {gallery.map(category => (
          <div key={category._id} style={{ marginBottom: '40px', padding: '20px', border: '2px solid #ddd', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img src={getImageUrl(category.thumbnail)} alt={category.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <h3 style={{ margin: 0 }}>{category.title}</h3>
                  <p className="muted" style={{ margin: '5px 0 0 0' }}>{category.images.length} images</p>
                </div>
              </div>
              <div>
                <label className="btn primary" style={{ cursor: 'pointer', marginRight: '10px' }}>
                  {uploading ? 'Uploading...' : '📤 Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(category._id, e)}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
                <button onClick={() => handleEditCategory(category)} className="btn ghost" style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteCategory(category._id)} className="btn ghost" style={{ color: 'red' }}>
                  Delete
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {category.images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={getImageUrl(img)} alt={`${category.title} ${idx + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    onClick={() => handleRemoveImageFromCategory(category._id, idx)}
                    className="btn ghost"
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.9)', padding: '5px 10px', fontSize: '12px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {category.images.length === 0 && (
                <p className="muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                  No images yet. Click "Upload Images" to add photos to this category.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {gallery.length === 0 && (
        <p className="muted" style={{ textAlign: 'center', marginTop: '40px' }}>
          No categories yet. Add your first category above!
        </p>
      )}
    </div>
  );
}

const parseStyles = (text) => text.split(',').map((s) => s.trim()).filter(Boolean);
const parseBio = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

// Same markup and classes as the public Staff page, so what you see here is what visitors get
function StaffPreviewCard({ person }) {
  const styles = person.styles || [];
  const bio = person.bio || [];
  return (
    <article className="staff-card">
      <div className="staff-content">
        <div className="staff-header">
          {person.img
            ? <img className="staff-avatar" src={getImageUrl(person.img)} alt={person.name || 'Staff photo'} />
            : <div className="staff-avatar placeholder" aria-hidden="true" />}
          <div className="staff-title-block">
            <h4>{person.name || 'Name'}</h4>
            <p className="muted">{person.title || 'Title'}</p>
          </div>
        </div>
        {styles.length > 0 && (
          <div className="staff-styles-block">
            <p className="styles-heading">Styles</p>
            <ul className="styles-list">
              {styles.map((style, i) => <li key={`${style}-${i}`}>{style}</li>)}
            </ul>
          </div>
        )}
        {bio.length > 0 && (
          <ul className="staff-bullets">
            {bio.map((line, i) => <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}

const emptyStaffForm = { name: '', title: '', img: '', styles: '', bio: '' };

function StaffPhotoManager() {
  const { token } = useAuthContext();
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formData, setFormData] = useState(emptyStaffForm);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      const data = await api.getStaff();
      setStaff(data);
    } catch (err) {
      console.error('Error loading staff:', err);
    }
  }

  function resetForm() {
    setEditing(null);
    setFormData(emptyStaffForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const staffData = {
        ...formData,
        styles: parseStyles(formData.styles),
        bio: parseBio(formData.bio)
      };

      if (editing) {
        await api.updateStaffMember(editing, staffData);
      } else {
        await api.createStaffMember({ ...staffData, order: staff.length });
      }

      setNotice(`${formData.name} was ${editing ? 'updated' : 'added'}.`);
      resetForm();
      setError('');
      await loadStaff();
    } catch (err) {
      console.error('Error saving staff member:', err);
      setNotice('');
      setError(`Failed to save staff member: ${err.message || 'Unknown error'}`);
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadImage(file, token);
      setFormData(prev => ({ ...prev, img: result.path }));
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload photo: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleCardPhotoUpload(id, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadImage(file, token);
      await api.updateStaffMember(id, { img: result.path });
      setError('');
      await loadStaff();
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload photo: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete ${item.name}?`)) return;
    try {
      await api.deleteStaffMember(item._id);
      if (editing === item._id) resetForm();
      setNotice(`${item.name} was removed.`);
      await loadStaff();
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError(`Failed to delete: ${err.message || 'Unknown error'}`);
    }
  }

  async function moveStaff(from, to) {
    if (from === null || from === to || to < 0 || to >= staff.length) return;
    const reordered = [...staff];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setStaff(reordered.map((person, i) => ({ ...person, order: i })));
    try {
      await Promise.all(
        reordered.map((person, i) => (person.order === i ? null : api.updateStaffMember(person._id, { order: i })))
      );
      setError('');
      setNotice(`${moved.name} is now number ${to + 1} on the Staff page.`);
    } catch (err) {
      console.error('Error reordering staff:', err);
      setNotice('');
      setError(`Failed to reorder: ${err.message || 'Unknown error'}`);
      await loadStaff();
    }
  }

  function endDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleEdit(item) {
    setEditing(item._id);
    setNotice('');
    setFormData({
      name: item.name,
      title: item.title,
      img: item.img || '',
      styles: (item.styles || []).join(', '),
      bio: (item.bio || []).join('\n')
    });
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const preview = {
    name: formData.name,
    title: formData.title,
    img: formData.img,
    styles: parseStyles(formData.styles),
    bio: parseBio(formData.bio)
  };

  return (
    <div className="staff-admin">
      {error && <p className="staff-alert error" role="alert">{error}</p>}
      {notice && <p className="staff-alert success" role="status">{notice}</p>}

      <section className="staff-editor" ref={editorRef}>
        <form onSubmit={handleSubmit} className="staff-form">
          <h3>{editing ? `Editing ${formData.name || 'staff member'}` : 'Add a staff member'}</h3>

          <div className="staff-photo-field">
            <div
              className="staff-photo-thumb"
              role="img"
              aria-label="Photo preview"
              style={{ backgroundImage: formData.img ? `url(${getImageUrl(formData.img)})` : 'none' }}
            >
              {!formData.img && <span aria-hidden="true">No photo</span>}
            </div>
            <div className="staff-photo-actions">
              <label className="btn primary">
                {uploading ? 'Uploading...' : formData.img ? 'Change photo' : 'Upload photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} hidden />
              </label>
              {formData.img && (
                <button type="button" className="btn ghost" onClick={() => setFormData({ ...formData, img: '' })}>
                  Remove photo
                </button>
              )}
              <p className="field-hint">Portrait or square photos work best.</p>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="staff-name">Name</label>
              <input
                id="staff-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="staff-title">Title</label>
              <input
                id="staff-title"
                type="text"
                placeholder="e.g. Instructor"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="staff-styles">Styles taught</label>
            <input
              id="staff-styles"
              type="text"
              placeholder="Ballet, Jazz, Tap"
              value={formData.styles}
              onChange={(e) => setFormData({ ...formData, styles: e.target.value })}
            />
            <p className="field-hint">Separate styles with commas.</p>
          </div>

          <div className="field">
            <label htmlFor="staff-bio">Bio</label>
            <textarea
              id="staff-bio"
              rows="6"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <p className="field-hint">Each line becomes its own bullet point.</p>
          </div>

          <div className="staff-form-actions">
            <button type="submit" className="btn primary">{editing ? 'Save changes' : 'Add staff member'}</button>
            {editing && <button type="button" className="btn ghost" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <aside className="staff-preview">
          <p className="staff-preview-label">Live preview</p>
          <p className="field-hint">How this person will appear on the Staff page.</p>
          <div className="staff-preview-stage">
            <StaffPreviewCard person={preview} />
          </div>
        </aside>
      </section>

      <div className="staff-roster-head">
        <h3>Current staff</h3>
        <span className="staff-count">{staff.length}</span>
      </div>
      {staff.length > 1 && (
        <p className="field-hint staff-order-hint">
          Drag a card, or use the arrows, to change the order. The Staff page lists people in this order.
        </p>
      )}

      <div className="staff-roster">
        {staff.map((item, index) => (
          <div
            key={item._id}
            className={`staff-roster-item${editing === item._id ? ' is-editing' : ''}${dragIndex === index ? ' is-dragging' : ''}${dragIndex !== null && overIndex === index && dragIndex !== index ? ' is-drop-target' : ''}`}
            draggable
            onDragStart={(e) => {
              setDragIndex(index);
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', item._id);
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return;
              e.preventDefault();
              if (overIndex !== index) setOverIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              moveStaff(dragIndex, index);
              endDrag();
            }}
            onDragEnd={endDrag}
          >
            <div className="staff-roster-order">
              <span className="staff-position">#{index + 1}</span>
              <span className="staff-drag-grip" aria-hidden="true">&#8942;&#8942; Drag to reorder</span>
              <div className="staff-move-buttons">
                <button type="button" className="btn ghost" onClick={() => moveStaff(index, index - 1)} disabled={index === 0} aria-label={`Move ${item.name} earlier`} title="Move earlier">&larr;</button>
                <button type="button" className="btn ghost" onClick={() => moveStaff(index, index + 1)} disabled={index === staff.length - 1} aria-label={`Move ${item.name} later`} title="Move later">&rarr;</button>
              </div>
            </div>
            <div className="staff-preview-stage">
              <StaffPreviewCard person={item} />
            </div>
            <div className="staff-roster-actions">
              <button type="button" onClick={() => handleEdit(item)} className="btn ghost">Edit</button>
              <label className="btn ghost">
                {uploading ? 'Uploading...' : 'Change photo'}
                <input type="file" accept="image/*" onChange={(e) => handleCardPhotoUpload(item._id, e)} disabled={uploading} hidden />
              </label>
              <button type="button" onClick={() => handleDelete(item)} className="btn ghost danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {staff.length === 0 && (
        <p className="muted staff-empty">No staff members yet. Add your first one above.</p>
      )}
    </div>
  );
}

// <input type="date"> works in yyyy-mm-dd; the post stores local noon so the day never shifts across time zones
function toDateInput(value) {
  const d = value ? new Date(value) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromDateInput(value) {
  return new Date(`${value}T12:00:00`).toISOString();
}

function NewsManager() {
  const { token } = useAuthContext();
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(() => toDateInput());
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      const data = await api.getNews();
      setNews(data);
    } catch (err) {
      console.error('Error loading news:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const post = { title, description: body, imageUrl: '', attachments, date: fromDateInput(date) };
      if (editing) {
        await api.updateNews(editing, post);
      } else {
        await api.createNews(post);
      }
      setTitle('');
      setBody('');
      setAttachments([]);
      setDate(toDateInput());
      setEditing(null);
      await loadNews();
    } catch (err) {
      console.error('Error saving news:', err);
      alert(`Failed to save news: ${err.message}`);
    }
  }

  async function handleAttachmentUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const result = await api.uploadFiles(files, token);
      setAttachments((current) => [...current, ...result.files]);
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deleteNews(id);
      await loadNews();
    } catch (err) {
      console.error('Error deleting news:', err);
      alert(`Failed to delete news: ${err.message}`);
    }
  }

  function handleEdit(item) {
    setEditing(item._id);
    setTitle(item.title);
    setBody(item.description ?? item.body ?? '');
    setAttachments(newsAttachments(item));
    setDate(toDateInput(item.date || item.updatedAt || item.createdAt));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Post' : 'Create New Post'}</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <textarea
          placeholder="Content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span style={{ display: 'block', marginBottom: '4px' }}>Date shown on the post</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </label>
        <div style={{ marginBottom: '10px' }}>
          <label className="btn primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
            {uploading ? 'Uploading...' : 'Add Attachments'}
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              onChange={handleAttachmentUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
          <span className="muted" style={{ marginLeft: '10px' }}>Pictures, PDF, Word, Excel, PowerPoint, text or CSV (up to 15 MB each)</span>
          {attachments.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'grid', gap: '8px' }}>
              {attachments.map((a, i) => (
                <li key={`${a.url}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px' }}>
                  {isImageAttachment(a)
                    ? <img src={getImageUrl(a.url)} alt={attachmentFileName(a)} style={{ height: '44px', width: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                    : <span style={{ fontSize: '24px' }} aria-hidden="true">&#128196;</span>}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachmentFileName(a)}</span>
                  <button type="button" className="btn ghost" style={{ color: 'red' }} onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn primary">
            {editing ? 'Update' : 'Create'}
          </button>
          {editing && (
            <button type="button" className="btn ghost" onClick={() => { setEditing(null); setTitle(''); setBody(''); setAttachments([]); setDate(toDateInput()); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="news-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {news.map(item => (
          <article key={item._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{item.title}</h4>
            <time style={{ fontSize: '0.9em', color: '#666' }}>
              {new Date(item.date || item.updatedAt || item.createdAt).toLocaleDateString()}
            </time>
            <p style={{ marginTop: '10px' }}>{item.description ?? item.body}</p>
            {newsAttachments(item).length > 0 && (
              <p className="muted" style={{ marginTop: '10px' }}>
                {newsAttachments(item).length} attachment{newsAttachments(item).length === 1 ? '' : 's'}: {newsAttachments(item).map(attachmentFileName).join(', ')}
              </p>
            )}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(item)} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// Highlights Manager
function HighlightsManager() {
  const [highlights, setHighlights] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    loadHighlights();
  }, []);

  async function loadHighlights() {
    try {
      const response = await fetch(`${API_BASE_URL}/highlights`);
      const data = await response.json();
      setHighlights(data);
    } catch (err) {
      console.error('Error loading highlights:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = editing ? { title, text } : { title, text, order: highlights.length };
    try {
      if (editing) {
        await api.updateHighlight(editing, data);
      } else {
        await api.createHighlight(data);
      }
      setTitle('');
      setText('');
      setEditing(null);
      loadHighlights();
    } catch (err) {
      console.error('Error saving highlight:', err);
      alert(`Failed to save highlight: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this highlight?')) {
      try {
        await api.deleteHighlight(id);
        loadHighlights();
      } catch (err) {
        console.error('Error deleting highlight:', err);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Highlight' : 'Create New Highlight'}</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <textarea
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {highlights.map(item => (
          <div key={item._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditing(item._id); setTitle(item.title); setText(item.text); }} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Programs Manager
function ProgramsManager() {
  const [programs, setPrograms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', bucket: '', style: '', schedule: '' });

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const response = await fetch(`${API_BASE_URL}/programs`);
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      console.error('Error loading programs:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = editing ? { ...formData } : { ...formData, order: programs.length };
    try {
      if (editing) {
        await api.updateProgram(editing, data);
      } else {
        await api.createProgram(data);
      }
      setFormData({ name: '', age: '', bucket: '', style: '', schedule: '' });
      setEditing(null);
      loadPrograms();
    } catch (err) {
      console.error('Error saving program:', err);
      alert(`Failed to save program: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this program?')) {
      try {
        await api.deleteProgram(id);
        loadPrograms();
      } catch (err) {
        console.error('Error deleting program:', err);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Program' : 'Create New Program'}</h3>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" list="program-buckets" placeholder="Bucket (pick or type, e.g., Ages 5-13)" value={formData.bucket} onChange={(e) => setFormData({...formData, bucket: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <datalist id="program-buckets">
          {[...new Set(['Ages 3-4', 'Ages 5-13', 'Ages 14-18', 'Adults', 'All Ages', ...programs.map(p => p.bucket).filter(Boolean)])].map(b => <option key={b} value={b} />)}
        </datalist>
        <input type="text" placeholder="Style" value={formData.style} onChange={(e) => setFormData({...formData, style: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <textarea placeholder="Schedule" value={formData.schedule} onChange={(e) => setFormData({...formData, schedule: e.target.value})} required rows={2} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {programs.map(item => (
          <div key={item._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{item.name}</h4>
            <p><strong>Age:</strong> {item.age} | <strong>Bucket:</strong> {item.bucket}</p>
            <p><strong>Style:</strong> {item.style}</p>
            <p><strong>Schedule:</strong> {item.schedule}</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditing(item._id); setFormData({name: item.name, age: item.age, bucket: item.bucket, style: item.style, schedule: item.schedule}); }} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Schedule Manager
function ScheduleManager() {
  const [schedule, setSchedule] = useState([]);
  const [editing, setEditing] = useState(null);
  const [day, setDay] = useState('');
  const [items, setItems] = useState([{ title: '', time: '', studio: '', age: '' }]);

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule`);
      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      console.error('Error loading schedule:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = editing ? { day, items } : { day, items, order: schedule.length };
    try {
      if (editing) {
        await api.updateSchedule(editing, data);
      } else {
        await api.createSchedule(data);
      }
      setDay('');
      setItems([{ title: '', time: '', studio: '', age: '' }]);
      setEditing(null);
      loadSchedule();
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert(`Failed to save schedule: ${err.message}`);
    }
  }

  function updateItem(index, field, value) {
    setItems(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function resetForm() {
    setEditing(null);
    setDay('');
    setItems([{ title: '', time: '', studio: '', age: '' }]);
  }

  async function handleDelete(id) {
    if (confirm('Delete this schedule day?')) {
      try {
        await api.deleteSchedule(id);
        loadSchedule();
      } catch (err) {
        console.error('Error deleting schedule:', err);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Schedule' : 'Create New Schedule Day'}</h3>
        <select value={day} onChange={(e) => setDay(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <option value="">Select day</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <h4 style={{ margin: '10px 0' }}>Classes</h4>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto', gap: '8px', marginBottom: '8px' }}>
            <input type="text" placeholder="Class title" value={it.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} required />
            <input type="text" placeholder="Time (4:00pm)" value={it.time} onChange={(e) => updateItem(idx, 'time', e.target.value)} required />
            <input type="text" placeholder="Studio" value={it.studio} onChange={(e) => updateItem(idx, 'studio', e.target.value)} required />
            <select value={it.age} onChange={(e) => updateItem(idx, 'age', e.target.value)} required>
              <option value="">Age group</option>
              {['Ages 3-4', 'Ages 5-13', 'Ages 14-18', 'Adults'].map(a => <option key={a} value={a}>{a}</option>)}
              {it.age && !['Ages 3-4', 'Ages 5-13', 'Ages 14-18', 'Adults'].includes(it.age) && <option value={it.age}>{it.age}</option>}
            </select>
            <button type="button" className="btn ghost" style={{ color: 'red' }} onClick={() => setItems(items.filter((_, i) => i !== idx))}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn ghost" style={{ marginBottom: '10px' }} onClick={() => setItems([...items, { title: '', time: '', studio: '', age: '' }])}>+ Add class</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" className="btn ghost" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {schedule.map(item => (
          <div key={item._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{item.day}</h4>
            {(item.items || []).map((it, i) => (
              <p key={i} className="muted" style={{ margin: '2px 0' }}>{it.time} - {it.title} (Studio {it.studio}, {it.age})</p>
            ))}
            {(!item.items || item.items.length === 0) && <p className="muted">No classes</p>}
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditing(item._id); setDay(item.day); setItems(item.items?.length ? item.items : [{ title: '', time: '', studio: '', age: '' }]); }} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Manager
function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Error loading testimonials:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = editing ? { quote, name } : { quote, name, order: testimonials.length };
    try {
      if (editing) {
        await api.updateTestimonial(editing, data);
      } else {
        await api.createTestimonial(data);
      }
      setQuote('');
      setName('');
      setEditing(null);
      loadTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert(`Failed to save testimonial: ${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this testimonial?')) {
      try {
        await api.deleteTestimonial(id);
        loadTestimonials();
      } catch (err) {
        console.error('Error deleting testimonial:', err);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Testimonial' : 'Create New Testimonial'}</h3>
        <textarea
          placeholder="Quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
          rows={3}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {testimonials.map(item => (
          <div key={item._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <p style={{ fontStyle: 'italic' }}>"{item.quote}"</p>
            <p style={{ marginTop: '10px', textAlign: 'right' }}>— {item.name}</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditing(item._id); setQuote(item.quote); setName(item.name); }} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// User Management
function UserManagement() {
  const { token } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'staff' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.getAllUsers(token);
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateUser(editing, formData, token);
      } else {
        await api.createUser(formData, token);
      }
      setFormData({ username: '', email: '', password: '', role: 'staff' });
      setEditing(null);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Error saving user');
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete this user?')) {
      try {
        await api.deleteUser(id, token);
        loadUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, token);
      alert('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (err) {
      alert(err.message || 'Error changing password');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', padding: '20px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h3>Change Your Password</h3>
        {!showPasswordChange ? (
          <button onClick={() => setShowPasswordChange(true)} className="btn ghost">Change Password</button>
        ) : (
          <form onSubmit={handlePasswordChange} style={{ marginTop: '10px' }}>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn primary">Update Password</button>
              <button type="button" onClick={() => { setShowPasswordChange(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="btn ghost">Cancel</button>
            </div>
          </form>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit User' : 'Create New User'}</h3>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="password"
          placeholder={editing ? "Password (leave blank to keep current)" : "Password"}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required={!editing}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setFormData({ username: '', email: '', password: '', role: 'staff' }); }} className="btn ghost">Cancel</button>
          )}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {users.map(u => (
          <div key={u._id} style={{ padding: '15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{u.username}</h4>
            <p>{u.email}</p>
            <span style={{ display: 'inline-block', padding: '4px 12px', background: u.role === 'admin' ? '#ff6b6b' : '#4ecdc4', color: 'white', borderRadius: '12px', fontSize: '0.85em', marginTop: '8px' }}>
              {u.role}
            </span>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { setEditing(u._id); setFormData({username: u.username, email: u.email, password: '', role: u.role}); }} className="btn ghost">Edit</button>
              <button onClick={() => handleDelete(u._id)} className="btn ghost" style={{ color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
