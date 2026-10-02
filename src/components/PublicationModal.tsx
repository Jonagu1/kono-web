import React, { useEffect, useState } from 'react';
import type { Publication } from '../types/publication';

interface PublicationModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export const PublicationModal: React.FC<PublicationModalProps> = ({
  publication,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (publication) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [publication, onClose]);

  if (!publication) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        <div className="modal-body-split">
          {/* Left: Poster image showcase */}
          <div className="modal-poster-col">
            <div className="modal-image-container">
              <img
                src={publication.image}
                alt={publication.title}
                className="modal-poster-img"
              />
              <div className="modal-poster-actions">
                <a
                  href={publication.image}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-zoom-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Ver afiche en pestaña completa
                </a>
              </div>
            </div>
          </div>

          {/* Right: Detailed Information */}
          <div className="modal-info-col">
            <div className="modal-category-row">
              <span className="modal-badge-category">
                {publication.category}
              </span>
              <span className="modal-campus-pill">
                📍 {publication.campus}
              </span>
            </div>

            <h2 className="modal-title">{publication.title}</h2>
            {publication.subtitle && (
              <h4 className="modal-subtitle">{publication.subtitle}</h4>
            )}

            <div className="modal-org-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <span>{publication.organization}</span>
            </div>

            <div className="modal-details-grid">
              <div className="detail-item">
                <span className="detail-label">Fecha</span>
                <span className="detail-val">📅 {publication.date}</span>
              </div>
              {publication.time && (
                <div className="detail-item">
                  <span className="detail-label">Horario</span>
                  <span className="detail-val">⏰ {publication.time}</span>
                </div>
              )}
              <div className="detail-item full-row">
                <span className="detail-label">Lugar / Espacio</span>
                <span className="detail-val">📌 {publication.location}</span>
              </div>
            </div>

            {publication.infoNote && (
              <div className="modal-info-highlight-box">
                <span className="info-icon">📢</span>
                <span>{publication.infoNote}</span>
              </div>
            )}

            <div className="modal-section-block">
              <h5 className="modal-section-title">Descripción y Convocatoria</h5>
              <p className="modal-description-text">{publication.description}</p>
            </div>

            {publication.highlights && publication.highlights.length > 0 && (
              <div className="modal-section-block">
                <h5 className="modal-section-title">Detalles del anuncio:</h5>
                <ul className="modal-highlights-list">
                  {publication.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="check-bullet">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-tags-row">
              {publication.tags.map((t) => (
                <span key={t} className="modal-tag-chip">#{t}</span>
              ))}
            </div>

            {/* Botones de acción sin links externos */}
            <div className="modal-cta-group">
              <button
                type="button"
                className="modal-action-btn blank-action-btn"
                title="Botón informativo sin enlace externo"
              >
                <span>Convocatoria Oficial Presencial</span>
              </button>

              <button
                type="button"
                className="modal-copy-btn"
                onClick={handleCopyLink}
              >
                {copied ? '✓ Enlace Copiado' : '🔗 Compartir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
