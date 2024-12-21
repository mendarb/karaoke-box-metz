import { LatLngExpression } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

interface MapMarkerProps {
  location: Location;
}

export const MapMarker = ({ location }: MapMarkerProps) => {
  return (
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
  );
};