import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native-web';

export const legendMapping = {
    '1': { color: 'rgb(255, 154, 234)', label: 'Sporthalle' },
    '2': { color: 'rgb(0, 0, 254)', label: 'Jugendclub' },
    '3': { color: 'rgb(1, 245, 245)', label: 'Senior*innenzentrum' },
    '4': { color: 'rgb(159, 126, 255)', label: 'Kaufhalle' },
    '5': { color: 'rgb(0, 160, 0)', label: 'Gleichrichterunterwerk' },
    '6': { color: 'rgb(109, 255, 50)', label: 'Umformerstation' },
    '7': { color: 'rgb(255, 13, 33)', label: 'Mehrzweckhalle/Individualbau' },
    '8': { color: 'rgb(106, 75, 0)', label: 'Abriss' },
};

const isMobile = Dimensions.get('window').width <= 768;

const Legend = () => {
    const [showLegend, setShowLegend] = useState(!isMobile);

    const toggleLegend = () => {
        setShowLegend(!showLegend);
    };

    return (
        <View style={styles.legendContainer}>
            <View style={styles.header}>
                {isMobile && (
                    <View style={styles.toggleButton} onClick={toggleLegend}>
                        <Text style={styles.toggleButtonText}>{showLegend ? '-' : '+'}</Text>
                    </View>
                )}
                <Text style={styles.legendTitle}>Kategorien</Text>
            </View>
            {showLegend && (
                <View>
                    {Object.keys(legendMapping).map(key => (
                        <View key={key} style={styles.legendItem}>
                            <svg width="20" height="20">
                                <circle cx="10" cy="10" r="7" fill={legendMapping[key].color} />
                            </svg>
                            <Text style={styles.legendLabel}>{legendMapping[key].label}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    legendContainer: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        padding: 10,
        zIndex: 3,
        marginLeft: 35,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    legendTitle: {
        fontWeight: 'bold',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    legendLabel: {
        marginLeft: 5,
    },
    toggleButton: {
        padding: 5,
        borderRadius: 5,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButtonText: {
        fontWeight: 'bold',
    },
});

export default Legend;
