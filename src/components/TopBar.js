import React from 'react';
import { View } from 'react-native-web';
import NavBar from './NavBar';
import { NavLink, Text } from './NavBarElements';

const Topbar = () => {
    return (
        <View style={styles.topbar}>
            <View style={styles.titleContainer}>
                <NavLink to="/info">
                    <Text style={styles.title}>VT-Falte</Text>
                </NavLink>
            </View>
            <View style={styles.navContainer}>
                <NavBar />
            </View>
        </View>

    );
}
const styles = {
    topbar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    navContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
};

export default Topbar;


