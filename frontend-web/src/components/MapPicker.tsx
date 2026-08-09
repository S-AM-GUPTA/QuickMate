"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultLat?: number;
  defaultLng?: number;
}

const LocationMarker = ({ onLocationSelect, defaultLat, defaultLng }: MapPickerProps) => {
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLat && defaultLng ? new L.LatLng(defaultLat, defaultLng) : null
  );

  useMapEvents({
    click: async (e) => {
      setPosition(e.latlng);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await res.json();
        const addressName = data.display_name || "Custom Location";
        onLocationSelect(e.latlng.lat, e.latlng.lng, addressName);
      } catch (err) {
        console.error("Reverse geocoding failed", err);
        onLocationSelect(e.latlng.lat, e.latlng.lng, "Unknown Location");
      }
    },
  });

  return position === null ? null : <Marker position={position} />;
};

export default function MapPicker({ onLocationSelect, defaultLat = 28.6304, defaultLng = 77.2177 }: MapPickerProps) {
  // Prevent SSR issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-sand animate-pulse rounded-xl"></div>;

  return (
    <MapContainer 
      center={[defaultLat, defaultLng]} 
      zoom={13} 
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem", zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationSelect={onLocationSelect} defaultLat={defaultLat} defaultLng={defaultLng} />
    </MapContainer>
  );
}
