import React from "react";
import { StyleSheet } from "react-native-web";


const AtlasDetails = () => {
    return (
        <div style={styles.container}>
            <h1>Atlas Details</h1>
            <p>Details about the atlas.</p>
        </div>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

export default AtlasDetails;