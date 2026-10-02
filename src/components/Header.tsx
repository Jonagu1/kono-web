import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdminInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAdminInfo
}) => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div className="brand-texts">
            <div className="brand-subtitle">UNIVERSIDAD AUSTRAL DE CHILE</div>
            <h1 className="brand-title">Información Universitaria</h1>
            <span className="brand-tagline">Club de Innovación y Emprendimiento · Espacio 14K</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar por afiche, carrera, lugar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Buscar publicaciones"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className="admin-info-trigger"
            onClick={onOpenAdminInfo}
            title="Información de publicación y administración"
          >
            <span className="admin-status-dot"></span>
            <span className="admin-trigger-text">Subir por Chat</span>
            <span className="admin-badge">Solo Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
