import React from 'react';

interface HeroBannerProps {
  totalPosts: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalPosts }) => {
  return (
    <section className="hero-banner">
      <div className="hero-content">
        <div className="hero-pill">
          <span className="live-indicator"></span>
          <span>Cartelera Oficial Verificada · Modo Lectura</span>
        </div>
        <h2 className="hero-title">
          Convocatorias, Talleres y Vida Universitaria en la <span className="highlight-text">UACh</span>
        </h2>
        <p className="hero-description">
          Portal informativo del Club de Innovación y Emprendimiento. Accede a las oportunidades de preincubación, encuentros estudiantiles, campeonatos deportivos y bienestar en Valdivia.
        </p>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{totalPosts}</span>
            <span className="stat-label">Publicaciones activas</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-text-badge">Campus Miraflores & Isla Teja</span>
            <span className="stat-label">Sedes Valdivia</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-badge-verified">✓ 100% Oficial</span>
            <span className="stat-label">Sin spam de terceros</span>
          </div>
        </div>
      </div>
    </section>
  );
};
