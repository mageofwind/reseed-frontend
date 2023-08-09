import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];
const MapView = ({coords, indexMap}) => {
   
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
        libraries
    })

    const [polygons, setPolygons] = useState([]);

    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: true,
        editable: true
    }

    const mapOptions = {
        streetViewControl: false,
        controlSize: false,
        fullscreenControl: false,
        mapTypeControl: false,
    }

    const onLoadMap = (map) => {
        const bounds = new google.maps.LatLngBounds();
        polygons.forEach((value) => {
            // catch value of markers in array
            Array(...value).map((item, index) => bounds.extend({
                lat: Number(item.lat),
                lng: Number(item.lng)
            }))
        });
        map.fitBounds(bounds);
    }

    useEffect(() => {
        // Recive all the Coords of the objects
        if (Array(...coords).length > 0) {
            let indexhi = Array(...coords).findIndex(value => value.index === indexMap);
            // Takes the coords of the polygon of each categorie
            if (indexhi > -1) {
                setPolygons([...polygons, coords[indexhi].coords]);
            }
        }
    }, [coords])

    return (
        isLoaded ?
        <div className="col-12 mb-3">
            <GoogleMap
                    zoom={15}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    // onTilesLoaded={() => setCenter(null)}
                    options={mapOptions}
                >
                    {
                        polygons.map((iterator, index) => (
                            <Polygon
                                key={index}
                                options={polygonOptions}
                                paths={iterator}
                            />
                        ))
                    }
                    
                </GoogleMap>
        </div>
        :
        null
    )

}
export default MapView;