import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MapInitializerProps {
  center: LatLngTuple;
}

export const MapInitializer = ({ center }: MapInitializerProps) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  
  return null;
};