import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Input,
} from '@chakra-ui/react';
import Map, { GeolocateControl, Source, Layer, Marker } from 'react-map-gl';
import { database } from '../firebase';
import { ref, set, onValue, get, child } from 'firebase/database';
import MarkerPin from './MarkerPin';
import MarkerDrawer from './MarkerDrawer';
import ImageMarker from './ImageMarker';
import ImageModal from './ImageModal';

const AdminMap = () => {
  const initialView = {
    longitude: -77.438267,
    latitude: 39.0431092,
    zoom: 13,
  };

  const [isUserLocation, setIsUserLocation] = useState([]);
  const [isGeometry, setIsGeometry] = useState([]);
  const [viewState, setViewState] = useState(initialView);
  const [isLive, setIsLive] = useState(false);
  const [draftPin, setDraftPin] = useState();
  const [sessionName, setSessionName] = useState('');
  const [sessions, setSessions] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [markers, setMarkers] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mapRef = useRef();
  const geolocateRef = useRef();

  useEffect(() => {
    if (isUserLocation.length > 1) {
      readUserLocations();
      console.log(isUserLocation);
      console.log(sessionName);
    }
  }, [isUserLocation]);

  useEffect(() => {
    getMarkers();
    getLocations();
  }, []);

  const readUserLocations = () => {
    if (sessionName) {
      const locationRef = ref(
        database,
        `/sessions/${sessionName}/isUserLocation`
      );
      onValue(locationRef, (snapshot) => {
        const data = snapshot.val();
        setIsGeometry(data);
      });
    }
  };

  const getLocations = () => {
    const dbMarkerRef = ref(database);
    get(child(dbMarkerRef, 'sessions'))
      .then((snapshot) => {
        setSessions(Object.values(snapshot.val()));
      })
      .then(() => console.log(sessions))
      .catch((err) => console.log(err));
  };

  const getMarkers = () => {
    const dbMarkerRef = ref(database);
    get(child(dbMarkerRef, 'markers'))
      .then((snapshot) => {
        setMarkers(Object.values(snapshot.val()));
      })
      .then(() => console.log(markers))
      .catch((err) => console.log(err));
  };

  const updateUserLocation = useCallback(() => {
    const date = new Date.now();
    if (sessionName != '') {
      set(ref(database, `/sessions/${date}`), {
        isUserLocation,
        session: sessionName,
      });
    }

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

  const sessionLayer = {
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#e53e5e',
      'line-width': 14,
    },
  };

  const endLiveStream = () => {
    geolocateRef.current.trigger();
    setIsLive(false);
    setSessionName('');
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  return (
    <Box width='100%' height='100%' position='relative'>
      <Map
        initialViewState={{
          longitude: -77.438267,
          latitude: 39.0431092,
          zoom: 11,
        }}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        onClick={(event) => setDraftPin(event.lngLat)}
        mapStyle='mapbox://styles/jmechristian/ck1ogvt4m1ses1brt5xfloncr'
        mapboxAccessToken='pk.eyJ1Ijoiam1lY2hyaXN0aWFuIiwiYSI6ImNsNW9udXBqNzBodDMzam92ZjR1cDNuM3oifQ.1XHdUAzgu6fisMcaHyPTnA'
        ref={mapRef}
      >
        <GeolocateControl
          ref={geolocateRef}
          positionOptions={{ enableHighAccuracy: true }}
          showUserHeading={true}
          trackUserLocation={true}
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
        {draftPin && (
          <Marker
            latitude={draftPin.lat}
            longitude={draftPin.lng}
            onClick={() => setDrawerOpen(true)}
          >
            <MarkerPin />
          </Marker>
        )}
        {markers &&
          markers.map((mark, index) => (
            <div key={index}>
              <Marker
                latitude={mark.lat}
                longitude={mark.long}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setDraftPin(null);
                  setImageModalOpen(mark);
                }}
              >
                <ImageMarker />
              </Marker>
            </div>
          ))}
        {sessions &&
          sessions.map((sess, index) => (
            <Source
              id='route'
              type='geojson'
              key={index}
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: sess.isUserLocation,
                },
              }}
            >
              <Layer {...sessionLayer} />
            </Source>
          ))}
      </Map>
      <Box
        height='-moz-max-content'
        backgroundColor={'blue.800'}
        color={'white'}
        position='absolute'
        top='10px'
        left='10px'
        zIndex='overlay'
      >
        <Flex alignItems={'center'}>
          {isLive && <Box px={'4'}>Session: {sessionName}</Box>}
          <Box>
            {isLive ? (
              <Button
                colorScheme={'red'}
                borderRadius='none'
                onClick={endLiveStream}
              >
                LIVE
              </Button>
            ) : (
              <Button colorScheme={'blue'} borderRadius='none' onClick={onOpen}>
                Start
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
      {imageModalOpen && (
        <ImageModal
          imageOpen={imageModalOpen}
          imageClose={closeImageModal}
          mark={imageModalOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => {
                onClose();
                setIsLive(true);
                geolocateRef.current.trigger();
              }}
            >
              Start Session
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <MarkerDrawer
        session={sessionName}
        lat={draftPin ? draftPin.lat : ''}
        long={draftPin ? draftPin.lng : ''}
        drawerOpen={drawerOpen}
        drawerClose={() => setDrawerOpen(false)}
        clearDraft={() => setDraftPin(null)}
        getMarks={() => getMarkers()}
      />
    </Box>
  );
};

export default AdminMap;
