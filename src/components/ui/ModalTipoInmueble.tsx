'use client';

import { useState } from 'react';

interface ModalTipoInmuebleProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tipo: 'Normal' | 'Especial') => void;
}

export default function ModalTipoInmueble({ isOpen, onClose, onSelect }: ModalTipoInmuebleProps) {
  const [selectedTipo, setSelectedTipo] = useState<'Normal' | 'Especial' | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedTipo) {
      onSelect(selectedTipo);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white p-6 rounded-t-2xl">
          <h2 className="text-xl font-bold text-center">Tipo de Inmueble</h2>
          <p className="text-sm text-white/90 text-center mt-1">Selecciona el tipo de inmueble a registrar</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Opción Normal */}
            <button
              onClick={() => setSelectedTipo('Normal')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedTipo === 'Normal'
                  ? 'border-[#676D47] bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedTipo === 'Normal' 
                    ? 'border-[#676D47] bg-[#676D47]' 
                    : 'border-gray-300'
                }`}>
                  {selectedTipo === 'Normal' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Inmueble Normal</h3>
                  <p className="text-sm text-gray-600">Registro estándar con todos los módulos</p>
                </div>
                <div className="ml-auto">
                  <span className="text-2xl">🏢</span>
                </div>
              </div>
            </button>

            {/* Opción Especial */}
            <button
              onClick={() => setSelectedTipo('Especial')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedTipo === 'Especial'
                  ? 'border-[#676D47] bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedTipo === 'Especial' 
                    ? 'border-[#676D47] bg-[#676D47]' 
                    : 'border-gray-300'
                }`}>
                  {selectedTipo === 'Especial' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Inmueble Especial</h3>
                  <p className="text-sm text-gray-600">Registro con características particulares</p>
                </div>
                <div className="ml-auto">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTipo}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTipo
                ? 'bg-[#676D47] text-white hover:bg-[#5a6140]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
