import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '../ui/loading-spinner';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

const LocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

  useEffect(() => {
    if (!mapContainer.current || !locations?.length) return;

    const initializeMap = async () => {
      try {
        const { data: { publicToken }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          return;
        }

        mapboxgl.accessToken = publicToken;

        // Calculer le centre de la carte basé sur les emplacements
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) => {
          bounds.extend([location.longitude, location.latitude]);
        });

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          bounds: bounds,
          fitBoundsOptions: { padding: 50 }
        });

        // Ajouter les contrôles de navigation
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Ajouter les marqueurs pour chaque emplacement
        locations.forEach((location) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${location.name}</h3>
              <p class="text-sm">${location.address}, ${location.city}</p>
              <p class="text-sm mt-1">Capacité: ${location.capacity} personnes</p>
            </div>
          `);

          const marker = new mapboxgl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .setPopup(popup)
            .addTo(map.current!);

          markersRef.current.push(marker);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [locations]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default LocationMap;