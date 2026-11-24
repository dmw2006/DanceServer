import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { api, getImageUrl } from '../services/api';
import { defaultStudioPro, studioProPreviewUrl } from '../services/pageDefaults';
import { AdminPreview } from './AdminPreview';

function safeHttpUrl(value) {
  const url = (value || '').trim();
  if (!/^https?:\/\//i.test(url) || [...url].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || char === '\\')) return '';
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : '';
  } catch {
    return '';
  }
}

function StudioProPreview({ data }) {
  const url = safeHttpUrl(data.url);
  return (
    <AdminPreview title="Studio Pro preview">
      <section className="section callout">
        <div>
          <p className="eyebrow">Studio Pro</p>
          <h2>Registration, tickets, and account management.</h2>
          <p className="lede small">Tap through to banking, tickets for shows, and family accounts.</p>
        </div>
        <div className="callout-actions">
          {url ? <a className="btn primary" href={url} target="_blank" rel="noreferrer">Open Studio Pro</a> : <p>{data.url?.trim() ? 'Enter a valid HTTP or HTTPS website link.' : 'No website link provided.'}</p>}
        </div>
        {url && <p className="muted">Destination: {data.url}</p>}
        <figure className="studio-pro-preview">
          <img src={studioProPreviewUrl(data.imageUrl, getImageUrl)} alt="Screenshot of the Studio Pro website" />
          <figcaption>Static screenshot, not a live view of the website. Select Open Studio Pro to visit the site.</figcaption>
        </figure>
      </section>
    </AdminPreview>
  );
}

export function StudioProEditor() {
  const { token } = useAuthContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getPageSettings('studio-pro').then((settings) => {
      if (mounted) setData(settings || defaultStudioPro);
    }).catch(() => {
      if (mounted) setError('Could not load Studio Pro settings. Refresh and try again.');
    });
    return () => { mounted = false; };
  }, []);

  async function save(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const saved = await api.updatePageSettings('studio-pro', data);
      setData(saved);
      setNotice('Studio Pro settings saved.');
    } catch (err) {
      setError(`Could not save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function upload(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    setError('');
    setNotice('');
    setUploading(true);
    try {
      const result = await api.uploadImage(file, token);
      setData((current) => ({ ...current, imageUrl: result.path }));
    } catch (err) {
      setError(`Could not upload the picture: ${err.message}`);
    } finally {
      setUploading(false);
      input.value = '';
    }
  }

  if (!data) return error ? <p className="staff-alert error" role="alert">{error}</p> : <p>Loading Studio Pro settings…</p>;

  return (
    <div className="page-settings-editor">
      <div className="page-settings-intro">
        <h3>Studio Pro link and picture</h3>
        <p>Choose the link visitors open and the picture shown beneath it.</p>
      </div>
      {error && <p className="staff-alert error" role="alert">{error}</p>}
      {notice && <p className="staff-alert success" role="status">{notice}</p>}
      <form className="page-settings-form" onSubmit={save}>
        <div className="page-settings-field">
          <label htmlFor="studio-pro-url">Website link</label>
          <input id="studio-pro-url" type="url" maxLength={2048} required disabled={saving || uploading} value={data.url} onChange={(event) => { setData({ ...data, url: event.target.value }); setNotice(''); }} />
          <p className="page-settings-hint">Enter a complete link beginning with https:// or http://.</p>
        </div>
        <div className="page-settings-field">
          <label htmlFor="studio-pro-picture">Website picture</label>
          <img className="studio-pro-editor-preview" src={studioProPreviewUrl(data.imageUrl, getImageUrl)} alt="Current Studio Pro website preview" />
          <input id="studio-pro-picture" type="file" accept=".png,.jpg,.jpeg,.gif,.webp" disabled={saving || uploading} onChange={upload} />
          <p className="page-settings-hint">This is a static picture, not a live preview. Upload a new screenshot if the website changes.</p>
          {data.imageUrl && <button type="button" className="btn ghost" disabled={saving || uploading} onClick={() => { setData({ ...data, imageUrl: '' }); setNotice(''); }}>Use original picture</button>}
        </div>
        <div className="page-settings-actions">
          <button type="submit" className="btn primary" disabled={saving || uploading}>{uploading ? 'Uploading…' : saving ? 'Saving…' : 'Save changes'}</button>
          <a className="btn ghost" href="/studio-pro" target="_blank" rel="noreferrer">View public page</a>
        </div>
      </form>
      <StudioProPreview data={data} />
    </div>
  );
}
