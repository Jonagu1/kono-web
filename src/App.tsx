import { useState, useMemo } from 'react';
import { initialPublications } from './data/publications';
import type { Publication, Category, Campus } from './types/publication';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
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
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isAdminInfoOpen, setIsAdminInfoOpen] = useState(false);

  // Filter publications based on search, category and campus
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
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
  }, [publications, selectedCategory, selectedCampus, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedCampus('Todos');
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

        <div className="filter-bar-container">
          <FilterBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            campuses={CAMPUSES}
            selectedCampus={selectedCampus}
            onSelectCampus={setSelectedCampus}
            filteredCount={filteredPublications.length}
          />
        </div>

        <section className="main-content">
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
              <div className="empty-state-icon">🔍</div>
              <h3>No se encontraron publicaciones</h3>
              <p>
                No hay afiches que coincidan con los filtros seleccionados o el término de búsqueda.
              </p>
              <button className="reset-filters-btn" onClick={handleResetFilters}>
                Restablecer todos los filtros
              </button>
            </div>
          )}
        </section>
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
