import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Termin, Ucastnik } from './types';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import PublicView from './components/PublicView';

// Demo data
const demoTerminy: Termin[] = [
  {
    id: '1',
    datum: '2025-02-15',
    cas: '10:00',
    tema: 'Úvod do React.js',
    maxUcastniku: 15,
    ucastnici: [
      {
        id: '1',
        jmeno: 'Jan Novák',
        email: 'jan.novak@email.cz',
        telefon: '+420 123 456 789',
        registrovan: '2025-01-10T09:30:00Z'
      },
      {
        id: '2',
        jmeno: 'Marie Svobodová',
        email: 'marie.svoboda@email.cz',
        registrovan: '2025-01-12T14:20:00Z'
      }
    ],
    vytvoren: '2025-01-08T08:00:00Z'
  },
  {
    id: '2',
    datum: '2025-02-20',
    cas: '14:00',
    tema: 'TypeScript pro začátečníky',
    maxUcastniku: 12,
    ucastnici: [],
    vytvoren: '2025-01-09T10:00:00Z'
  },
  {
    id: '3',
    datum: '2025-01-10',
    cas: '16:00',
    tema: 'HTML & CSS Workshop',
    maxUcastniku: 20,
    ucastnici: [
      {
        id: '3',
        jmeno: 'Petr Dvořák',
        email: 'petr.dvorak@email.cz',
        telefon: '+420 987 654 321',
        registrovan: '2025-01-05T11:45:00Z'
      }
    ],
    vytvoren: '2025-01-01T12:00:00Z'
  }
];

function AppContent() {
  const { isAdmin } = useAuth();
  const [terminy, setTerminy] = useLocalStorage<Termin[]>('terminy', demoTerminy);
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [showLogin, setShowLogin] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddTermin = (terminData: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => {
    const newTermin: Termin = {
      ...terminData,
      id: generateId(),
      ucastnici: [],
      vytvoren: new Date().toISOString()
    };
    setTerminy(prev => [...prev, newTermin]);
  };

  const handleEditTermin = (id: string, terminData: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => {
    setTerminy(prev => prev.map(termin => 
      termin.id === id 
        ? { ...termin, ...terminData }
        : termin
    ));
  };

  const handleDeleteTermin = (id: string) => {
    setTerminy(prev => prev.filter(termin => termin.id !== id));
  };

  const handleRegister = (terminId: string, ucastnikData: Omit<Ucastnik, 'id' | 'registrovan'>) => {
    const newUcastnik: Ucastnik = {
      ...ucastnikData,
      id: generateId(),
      registrovan: new Date().toISOString()
    };

    setTerminy(prev => prev.map(termin => {
      if (termin.id === terminId && termin.ucastnici.length < termin.maxUcastniku) {
        // Kontrola duplicitního emailu
        const emailExists = termin.ucastnici.some(u => u.email === ucastnikData.email);
        if (emailExists) {
          alert('Tento email je již zaregistrován na tento termín.');
          return termin;
        }
        
        return {
          ...termin,
          ucastnici: [...termin.ucastnici, newUcastnik]
        };
      }
      return termin;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      {isAdmin ? (
        currentView === 'admin' ? (
          <AdminPanel
            terminy={terminy}
            onAddTermin={handleAddTermin}
            onEditTermin={handleEditTermin}
            onDeleteTermin={handleDeleteTermin}
          />
        ) : (
          <PublicView terminy={terminy} onRegister={handleRegister} />
        )
      ) : (
        <>
          <PublicView terminy={terminy} onRegister={handleRegister} />
          <div className="fixed bottom-4 right-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Admin přihlášení
            </button>
          </div>
        </>
      )}

      {showLogin && (
        <AdminLogin onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;