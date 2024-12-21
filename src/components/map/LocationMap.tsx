import React, { Suspense } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapMarker } from './MapMarker';
import { useLocations } from './useLocations';
import { MapInitializer } from './MapInitializer';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [49.1193089, 6.1757156]; // Metz coordinates
const DEFAULT_ZOOM = 13;

const LocationMap = () => {
  const { data: locations, isLoading } = useLocations();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!locations?.length) {
    return <div>Aucun lieu disponible</div>;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <Suspense fallback={<LoadingSpinner />}>
        <MapContainer
          className="h-full w-full"
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer center={DEFAULT_CENTER} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((location) => (
            <MapMarker key={location.id} location={location} />
          ))}
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default LocationMap;