import React from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, Image } from 'react-native-web';

const Info = () => {
    const windowWidth = Dimensions.get('window').width;
    const isMobile = windowWidth <= 768;

    // disable scroll for mobile
    if (isMobile) {
        document.body.style.overflow = 'hidden';
    }

    if (isMobile) {
        return (
            <ScrollView style={styles.mobileContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005435.jpg')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
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
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/VT-Falte_Transport_Zuber.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/df_hauptkatalog_0475046.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240716_Abläufe_breit.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005403.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240716_Konstruktionszeichnung18-24_mittig.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005374.jpg')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>● Impressum</Text>
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Johanna Knigge
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Schillerstraße 14, 99423 Weimar
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                        Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen und Geschichten:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Dieser VT-Faltenatlas soll wachsen. Schicke gerne deinen Beitrag an:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                        info@vtfalte.de
                    </Text>

                    <View style={{ height: 100 }}>
                        {/* Spacer */}
                    </View>

                </View>
            </ScrollView>
        );
    } else {
        return (
            <ScrollView style={styles.desktopContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.row}>
                    <View style={styles.col2}>
                        <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005435.jpg')} style={styles.image} />
                    </View>
                    <View style={styles.col1}>
                        <View style={styles.textContainer}>
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
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col2}>
                        <Image source={require('../images/info/VT-Falte_Transport_Zuber.jpg')} style={styles.image} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col1}>
                        <Image source={require('../images/info/df_hauptkatalog_0475046.jpg')} style={styles.image} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.col3}>
                        <Image source={require('../images/info/240716_Abläufe_breit.jpg')} style={styles.image} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col1}>
                        <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005403.jpg')} style={styles.image} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col2}>
                        <Image source={require('../images/info/240716_Konstruktionszeichnung18-24_mittig.jpg')} style={styles.image} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col1}>
                        <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005374.jpg')} style={styles.image} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col3}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                <Text style={{ fontWeight: "bold" }}>● Impressum</Text>
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 20 }}>
                                Johanna Knigge
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 20 }}>
                                Schillerstraße 14, 99423 Weimar
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                                Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen und Geschichten:
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 20 }}>
                                Dieser VT-Faltenatlas soll wachsen. Schicke gerne deinen Beitrag an:
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                                info@vtfalte.de
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    desktopContainer: {
        display: 'flex',
        flex: 3,
        maxWidth: 1200,
    },
    mobileContainer: {
        display: 'flex',
        maxWidth: '100%',
        height: '100svh',
        marginLeft: 20,
        marginRight: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',


    },
    col1: {
        flex: 1,
        margin: 22,
    },
    col2: {
        flex: 2,
        margin: 20,
    },
    col3: {
        flex: 3,
        marginRight: 20,
    },
    mobileCol: {
        width: '100%',
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,  // Adjust aspect ratio as needed
        resizeMode: 'contain',
        marginBottom: 20,
    },
});

export default Info;
