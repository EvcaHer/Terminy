import React, { useState } from 'react';
import { X, Save, Calendar, Clock, Users, FileText } from 'lucide-react';
import { Termin } from '../types';

interface TerminFormProps {
  termin?: Termin;
  onSave: (termin: Omit<Termin, 'id' | 'ucastnici' | 'vytvoren'>) => void;
  onCancel: () => void;
}

export default function TerminForm({ termin, onSave, onCancel }: TerminFormProps) {
  const [formData, setFormData] = useState({
    datum: termin?.datum || '',
    cas: termin?.cas || '',
    tema: termin?.tema || '',
    maxUcastniku: termin?.maxUcastniku || 10
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.datum) newErrors.datum = 'Datum je povinný';
    if (!formData.cas) newErrors.cas = 'Čas je povinný';
    if (!formData.tema.trim()) newErrors.tema = 'Téma je povinné';
    if (formData.maxUcastniku < 1) newErrors.maxUcastniku = 'Minimálně 1 účastník';
    if (formData.maxUcastniku > 100) newErrors.maxUcastniku = 'Maximálně 100 účastníků';

    // Kontrola, zda je datum v budoucnosti
    const selectedDate = new Date(`${formData.datum}T${formData.cas}`);
    if (selectedDate <= new Date()) {
      newErrors.datum = 'Datum a čas musí být v budoucnosti';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {termin ? 'Upravit termín' : 'Nový termín'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Datum
              </label>
              <input
                type="date"
                value={formData.datum}
                onChange={(e) => handleChange('datum', e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.datum ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.datum && <p className="text-red-600 text-sm mt-1">{errors.datum}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Čas
              </label>
              <input
                type="time"
                value={formData.cas}
                onChange={(e) => handleChange('cas', e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.cas ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.cas && <p className="text-red-600 text-sm mt-1">{errors.cas}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Téma/Název termínu
            </label>
            <input
              type="text"
              value={formData.tema}
              onChange={(e) => handleChange('tema', e.target.value)}
              placeholder="Zadejte téma nebo název termínu"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.tema ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.tema && <p className="text-red-600 text-sm mt-1">{errors.tema}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Maximální počet účastníků
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.maxUcastniku}
              onChange={(e) => handleChange('maxUcastniku', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.maxUcastniku ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.maxUcastniku && <p className="text-red-600 text-sm mt-1">{errors.maxUcastniku}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {termin ? 'Uložit změny' : 'Vytvořit termín'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}