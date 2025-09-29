'use client';

import { StepProps } from './types';

export default function Registral({ datos, actualizarDatos }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Registros Públicos</h3>
        <p className="text-gray-600">Información de registros públicos y legales</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Folio Electrónico
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={150}
              value={datos.folioElectronico || ''}
              onChange={(e) => actualizarDatos('folioElectronico', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="FE-2024-001"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📁</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha del Certificado de Libertad
          </label>
          <input
            type="date"
            value={datos.fechaCertificadoLibertad || ''}
            onChange={(e) => actualizarDatos('fechaCertificadoLibertad', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Certificado de Libertad de Gravamen
          </label>
          <div className="relative">
            <input
              type="url"
              value={datos.certificadoLibertadGravamen || ''}
              onChange={(e) => actualizarDatos('certificadoLibertadGravamen', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://ejemplo.com/certificado-libertad.pdf"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">🔗</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Archivo de Antecedente Registral
          </label>
          <div className="relative">
            <input
              type="url"
              value={datos.archivoAntecedenteRegistral || ''}
              onChange={(e) => actualizarDatos('archivoAntecedenteRegistral', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://ejemplo.com/antecedente.pdf"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">🔗</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha de Inscripción en el Registro Público de Propiedad Inmobiliaria
          </label>
          <input
            type="date"
            value={datos.fechaInscripcionRegistroPublicoPropiedadInmobiliaria || ''}
            onChange={(e) => actualizarDatos('fechaInscripcionRegistroPublicoPropiedadInmobiliaria', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Antecedente Registral
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.antecedenteRegistral || ''}
            onChange={(e) => actualizarDatos('antecedenteRegistral', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Registro previo bajo folio 12345"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Inscripción de Decreto
          </label>
          <textarea
            value={datos.inscripcionDecreto || ''}
            onChange={(e) => actualizarDatos('inscripcionDecreto', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Decreto gubernamental 2024-A"
          />
        </div>
      </div>

      {/* Documents preview */}
      {(datos.folioElectronico || datos.certificadoLibertadGravamen || datos.archivoAntecedenteRegistral || datos.inscripcionDecreto) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">Información de Registros Públicos</h4>
          <div className="space-y-3">
            {datos.folioElectronico && (
              <div className="text-blue-700">
                <p className="font-medium">📁 <strong>Folio Electrónico:</strong> {datos.folioElectronico}</p>
              </div>
            )}
            
            {(datos.certificadoLibertadGravamen || datos.archivoAntecedenteRegistral) && (
              <div className="space-y-2">
                <h5 className="font-medium text-blue-700">Documentos Disponibles</h5>
                {datos.certificadoLibertadGravamen && (
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📄</span>
                    <a 
                      href={datos.certificadoLibertadGravamen} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Certificado de Libertad de Gravamen
                    </a>
                  </div>
                )}
                {datos.archivoAntecedenteRegistral && (
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📋</span>
                    <a 
                      href={datos.archivoAntecedenteRegistral} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Antecedente Registral
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {datos.antecedenteRegistral && (
              <div className="pt-3 border-t border-blue-200">
                <h5 className="font-medium text-blue-700 mb-2">Antecedente Registral</h5>
                <p className="text-blue-700 text-sm">{datos.antecedenteRegistral}</p>
              </div>
            )}
            
            {datos.inscripcionDecreto && (
              <div className="pt-3 border-t border-blue-200">
                <h5 className="font-medium text-blue-700 mb-2">Inscripción de Decreto</h5>
                <p className="text-blue-700 text-sm">{datos.inscripcionDecreto}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}