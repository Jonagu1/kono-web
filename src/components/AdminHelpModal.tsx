import React, { useEffect } from 'react';

interface AdminHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPosts: number;
}

export const AdminHelpModal: React.FC<AdminHelpModalProps> = ({
  isOpen,
  onClose,
  totalPosts
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window admin-modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        <div className="admin-modal-content">
          <div className="admin-header-pill">
            <span className="admin-lock-icon">🔒</span>
            <span>Sistema de Publicaciones Oficiales UACh</span>
          </div>

          <h2 className="admin-title">¿Cómo funciona la subida de publicaciones?</h2>
          <p className="admin-subtitle">
            Para garantizar la seguridad, calidad editorial y evitar spam, <strong>el público general no tiene acceso para subir publicaciones</strong> desde la web.
          </p>

          <div className="admin-steps-grid">
            <div className="admin-step-card">
              <div className="step-number">1</div>
              <h4>Envía el afiche a este Chat</h4>
              <p>
                Adjunta la imagen del afiche o poster (PNG/JPG) directamente en nuestro chat de Antigravity con las indicaciones que quieras.
              </p>
            </div>

            <div className="admin-step-card">
              <div className="step-number">2</div>
              <h4>Procesamiento Asistido</h4>
              <p>
                El asistente lee la información del afiche (fecha, hora, lugar, organizador, enlaces) y guarda la imagen en la carpeta <code>public/posts/</code>.
              </p>
            </div>

            <div className="admin-step-card">
              <div className="step-number">3</div>
              <h4>Publicación Inmediata</h4>
              <p>
                Se genera la ficha en <code>src/data/publications.ts</code> y el portal se actualiza automáticamente sin exponer formularios vulnerables.
              </p>
            </div>
          </div>

          <div className="admin-code-sample">
            <div className="code-header">
              <span>Estructura de datos (`src/data/publications.ts`)</span>
              <span className="code-tag">{totalPosts} publicaciones cargadas</span>
            </div>
            <pre>
{`{
  id: "mi-nueva-convocatoria",
  title: "Nombre del Evento o Taller",
  category: "Emprendimiento" | "Club" | "Deportes" | "Salud & Bienestar",
  date: "Fecha del evento",
  location: "Campus Miraflores / Isla Teja / Valdivia",
  image: "/posts/mi-afiche.jpg",
  highlights: ["Taller práctico", "Certificado"],
  actionLink: { url: "https://...", label: "Inscripción" }
}`}
            </pre>
          </div>

          <div className="admin-modal-footer">
            <p className="admin-status-text">
              ✨ <strong>Estado actual:</strong> 4 afiches oficiales UACh activos y protegidos contra modificaciones no autorizadas.
            </p>
            <button className="modal-action-btn primary" onClick={onClose}>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
