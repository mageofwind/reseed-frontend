import React, { useState, useEffect } from "react";
import Select from 'react-select'

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE; 

const Checkbox = ({ type, label, hint, required, attribute, typeList, name = "", value, isLoading }) => {
    const [options, setOptions] = useState([])
    const [testing, setTesting] = useState([...value]);


    const getInformation = async () => {
        
        if (typeList === 'OrgTypeList') {
            const response = await fetch(
                `${ENDPOINT}${PREFIX}/organizationType`
            ).then((response) => response.json());
            setOptions(response.data.list)
        } else {
            const response = await fetch(
                `${ENDPOINT}${PREFIX}/country`
            ).then((response) => response.json());
            let sebo = [...response.data.list]
            let otra = [];
            sebo.map((item, index) => {
                sebo[index].label = item.description;
                
            })
            testing.map((item, index) => {
                otra.push(item);
            });
            setTesting(otra);
            setOptions(sebo)
        }

    }
   
    useEffect(() => {
        getInformation();
    }, []);

    return (
        <div name={name} className="col-6 mb-3">
            <label className="labelform" title={hint} >{label}</label>
            {required === true && !isLoading &&
                <Select
                    id={attribute}
                    name={label}
                    options={options}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isSearchable
                    required
                    defaultValue={value.length === 0 ? [] : value}
                />
            }
            {required === false && !isLoading &&
                <Select
                    id={attribute}
                    name={label}
                    options={options}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isSearchable
                    defaultValue={value.length === 0 ? [] : value}
                />
            }

        </div>

    )
}

export default Checkbox;