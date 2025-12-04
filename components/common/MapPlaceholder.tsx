// oneQlick/components/common/MapPlaceholder.tsx (Task 10: Reusable Map Component)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Define the expected interface for location props
interface LocationDetail {
    name: string;
    address: string;
}

interface MapPlaceholderProps {
    pickup: LocationDetail; // Checklist: Props: pickup
    drop: LocationDetail;   // Checklist: Props: drop
}

const MapPlaceholderComponent: React.FC<MapPlaceholderProps> = ({ pickup, drop }) => {
    return (
        <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Route Preview</Text>
            
            <View style={styles.routeBox}>
                {/* Visual Route Line */}
                <View style={styles.routeLine} />

                {/* Checklist: Tooltips on markers (Simulated) - PICKUP */}
                <View style={styles.markerContainer}>
                    <MaterialIcons name="store" size={28} color="#4CAF50" style={styles.markerIcon} />
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>Pickup: {pickup.name}</Text>
                        <Text style={styles.tooltipAddress}>{pickup.address}</Text>
                    </View>
                </View>

                {/* Checklist: Tooltips on markers (Simulated) - DROP */}
                <View style={styles.markerContainer}>
                    <MaterialIcons name="pin-drop" size={28} color="#F44336" style={styles.markerIcon} />
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>Drop: {drop.name}</Text>
                        <Text style={styles.tooltipAddress}>{drop.address}</Text>
                    </View>
                </View>
            </View>

            {/* Checklist: Static map image or SVG (Simulated) */}
            <Text style={styles.mapText}>[Static Map Graphic Simulation]</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        backgroundColor: '#e0e0e0', // Light gray background simulating map area
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        minHeight: 220,
    },
    mapTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    mapText: {
        color: '#666',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 15,
    },

    // Route Visualization
    routeBox: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'relative',
    },
    routeLine: {
        position: 'absolute',
        top: 20,
        bottom: 20,
        width: 3,
        backgroundColor: '#999',
        borderRadius: 2,
    },

    // Marker/Tooltip Styles
    markerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        zIndex: 10,
        backgroundColor: '#e0e0e0', // Match map background to hide route line intersection
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    markerIcon: {
        marginRight: 10,
    },
    tooltip: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 180,
    },
    tooltipText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    tooltipAddress: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
});

export default MapPlaceholderComponent;