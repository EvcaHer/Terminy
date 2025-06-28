import React, { useState } from 'react';
import { Search, Calendar, Filter, Clock } from 'lucide-react';
import { Termin, Ucastnik } from '../types';
import TerminCard from './TerminCard';

interface PublicViewProps {
  terminy: Termin[];
  onRegister: (terminId: string, ucastnik: Omit<Ucastnik, 'id' | 'registrovan'>) => void;
}

export default function PublicView({ terminy, onRegister }: PublicViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'upcoming'>('upcoming');

  const filteredTerminy = terminy.filter(termin => {
    const matchesSearch = termin.tema.toLowerCase().includes(searchTerm.toLowerCase());
    const terminDate = new Date(`${termin.datum}T${termin.cas}`);
    const now = new Date();
    const isAvailable = termin.ucastnici.length < termin.maxUcastniku;
    const isUpcoming = terminDate > now;
    
    let matchesFilter = true;
    if (filter === 'available') {
      matchesFilter = isAvailable && isUpcoming;
    } else if (filter === 'upcoming') {
      matchesFilter = isUpcoming;
    }
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Seřadit podle data (nejdříve nejbližší)
    const dateA = new Date(`${a.datum}T${a.cas}`);
    const dateB = new Date(`${b.datum}T${b.cas}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingTerminy = terminy.filter(t => new Date(`${t.datum}T${t.cas}`) > new Date());
  const availableTerminy = upcomingTerminy.filter(t => t.ucastnici.length < t.maxUcastniku);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dostupné termíny
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Vyberte si termín a zaregistrujte se. Všechna místa jsou obsazována podle pořadí přihlášení.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mb-2" />
            <div className="ml-4">
              <p className="text-blue-100">Nadcházející termíny</p>
              <p className="text-3xl font-bold">{upcomingTerminy.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Clock className="h-8 w-8 mb-2" />
            <div className="ml-4">
              <p className="text-green-100">Volná místa</p>
              <p className="text-3xl font-bold">{availableTerminy.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mb-2" />
            <div className="ml-4">
              <p className="text-purple-100">Celkem termínů</p>
              <p className="text-3xl font-bold">{terminy.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Hledat podle tématu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="sm:w-56">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="upcoming">Nadcházející</option>
                <option value="available">Jen volná místa</option>
                <option value="all">Všechny termíny</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Terminy List */}
      {filteredTerminy.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filter !== 'upcoming' ? 'Žádné termíny nenalezeny' : 'Zatím žádné nadcházející termíny'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'upcoming' 
              ? 'Zkuste změnit vyhledávací kritéria'
              : 'Nové termíny budou brzy přidány'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerminy.map(termin => (
            <TerminCard
              key={termin.id}
              termin={termin}
              onRegister={onRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}