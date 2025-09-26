'use client';

import { useMemo } from 'react';

interface OpenStreetMapEmbedProps {
  coordinates: string; // formato: "lat, lng"
  zoom?: number; // 1-19 aprox
  heightClassName?: string; // ej: h-64
}

function parseCoordinates(input: string): { lat: number; lng: number } | null {
  if (!input) return null;
  const parts = input.split(',').map((p) => p.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export default function OpenStreetMapEmbed({ coordinates, zoom = 16, heightClassName = 'h-64' }: OpenStreetMapEmbedProps) {
  const parsed = useMemo(() => parseCoordinates(coordinates), [coordinates]);

  if (!parsed) {
    return (
      <div className={`w-full ${heightClassName} bg-gray-100 rounded-lg flex items-center justify-center`}>        
        <div className="text-center text-gray-600 text-sm">
          Coordenadas no válidas. Usa el formato: latitud, longitud (ej: 19.4326, -99.1332)
        </div>
      </div>
    );
  }

  const { lat, lng } = parsed;
  // Construimos un bbox pequeño alrededor del centro para el iframe
  const delta = 0.005; // ~500m aprox, depende de lat
  const left = lng - delta;
  const bottom = lat - delta;
  const right = lng + delta;
  const top = lat + delta;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}&zoom=${zoom}`;
  const linkHref = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div className="w-full">
      <div className={`relative w-full ${heightClassName} overflow-hidden rounded-lg border border-gray-200`}>
        <iframe
          title="OpenStreetMap"
          className="w-full h-full"
          src={src}
          style={{ border: 0 }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Ver en OpenStreetMap
        </a>
        <span className="text-xs text-gray-500">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a> contributors
        </span>
      </div>
    </div>
  );
}


