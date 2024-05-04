import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native-web';

const Info = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.placeholderText}>container</Text>
            <View style={styles.infoTop}>
                <Text style={styles.placeholderText}>infoTop</Text>
            </View>
            <View style={styles.infoMiddle}>
                <Image source={require('../images/rolling_triangle.gif')} style={styles.gif} />
            </View>
            <View style={styles.infoBottom}>
                <Text style={styles.placeholderText}>infoBottom</Text>
            </View>
            <View style={styles.imageRight}>
                <Text style={styles.placeholderText}>imageRight</Text>
            </View>
            <View style={styles.imprint}>
                <Text style={styles.placeholderText}>Imprint</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        // 20 * 5% rows
        gridTemplateRows: 'repeat(20, 5%)',
        height: '100%',
        width: '100%',
    },
    // logic: from-row / from-column / to-row / to-column
    // 45% of the grid (left)
    infoTop: {
        gridArea: '1 / 1 / 10 / 1',
        justifyContent: 'center',
        border: '1px dashed black',
    },
    // 10% of the grid (left)
    infoMiddle: {
        gridArea: '10 / 1 / 12 / 3',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    // 45% of the grid (left)
    infoBottom: {
        gridArea: '12 / 1 / 21 / 1',
        justifyContent: 'center',
        border: '1px dashed black',
    },
    // 60% of the grid (right)
    imageRight: {
        gridArea: '1 / 2 / 14 / 3',
        backgroundColor: 'rgba(213, 89, 153, 0.8)',
        justifyContent: 'center',

    },
    // 40% of the grid (right)
    imprint: {
        gridArea: '14 / 2 / 21 / 3',
        justifyContent: 'center',
        border: '1px dashed black'
    },
    placeholderText: {
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
    },
    // adjust to the size of infoMiddle
    gif: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
});

export default Info;