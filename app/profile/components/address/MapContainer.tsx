import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker, Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../../../constants/designSystem';
import { GlobalStyles } from '../../../../styles/globalStyles';
import { MapLocation } from '../../addressFormData';

interface MapContainerProps {
  mapRegion: Region;
  onMapPress: (event: any) => void;
  onRegionChangeComplete: (region: Region) => void;
  selectedLocation: MapLocation | null;
  locationPermission: boolean;
  isMapLoading: boolean;
  onGetCurrentLocation: () => void;
}

export default function MapContainer({
  mapRegion,
  onMapPress,
  onRegionChangeComplete,
  selectedLocation,
  locationPermission,
  isMapLoading,
  onGetCurrentLocation,
}: MapContainerProps) {
  return (
    <View style={styles.mapContainer}>
      <Text style={[GlobalStyles.typography.h6, styles.sectionTitle]}>Select Location on Map</Text>
      
      {/* Map View */}
      <View style={styles.mapViewContainer}>
        <MapView
          style={styles.mapView}
          region={mapRegion}
          onPress={onMapPress}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={true}
          mapType="standard"
          scrollEnabled={true}
          zoomEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          moveOnMarkerPress={false}
          followsUserLocation={false}
          loadingEnabled={true}
          loadingIndicatorColor={DesignSystem.colors.primary[500]}
          loadingBackgroundColor={DesignSystem.colors.background.primary}
        >
          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Address"
              description={selectedLocation.address}
            >
              <View style={styles.selectedMarker}>
                <MaterialIcons name="location-on" size={18} color="white" />
              </View>
            </Marker>
          )}
        </MapView>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <Pressable style={styles.mapControlButton} onPress={onGetCurrentLocation}>
            <MaterialIcons name="my-location" size={20} color="#333" />
          </Pressable>
        </View>
        
        {/* Loading Overlay */}
        {isMapLoading && (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator size="large" color={DesignSystem.colors.primary[500]} />
            <Text style={styles.mapLoadingText}>Loading location...</Text>
          </View>
        )}
      </View>
      
      {/* Selected Location Info */}
      {selectedLocation && (
        <View style={styles.selectedLocationInfo}>
          <MaterialIcons 
            name="location-on" 
            size={DesignSystem.sizes.icon.sm} 
            color={DesignSystem.colors.success} 
          />
          <Text style={[GlobalStyles.typography.caption, styles.selectedLocationText]} numberOfLines={2}>
            {selectedLocation.address}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    marginBottom: DesignSystem.spacing.lg,
  },
  sectionTitle: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
  },
  mapViewContainer: {
    height: 300,
    borderRadius: DesignSystem.borderRadius.md,
    overflow: 'hidden',
    marginTop: DesignSystem.spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  mapView: {
    flex: 1,
  },
  selectedMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DesignSystem.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  mapControls: {
    position: 'absolute',
    top: DesignSystem.spacing.sm,
    right: DesignSystem.spacing.sm,
    gap: DesignSystem.spacing.xs,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLoadingText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.sm,
  },
  selectedLocationInfo: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    marginTop: DesignSystem.spacing.sm,
    padding: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.success[50],
    borderRadius: DesignSystem.borderRadius.sm,
    gap: DesignSystem.spacing.xs,
  },
  selectedLocationText: {
    color: DesignSystem.colors.success[700],
    flex: 1,
  },
});
