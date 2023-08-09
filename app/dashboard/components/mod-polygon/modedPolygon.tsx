import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import ICONS from '@/assets/icons/icons';
import poly_style from "./modedPolygon.module.scss"

interface MapData {
    attribute: string,
    border_color: string,
    fill_color: string,
    hint: string,
    label: string,
    required: boolean,
    type: string
    formControllerIndex: number,
    value: Array<any>,
    category: any,
}

interface Config {
    mapOptions: google.maps.MapOptions
    mapOptionsOR: google.maps.MapOptions
    style: React.CSSProperties
    center: any,
    polygonOptions: any,
}

const libraries: Array<any> = ['places', 'drawing'];

const MapPolygon = ({ info, callback, canWrite, savedData }: { info: MapData, callback?: Function, canWrite?: boolean, savedData: any  }) => {
    const config: Config = {
        mapOptions: { streetViewControl: false, fullscreenControl: false, mapTypeControl: true },
        mapOptionsOR: { streetViewControl: false, fullscreenControl: false, mapTypeControl: true, draggable: false, zoomControl: false },
        style: { width: '100%', height: '400px' },
        center: { lat: 36.6972845, lng: -119.1922622 },
        polygonOptions: {
            fillOpacity: 0.3,
            fillColor: info.fill_color ?? '#ff0000',
            strokeColor: info.border_color ?? '#ff0000',
            strokeWeight: 2,
            editable: true
        }
    }
    const DrawerManagerOpt = {
        drawingControl: true,
        drawingControlOptions: {
            position: window?.google?.maps?.ControlPosition?.TOP_RIGHT,
            drawingModes: [
                window?.google?.maps?.drawing?.OverlayType.POLYGON
            ]
        },
        polygonOptions: config.polygonOptions
    }
    const autocompleteStyle: React.CSSProperties = {
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
        fontFamily: 'Pragmatica',
        fontStyle: 'normal',
        fontWeight: '500'
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
        libraries: libraries
    })

    const [polygons, setPolygons] = useState<google.maps.Polygon[]>([])
    const [OR_polyArray, setOR_polyArray] = useState<any>([])
    const autocompleteRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        if (!!info.value) {
            setOR_polyArray(info.value);
        }
        console.log(info.value);
        if (callback) {
            const DataToSend = {
                "coords": info.value,
                "index": info.formControllerIndex,
                "attribute": info.attribute
            }
            callback(DataToSend.coords, info)
        }
    }, [])

    //TODO -------------------------------------------------------------
    //TODO functions
    const prepareArray = (polyData: google.maps.Polygon[]) => {
        let path = polyData[0].getPath().getArray()
        let polyCoords = path.map((point) => {
            const lat = point.lat();
            const lng = point.lng();
            return { lat, lng }
        })

        //? verificacion de la existencia de una funcion callback para retornar valores obtenidos
        if (callback) {
            const polyToSend = polyCoords
            const DataToSend = {
                "coords": polyToSend,
                "index": info.formControllerIndex,
                "attribute": info.attribute
            }
            callback(DataToSend.coords, info)
        }
    }
    const handlePolygonComplete = (polygon: google.maps.Polygon) => {
        //setPolygons((prevPolygons) => [...prevPolygons, polygon]);
        setPolygons([polygon]);
        prepareArray([polygon]);
        setOR_polyArray(polygon.getPath().getArray());
        polygon.setMap(null)
    }
    const removePolygon = () => {
        //if (canDelete) setPolygons((prevPolygons) => prevPolygons.filter((p) => p !== polygon));
        //prepareArray("remove", polygon)
        setPolygons([]);
        if (callback) {
            const DataToSend = {
                "coords": [],
                "index": info.formControllerIndex,
                "attribute": info.attribute
            }
            callback(DataToSend.coords, info)
        }
    }
    const editHandle = (event: any) => {
        const newLatLng = event.latLng;
        const vertexIndex = event.vertex;

        setPolygons(prevPolygons => {
            const updatedPolygons = [...prevPolygons];
            const updatedPolygon = updatedPolygons[0];
            const path = updatedPolygon.getPath();
            path.setAt(vertexIndex, newLatLng);
            prepareArray(updatedPolygons)
            return updatedPolygons;
        });
    }
    const onLoadMapOR = (map: google.maps.Map) => {
        if (info.value) {
            const bounds = new google.maps.LatLngBounds()
            info.value.forEach((poly: any) => {
                bounds.extend({
                    lat: Number(poly.lat),
                    lng: Number(poly.lng)
                })
            })
            map.fitBounds(bounds)
        }
    }
    const onLoadAutocomplete = (autocomplete: any) => {
        autocompleteRef.current = autocomplete;
    }
    const onPlaceChanged = () => {
        //@ts-ignore
        const { geometry } = autocompleteRef?.current?.getPlace();
        const bounds = new window.google.maps.LatLngBounds();
        if (geometry.viewport) {
            bounds.union(geometry.viewport);
        } else {
            bounds.extend(geometry.location);
        }
        //@ts-ignore
        mapRef.current?.fitBounds(bounds);
    }
    //TODO -------------------------------------------------------------


    //? Logica que permite identificar si es para crear polygons o para mostrar solamente
    if (canWrite) {
        return isLoaded ?
            <div className="col-12 mb-3" style={{ position: 'relative' }}>
                <div className={poly_style["title_div"]}>
                    <div>
                        <h1>{info.label}</h1>
                        <h2>{info.hint}</h2>
                    </div>
                    <p onClick={() => removePolygon()}><img src={ICONS.trash.src} alt="can" /></p>
                </div>
                {/* @ts-ignore */}
                <GoogleMap
                    onLoad={(map: any) => {
                        onLoadMapOR(map);
                        mapRef.current = map;
                    }}
                    zoom={9}
                    // center={polygons.length > 0 ? undefined : config.center}
                    mapContainerStyle={config.style}
                    options={config.mapOptions}
                >
                    {
                        <Polygon
                          path={OR_polyArray}
                          options={config.polygonOptions}
                          onMouseUp={(event: any) => editHandle(event)}
                        />
                    }
                    <DrawingManager
                        drawingMode={window?.google?.maps?.drawing?.OverlayType?.POLYGON}
                        options={DrawerManagerOpt}
                        onPolygonComplete={handlePolygonComplete}
                    />
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
    } else {
        return isLoaded ?
            //@ts-ignore
            <GoogleMap
                onLoad={(map: google.maps.Map) => onLoadMapOR(map)}
                zoom={9}
                center={config.center}
                options={config.mapOptionsOR}
                mapContainerStyle={config.style}
            >
                <Polygon
                    path={OR_polyArray}
                    options={{
                        fillOpacity: 0.3,
                        fillColor: info.fill_color ?? '#ff0000',
                        strokeColor: info.border_color ?? '#ff0000',
                        strokeWeight: 2,
                    }}
                />
            </GoogleMap>
            : null
    }
}
export default MapPolygon