"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from '@mui/material';

// Fix for default marker icons in leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view when center/zoom changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const MapComponent = ({ 
  center = [20.5937, 78.9629], // Default to India's center
  zoom = 4,
  locations = [],
  selectedFrom = null,
  selectedTo = null,
  onMarkerClick = () => {}
}) => {
  // Create custom marker icons
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <svg width="30" height="42" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 44 16 44C16 44 32 28 32 16C32 7.16 24.84 0 16 0ZM16 22C12.68 22 10 19.32 10 16C10 12.68 12.68 10 16 10C19.32 10 22 12.68 22 16C22 19.32 19.32 22 16 22Z" fill="${color}"/>
        </svg>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -35]
    });
  };

  const fromIcon = createCustomIcon('#FF9933'); // Orange (from Indian flag)
  const toIcon = createCustomIcon('#138808'); // Green (from Indian flag)
  const defaultIcon = createCustomIcon('#000080'); // Navy blue

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} zoom={zoom} />
      
      {selectedFrom && (
        <Marker 
          position={selectedFrom.coordinates} 
          icon={fromIcon}
        >
          <Popup>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                From: {selectedFrom.label}
              </Typography>
              <Typography variant="body2">
                {selectedFrom.description}
              </Typography>
            </Box>
          </Popup>
        </Marker>
      )}
      
      {selectedTo && (
        <Marker 
          position={selectedTo.coordinates}
          icon={toIcon}
        >
          <Popup>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                To: {selectedTo.label}
              </Typography>
              <Typography variant="body2">
                {selectedTo.description}
              </Typography>
            </Box>
          </Popup>
        </Marker>
      )}
      
      {!selectedFrom && !selectedTo && locations.map((location) => (
        <Marker 
          key={location.label} 
          position={location.coordinates}
          eventHandlers={{
            click: () => onMarkerClick(location),
          }}
          icon={defaultIcon}
        >
          <Popup>
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {location.label}
              </Typography>
              <Typography variant="body2">
                {location.description}
              </Typography>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
