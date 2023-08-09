import React from "react";


const Input = ({ type, label, hint, required, attribute, name = "", size }) => {
    return (
        <div className="col-6 mb-3">
            <label className="labelform" title={hint} >{label}</label>
            {required === true ?
                <input
                    title={hint}
                    id={attribute}
                    type="text"
                    className="inputs_forms"
                    aria-label={label}
                    name={name}
                    required
                /> :
                <input
                    title={hint}
                    id={attribute}
                    type="text"
                    className="inputs_forms"
                    aria-label={label}
                    name={name}
                />
            }

        </div>
    )
}

export default Input;