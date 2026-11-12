// components/PageContainer.js

// PageContainer component serves as a layout wrapper for pages
export default function PageContainer({
  children,
  title,
  headerContent,
  fluid = false,
  edgeToEdge = false,
}) {
  return (
    <article className={`page-container ${edgeToEdge ? 'edge-to-edge' : 'contained'} ${fluid ? 'fluid' : ''}`}>
      {title && (
        <header className="page-header">
          <h1 className="page-title">
            {title}
          </h1>
          {headerContent}
        </header>
      )}
      <div className="page-content">
        {children}
      </div>
    </article>
  );
}
