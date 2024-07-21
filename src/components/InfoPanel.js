import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native-web';
import { Link } from 'react-router-dom';

const InfoPanel = ({ feature, onClose, showLink }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = feature.properties.images || {};
    const n_images = Object.keys(images).length - 1;
    const panelWidth = '70vw';
    const panelHeight = '100%';


    const handleImageClick = (direction) => {
        if (direction === 'prev') {
            setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? n_images : prevIndex - 1));
        } else {
            setCurrentImageIndex((prevIndex) => (prevIndex === n_images ? 0 : prevIndex + 1));
        }
    }

    const overlayStyle = n_images > 0 ? styles.overlayClickable : styles.overlay;
    const currentImage = images[`image_${currentImageIndex}`]?.src;
    const currentAuthor = images[`image_${currentImageIndex}`]?.author_firstname + ' ' + images[`image_${currentImageIndex}`]?.author_lastname;

    const atlasLink = window.location.href.replace('galerie', 'atlas') + '?fold=' + feature.properties.id;

    const links = Array.isArray(feature.properties.links) ? feature.properties.links : [];

    return (
        <View style={[styles.container, { width: panelWidth, height: panelHeight }]}>
            <View style={styles.infoGallery}>
                {currentImage && (
                    <Image source={require(`../${currentImage}`)} style={styles.image} />
                )}
                <Pressable
                    style={[styles.leftOverlay, overlayStyle]}
                    onPress={() => n_images > 0 && handleImageClick('prev')}
                />
                <Pressable
                    style={[styles.rightOverlay, overlayStyle]}
                    onPress={() => n_images > 0 && handleImageClick('next')}
                />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.title}>Adresse</Text>
                <Text>{feature.properties.address || ' - '}</Text>
                <Text style={styles.title}>Typ</Text>
                <Text>{feature.properties.type || ' - '}</Text>
                <Text style={styles.title}>Nutzung</Text>
                <Text>{feature.properties.useage || ' - '}</Text>
                <Text style={styles.title}>Zustand</Text>
                <Text>{feature.properties.condition || ' - '}</Text>
                <Text style={styles.title}>Ehemalige Nutzung</Text>
                <Text>{feature.properties.former_useage || ' - '}</Text>
                <Text style={styles.title}>Foto</Text>
                <Text>{currentAuthor || ' - '}</Text>
                <Text style={styles.title}>Links</Text>
                {links.length > 0 ? links.map((link, index) => (
                    <Text key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </Text>
                )) : <Text> - </Text>}
                {showLink && <Link to={atlasLink} style={{ textDecoration: 'none' }}>Atlas</Link>}

            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
                <Image source={require('../images/X_close_button.png')} style={styles.closeIcon} />
            </Pressable>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'white',
        zIndex: 1000,
    },
    infoGallery: {
        position: 'relative',
        width: '70%',
        height: '100%',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    leftOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: '100%',
    },
    rightOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
    },
    overlay: {
        cursor: 'default',
    },
    overlayClickable: {
        cursor: 'pointer',
    },
    infoContent: {
        width: '30%',
        padding: 20,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        marginBottom: 5,
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
    },
});

export default InfoPanel;
