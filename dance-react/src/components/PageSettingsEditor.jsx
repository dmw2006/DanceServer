import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { defaultContact, defaultHandbook } from '../services/pageDefaults';
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

function HandbookPreview({ data }) {
  return (
    <AdminPreview title="Handbook preview">
      <section className="section handbook">
        <div className="section-heading">
          <p className="eyebrow">Handbook</p>
          <h2>Policies &amp; Dress Code</h2>
          <p className="lede small">The essentials for students and families.</p>
        </div>
        <div className="handbook-stack">
          {data.sections.length === 0 ? <p>No handbook sections yet.</p> : data.sections.map((section, index) => (
            <details className="accordion" key={index} open>
              <summary><span>{section.title?.trim() ? section.title : 'Untitled section'}</span><span className="chevron">▼</span></summary>
              <div className="accordion-body handbook-text">{section.body?.trim() ? section.body : 'No section content yet.'}</div>
            </details>
          ))}
        </div>
      </section>
    </AdminPreview>
  );
}

function ContactPreview({ data }) {
  const mapUrl = safeHttpUrl(data.mapUrl);
  return (
    <AdminPreview title="Contact preview">
      <section className="section contact">
        <div className="section-heading">
          <p className="eyebrow">Location &amp; Contact Info</p>
          <h2>Visit, call, or email us.</h2>
          <p className="lede small">Find our address, contact details, and office hours below.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>Location &amp; Contact</h3>
            <p className="muted">{data.addressLine1?.trim() ? data.addressLine1 : 'Street address not provided.'}</p>
            <p className="muted">{data.addressLine2?.trim() ? data.addressLine2 : 'City, state and ZIP not provided.'}</p>
            <p className="muted">{data.email?.trim() ? data.email : 'Email not provided.'}</p>
            <p className="muted">{data.phone?.trim() ? data.phone : 'Phone not provided.'}</p>
            {data.addressLine1 === defaultContact.addressLine1 && data.addressLine2 === defaultContact.addressLine2 && (
              <a className="map-image-link" href="/images/Map.png" target="_blank" rel="noreferrer" aria-label="Open map full screen">
                <img className="map-image" src="/images/Map.png" alt="Map to The Dance Academy" />
              </a>
            )}
            {mapUrl ? <a className="muted map-link" href={mapUrl} target="_blank" rel="noreferrer">View on Google Maps</a> : (
              <p className="muted">{data.mapUrl?.trim() ? 'Enter a valid HTTP or HTTPS map link.' : 'No map link provided.'}</p>
            )}
          </div>
          <div className="contact-card storefront">
            <h3>Storefront &amp; Office Hours</h3>
            <p className="muted">Stop by for registration and questions.</p>
            <p className="muted contact-hours">{data.officeHours?.trim() ? data.officeHours : 'Office hours not provided.'}</p>
            <div className="storefront-photo" aria-label="Studio storefront" />
          </div>
        </div>
      </section>
    </AdminPreview>
  );
}

const contactFields = [
  { key: 'addressLine1', label: 'Street address', maxLength: 200 },
  { key: 'addressLine2', label: 'City, state and ZIP', maxLength: 200 },
  { key: 'phone', label: 'Phone', type: 'tel', maxLength: 50 },
  { key: 'email', label: 'Email', type: 'email', maxLength: 254 },
  { key: 'officeHours', label: 'Office hours', multiline: true, maxLength: 500, hint: 'Use a separate line for each set of hours.' },
  { key: 'mapUrl', label: 'Map link', type: 'url', maxLength: 2048, hint: 'Use a complete https:// or http:// link, or leave empty.' },
];

export function PageSettingsEditor({ page }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const handbook = page === 'handbook';

  useEffect(() => {
    let mounted = true;
    api.getPageSettings(page).then((value) => {
      if (mounted) setData(value || (page === 'handbook' ? defaultHandbook : defaultContact));
    }).catch(() => {
      if (mounted) setError('Could not load the current page content. Refresh and try again.');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [page]);

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const saved = await api.updatePageSettings(page, data);
      setData(saved);
      setNotice('Changes saved. They will appear on the public page.');
    } catch (err) {
      setError(`Could not save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function updateSection(index, key, value) {
    setData((current) => ({ ...current, sections: current.sections.map((section, i) => i === index ? { ...section, [key]: value } : section) }));
    setNotice('');
  }

  function moveSection(index, direction) {
    setData((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.sections.length) return current;
      const sections = [...current.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...current, sections };
    });
    setNotice('');
  }

  if (loading) return <p>Loading page content…</p>;
  if (!data) return <p className="staff-alert error" role="alert">{error}</p>;

  return (
    <div className="page-settings-editor">
      <div className="page-settings-intro">
        <h3>{handbook ? 'Edit handbook' : 'Edit contact information'}</h3>
        <p>{handbook ? 'Edit the sections visitors can expand on the Handbook page. Changes appear after saving.' : 'Update the contact page and footer. Changes appear after saving.'}</p>
      </div>
      {error && <p className="staff-alert error" role="alert">{error}</p>}
      {notice && <p className="staff-alert success" role="status">{notice}</p>}
      <form className="page-settings-form" onSubmit={handleSave}>
        {handbook ? (
          <>
            {data.sections.map((section, index) => (
              <fieldset className="page-settings-section" key={index}>
                <legend>Section {index + 1}</legend>
                <label htmlFor={`handbook-title-${index}`}>Section title</label>
                <input id={`handbook-title-${index}`} value={section.title} onChange={(e) => updateSection(index, 'title', e.target.value)} maxLength={200} disabled={saving} required />
                <label htmlFor={`handbook-body-${index}`}>Content</label>
                <textarea id={`handbook-body-${index}`} value={section.body} onChange={(e) => updateSection(index, 'body', e.target.value)} maxLength={5000} rows={10} disabled={saving} required />
                <div className="page-settings-actions">
                  <button type="button" className="btn ghost" disabled={saving || index === 0} onClick={() => moveSection(index, -1)} aria-label={`Move section ${index + 1} up`}>Move up</button>
                  <button type="button" className="btn ghost" disabled={saving || index === data.sections.length - 1} onClick={() => moveSection(index, 1)} aria-label={`Move section ${index + 1} down`}>Move down</button>
                  <button type="button" className="btn ghost danger" disabled={saving} onClick={() => {
                    if (window.confirm(`Remove “${section.title}”? Save to apply this change.`)) {
                      setData((current) => ({ ...current, sections: current.sections.filter((_, i) => i !== index) }));
                      setNotice('');
                    }
                  }}>Remove</button>
                </div>
              </fieldset>
            ))}
            <button type="button" className="btn ghost" disabled={saving || data.sections.length >= 30} onClick={() => {
              setData((current) => ({ ...current, sections: [...current.sections, { title: '', body: '' }] }));
              setNotice('');
            }}>Add section</button>
          </>
        ) : contactFields.map(({ key, label, type, multiline, maxLength, hint }) => (
          <div className="page-settings-field" key={key}>
            <label htmlFor={`contact-${key}`}>{label}</label>
            {multiline ? (
              <textarea id={`contact-${key}`} rows={4} maxLength={maxLength} value={data[key]} disabled={saving} onChange={(e) => { setData({ ...data, [key]: e.target.value }); setNotice(''); }} />
            ) : (
              <input id={`contact-${key}`} type={type || 'text'} maxLength={maxLength} value={data[key]} disabled={saving} onChange={(e) => { setData({ ...data, [key]: e.target.value }); setNotice(''); }} />
            )}
            {hint && <p className="page-settings-hint">{hint}</p>}
          </div>
        ))}
        <div className="page-settings-actions">
          <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          <a className="btn ghost" href={`/${page}`} target="_blank" rel="noreferrer">View public page</a>
        </div>
      </form>
      {handbook ? <HandbookPreview data={data} /> : <ContactPreview data={data} />}
    </div>
  );
}
