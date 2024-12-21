import { Marker, Popup } from 'react-leaflet';
import { Location } from './useLocations';

interface MapMarkerProps {
  location: Location;
}

export const MapMarker = ({ location }: MapMarkerProps) => {
  return (
    <Marker position={[location.latitude, location.longitude]}>
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{location.name}</h3>
          <p className="text-sm">{location.address}, {location.city}</p>
          <p className="text-sm mt-1">Capacité: {location.capacity} personnes</p>
        </div>
      </Popup>
    </Marker>
  );
};