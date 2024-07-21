import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Image, Dimensions, Pressable, ScrollView } from "react-native-web";
import InfoPanel from "../components/InfoPanel";

const data = require('../data/data.json');

const Galerie = () => {
    // Features that should be displayed first
    const startFeatureIds = [51];

    // Sort features so that the start features are displayed first
    data.features.sort((a, b) => {
        if (startFeatureIds.includes(a.properties.id)) {
            return -1;
        }
        if (startFeatureIds.includes(b.properties.id)) {
            return 1;
        }
        return 0;
    });

    const [infoState, setInfoState] = useState({
        showInfo: false,
        selectedFeature: null,
    });

    const [isMobile, setIsMobile] = useState(Dimensions.get('window').width <= 768);
    const [scrollY, setScrollY] = useState(0); // Track scroll position

    const dimensionsRef = useRef();
    const scrollViewRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(Dimensions.get('window').width <= 768);
        };

        dimensionsRef.current = Dimensions.addEventListener('change', handleResize);
        return () => {
            if (dimensionsRef.current) {
                dimensionsRef.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            // Update scroll position when `infoState.showInfo` changes
            setScrollY(scrollViewRef.current.scrollTop);
        }
    }, [infoState.showInfo]);

    const onImageClick = useCallback((id) => {
        const selectedFeature = data.features.find(feature => feature.properties.id === id);
        const images = selectedFeature.properties.images;
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
            <ScrollView
                contentContainerStyle={isMobile ? styles.mobileGalerie : styles.galerie}
                ref={scrollViewRef}
                onScroll={() => setScrollY(scrollViewRef.current.scrollTop)}
                showsVerticalScrollIndicator={false}
            >
                {data.features.map((feature, index) => {
                    if (feature.properties.images.image_0.src !== 'images/placeholder.jpg') {
                        return (
                            <Pressable key={index} onPress={() => onImageClick(feature.properties.id)}>
                                <Image
                                    source={require('../' + feature.properties.images.image_0.src)}
                                    style={styles.image}
                                />
                            </Pressable>
                        );
                    }
                    return null;
                })}
            </ScrollView>
            {infoState.showInfo && (
                <InfoPanel
                    feature={infoState.selectedFeature}
                    onClose={onClose}
                    showLink={true}
                    style={{ top: scrollY }}
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
        position: 'relative',
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
        resizeMode: 'contain',
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
