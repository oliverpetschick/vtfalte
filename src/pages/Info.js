import React from 'react';
import { View, Text, ScrollView, Dimensions, Image, StyleSheet} from 'react-native-web';

const Info = () => {
    const windowWidth = Dimensions.get('window').width;
    const isMobile = windowWidth <= 768;


    const ImageWithCaption = ({ source, caption }) => (
        <View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={source} style={styles.webImage} />
            <Text style={{ fontSize: 16, lineHeight: 20, marginBottom: 20 }}>
                {caption}
            </Text>
        </View>
    );

    const BoldText = ({ text }) => (
        <Text style={{ fontWeight: 'bold' }}>
            {text}
        </Text>
    );

    const ItalicText = ({ text }) => (
        <Text style={{ fontStyle: 'italic' }}>
            {text}
        </Text>
    );

    // disable scroll for mobile
    if (isMobile) {
        document.body.style.overflow = 'hidden';
    }

    if (isMobile) {
        return (
            <ScrollView style={styles.mobileContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005435.jpg')} style={styles.webImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Ab Ende der 60er Jahre fand die Typisierung von Bauten und Bauteilen in der DDR ihren Höhepunkt. Neben einigen wenigen bedeutenden Stadtbausteinen, die speziell für einen bestimmten Ort entworfen worden sind, gab es den Rest von der Katalogstange. <ItalicText text={"Schneller, leichter und wirtschaftlicher"}/> war die Devise und so wurden repetitiv die verschiedenen Systeme in der ganzen Republik angewendet.
                    </Text>
                    <Text style={styles.text}>
                        Das Institut für Stahlbeton Dresden entwickelte Ende der 60er Jahre ein einfach und günstig zu produzierendes typisiertes Bauteil: Die sogenannte  <BoldText text={"VT-Falte"}/> (<ItalicText text ={"Vorgefertigte trapezförmige Faltwerkträger"}/>). Als aneinander gesetzter Träger ermöglicht sie eine stützenfreie Halle von maximal 24 Metern Spannweite und formt ein charakterstarkes Dach. Die trapezförmigen Faltwerkträger sollten mit ihrer Form nicht nur das Stadtbild verschönern und auflockern, sondern bestachen auch durch ihre vielseitigen Einsatzmöglichkeiten im Industrie-, Landwirtschafts- und Gesellschaftsbau. Zahlreiche Vorteile führten zu einer raschen Verbreitung.
                    </Text>
                    <Text style={styles.text}>
                        Trotz des markanten Dachs und der schieren Menge, sind die Bauten bisher kaum Bestandteil der Diskussion um baukulturelles Erbe der DDR-Architektur geworden. An zahlreichen Stellen fügen sie sich in die städtische Umgebung ein und finden Anklang durch die Einfachheit ihrer Konstruktion. Dennoch sind sie auch dem Verfall, Leerstand oder Abriss ausgesetzt.
                    </Text>
                    <Text style={styles.text}>
                        Die Arbeit Unfold vermittelt die Bautechnikgeschichte der VT-Falte und stellt ihre materiellen wie räumlichen Potenziale zur Diskussion. Eines der größten Vorteile der Hallen, sind ihre freie Grundrissgestaltung und Möglichkeit unterschiedlichste Programme aufzunehmen. In einem Atlas ist der aktuelle Gebäudebestand mit VT-Faltendach am Beispiel Leipzigs dargestellt. Die VT-Falte findet sich jedoch auch an zahlreichen weiteren Standorten wider. Der aktuelle Baubestand in ganz Deutschland ist schwer zu schätzen. Daher soll dieser Atlas interaktiv weiter wachsen. Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen, Geschichten und Nachfragen: schicke gerne deinen Beitrag an <Text style={{ fontSize: 18, lineHeight: 20, marginTop: 20, color: 'blue'}}> info@vtfalte.de</Text>
                    </Text>
                    <Text style={styles.text}>
                        <ItalicText text={"Unfold"}/> ist im Rahmen der Architektur Masterarbeit von Johanna Knigge an der Bauhaus-Universität Weimar entstanden.
                    </Text>
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/240723_Cover5BUW_Unfold_Johanna-KniggeBUW_Unfold_Johanna-Knigge.jpg')} style={
                    styles.image
                } />
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
                    <Image source={require('../images/info/240716_Konstruktionszeichnung18-24_mittig.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge9.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge2.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge4.jpg')} style={styles.image} />
                </View>
                <View style={styles.mobileCol}>
                    <Image source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge3.jpg')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>Impressum</Text>
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Für den Inhalt dieser Seite verantwortlich:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Johanna Knigge
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Elisabethstraße 23, 04315 Leipzig
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                        Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen und Geschichten:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Dieser VT-Faltenatlas soll wachsen. Schicke gerne deinen Beitrag an:
                        <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20, color: 'blue'}}> info@vtfalte.de</Text>
                    </Text>

                            <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20, textAlign: 'left' }}>
                        Bildnachweise in chronologischer Reihenfolge:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        ©  Florian Marenbach, 2024.
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        ©  Johanna Knigge, 2024.
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        ©  Privatarchiv H.P.Zuber, 2024.
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        ©  Gerhard Döring, 1972.
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        Für alle Folgenden:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, textAlign: 'left' }}>
                        ©  Johanna Knigge, 2024.
                    </Text>


                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20, textAlign: 'left' }}>
                        Gefördert durch die Frauenförderfonds der Bauhaus-Universität Weimar.
                        </Text>
                        <Image
                            source={require('../images/info/Logo_Frauenfoerderfonds_RGB.png')}
                            style={{
                                width: '50%',
                                height: '50%',
                                resizeMode: 'contain',
                                marginTop: -55,
                            }}
                            />

                    <View style={{ height: 10 }}>

                    </View>

                </View>
            </ScrollView>
        );
    } else {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{width: '100%',height: 'auto', zIndex: 1}}>
                <Text style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'left', marginLeft: 45}}>Unfold</Text>
                {/* <Text style={{ fontSize: 20, textAlign: 'left', marginLeft: 45, marginBottom: 25}}>Über die Geschichte und Potenziale der VT-Falte</Text> */}
            </View>
            <View style={{ flexDirection: 'row', flex: 1, width: '100%', }}>
            <View style={{ width: 45, height: '100%'}} />

                <View style={{
                width: '30%',
                maxHeight: '100%',
                justifyContent: 'flex-start',
                alignContent: 'center',
                }}>
                <Text style={styles.text}>
                <ItalicText text={"Über die Geschichte und Potenziale der VT-Falte"}/>
                </Text>

                <Text style={styles.text}>
                Ab Ende der 60er Jahre fand die Typisierung von Bauten und Bauteilen in der DDR ihren Höhepunkt. Neben einigen wenigen bedeutenden Stadtbausteinen, die speziell für einen bestimmten Ort entworfen worden sind, gab es den Rest von der Katalogstange. <ItalicText text={"Schneller, leichter und wirtschaftlicher"}/> war die Devise und so wurden repetitiv die verschiedenen Systeme in der ganzen Republik angewendet.
                </Text>
                <Text style={styles.text}>
                Das Institut für Stahlbeton Dresden entwickelte Ende der 60er Jahre ein einfach und günstig zu produzierendes typisiertes Bauteil: Die sogenannte  <BoldText text={"VT-Falte"}/> (<ItalicText text ={"Vorgefertigte trapezförmige Faltwerkträger"}/>). Als aneinander gesetzter Träger ermöglicht sie eine stützenfreie Halle von maximal 24 Metern Spannweite und formt ein charakterstarkes Dach. Die trapezförmigen Faltwerkträger sollten mit ihrer Form nicht nur das Stadtbild verschönern und auflockern, sondern bestachen auch durch ihre vielseitigen Einsatzmöglichkeiten im Industrie-, Landwirtschafts- und Gesellschaftsbau. Zahlreiche Vorteile führten zu einer raschen Verbreitung.
                </Text>
                <Text style={styles.text}>
                Trotz des markanten Dachs und der schieren Menge, sind die Bauten bisher kaum Bestandteil der Diskussion um baukulturelles Erbe der DDR-Architektur geworden. An zahlreichen Stellen fügen sie sich in die städtische Umgebung ein und finden Anklang durch die Einfachheit ihrer Konstruktion. Dennoch sind sie auch dem Verfall, Leerstand oder Abriss ausgesetzt.
                </Text>
                <Text style={styles.text}>
                Die Arbeit Unfold vermittelt die Bautechnikgeschichte der VT-Falte und stellt ihre materiellen wie räumlichen Potenziale zur Diskussion. Eines der größten Vorteile der Hallen, sind ihre freie Grundrissgestaltung und Möglichkeit unterschiedlichste Programme aufzunehmen. In einem Atlas ist der aktuelle Gebäudebestand mit VT-Faltendach am Beispiel Leipzigs dargestellt. Die VT-Falte findet sich jedoch auch an zahlreichen weiteren Standorten wider. Der aktuelle Baubestand in ganz Deutschland ist schwer zu schätzen. Daher soll dieser Atlas interaktiv weiter wachsen. Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen, Geschichten und Nachfragen: schicke gerne deinen Beitrag an <Text style={{ fontSize: 18, lineHeight: 20, marginTop: 20, color: 'blue'}}> info@vtfalte.de</Text>.
                </Text>
                <Text style={styles.text}>
                <ItalicText text={"Unfold"}/> ist im Rahmen der Architektur Masterarbeit von Johanna Knigge an der Bauhaus-Universität Weimar entstanden.
                </Text>

                </View>
                <View style={{ width: 45, height: '100%'}} />
                <View style={{ flexDirection: 'column', flex: 1, width: '70%', }}>
                <ImageWithCaption
                    source={require('../images/info/240703_VT-Falte_Leutzsch_FM_L1005435.jpg')}
                    caption="VT-Falte in Leipzig-Leutzsch © Florian Marenbach"/>

                <Image source={require('../images/info/240723_Cover5BUW_Unfold_Johanna-KniggeBUW_Unfold_Johanna-Knigge.jpg')} style={
                    styles.webImage
                } />
                <ImageWithCaption
                    source={require('../images/info/VT-Falte_Transport_Zuber.jpg')}
                    caption="Transport von VT-Falten © Privatarchiv H.P. Zuber"/>
                <ImageWithCaption
                    source={require('../images/info/df_hauptkatalog_0475046.jpg')}
                    caption="Produktion auf Matritzen © Gerhard Döring, 1972"/>


                <ImageWithCaption
                    source={require('../images/info/240716_Abläufe_breit.jpg')}
                    caption="Konstruktionsablauf"/>
                <ImageWithCaption
                     source={require('../images/info/240716_Konstruktionszeichnung18-24_mittig.jpg')} caption="Konstruktionszeichnung und Fugenausbildung"/>
                <ImageWithCaption
                     source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge9.jpg')} caption="Standardaufbau einer Umformerstation"/>
                <ImageWithCaption
                        source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge2.jpg')}
                        caption=""/>
                <ImageWithCaption
                        source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge4.jpg')}
                        caption=""/>
                <ImageWithCaption
                        source={require('../images/info/241112_Unfold_DokuBUW_Unfold_Johanna-Knigge3.jpg')}
                        caption=""/>
                </View>
                <View style={{ width: 45, height: '100%'}} />
            </View>
            <View style={{ height: 200, width: '30%', marginLeft: 45, marginBottom: 50}}>
            <Text style={styles.text}>
                        <Text style={{ fontWeight: "bold" }}>Impressum</Text>
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Für den Inhalt dieser Seite verantwortlich:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Johanna Knigge
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Elisabethstraße 23, 04315 Leipzig
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20 }}>
                        Ob aktuelles oder historisches Bildmaterial, ein weiterer Standort, Erinnerungen und Geschichten:
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20 }}>
                        Dieser VT-Faltenatlas soll wachsen. Schicke gerne deinen Beitrag an:
                        <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20, color: 'blue'}}> info@vtfalte.de</Text>
                    </Text>
                    <Text style={{ fontSize: 16, lineHeight: 20, marginTop: 20, textAlign: 'left' }}>
                        Gefördert durch die Frauenförderfonds der Bauhaus-Universität Weimar.
                        </Text>
                        <Image
                            source={require('../images/info/Logo_Frauenfoerderfonds_RGB.png')}
                            style={{
                                width: '50%',
                                height: '50%',
                                resizeMode: 'contain',
                                marginTop: -5,
                            }}
                            />
            </View>

            </ScrollView>

        );

    }
};





const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        marginBottom: 20,
    },
    mobileContainer: {
        flex: 1,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
    row: {
        marginBottom: 20,

    },
    mobileCol: {
        width: '100%',
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'column',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'justify'

    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,  // Adjust aspect ratio as needed
        resizeMode: 'contain',
        marginBottom: 20,
    },
    webImage: {
        width: '100%',
        height: '80vh',
        aspectRatio: 1,
        resizeMode: 'contain',
    }
});

export default Info;
