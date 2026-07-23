import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { ENV } from '@/config/env';

// Leaflet's default marker icon paths break under bundlers — point them at the
// bundled assets explicitly.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Captures clicks/drags on the map and reports the picked coordinates.
const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Interactive map for picking a lat/lng (e.g. resident/worker home location).
// Click anywhere on the map, drag the marker, or use "Joriy joylashuv" to read
// the device's GPS position via the browser's Geolocation API.
const LocationPicker = ({ value, onChange, height = 260 }) => {
  const { t } = useTranslation();
  const center = value ? [value.lat, value.lng] : [ENV.MAP_DEFAULT.lat, ENV.MAP_DEFAULT.lng];

  const handlePick = useCallback(
    (lat, lng) => onChange?.({ lat, lng }),
    [onChange]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePick(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">{t('common.mapHint')}</span>
        <button
          type="button"
          onClick={useMyLocation}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline"
        >
          <HiOutlineMapPin className="h-3.5 w-3.5" />
          {t('common.myLocation')}
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700" style={{ height }}>
        <MapContainer center={center} zoom={value ? 15 : 11} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  handlePick(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
