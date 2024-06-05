import React from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Pressable, Text } from 'react-native-web';
import { useState } from 'react';

const InfoPanel = ({ feature, onClose }) => {
    const windowHeight = Dimensions.get('window').height;
    const height = windowHeight * 0.6;

    return (
        <View style={[styles.info, { height }]}>
            <ScrollView style={styles.infoContent}>
                <InfoContent feature={feature} />
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={onClose}>
                <Image source={require('../images/close-icon.png')} style={styles.closeIcon} />
            </Pressable>
        </View>
    );
}

const InfoContent = ({ feature }) => {
    return (
        <View style={styles.infoContent}>
            <InfoGallery feature={feature} />
            <Text style={{ fontSize: 20 }}>ADRESSE</Text>
            <Text>{feature.properties.address}</Text>
            <Text style={{ fontSize: 20 }}>TYP</Text>
            <Text>{feature.properties.type}</Text>
            <Text style={{ fontSize: 20 }}>BAUJAHR</Text>
            <Text>{feature.properties.year}</Text>
            <Text style={{ fontSize: 20 }}>STÄDTEBAU</Text>
            <Text>{feature.properties.urbanism}</Text>
            <Text style={{ fontSize: 20 }}>NUTZUNG</Text>
            <Text>{feature.properties.useage}</Text>
            <Text style={{ fontSize: 20 }}>ZUSTAND</Text>
            <Text>{feature.properties.condition}</Text>
            <Text style={{ fontSize: 20 }}>HINTERGRÜNDE</Text>
            <Text>{feature.properties.background}</Text>
            <Text style={{ fontSize: 20 }}>LINKS</Text>
            {feature.properties.links && feature.properties.links.map((link, index) => (
                <Text key={index}>
                    <a href={link.url}>{link.title}</a>
                </Text>
            ))}
        </View>
    );
}

const InfoGallery = ({ feature }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = feature.properties.images;
    const n_images = Object.keys(images).length - 1;

    const handleImageClick = (direction) => {
        if (direction === 'prev') {
            setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? n_images : prevIndex - 1));
        } else {
            setCurrentImageIndex((prevIndex) => (prevIndex === n_images ? 0 : prevIndex + 1));
        }
    };

    return (
        <View style={styles.infoContent}>
            <View style={styles.imageContainer}>
                <Image source={require('../' + images[`image_${currentImageIndex}`].src)} style={styles.image} />
                < Pressable style={styles.leftOverlay} onPress={() => handleImageClick('prev')} />
                <Pressable style={styles.rightOverlay} onPress={() => handleImageClick('next')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create(
    {
        info: {
            position: 'fixed',
            top: '25vh',
            left: '35vw',
            width: '30vw',
            height: '60vh',
            backgroundColor: 'white',
            zIndex: 3,
        },
        infoContent: {
            flex: 1,
            width: '100%',
            padding: 10,
        },
        closeButton: {
            position: 'absolute',
            top: 10,
            right: 10,
        },
        closeIcon: {
            width: 20,
            height: 20,
            resizeMode: 'contain',
            tintColor: 'black',
        },
        imageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            aspectRatio: 1,
            resizeMode: 'contain',
            width: '100%',
        },
        leftOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: '50%',
        },
        rightOverlay: {
            position: 'absolute',
            top: 0,
            left: '50%',
            bottom: 0,
            right: 0,
        },
    }
)

export default InfoPanel;
