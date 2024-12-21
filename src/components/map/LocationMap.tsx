import React, { Suspense } from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapInitializer } from './MapInitializer';
import { MapMarker } from './MapMarker';
import { useLocations } from './useLocations';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const calculateMapCenter = (locations: { latitude: number; longitude: number }[]): LatLngTuple => {
  return locations.reduce(
    (acc, location) => {
      acc[0] += location.latitude;
      acc[1] += location.longitude;
      return acc;
    },
    [0, 0]
  ).map(coord => coord / locations.length) as LatLngTuple;
};

const LocationMap = () => {
  const { data: locations, isLoading } = useLocations();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!locations?.length) {
    return <div>Aucun lieu disponible</div>;
  }

  const center = calculateMapCenter(locations);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <Suspense fallback={<LoadingSpinner />}>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <MapMarker key={location.id} location={location} />
          ))}
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default LocationMap;