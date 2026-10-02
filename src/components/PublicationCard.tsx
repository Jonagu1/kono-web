import React from 'react';
import type { Publication } from '../types/publication';

interface PublicationCardProps {
  publication: Publication;
  onOpenDetail: (publication: Publication) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onOpenDetail
}) => {
  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Emprendimiento':
        return 'badge-entrepreneurship';
      case 'Club':
        return 'badge-club';
      case 'Deportes':
        return 'badge-sports';
      case 'Salud & Bienestar':
        return 'badge-wellness';
      default:
        return 'badge-general';
    }
  };

  return (
    <article className="pub-card" onClick={() => onOpenDetail(publication)}>
      <div className="pub-image-wrapper">
        <img
          src={publication.image}
          alt={publication.title}
          className="pub-image"
          loading="lazy"
        />
        <div className="pub-overlay">
          <span className="view-poster-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Ver Afiche en Grande
          </span>
        </div>
        <div className="pub-badges-top">
          <span className={`pub-category-badge ${getCategoryClass(publication.category)}`}>
            {publication.category}
          </span>
          {publication.featured && (
            <span className="pub-featured-badge">Destacado</span>
          )}
        </div>
      </div>

      <div className="pub-content">
        <div className="pub-meta-row">
          <div className="pub-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{publication.date}</span>
          </div>

          {publication.time && (
            <div className="pub-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{publication.time}</span>
            </div>
          )}
        </div>

        <h3 className="pub-title">{publication.title}</h3>
        {publication.subtitle && (
          <p className="pub-subtitle">{publication.subtitle}</p>
        )}

        <div className="pub-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{publication.location}</span>
        </div>

        <p className="pub-description-excerpt">
          {publication.description}
        </p>

        {publication.infoNote && (
          <div className="pub-info-note">
            ℹ️ {publication.infoNote}
          </div>
        )}

        {publication.highlights && publication.highlights.length > 0 && (
          <div className="pub-highlights-row">
            {publication.highlights.slice(0, 3).map((item, idx) => (
              <span key={idx} className="pub-highlight-tag">
                ✓ {item}
              </span>
            ))}
          </div>
        )}

        <div className="pub-card-footer">
          <span className="pub-org-text">
            {publication.organization}
          </span>
          {/* Botón no funcional de redirección según lo solicitado */}
          <button
            type="button"
            className="pub-card-action-btn blank-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(publication);
            }}
          >
            Ver Afiche →
          </button>
        </div>
      </div>
    </article>
  );
};
