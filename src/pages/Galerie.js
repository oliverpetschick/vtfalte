import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView, Pressable } from "react-native-web";
import InfoPanel from "../components/InfoPanel";

const data = require('../data/data.json');

const Galerie = () => {
    const [infoState, setInfoState] = useState({
        showInfo: false,
        selectedFeature: null,
    });

    const setImageWidth = () => Dimensions.get('window').width / 5.5;

    useEffect(() => {
        const handleResize = () => {
            setImageWidth();
        };

        Dimensions.addEventListener('change', handleResize);
        return () => Dimensions.removeEventListener('change', handleResize);
    }, []);

    const onImageClick = (images) => {
        setInfoState({
            showInfo: true,
            selectedFeature: {
                ...data.features.find(feature => feature.properties.images === images),
                properties: {
                    ...data.features.find(feature => feature.properties.images === images).properties,
                    image: images[0] // Displaying only the first image
                }
            },
        });
        toggleScrollLock(true);
    };

    const onClose = () => {
        setInfoState({
            showInfo: false,
            selectedFeature: null,
        });
        toggleScrollLock(false);
    };

    const onOverlayClick = onClose;

    const toggleScrollLock = (lock) => {
        document.body.style.overflow = lock ? 'hidden' : 'auto';
    };

    return (
        <View style={styles.container}>
            {infoState.showInfo && <InfoPanel feature={infoState.selectedFeature} onClose={onClose} />}
            {infoState.showInfo && <View style={styles.overlay} onClick={onOverlayClick} />}
            <ScrollView>
                <View style={styles.galerie}>
                    {data.features.map((feature, index) => (
                        <Pressable key={index} onPress={() => onImageClick(feature.properties.images)}>
                            <Image source={require('../images/' + feature.properties.images[0])} style={[styles.image, { width: setImageWidth() }]} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
    },
    galerie: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        rowGap: 10,
        columnGap: 10,
    },
    image: {
        aspectRatio: 1,
        resizeMode: 'contain',
        margin: 10,
        padding: 10,
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(219, 237, 113, 0.2)',
        zIndex: 2,
    },
});

export default Galerie;
