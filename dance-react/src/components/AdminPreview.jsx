export function AdminPreview({ title, children, note = 'Preview updates as you edit. Save to publish your changes.' }) {
  return (
    <aside className="admin-page-preview" aria-label={title}>
      <div className="admin-page-preview-heading">
        <strong>{title}</strong>
        <span>{note}</span>
      </div>
      <div className="admin-page-preview-stage">{children}</div>
    </aside>
  );
}
