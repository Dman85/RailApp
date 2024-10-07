import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { useQuery } from 'react-query';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapContext } from '../contexts/MapContext';
import { MapPin, Navigation } from 'lucide-react';
import MarkerClusterGroup from 'react-leaflet-markercluster';

interface Asset {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const Map: React.FC = () => {
  const { isLoading, error, data } = useQuery<Asset[], Error>('assets', () =>
    axios.get('https://railway-api.thesandrys.com/api/assets').then((res) => res.data)
  );

  const { followMe, setFollowMe } = useMapContext();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (followMe) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setFollowMe(false);
        }
      );
    }
  }, [followMe, setFollowMe]);

  if (isLoading) return <div>Loading assets...</div>;
  if (error) return <div>Error fetching assets: {error.message}</div>;

  return (
    <MapContainer
      center={[54.5, -4]} // Center of UK
      zoom={6}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="bottomright" />
      <MarkerClusterGroup>
        {data?.map((asset) => (
          <Marker
            key={asset.id}
            position={[asset.latitude, asset.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="flex items-start">
                <div className="flex-grow">
                  <h3 className="font-bold">{asset.name}</h3>
                  <p>Type: {asset.type}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${asset.latitude},${asset.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center mt-2"
                  >
                    <Navigation size={16} className="mr-1" /> Navigate
                  </a>
                </div>
                <img
                  src="https://theanswerclass.com/wp-content/uploads/2021/04/Stress-Monster-300x300.png"
                  alt="Asset"
                  className="w-16 h-16 object-cover ml-4"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {followMe && userLocation && (
        <Marker position={userLocation} icon={customIcon}>
          <Popup>Your current location</Popup>
        </Marker>
      )}
      <MapEvents />
    </MapContainer>
  );
};

const MapEvents: React.FC = () => {
  const map = useMap();
  const { followMe } = useMapContext();

  useEffect(() => {
    if (followMe) {
      map.locate({ watch: true });
      map.on('locationfound', (e) => {
        map.flyTo(e.latlng, map.getZoom());
      });
    } else {
      map.stopLocate();
    }

    return () => {
      map.off('locationfound');
    };
  }, [followMe, map]);

  return null;
};

export default Map;