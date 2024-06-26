import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';

export const legendMapping = {
    '1': { color: 'rgb(255, 154, 234)', label: 'Sporthalle' },
    '2': { color: 'rgb(0, 0, 254)', label: 'Jugendclub' },
    '3': { color: 'rgb(1, 245, 245)', label: 'Senior*innenzentrum' },
    '4': { color: 'rgb(159, 126, 255)', label: 'Kaufhalle' },
    '5': { color: 'rgb(0, 160, 0)', label: 'Unterwerke' },
    '6': { color: 'rgb(109, 255, 50)', label: 'Umformerstation' },
    '7': { color: 'rgb(255, 13, 33)', label: 'Mehrzweckhalle/Individualbau' },
    '8': { color: 'rgb(106, 75, 0)', label: 'Abriss' },
};

const Legend = () => {
    return (
        <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Ursprüng. Nutzung</Text>
            {Object.keys(legendMapping).map(key => (
                <View key={key} style={styles.legendItem}>
                    <svg width="20" height="20">
                        <circle cx="10" cy="10" r="10" fill={legendMapping[key].color} />
                    </svg>
                    <Text style={styles.legendLabel}>{legendMapping[key].label}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    legendContainer: {
        position: 'absolute',
        right: '50px',
        top: '50px',
        padding: 10,
        zIndex: 3,
    },
    legendTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    legendItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendLabel: {
        marginLeft: 5,
    },
});

export default Legend;