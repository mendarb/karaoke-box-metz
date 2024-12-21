import React, { Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '../ui/loading-spinner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

// Component to handle map initialization
const MapInitializer = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  
  return null;
};

const LocationMap = () => {
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .is('deleted_at', null);

      if (error) throw error;
      return data as Location[];
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!locations?.length) {
    return <div>Aucun lieu disponible</div>;
  }

  // Calculate map center based on locations
  const center: LatLngTuple = locations.reduce(
    (acc, location) => {
      acc[0] += location.latitude;
      acc[1] += location.longitude;
      return acc;
    },
    [0, 0]
  ).map(coord => coord / locations.length) as LatLngTuple;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <Suspense fallback={<LoadingSpinner />}>
        <MapContainer
          center={center as [number, number]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <MapInitializer center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude] as LatLngExpression}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm">{location.address}, {location.city}</p>
                  <p className="text-sm mt-1">Capacité: {location.capacity} personnes</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default LocationMap;