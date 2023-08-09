import React from "react";

const Date = ({ type, label, hint, required, attribute, name = "" }) => {
    return (
        <div className="col-6">
            <label className="labelform" title={hint} >{label}</label>
            {required === true ?
                <input
                    name={name}
                    id={attribute}
                    type={type}
                    className="inputs_forms"
                    required
                />
                :
                <input
                    name={name}
                    id={attribute}
                    type={type}
                    className="inputs_forms"
                />
            }
        </div>
    )
}

export default Date;