// components/ImageCaption.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native-web';

const ImageCaption = ({ src, caption }) => {
    return (
        <View style={styles.container}>
            <Image source={src} style={styles.image} />
            <Text style={styles.caption}>{caption}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    caption: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        padding: 5,
        fontSize: 12,
        color: 'black',
    },
});

export default ImageCaption;
