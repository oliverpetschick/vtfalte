import React from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Pressable, Text } from 'react-native-web';
import { useState } from 'react';

const InfoPanel = ({ feature, onClose }) => {
    const windowHeight = Dimensions.get('window').height;
    const height = windowHeight * 0.6;


    return (
        console.log(feature),
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
            {/* <Image source={require('../images/' + feature.properties.image)} style={styles.infoImage} /> */}
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
            {Array.isArray(feature.properties.links) ? (
                feature.properties.links.map((link, index) => (
                    <Text key={index}>
                        <a href={link.url}>{link.title}</a>
                    </Text>
                ))
            ) : (
                JSON.parse(feature.properties.links).map((link, index) => (
                    <Text key={index}>
                        <a href={link.url}>{link.title}</a>
                    </Text>
                ))
            )}
        </View>
    );
}
const InfoGallery = ({ feature }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = feature.properties.images;

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <View style={styles.infoContent}>
            <View style={styles.imageContainer}>
                <Image source={require('../images/' + images[currentImageIndex])} style={styles.image} />
            </View>
            {images.length > 1 && (
                <>
                    <Pressable style={[styles.prevButton, { display: currentImageIndex === 0 ? 'none' : 'flex' }]} onPress={handlePrevImage}>
                        <Text style={styles.buttonText}>{'<'}</Text>
                    </Pressable>
                    <Pressable style={[styles.nextButton, { display: currentImageIndex === images.length - 1 ? 'none' : 'flex' }]} onPress={handleNextImage}>
                        <Text style={styles.buttonText}>{'>'}</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create(
    {
        info: {
            position: 'fixed',
            top: '25vh',
            left: '20vw',
            width: '30vw',
            height: '60vh',
            backgroundColor: 'white',
            // borderColor: 'black',
            // borderWidth: 1,
            // borderRadius: 10,
            zIndex: 3,
        },
        infoContent: {
            flex: 1,
            width: '100%',
            padding: 10,
        },
        infoImage: {
            aspectRatio: 1,
            resizeMode: 'contain',
            margin: 10,
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
        prevButton: {
            position: 'absolute',
            top: '50%',
            left: 10,
            transform: [{ translateY: -20 }],
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: 10,
            borderRadius: 5,
        },
        nextButton: {
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: [{ translateY: -20 }],
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: 10,
            borderRadius: 5,
        },
        buttonText: {
            fontSize: 20,
        },

    }
)

export default InfoPanel;