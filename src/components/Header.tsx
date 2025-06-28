import React from 'react';
import { Calendar, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RezervaSystem</h1>
              <p className="text-sm text-gray-500">Správa termínů a rezervací</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewChange('public')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'public'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-1" />
                  Veřejný pohled
                </button>
                <button
                  onClick={() => onViewChange('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-1" />
                  Administrace
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 inline mr-1" />
                  Odhlásit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}