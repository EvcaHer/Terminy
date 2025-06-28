import React, { useState } from 'react';
import { Calendar, Clock, Users, UserPlus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Termin, Ucastnik } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RegistrationModal from './RegistrationModal';

interface TerminCardProps {
  termin: Termin;
  onEdit?: (termin: Termin) => void;
  onDelete?: (id: string) => void;
  onRegister: (terminId: string, ucastnik: Omit<Ucastnik, 'id' | 'registrovan'>) => void;
}

export default function TerminCard({ termin, onEdit, onDelete, onRegister }: TerminCardProps) {
  const { isAdmin } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const isFullyBooked = termin.ucastnici.length >= termin.maxUcastniku;
  const isPastDate = new Date(`${termin.datum}T${termin.cas}`) < new Date();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRegister = (ucastnikData: Omit<Ucastnik, 'id' | 'registrovan'>) => {
    onRegister(termin.id, ucastnikData);
    setShowRegistration(false);
  };

  const getStatusColor = () => {
    if (isPastDate) return 'text-gray-500 bg-gray-100';
    if (isFullyBooked) return 'text-red-700 bg-red-100';
    return 'text-green-700 bg-green-100';
  };

  const getStatusText = () => {
    if (isPastDate) return 'Proběhl';
    if (isFullyBooked) return 'Obsazeno';
    return 'Volné místa';
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isPastDate ? 'opacity-75' : ''
      }`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{termin.tema}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(termin.datum)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {termin.cas}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="font-medium">{termin.ucastnici.length}</span>
              <span className="mx-1">/</span>
              <span>{termin.maxUcastniku}</span>
              <span className="ml-1">účastníků</span>
            </div>

            {termin.ucastnici.length > 0 && (
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showParticipants ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showParticipants ? 'Skrýt účastníky' : 'Zobrazit účastníky'}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isFullyBooked ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min((termin.ucastnici.length / termin.maxUcastniku) * 100, 100)}%`
              }}
            ></div>
          </div>

          {/* Participants List */}
          {showParticipants && termin.ucastnici.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Registrovaní účastníci:</h4>
              <div className="space-y-2">
                {termin.ucastnici.map((ucastnik, index) => (
                  <div key={ucastnik.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}. {ucastnik.jmeno}
                      </span>
                      <div className="text-xs text-gray-500">
                        {ucastnik.email}
                        {ucastnik.telefon && ` • ${ucastnik.telefon}`}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(ucastnik.registrovan).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit?.(termin)}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Upravit termín"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(termin.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Smazat termín"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {!isAdmin && !isPastDate && (
              <button
                onClick={() => setShowRegistration(true)}
                disabled={isFullyBooked}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFullyBooked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isFullyBooked ? 'Obsazeno' : 'Registrovat se'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showRegistration && (
        <RegistrationModal
          onRegister={handleRegister}
          onCancel={() => setShowRegistration(false)}
          tema={termin.tema}
          datum={termin.datum}
          cas={termin.cas}
        />
      )}
    </>
  );
}