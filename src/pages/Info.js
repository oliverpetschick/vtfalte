import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native-web';

const Info = () => {
    return (
        <View style={styles.container}>
            <View style={styles.infoTop}>
                <Text style={styles.placeholderText}>Ab Ende der 60er Jahre fand die Typisierung von Bauten und Bauteilen in der DDR ihren Höhepunkt. Neben einigen wenigen bedeutenden Stadtbausteinen, die speziell für einen bestimmten Ort entworfen worden sind, gab es den Rest von der Katalogstange. Schneller, leichter und wirtschaftlicher war die Devise und so wurden repetitiv die verschiedenen Systeme in der ganzen Republik angewendet. Auch in Leipzig prägt das baukulturelle Erbe der DDR-Zeit das Stadtbild nachhaltig. Neben markanten und bekannten Architekturen wie dem innerstädtischen Gewandhaus, der Oper, dem Wintergartenhochhaus oder dem West Inn (ehemaliges Hotel Merkur) entstand in Leipzig auch die zweitgrößte Großwohnsiedlung der Republik, Grünau. In die Stadtstruktur mischen sich aber auch einige weniger auffällige DDR-Bauten, unter anderen sogenannten Mehrzweckhallen. Sie dienten als städtebaulicher Kontrast zwischen Wohnbauten und werden durch ihre einfache Bauweise vielseitig genutzt um das öffentliche Leben zu organisierten. Diese multifunktionalen, oft ein- bis dreigeschossigen Gebäude dienen auch heute noch neben Funktionen der Gesellschaft auch bis hin zu Industrie und Landwirtschaft. Das VEB Baukombinat in Dresden entwickelte speziell für diese Zwecke ein einfach zu produzierendes typisiertes Bauteil: Die sogenannte VT-Falte.</Text>
            </View>
            <View style={styles.infoMiddle}>
                <Image source={require('../images/rolling_triangle_transparent.gif')} style={styles.gif} />
            </View>
            <View style={styles.infoBottom}>
                <Text style={styles.placeholderText}>Als aneinandergesetzte Träger ermöglichen sie eine stützenfreie Halle von maximal 24 Metern und formen ein charakterstarkes Dach. Neben anderen seriellen Fertigteildächern aus Spannbeton, wie zum Beispiel der HP-Schalenträger von Herbert Müller, ist das VT-Faltendach in diesem Kontext im gesamten Stadtraum Leipzigs die verbreitetste Dachform und hundertfach vorzufinden. Die trapezförmigen Faltwerkträger sollten nicht nur das Stadtbild verschönern und mit ihrer Form auflockern, sondern auch schnell wie kostengünstig hergestellt und verbaut werden. Zahlreiche Vorteile führten zu einer raschen Verbreitung. Trotz der markanten Dachform sind die Bauten bisher kaum Bestandteil der Diskussion um baukulturelles Erbe der DDR-Architektur geworden. An zahlreichen Stellen fügen sie sich in die städtische Umgebung ein, finden Anklang durch die Einfachheit ihrer Konstruktion. Dennoch sind sie auch dem Verfall, Leerstand in manchen Fällen sogar dem Abriss ausgesetzt. Dieses Projekt zielt darauf ab Aufmerksamkeit für ein bemerkenswerte Konstruktion zu generieren. Darüber hinaus, in Hinblick auf ein notwendiges ökologisches Umdenken, soll ein produktiver Umgang mit eher ungeliebtem, jüngerem Bestand aufzeigt werden. Die Hallen mit VT-Faltendach prägen durch ihre Kumulation das Stadtbild. Diese weniger auffälligen, alltäglichen Bauten sollen in den Fokus gerückt und Gegenstand einer Diskussion über immaterielles Baukulturerbe werden.
                </Text>
            </View>
            <View style={styles.imageRight}>
                <Image source={require('../images/info/info_image.jpg')} style={styles.baseImage} />
            </View>
            <View style={styles.imprint}>
                <Text style={styles.placeholderText}>Impressum</Text>
                <Text style={styles.placeholderText}>Johanna Knigge</Text>
                <Text style={styles.placeholderText}>Schillerstraße 14 99423 Weimar</Text>
                <Text style={styles.placeholderText}>E-Mail: <a href="mailto:">johannapaulaknigge@gmail.com</a></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        // 20 * 5% rows
        gridTemplateRows: 'repeat(20, 5%)',
        height: '100%',
        width: '100%',
    },
    // logic: from-row / from-column / to-row / to-column
    // 45% of the grid (left)
    infoTop: {
        gridArea: '1 / 1 / 10 / 1',
        justifyContent: 'center',
    },
    // 10% of the grid (left)
    infoMiddle: {
        gridArea: '10 / 1 / 12 / 3',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    // 45% of the grid (left)
    infoBottom: {
        gridArea: '12 / 1 / 21 / 1',
        justifyContent: 'center',
    },
    // 60% of the grid (right)
    imageRight: {
        gridArea: '1 / 2 / 14 / 3',
        justifyContent: 'center',

    },
    // 40% of the grid (right)
    imprint: {
        gridArea: '14 / 2 / 21 / 3',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 20,
        textAlign: 'block',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    gif: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    baseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'keep'
    }
});

export default Info;