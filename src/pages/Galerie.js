import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView, Pressable } from "react-native-web";
import InfoPanel from "../components/InfoPanel";

const data = require('../data/data.json');

const Galerie = () => {
    const [infoState, setInfoState] = useState({
        showInfo: false,
        selectedFeature: null,
    });
    const [imageWidth, setImageWidth] = useState(Dimensions.get('window').width / 5.5);

    const dimensionsRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            setImageWidth(Dimensions.get('window').width / 5.5);
        };

        dimensionsRef.current = Dimensions.addEventListener('change', handleResize);
        return () => {
            if (dimensionsRef.current) {
                dimensionsRef.current.remove();
            }
        };
    }, []);

    const onImageClick = useCallback((images) => {
        const selectedFeature = data.features.find(feature => feature.properties.images === images);
        setInfoState({
            showInfo: true,
            selectedFeature: {
                ...selectedFeature,
                properties: {
                    ...selectedFeature.properties,
                    image: images.image_0.src, // Using the first image source
                },
            },
        });
        toggleScrollLock(true);
    }, []);

    const onClose = useCallback(() => {
        setInfoState({
            showInfo: false,
            selectedFeature: null,
        });
        toggleScrollLock(false);
    }, []);

    const toggleScrollLock = (lock) => {
        document.body.style.overflow = lock ? 'hidden' : 'auto';
    };

    return (
        <View style={styles.container}>
            {infoState.showInfo && <InfoPanel feature={infoState.selectedFeature} onClose={onClose} />}
            {infoState.showInfo && <View style={styles.overlay} onClick={onClose} />}
            <ScrollView>
                <View style={styles.galerie}>
                    {data.features.map((feature, index) => (
                        <Pressable key={index} onPress={() => onImageClick(feature.properties.images)}>
                            <Image
                                source={require('../' + feature.properties.images.image_0.src)}
                                style={[styles.image, { width: imageWidth }]}
                            />
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
        position: 'relative',
        zIndex: 1,
        justifyContent: 'center',
    },
    galerie: {
        flexWrap: 'wrap',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        rowGap: 15,
        columnGap: 15,
    },
    image: {
        aspectRatio: 1,
        resizeMode: 'contain',
        margin: 10,
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 2,
    },
});

export default Galerie;
