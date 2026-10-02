import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-brand-title">Información Universitaria</span>
            <span className="footer-brand-sub">Club de Innovación y Emprendimiento</span>
          </div>
          <p className="footer-description">
            Plataforma informativa para la difusión de convocatorias de innovación, clubes estudiantiles, deporte y bienestar de la Universidad Austral de Chile.
          </p>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Espacios y Sedes</h5>
          <ul className="footer-links">
            <li>📍 Centro de Innovación y Emprendimiento 14K (Miraflores)</li>
            <li>📍 Facultad de Ciencias de la Ingeniería</li>
            <li>📍 Campus Isla Teja · Sala Espejos & Gimnasio UACh</li>
            <li>📍 Valdivia, Región de Los Ríos, Chile</li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Seguridad y Gestión</h5>
          <div className="footer-security-pill">
            <span className="secure-dot"></span>
            <span>Portal protegido · Modo solo lectura público</span>
          </div>
          <p className="footer-note">
            Para solicitar la publicación de afiches de carreras o clubes, coordina con la administración enviando el afiche al chat del proyecto.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Universidad Austral de Chile · Club de Innovación y Emprendimiento. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
