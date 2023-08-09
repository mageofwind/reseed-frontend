import React, { useEffect, useState } from "react";
import Input from './Elements/Input';
import SelectInput from './Elements/Select';
import Checkbox from './Elements/Checkbox'
import Date from './Elements/Date';
import Decimal from './Elements/Decimal';
import File from './Elements/File';
import LocationPoligon from './Elements/Polygon';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE; 

const Element = ({ coordsFormMaps, atribute: { type, label, hint, required, attribute, options }, name = "", metadata, category, arrayFlag, indexPerObject, userRole }) => {

    const [values, setValues] = useState([]);
    const [isLoadingTest, setIsLoadingTest] = useState(true);
    const [coordsMap, setCoordsMap] = useState([]);

    const getInformation = async () => {
        if (options === 'OrgTypeList') {
            const response = await fetch(
                `${ENDPOINT}${PREFIX}/organizationType`
            ).then((response) => response.json());
            return response.data.list;
        } else {
            const response = await fetch(
                `${ENDPOINT}${PREFIX}/country`
            ).then((response) => response.json());
            return response.data.list;
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            if (!category && !metadata) return;
            if (arrayFlag === true) {
                if (!metadata[category.category]) return;
                Array(...metadata[category.category]).map((item, index) => {
                    let e = [...document.getElementsByName(attribute)];
                    // console.log('attribute ->', attribute);
                    // console.log('e -> :D', e);
                    // console.log('pops =>', metadata[category.category][index]);
                    e.map((item2, index2) => {

                        if (metadata[category.category][index][attribute] === "") {
                            // console.log('es un string vacio :c');
                        } else if (item2.type === 'LocationPolygon') {
                            // console.log('son las coords we ->', metadata[category.category]);
                            // console.log('index per object ->', indexPerObject)
                        } else {
                            e[index].value = metadata[category.category][index][attribute];
                        }
                    });
                })
            } else {
                if (!metadata[category.category]) return;
                if (metadata[category.category][attribute] === "" || metadata[category.category][attribute] === undefined) return setIsLoadingTest(false);
                let e = document.getElementById(attribute);
                if (type === 'StaticList') {
                    let lista = await getInformation();
                    let indexFind = Array(...lista).findIndex(item => item.value === metadata[category.category][attribute] || item.description === metadata[category.category][attribute]);
                    e.options.selectedIndex = indexFind;
                } else if (type === 'MultiSelectList') {
                    let moreinfo = await getInformation();
                    let valoresebo = []
                    Array(...metadata[category.category][attribute]).map((item, index) => {

                        let indexcount = moreinfo.findIndex(country => country.value === item);
                        if (indexcount > -1) {
                            valoresebo.push({ "value": moreinfo[indexcount].value, "label": moreinfo[indexcount].description });
                        }
                    });
                    setValues(valoresebo);
                    setIsLoadingTest(false);
                } else if (type === 'LocationPolygon') {

                } else {
                    e.value = metadata[category.category][attribute];
                }
            }
        };
        fetchData();

    }, [])
    switch (type) {
        case 'String':
            return (<Input
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                name={name}
            />)
        case 'StaticList':
            return (<SelectInput
                userRole={userRole}
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                typeList={options}
                name={name}
            />)
        case 'MultiSelectList':
            return (<Checkbox
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                typeList={options}
                name={name}
                value={values}
                isLoading={isLoadingTest}
            />)
        case 'Date':
            return (<Date
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                name={name}
            />)
        case 'Decimal':
            return (<Decimal
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                name={name}
            />)
        case 'File':
            return (<File
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                name={name}
            />)
        case 'LocationPolygon':
            return (<LocationPoligon
                attribute={name === "" ? attribute : ""}
                label={label}
                required={required}
                hint={hint}
                name={name}
                category={category}
                indexPerObject={indexPerObject}
                coordsOriginal={coordsFormMaps}
                type={type}
            />)
        default:
            return null;
    }
}

export default Element;