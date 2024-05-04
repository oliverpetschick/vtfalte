import React from 'react';
import { StyleSheet, View } from 'react-native-web';
import NavBar from './NavBar';
import { KarrikRegular } from './Fonts';

const Topbar = () => {
    return (
        <View style={styles.topbar}>
            <View style={styles.titleContainer}>
                <KarrikRegular style={styles.title}>VT FALTE</KarrikRegular>
            </View>
            <View style={styles.navContainer}>
                <NavBar />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: 5,
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 80,
    },
    navContainer: {
        alignItems: 'flex-end',
    },
});

export default Topbar;
