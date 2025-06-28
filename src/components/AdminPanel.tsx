import React, { useState } from 'react';
import { Plus, Search, Filter, CalendarDays, Users as UsersIcon } from 'lucide-react';
import { Termin } from '../types';
import TerminCard from './TerminCard';
import TerminForm from './TerminForm';

interface AdminPanelProps {
  terminy: Termin[];
  onAddTermin: (termin: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => void;
  onEditTermin: (id: string, termin: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => void;
  onDeleteTermin: (id: string) => void;
}

export default function AdminPanel({ terminy, onAddTermin, onEditTermin, onDeleteTermin }: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTermin, setEditingTermin] = useState<Termin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filteredTerminy = terminy.filter(termin => {
    const matchesSearch = termin.tema.toLowerCase().includes(searchTerm.toLowerCase());
    const terminDate = new Date(`${termin.datum}T${termin.cas}`);
    const now = new Date();
    
    let matchesFilter = true;
    if (filter === 'upcoming') {
      matchesFilter = terminDate > now;
    } else if (filter === 'past') {
      matchesFilter = terminDate <= now;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleSave = (terminData: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => {
    if (editingTermin) {
      onEditTermin(editingTermin.id, terminData);
      setEditingTermin(null);
    } else {
      onAddTermin(terminData);
    }
    setShowForm(false);
  };

  const handleEdit = (termin: Termin) => {
    setEditingTermin(termin);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Opravdu chcete smazat tento termín?')) {
      onDeleteTermin(id);
    }
  };

  const upcomingTerminy = terminy.filter(t => new Date(`${t.datum}T${t.cas}`) > new Date());
  const totalParticipants = terminy.reduce((sum, t) => sum + t.ucastnici.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Celkem termínů</p>
              <p className="text-2xl font-bold text-gray-900">{terminy.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CalendarDays className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nadcházející</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingTerminy.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Celkem účastníků</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Správa termínů</h1>
          <p className="text-gray-600 mt-1">Vytvářejte a spravujte termíny pro rezervace</p>
        </div>
        <button
          onClick={() => {
            setEditingTermin(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nový termín
        </button>
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
          
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Všechny termíny</option>
                <option value="upcoming">Nadcházející</option>
                <option value="past">Proběhlé</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Terminy List */}
      {filteredTerminy.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filter !== 'all' ? 'Žádné termíny nenalezeny' : 'Zatím žádné termíny'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filter !== 'all' 
              ? 'Zkuste změnit vyhledávací kritéria'
              : 'Začněte vytvořením prvního termínu'
            }
          </p>
          {!searchTerm && filter === 'all' && (
            <button
              onClick={() => {
                setEditingTermin(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Vytvořit první termín
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerminy.map(termin => (
            <TerminCard
              key={termin.id}
              termin={termin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRegister={() => {}} // V admin panelu se neregistruje
            />
          ))}
        </div>
      )}

      {/* Termin Form Modal */}
      {showForm && (
        <TerminForm
          termin={editingTermin || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTermin(null);
          }}
        />
      )}
    </div>
  );
}