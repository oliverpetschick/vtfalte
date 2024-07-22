// Info.js
import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native-web';
import ImageCaption from '../components/ImageCaption';

const Info = () => {
    const windowWidth = Dimensions.get('window').width;
    const isMobile = windowWidth <= 768;

    // disable scroll for mobile
    if (isMobile) {
        document.body.style.overflow = 'hidden';
    }



    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={isMobile ? styles.mobileContainer : styles.gridContainer}>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.turm]}>
                    <ImageCaption src={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005435.jpg')} caption="Foto: Florian Mahrenbach, 2024." />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.transport]}>
                    <ImageCaption src={require('../images/info/VT-Falte_Transport_Zuber.jpg')} caption="Foto: Aus Sammlung H.P. Zuber." />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.unfold]}>
                    <Text style={styles.text}>
                        Ab Ende der 60er Jahre fand die Typisierung von Bauten und Bauteilen in der DDR ihren Höhepunkt. Neben einigen wenigen bedeutenden Stadtbau-steinen, die speziell für einen bestimmten Ort entworfen worden sind, gab es den Rest von der Katalogstange. <Text style={{ fontStyle: "italic" }}>Schneller, leichter und wirtschaftlicher</Text> war die Devise und so wurden repetitiv die verschiedenen Systeme in der ganzen Republik angewendet.
                    </Text>
                    <Text style={styles.text}>
                        Das Institut für Stahlbeton Dresden entwickelte Ende der 60er Jahre ein einfach und günstig zu produzierendes typisiertes Bauteil: Die sogenannte <Text style={{ fontWeight: "bold" }}> VT-Falte</Text>. Als aneinandergesetzter Träger ermöglicht sie eine stützenfreie Halle von maximal 24 Metern Spannweite und formt ein charakterstarkes Dach. Der trapezförmigen Faltwerkträger sollten nicht nur das Stadtbild verschönern und mit seiner Form auflockern, sondern bestach auch durch seine vielseitigen Einsatzmöglichkeiten im Industrie- Landwirtschafts und Gesellschaftsbereich. Zahlreiche Vorteile führten zu einer raschen Verbreitung.
                    </Text>
                    <Text style={styles.text}>
                        Trotz der markanten Dachs und der schieren Menge, sind die Bauten bisher kaum Bestandteil der Diskussion um baukulturelles Erbe der DDR-Architektur geworden. An zahlreichen Stellen fügen sie sich in die städtische Umgebung ein und finden Anklang durch die Einfachheit ihrer Konstruktion. Dennoch sind sie auch dem Verfall, Leerstand oder Abriss ausgesetzt. Die Arbeit <Text style={{ fontStyle: "italic" }}>Unfold</Text> vermittelt die Bautechnikgeschichte der VT-Falte und stellt ihre Potenziale zur Diskussion. In einem interaktiven Atlas ist hier der aktuelle Gebäudebestand mit VT-Faltendach am Beispiel Leipzigs dargestellt.
                    </Text>
                    <Text style={styles.text}>
                        <Text style={{ fontStyle: "italic" }}>Unfold</Text> ist im Rahmen der Architektur- Masterarbeit von Johanna Knigge an der Bauhaus-Universität-Weimar entstanden.
                    </Text>
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.matritze]}>
                    <ImageCaption src={require('../images/info/df_hauptkatalog_0475046.jpg')} caption="Foto: Gerhard Döring, 1972." />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.prozess]}>
                    <ImageCaption src={require('../images/info/240716_Abläufe_breit.jpg')} caption="" />
                </View>

                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.autoservice]}>
                    <ImageCaption src={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005403.jpg')} caption="Foto: Florian Mahrenbach, 2024." />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.vtf]}>
                    <ImageCaption src={require('../images/info/240716_Konstruktionszeichnung18-24_mittig.jpg')} caption="" />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.mdf]}>
                    <ImageCaption src={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005374.jpg')} caption="Foto: Florian Mahrenbach, 2024." />
                </View>
                <View style={isMobile ? styles.mobileItem : [styles.gridItem, styles.impressum]}>
                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>● Impressum</Text>
                    </Text>
                    <Text style={{ fontSize: 18, lineHeight: 20 }}>
                        Johanna Knigge
                    </Text>
                    <Text style={{ fontSize: 18, lineHeight: 20 }}>
                        Schillerstraße 14, 99423 Weimar
                    </Text>

                    <Text style={{ fontSize: 18, lineHeight: 20, width: '30%', marginTop: 20 }}>
                        Ob aktuelles und historisches Bildmaterial, ein weiterer Standort, Erinnerungen oder Geschichten: Dieser VT-Faltenatlas soll wachsen. Schicke gerne deinen Beitrag an:
                    </Text>
                    <Text style={{ fontSize: 18, lineHeight: 20, marginTop: 20 }}>
                        info@vtfalte.de
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 1300,
    },

    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoRows: '1fr',
        width: '100%',
        gap: 20,
    },
    mobileContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // align items at the top of the container
        alignItems: 'flex-start',
    },
    gridItem: {
        width: '100%',
        height: '100%',
        //borderWidth: 1,
        borderColor: 'black',
    },
    mobileItem: {
        width: '100%',
        height: '100%',

    },
    transport: {
        gridColumn: '1',
        gridRow: '4 / span 3',
    },
    unfold: {
        gridColumn: '1',
        gridRow: '1 / span 3',
    },
    matritze: {
        gridColumn: '2',
        gridRow: '5 / span 4',
    },
    prozess: {
        gridColumn: '1 / span 2',
        gridRow: '9 / span 4',
    },
    turm: {
        gridColumn: '2',
        gridRow: '1 / 5',
    },
    autoservice: {
        gridColumn: '1 / span 2',
        gridRow: '13 / span 4',
    },
    vtf: {
        gridColumn: '2',
        gridRow: '17 / span 4',
    },
    mdf: {
        gridColumn: '1',
        gridRow: '17 / span 4',
    },
    impressum: {
        gridColumn: '1 / span 2',
        gridRow: '21 / span 2',
    },
    image: {
        height: '100%',
        resizeMode: 'contain',
    },
    text: {
        fontSize: 16,
        lineHeight: 18,
        marginBottom: 20, // Add some margin to separate paragraphs
        hyphens: 'auto',
    },
    caption: {
        fontSize: 12,
        color: 'black',
        paddingTop: 5,
        textAlign: 'center',
    },
});

export default Info;
