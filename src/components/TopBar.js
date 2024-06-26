import React from 'react';
import { StyleSheet, View, Text } from 'react-native-web';
import NavBar from './NavBar';
import { NavLink } from './NavBarElements';
import { ArialText } from './Fonts';

const Topbar = () => {
    return (
        <View style={styles.topbar}>
            <View style={styles.titleContainer}>
                <NavLink to="/info">
                    <ArialText style={styles.title}>UNFOLD</ArialText>
                </NavLink>
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
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 35,
    },
    navContainer: {
        alignItems: 'flex-end',
    },
});

export default Topbar;
