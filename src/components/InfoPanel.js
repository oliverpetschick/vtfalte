import React from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Pressable, Text } from 'react-native-web';

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
            <Image source={require('../images/' + feature.properties.image)} style={styles.infoImage} />
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
    }
)

export default InfoPanel;