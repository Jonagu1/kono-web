import { useState, useMemo } from 'react';
import { initialPublications } from './data/publications';
import type { Publication, Category, Campus } from './types/publication';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CalendarWidget } from './components/CalendarWidget';
import { FilterBar } from './components/FilterBar';
import { PublicationCard } from './components/PublicationCard';
import { PublicationModal } from './components/PublicationModal';
import { AdminHelpModal } from './components/AdminHelpModal';
import { Footer } from './components/Footer';
import './App.css';

const CATEGORIES: Category[] = [
  'Todas',
  'Emprendimiento',
  'Club',
  'Deportes',
  'Salud & Bienestar'
];

const CAMPUSES: Campus[] = [
  'Todos',
  'Campus Miraflores',
  'Campus Isla Teja',
  'Valdivia'
];

function App() {
  const [publications] = useState<Publication[]>(initialPublications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [selectedCampus, setSelectedCampus] = useState<Campus>('Todos');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isAdminInfoOpen, setIsAdminInfoOpen] = useState(false);

  // Filter publications based on search, category, campus, and calendar date
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      // Date filter from Calendar
      if (selectedDate !== null) {
        if (!pub.eventDates.includes(selectedDate)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'Todas' && pub.category !== selectedCategory) {
        return false;
      }

      // Campus filter
      if (selectedCampus !== 'Todos' && pub.campus !== selectedCampus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = pub.title.toLowerCase().includes(query);
        const matchesSubtitle = pub.subtitle?.toLowerCase().includes(query) ?? false;
        const matchesOrg = pub.organization.toLowerCase().includes(query);
        const matchesLocation = pub.location.toLowerCase().includes(query);
        const matchesDescription = pub.description.toLowerCase().includes(query);
        const matchesTags = pub.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSubtitle && !matchesOrg && !matchesLocation && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [publications, selectedDate, selectedCategory, selectedCampus, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedCampus('Todos');
    setSelectedDate(null);
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminInfo={() => setIsAdminInfoOpen(true)}
      />

      <main>
        <HeroBanner totalPosts={publications.length} />

        <div className="portal-layout">
          {/* Sidebar: Interactive Calendar Widget & Info */}
          <aside className="portal-sidebar">
            <CalendarWidget
              publications={publications}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <div className="sidebar-info-card">
              <h4>🔒 Portal de Solo Lectura</h4>
              <p>
                Los anuncios son oficiales y verificados por el Club de Innovación y Emprendimiento UACh. No contiene enlaces externos de redirección ni formularios de terceros.
              </p>
            </div>
          </aside>

          {/* Right Column: Filter Bar & Publications Grid */}
          <section className="portal-main-feed">
            <FilterBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              campuses={CAMPUSES}
              selectedCampus={selectedCampus}
              onSelectCampus={setSelectedCampus}
              filteredCount={filteredPublications.length}
            />

            {filteredPublications.length > 0 ? (
              <div className="publications-grid">
                {filteredPublications.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    publication={pub}
                    onOpenDetail={setSelectedPublication}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3>No hay publicaciones para estos filtros</h3>
                <p>
                  {selectedDate
                    ? `No se encontraron eventos para el día ${selectedDate}.`
                    : 'Intenta cambiar de categoría o borrar la búsqueda.'}
                </p>
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={handleResetFilters}
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <PublicationModal
        publication={selectedPublication}
        onClose={() => setSelectedPublication(null)}
      />

      <AdminHelpModal
        isOpen={isAdminInfoOpen}
        onClose={() => setIsAdminInfoOpen(false)}
        totalPosts={publications.length}
      />

      <Footer />
    </>
  );
}

export default App;
