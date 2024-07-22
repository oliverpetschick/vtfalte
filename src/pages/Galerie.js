import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Image, Pressable, ScrollView, Dimensions } from "react-native-web";
import InfoPanel from "../components/InfoPanel";

const data = require('../data/data.json');

const Galerie = () => {
    const [infoState, setInfoState] = useState({
        showInfo: false,
        selectedFeature: null,
    });
    const [isMobile, setIsMobile] = useState(Dimensions.get('window').width <= 768);

    const handleResize = useCallback(() => {
        setIsMobile(Dimensions.get('window').width <= 768);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        document.body.style.overflow = infoState.showInfo ? 'hidden' : 'auto';
    }, [infoState.showInfo]);

    const onImageClick = useCallback((id) => {
        const selectedFeature = data.features.find(feature => feature.properties.id === id);
        if (selectedFeature) {
            setInfoState({
                showInfo: true,
                selectedFeature: {
                    ...selectedFeature,
                    properties: {
                        ...selectedFeature.properties,
                        image: selectedFeature.properties.images.image_0.src,
                    },
                },
            });
        }
    }, []);

    const onClose = useCallback(() => {
        setInfoState({
            showInfo: false,
            selectedFeature: null,
        });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={isMobile ? styles.mobileGalerie : styles.galerie}
                showsVerticalScrollIndicator={false}
            >
                {data.features.map((feature, index) => (
                    feature.properties.images.image_0.src !== 'images/placeholder.jpg' && (
                        <Pressable key={index} onPress={() => onImageClick(feature.properties.id)}>
                            <Image
                                source={require('../' + feature.properties.images.image_0.src)}
                                style={styles.image}
                                resizeMode={'contain'}
                            />
                        </Pressable>
                    )
                ))}
            </ScrollView>
            {infoState.showInfo && (
                <InfoPanel
                    feature={infoState.selectedFeature}
                    onClose={onClose}
                    showLink={true}
                />
            )}
            {infoState.showInfo && <View style={styles.overlay} onClick={onClose} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    galerie: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        width: '100%',
        justifyContent: 'center',
    },
    mobileGalerie: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 20,
    },
    image: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
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
