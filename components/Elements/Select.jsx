import React, { useState, useEffect } from "react";
import axios from "axios"
import ls from '../../utils/localStorage/ls';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
const ESTRUCTUREPOINT = process.env.NEXT_PUBLIC_API_ESTRUCTURE;

const Select = ({ type, label, hint, required, attribute, typeList, name = "", userRole }) => {
    const [options, setOptions] = useState([])

    const getInformation = async () => {
            const response = await axios.get(`${ESTRUCTUREPOINT}/${userRole ?? 'pp'}/list?name=${typeList}`
            ).then((response) => response);
            setOptions(response.data.data.list)
    }

    useEffect(() => {
        getInformation();
    }, []);

    return (
        <div className="col-6 mb-3">
            <label className="labelform" title={hint} >{label}</label>
            {required === true ?
                <select
                    id={attribute}
                    className="inputs_forms"
                    aria-label={label}
                    name={name}
                    placeholder={label}
                    required
                >
                    {options?.length > 0 && options.map(
                        (option_item, i) =>
                            <option value={option_item.value} key={i}>{option_item.Description}</option>
                    )}
                </select>
                :
                <select
                    id={attribute}
                    className="inputs_forms"
                    aria-label={label}
                    name={name}
                    placeholder={label}
                >
                    {options.length > 0 && options.map(
                        (option_item, i) =>
                            <option value={option_item.value} key={i}>{option_item.description}</option>
                    )}
                </select>
            }
        </div>
    )
}
export default Select;