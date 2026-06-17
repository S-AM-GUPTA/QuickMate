import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapPickerProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  height?: number;
}

export default function MapPicker({ 
  initialLocation, 
  onLocationSelect,
  height = 300 
}: MapPickerProps) {
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(!initialLocation);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!initialLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setLocation(newLocation);
        onLocationSelect(newLocation);
        setLoading(false);
      })();
    }
  }, [initialLocation, onLocationSelect]);

  const handleMapPress = (e: MapPressEvent) => {
    const coord = e.nativeEvent.coordinate;
    setLocation(coord);
    onLocationSelect(coord);
  };

  if (loading) {
    return (
      <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg && !location) {
    return (
      <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>{errorMsg}</Text>
        <Text>Please select a location manually.</Text>
        {/* Fallback to default location if permission denied */}
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 28.6139,
          longitude: location?.longitude || 77.2090,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Selected Location"
            description="Your selected task location"
            draggable
            onDragEnd={(e) => {
              const coord = e.nativeEvent.coordinate;
              setLocation(coord);
              onLocationSelect(coord);
            }}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
