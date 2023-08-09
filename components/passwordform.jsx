"use client"
import React, { useState } from "react";

export default function PasswordForm({ account, setAccount }) {
    const [validate, setValidate] = useState(false)
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(false);


    const handleChange = event => {
        setEmail(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();

        setError(null);
        setAccount(true);

    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="password"
                    className="input_form_auth"
                    placeholder="Password"
                    aria-label="password"
                    // value={password}
                // onChange={handleChange}
                />
            </div>
            <div className="">
                <input
                    type="password"
                    className="input_form_auth"
                    placeholder="Confirm Password"
                    aria-label="password"
                    // value={password2}
                    // onChange={handleChange}
                />
            </div>
            <div className="btn_password_container">

                <button className="btn_signup btn_signin" type="submit">Create Password</button>

            </div>
        </form>
    )
}