import React from 'react';
import { View, StyleSheet, Image } from 'react-native-web';

const Info = () => {
    return (
        <View style={styles.container}>
            <View style={styles.gridContainer}>
                <View style={{ gridArea: '1 / 1 / 10 / 10' }}>
                    <Image
                        source={require('../images/info/240527_VT-Falte_Gruenau_FM_L1005215.jpg')}
                        style={styles.image}
                    />
                </View>
                <View style={{ gridArea: '1 / 9 / 5 / 15' }}>
                    <Image
                        source={require('../images/info/011.jpg')}
                        style={styles.image}
                    />
                </View>
                <View style={{ gridArea: '10 / 1 / 16 / 10' }}>
                    <Image
                        source={require('../images/info/010.jpg')}
                        style={styles.image}
                    />
                </View>
                <View style={{ gridArea: '10 / 10 / 16 / 16' }}>
                    <Image
                        source={require('../images/info/Bildschirmfoto 2024-06-22 um 12.43.09.png')}
                        style={styles.image}
                    />
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        overflow: 'auto',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(15, 1fr)',
        gridAutoRows: 'minmax(100px, auto)',
        gridGap: 20,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default Info;
