import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, Region, LatLng } from 'react-native-maps';
import { Text, Surface, Button, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { MAP_CONFIG, GOOGLE_MAPS_API_KEY } from '../../config/maps';

const { width, height } = Dimensions.get('window');

// Delivery tracking props
interface DeliveryTrackingProps {
  // Order data
  orderId: string;
  restaurant: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryAddress: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryPartner: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    currentLocation: {
      latitude: number;
      longitude: number;
    };
    status: 'assigned' | 'picked_up' | 'on_way' | 'delivered';
    estimatedArrival: string;
    lastUpdated: string;
  };
  
  // Configuration
  showMap?: boolean;
  showRoute?: boolean;
  showPartnerInfo?: boolean;
  showEstimatedTime?: boolean;
  allowMapInteraction?: boolean;
  
  // Styling
  height?: number;
  borderRadius?: number;
  
  // Callbacks
  onPartnerCall?: (phone: string) => void;
  onMapPress?: () => void;
}

// Delivery status configuration
const DELIVERY_STATUS = {
  assigned: {
    label: 'Order Assigned',
    color: '#FF9800',
    icon: 'assignment',
    description: 'Your order has been assigned to a delivery partner',
  },
  picked_up: {
    label: 'Order Picked Up',
    color: '#2196F3',
    icon: 'local-shipping',
    description: 'Your order has been picked up and is on the way',
  },
  on_way: {
    label: 'On the Way',
    color: '#4CAF50',
    icon: 'delivery-dining',
    description: 'Your order is on the way to your location',
  },
  delivered: {
    label: 'Delivered',
    color: '#4CAF50',
    icon: 'check-circle',
    description: 'Your order has been delivered successfully',
  },
};

export default function DeliveryTracking({
  orderId,
  restaurant,
  deliveryAddress,
  deliveryPartner,
  showMap = true,
  showRoute = true,
  showPartnerInfo = true,
  showEstimatedTime = true,
  allowMapInteraction = true,
  height = Dimensions.get('window').height * 0.6,
  borderRadius = DesignSystem.borderRadius.lg,
  onPartnerCall,
  onMapPress,
}: DeliveryTrackingProps) {
  // State
  const [region, setRegion] = useState<Region>({
    latitude: (restaurant.coordinates.latitude + deliveryAddress.coordinates.latitude) / 2,
    longitude: (restaurant.coordinates.longitude + deliveryAddress.coordinates.longitude) / 2,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Start delivery partner close to restaurant
  const [partnerLocation, setPartnerLocation] = useState({
    latitude: restaurant.coordinates.latitude + 0.001, // Very close to restaurant
    longitude: restaurant.coordinates.longitude + 0.001,
  });
  const [lastUpdated, setLastUpdated] = useState(deliveryPartner.lastUpdated);

  // Refs
  const mapRef = useRef<MapView>(null);
  const partnerMarkerAnim = useRef(new Animated.Value(0)).current;

  // Initialize component
  useEffect(() => {
    initializeMap();
    generateRoute();
    startLocationUpdates();
  }, []);

  // Initialize map region
  const initializeMap = () => {
    const coordinates = [restaurant.coordinates, deliveryAddress.coordinates, partnerLocation];
    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    
    const deltaLat = (maxLat - minLat) * 1.2;
    const deltaLon = (maxLon - minLon) * 1.2;
    
    setRegion({
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: Math.max(deltaLat, 0.01),
      longitudeDelta: Math.max(deltaLon, 0.01),
    });
  };

  // Generate route between restaurant and delivery address
  const generateRoute = async () => {
    try {
      setIsLoading(true);
      
      // Use Google Directions API to get actual route
      const origin = `${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`;
      const destination = `${deliveryAddress.coordinates.latitude},${deliveryAddress.coordinates.longitude}`;
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}&mode=driving&avoid=tolls&alternatives=false`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const decodedPath = decodePolyline(route.overview_polyline.points);
        setRouteCoordinates(decodedPath);
      } else {
        // Fallback to straight line if API fails
        const fallbackRoute = [
          restaurant.coordinates,
          deliveryAddress.coordinates,
        ];
        setRouteCoordinates(fallbackRoute);
      }
    } catch (error) {
      console.error('Route generation error:', error);
      // Fallback to straight line
      const fallbackRoute = [
        restaurant.coordinates,
        deliveryAddress.coordinates,
      ];
      setRouteCoordinates(fallbackRoute);
    } finally {
      setIsLoading(false);
    }
  };

  // Decode polyline from Google Directions API
  const decodePolyline = (encoded: string) => {
    const points = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  // Start location updates (simulate real-time updates)
  const startLocationUpdates = () => {
    // Animate partner marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(partnerMarkerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(partnerMarkerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate location updates every 30 seconds
    const interval = setInterval(() => {
      updatePartnerLocation();
    }, 30000);

    return () => clearInterval(interval);
  };

  // Update partner location (simulate movement)
  const updatePartnerLocation = () => {
    // Simulate partner moving towards delivery address
    const currentLat = partnerLocation.latitude;
    const currentLon = partnerLocation.longitude;
    const targetLat = deliveryAddress.coordinates.latitude;
    const targetLon = deliveryAddress.coordinates.longitude;
    
    const latDiff = targetLat - currentLat;
    const lonDiff = targetLon - currentLon;
    
    // Move 15% closer to target (faster movement)
    const newLat = currentLat + (latDiff * 0.15);
    const newLon = currentLon + (lonDiff * 0.15);
    
    setPartnerLocation({
      latitude: newLat,
      longitude: newLon,
    });
    setLastUpdated(new Date().toISOString());
  };

  // Handle map press
  const handleMapPress = () => {
    if (onMapPress) {
      onMapPress();
    }
  };

  // Handle partner call
  const handlePartnerCall = () => {
    if (onPartnerCall) {
      onPartnerCall(deliveryPartner.phone);
    }
  };

  // Get status configuration
  const statusConfig = DELIVERY_STATUS[deliveryPartner.status];

  // Calculate distance to delivery address
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distanceToDestination = calculateDistance(
    partnerLocation.latitude,
    partnerLocation.longitude,
    deliveryAddress.coordinates.latitude,
    deliveryAddress.coordinates.longitude
  );

  if (!showMap) {
    return (
      <View style={styles.mapHidden}>
        <Text style={styles.mapHiddenText}>Map hidden to save battery</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={[styles.mapContainer, { height, borderRadius }]}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={true}
          showsIndoors={true}
          mapType="standard"
          scrollEnabled={allowMapInteraction}
          zoomEnabled={allowMapInteraction}
          rotateEnabled={allowMapInteraction}
          pitchEnabled={allowMapInteraction}
        >
          {/* Restaurant Marker */}
          <Marker
            coordinate={restaurant.coordinates}
            title="Restaurant"
            description={restaurant.name}
          >
            <View style={styles.restaurantMarker}>
              <Text style={styles.markerText}>🍽️</Text>
            </View>
          </Marker>

          {/* Delivery Address Marker */}
          <Marker
            coordinate={deliveryAddress.coordinates}
            title="Delivery Address"
            description={deliveryAddress.name}
          >
            <View style={styles.deliveryMarker}>
              <Text style={styles.markerText}>🏠</Text>
            </View>
          </Marker>

          {/* Delivery Partner Marker */}
          <Marker
            coordinate={partnerLocation}
            title="Delivery Partner"
            description={deliveryPartner.name}
          >
            <Animated.View
              style={[
                styles.partnerMarker,
                {
                  transform: [
                    {
                      scale: partnerMarkerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.markerText}>🏍️</Text>
            </Animated.View>
          </Marker>

          {/* Route Line */}
          {showRoute && routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#2196F3"
              strokeWidth={4}
              lineDashPattern={[10, 5]}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <Pressable style={styles.controlButton} onPress={() => mapRef.current?.animateToRegion(region, 1000)}>
            <MaterialIcons name="my-location" size={20} color="#333" />
          </Pressable>
        </View>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={DesignSystem.colors.primary[500]} />
            <Text style={styles.loadingText}>Loading route...</Text>
          </View>
        )}
      </View>

      {/* Delivery Status */}
      <Surface style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <MaterialIcons 
              name={statusConfig.icon as any} 
              size={DesignSystem.sizes.icon.md} 
              color={statusConfig.color} 
            />
            <View style={styles.statusText}>
              <Text style={[GlobalStyles.typography.h6, styles.statusLabel]}>
                {statusConfig.label}
              </Text>
              <Text style={[GlobalStyles.typography.body2, styles.statusDescription]}>
                {statusConfig.description}
              </Text>
            </View>
          </View>
          <Chip 
            mode="outlined" 
            textStyle={{ color: statusConfig.color }}
            style={[styles.statusChip, { borderColor: statusConfig.color }]}
          >
            {deliveryPartner.status.replace('_', ' ').toUpperCase()}
          </Chip>
        </View>

        {/* Estimated Time */}
        {showEstimatedTime && (
          <View style={styles.estimatedTime}>
            <MaterialIcons name="schedule" size={DesignSystem.sizes.icon.sm} color={DesignSystem.colors.text.secondary} />
            <Text style={[GlobalStyles.typography.body2, styles.estimatedTimeText]}>
              Estimated arrival: {deliveryPartner.estimatedArrival}
            </Text>
          </View>
        )}

        {/* Distance Info */}
        <View style={styles.distanceInfo}>
          <MaterialIcons name="straighten" size={DesignSystem.sizes.icon.sm} color={DesignSystem.colors.text.secondary} />
          <Text style={[GlobalStyles.typography.body2, styles.distanceText]}>
            {distanceToDestination.toFixed(1)} km away
          </Text>
        </View>
      </Surface>

      {/* Delivery Partner Info */}
      {showPartnerInfo && (
        <Surface style={styles.partnerContainer}>
          <View style={styles.partnerHeader}>
            <View style={styles.partnerInfo}>
              <MaterialIcons name="person" size={DesignSystem.sizes.icon.md} color={DesignSystem.colors.primary[500]} />
              <View style={styles.partnerDetails}>
                <Text style={[GlobalStyles.typography.h6, styles.partnerName]}>
                  {deliveryPartner.name}
                </Text>
                <Text style={[GlobalStyles.typography.body2, styles.partnerVehicle]}>
                  {deliveryPartner.vehicle} • ⭐ {deliveryPartner.rating}
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={handlePartnerCall}
              icon="phone"
              style={styles.callButton}
              buttonColor={DesignSystem.colors.primary[500]}
            >
              Call
            </Button>
          </View>
          
          <Text style={[GlobalStyles.typography.caption, styles.lastUpdated]}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </Text>
        </Surface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Map Container
  mapContainer: {
    margin: DesignSystem.spacing.md,
    overflow: 'hidden',
    ...DesignSystem.shadows.lg,
  },
  map: {
    flex: 1,
  },
  
  // Map Controls
  mapControls: {
    position: 'absolute',
    top: DesignSystem.spacing.md,
    right: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...DesignSystem.shadows.md,
  },
  
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.primary,
    marginTop: DesignSystem.spacing.sm,
  },
  
  // Map Hidden
  mapHidden: {
    padding: 40,
    alignItems: 'center',
  },
  mapHiddenText: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Markers
  restaurantMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...DesignSystem.shadows.lg,
    elevation: 8,
  },
  deliveryMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...DesignSystem.shadows.lg,
    elevation: 8,
  },
  partnerMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'white',
    ...DesignSystem.shadows.lg,
    elevation: 8,
  },
  markerText: {
    fontSize: 28,
    textAlign: 'center',
  },
  
  // Status Container
  statusContainer: {
    margin: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.sm,
  },
  statusHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  statusInfo: {
    ...GlobalStyles.layout.row,
    alignItems: 'flex-start',
    flex: 1,
  },
  statusText: {
    marginLeft: DesignSystem.spacing.sm,
    flex: 1,
  },
  statusLabel: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  statusDescription: {
    color: DesignSystem.colors.text.secondary,
  },
  statusChip: {
    marginLeft: DesignSystem.spacing.sm,
  },
  estimatedTime: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  estimatedTimeText: {
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  distanceInfo: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
  },
  distanceText: {
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  
  // Partner Container
  partnerContainer: {
    margin: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    backgroundColor: DesignSystem.colors.background.primary,
    ...DesignSystem.shadows.sm,
  },
  partnerHeader: {
    ...GlobalStyles.layout.rowSpaceBetween,
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  partnerInfo: {
    ...GlobalStyles.layout.row,
    alignItems: 'center',
    flex: 1,
  },
  partnerDetails: {
    marginLeft: DesignSystem.spacing.sm,
    flex: 1,
  },
  partnerName: {
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  partnerVehicle: {
    color: DesignSystem.colors.text.secondary,
  },
  callButton: {
    borderRadius: DesignSystem.borderRadius.full,
  },
  lastUpdated: {
    color: DesignSystem.colors.text.disabled,
    textAlign: 'center',
  },
});
