import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native-web';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import InfoPanel from '../components/InfoPanel';
import Legend, { legendMapping } from '../components/Legend';

const Atlas = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [infoState, setInfoState] = useState({
        showInfo: false,
        selectedFeature: null,
        showLink: false,
    });

    const onClose = () => {
        setInfoState({ showInfo: false, selectedFeature: null });
    };

    const addMapLayers = () => {
        map.current.addSource('vt-falten-atlas', {
            type: 'geojson',
            data: require('../data/data.json'),
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 40,
            clusterMinPoints: 3,
        });

        const layers = [
            {
                id: 'clusters',
                type: 'circle',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#FFF' /* white */,
                    'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 20, 40],
                    // add a black border around the circle
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000',
                },
            },
            {
                id: 'cluster-count',
                type: 'symbol',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Arial Unicode MS Bold'],
                    'text-size': 12,
                },
                paint: {
                    'text-color': '#000', // black
                },
            },
            {
                id: 'unclustered-point',
                type: 'circle',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': [
                        'match',
                        ['get', 'category_id'],
                        ...Object.entries(legendMapping).flatMap(([key, { color }]) => [parseInt(key), color]),
                        '#000',
                    ],
                    'circle-radius': 10,
                },
            },
        ];

        layers.forEach(layer => map.current.addLayer({ ...layer, source: 'vt-falten-atlas' }));
    };

    const addMapEvents = useCallback(() => {
        map.current.on('click', 'clusters', async (e) => {
            const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            const clusterId = features[0].properties.cluster_id;
            const zoom = await map.current.getSource('vt-falten-atlas').getClusterExpansionZoom(clusterId);
            map.current.easeTo({ center: features[0].geometry.coordinates, zoom });
        });

        // close the info panel when the user interacts with the map
        map.current.on('click', () => {
            onClose();
        });

        map.current.on('mouseenter', 'unclustered-point', () => {
            map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'unclustered-point', () => {
            map.current.getCanvas().style.cursor = '';
        });

        // map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('click', 'unclustered-point', (e) => {
            const feature = e.features[0];
            console.log(feature);
            const selectedFeatureWithArray = {
                ...feature,
                properties: {
                    ...feature.properties,
                    images: JSON.parse(feature.properties.images),
                },
            };

            setInfoState({ showInfo: true, selectedFeature: selectedFeatureWithArray });

        });
    }, []);

    useEffect(() => {
        const lng = parseFloat(new URLSearchParams(window.location.search).get('lng')) || 12.3619;
        const lat = parseFloat(new URLSearchParams(window.location.search).get('lat')) || 51.3142;
        const zoom = parseFloat(new URLSearchParams(window.location.search).get('zoom')) || 10.8;

        const mapOptions = {
            lng: lng,
            lat: lat,
            zoom: zoom,
            API_KEY: 'tbJDDMch9VKtj6tMDmQM',
        };
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/backdrop/style.json?key=${mapOptions.API_KEY}`,
            center: [mapOptions.lng, mapOptions.lat],
            zoom: mapOptions.zoom,
            flex: 1,
            height: '100%',
            width: '100%',
            zIndex: 2,
        });

        map.current.setStyle('https://api.maptiler.com/maps/bc0931e0-e1c3-4e7a-b93c-8101a09bcd9b/style.json?key=tbJDDMch9VKtj6tMDmQM');

        map.current.on('load', () => {
            addMapLayers();
            addMapEvents();

            const foldId = new URLSearchParams(window.location.search).get('fold') || null;
            if (foldId) {
                const feature = map.current.getSource('vt-falten-atlas')._data.features[foldId - 1];
                map.current.easeTo({ center: feature.geometry.coordinates, zoom: 17 });
            }
        });
    }, [addMapEvents]);

    const { showInfo, selectedFeature } = infoState;

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer} ref={mapContainer}></View>
            {showInfo && <InfoPanel feature={selectedFeature} onClose={onClose} />}
            {!showInfo && <Legend />}
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 1,
    },
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Atlas;
