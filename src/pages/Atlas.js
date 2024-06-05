import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native-web';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import InfoPanel from '../components/InfoPanel';

const Atlas = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [showInfo, setShowInfo] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);





    useEffect(() => {

        const mapOptions = {
            lng: 12.3619,
            lat: 51.3142,
            zoom: 10.8,
            API_KEY: 'tbJDDMch9VKtj6tMDmQM',
        };
        if (map.current) return;


        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/backdrop/style.json?key=${mapOptions.API_KEY}`,
            // style: `https://api.maptiler.com/maps/bc0931e0-e1c3-4e7a-b93c-8101a09bcd9b/style.json?key=${mapOptions.API_KEY}`,
            center: [mapOptions.lng, mapOptions.lat],
            zoom: mapOptions.zoom, flex: 1,
            height: '100%',
            width: '100%',
            zIndex: 2,
        });

        // change style of map
        map.current.setStyle('https://api.maptiler.com/maps/bc0931e0-e1c3-4e7a-b93c-8101a09bcd9b/style.json?key=tbJDDMch9VKtj6tMDmQM')

        map.current.on('load', () => {
            const addMapLayers = () => {
                map.current.addSource('vt-falten-atlas', {
                    type: 'geojson',
                    data: require('../data/data.json'),
                    cluster: true,
                });

                const layers = [
                    {
                        id: 'clusters',
                        type: 'circle',
                        filter: ['has', 'point_count'],
                        paint: {
                            'circle-color': '#000',
                            'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 20, 40],
                        },
                    },
                    {
                        id: 'cluster-count',
                        type: 'symbol',
                        filter: ['has', 'point_count'],
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                            'text-size': 12,
                        },
                        paint: {
                            'text-color': '#fff',
                        },
                    },
                    {
                        id: 'unclustered-point',
                        type: 'circle',
                        filter: ['!', ['has', 'point_count']],
                        paint: {
                            'circle-color': '#000',
                            'circle-radius': 10,
                            'circle-stroke-width': 1,
                            'circle-stroke-color': '#fff',
                        },
                    },
                ];

                layers.forEach(layer => map.current.addLayer({ ...layer, source: 'vt-falten-atlas' }));
            };

            addMapLayers();

            // Event listeners
            map.current.on('click', 'clusters', async (e) => {
                const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                const clusterId = features[0].properties.cluster_id;
                const zoom = await map.current.getSource('vt-falten-atlas').getClusterExpansionZoom(clusterId);
                map.current.easeTo({ center: features[0].geometry.coordinates, zoom });
            });

            map.current.on('mouseenter', 'unclustered-point', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });

            map.current.on('mouseleave', 'unclustered-point', () => {
                map.current.getCanvas().style.cursor = '';
            });

            map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

            map.current.on('click', 'unclustered-point', (e) => {
                const feature = e.features[0];
                const selectedFeatureWithArray = {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        images: JSON.parse(feature.properties.images), // Convert string to array
                    },
                };
                setSelectedFeature(selectedFeatureWithArray);
                setShowInfo(true);
            });

        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer} ref={mapContainer}></View>
            {showInfo && (
                <View style={styles.info}>
                    <InfoPanel feature={selectedFeature} onClose={() => setShowInfo(false)} />
                </View>
            )}
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
    },
    info: {
        position: 'fixed',
        top: '25vh',
        left: '35vw',
        width: '30vw',
        height: '60vh',
        backgroundColor: 'white',
        zIndex: 3,
    },
});

export default Atlas;
