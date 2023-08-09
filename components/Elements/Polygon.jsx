"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import Image from "next/image";
import deleteIcon from '../../assets/remove-gray.png';

const libraries = ['places', 'drawing'];

const LocationPoligon = ({ type, label, hint, required, attribute, name = "", category, indexPerObject, coordsOriginal }) => {
    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const autocompleteRef = useRef();
    const drawingManagerRef = useRef();
    const [polygons, setPolygons] = useState([])

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
        libraries
    })
    const containerStyle = {
        width: '100%',
        height: '400px'
    };
    const defaultCenter = {
        lat: 36.6972845,
        lng: -119.1922622
    }
    const [center, setCenter] = useState(defaultCenter);

    const autocompleteStyle = {
        boxSizing: `border-box`,
        border: `1px solid transparent`,
        width: `270px`,
        height: `40px`,
        padding: `0 12px`,
        borderRadius: `6px`,
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
        fontSize: `14px`,
        outline: `none`,
        textOverflow: `ellipses`,
        position: "absolute",
        right: "30%",
        top: "5px",
        color: "#0D3331",
        fontfamily: 'Pragmatica',
        fontstyle: 'normal',
        fontweight: '500'
    }

    const deleteIconStyle = {
        cursor: 'pointer',
        backgroundImage: `url(${deleteIcon})`,
        height: '25px',
        width: '25px',
        marginTop: '5px',
        backgroundColor: 'red',
        position: 'absolute',
        top: "30px",
        right: "70px",
        zIndex: 99999,
    }

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
        mapTypeControl: true,
    }

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON
            ]
        }
    }

    
    const onLoadPolygon = (polygon, index) => {
        polygonRefs.current[index] = polygon;
    }

    const onClickPolygon = (index) => {
        activePolygonIndex.current = index;
    }
    const onLoadAutocomplete = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    }

    const onPlaceChanged = () => {
        const { geometry } = autocompleteRef.current.getPlace();
        const bounds = new window.google.maps.LatLngBounds();
        if (geometry.viewport) {
            bounds.union(geometry.viewport);
        } else {
            bounds.extend(geometry.location);
        }
        mapRef.current.fitBounds(bounds);
    }

    const onLoadDrawingManager = drawingManager => {
        drawingManagerRef.current = drawingManager;
    }

    const onOverlayComplete = ($overlayEvent) => {
        drawingManagerRef.current.setDrawingMode(null);
        if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = $overlayEvent.overlay.getPath()
                .getArray()
                .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }))

            // start and end point should be same for valid geojson
            const startPoint = newPolygon[0];
            
            newPolygon.push(startPoint);
            console.log('New', newPolygon)    
            $overlayEvent.overlay?.setMap(null);
            setPolygons([newPolygon]);
        }
    }

    const onDeleteDrawing = () => {
        const filtered = polygons.filter((polygon, index) => index !== activePolygonIndex.current)
        setPolygons(filtered)
    }

    const onEditPolygon = (index) => {
        const polygonRef = polygonRefs.current[index];
        if (polygonRef) {
            const coordinates = polygonRef.getPath()
                .getArray()
                .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));

            const allPolygons = [...polygons];
            allPolygons[index] = coordinates;
            setPolygons(allPolygons)
        }
    }

    

    useEffect(() => {
        
        if (Array(...coordsOriginal).length > -1) {
            let indexhi = Array(...coordsOriginal).findIndex(value => value.index === indexPerObject);
            if (indexhi > -1) {
                setPolygons([...polygons, coordsOriginal[indexhi].coords]);
            }
        }
    }, [])

    const onLoadMap = (map) => {
        mapRef.current = map;
        const bounds = new google.maps.LatLngBounds();
        console.log('Polygons', polygons)
        polygons.forEach((value) => {
            console.log('Que llega', value)
            Array(...value).map((item, index) => bounds.extend({
                lat: Number(item.lat),
                lng: Number(item.lng)
            }))
        });
        map.fitBounds(bounds);
    }

    return (
        isLoaded ?
            <div className="col-12 mb-3" style={{ position: 'relative' }}>
                <label className="labelform" title={hint}>{label}</label>
                {
                    drawingManagerRef.current
                    &&
                    <div
                        onClick={onDeleteDrawing}
                        title='Delete shape'
                        style={deleteIconStyle}>
                        <deleteIcon style={{ with: 20, height: 20 }} />
                        <Image
                            src={require("../../assets/remove-white.png")}
                            alt="Delete"
                            width={25}
                            height={25}
                        />
                    </div>
                }
                
                <GoogleMap
                    zoom={9}
                    center={center}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    onTilesLoaded={() => setCenter(null)}
                    options={mapOptions}
                    mapContainerClassName={`${name} ${JSON.stringify(...polygons)}`}
                >
                    <DrawingManager
                        onLoad={onLoadDrawingManager}
                        onOverlayComplete={onOverlayComplete}
                        options={drawingManagerOptions}
                    />
                    {
                        polygons.map((iterator, index) => (
                            <Polygon
                                key={index}
                                onLoad={(event) => onLoadPolygon(event, index)}
                                onMouseDown={() => onClickPolygon(index)}
                                onMouseUp={() => onEditPolygon(index)}
                                onDragEnd={() => onEditPolygon(index)}
                                options={polygonOptions}
                                paths={iterator}
                                draggable
                                editable
                            />
                        ))
                    }
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type='text'
                            placeholder='Search Location'
                            style={autocompleteStyle}
                        />
                    </Autocomplete>
                </GoogleMap>


            </div>
            : null
    )
}

export default LocationPoligon;