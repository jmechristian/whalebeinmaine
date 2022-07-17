import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Map, { GeolocateControl, Source, Layer } from 'react-map-gl';
import { database } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

const AdminMap = () => {
  const [isUserLocation, setIsUserLocation] = useState([]);
  const [isGeometry, setIsGeometry] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    readUserLocations();
  }, [isUserLocation]);

  const readUserLocations = () => {
    const locationRef = ref(database, 'userLocation/isUserLocation');
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      setIsGeometry(data);
    });
  };

  const updateUserLocation = useCallback(() => {
    set(ref(database, '/userLocation'), {
      isUserLocation,
    });

    setIsGeometry(isUserLocation);
  }, [isUserLocation]);

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: isGeometry,
          type: 'LineString',
        },
      },
    ],
  };

  const layerStyle = {
    type: 'line',
    id: 'line',
    paint: {
      'line-color': 'red',
      'line-width': 14,
      // 'line-gradient' must be specified using an expression
      // with the special 'line-progress' property
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        'blue',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red',
      ],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  return (
    <Box
      width='100%'
      height='100%'
      backgroundColor={'green.900'}
      position='relative'
    >
      <Map
        initialViewState={{
          longitude: -77.438267,
          latitude: 39.0431092,
          zoom: 11,
        }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken='pk.eyJ1Ijoiam1lY2hyaXN0aWFuIiwiYSI6ImNsNW9udXBqNzBodDMzam92ZjR1cDNuM3oifQ.1XHdUAzgu6fisMcaHyPTnA'
        ref={mapRef}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          onGeolocate={(evt) => {
            setIsUserLocation((prevState) => [
              ...prevState,
              [evt.coords.longitude, evt.coords.latitude],
            ]);
            updateUserLocation();
          }}
        />
        <Source
          id='gradient-line'
          type='geojson'
          lineMetrics={true}
          data={geojson}
        >
          <Layer {...layerStyle} />
        </Source>
      </Map>
      <Box
        height='-moz-max-content'
        backgroundColor={'white'}
        position='absolute'
        top='10px'
        left='10px'
        zIndex='overlay'
      >
        <Box>{isUserLocation.length}</Box>
      </Box>
    </Box>
  );
};

export default AdminMap;
