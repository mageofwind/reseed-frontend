import React from "react";

const Decimal = ({ type, label, hint, required, attribute, name = ""}) => {
    
    return (
        <div className="col-6 mb-3">
            <label className="labelform" title={hint} >{label}</label>
            {required === true ?
                <input
                    name={name}
                    id={attribute}
                    type="number"
                    className="inputs_forms"
                    aria-label={label}
                    required
                />
                :
                <input
                    name={name}
                    id={attribute}
                    type="number"
                    className="inputs_forms"
                    aria-label={label}
                />
            }
        </div>
    )
}

export default Decimal;