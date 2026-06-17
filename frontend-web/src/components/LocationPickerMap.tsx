"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js/Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  height?: string;
}

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

function LocateControl({ setPosition, onLocationSelect }: any) {
  const map = useMap();

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(loc);
          onLocationSelect(loc);
          map.flyTo(loc, 14);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert(
            "Could not get your location. Please check browser permissions.",
          );
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div
      style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}
    >
      <button
        type="button"
        onClick={handleLocate}
        style={{
          backgroundColor: "white",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "12px",
          color: "#333",
          boxShadow: "0 1px 5px rgba(0,0,0,0.6)",
        }}
      >
        📍 Locate Me
      </button>
    </div>
  );
}

export default function LocationPickerMap({
  initialLocation = { lat: 28.6139, lng: 77.209 }, // Default to New Delhi
  onLocationSelect,
  height = "400px",
}: LocationPickerMapProps) {
  const [position, setPosition] = useState(initialLocation);

  // Allow browser geolocation to find current position
  useEffect(() => {
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(loc);
          onLocationSelect(loc);
        },
        (err) => console.error("Geolocation error:", err),
      );
    }
  }, [initialLocation, onLocationSelect]);

  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
        <LocateControl
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
}
