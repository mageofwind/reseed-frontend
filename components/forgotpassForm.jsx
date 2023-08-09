"use client"
import React, { useState } from "react";
import Link from "next/link";

export default function ForgotForm({ account, setAccount }) {
    const [ validate, setValidate ] = useState(false)
    
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleChange = event => {
        setEmail(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
    
        setError(null);
    
        if (isValidEmail(email)) {
          setValidate(true);
          setAccount(true);
        } else {
          setError(true);
          console.log('The email is invalid');
        }
      };

    return (
        <div>
            <p className="si_bottom_text text-center">
                Please enter your email to recover your password. We will send you an
                email to your email with the steps to access
            </p>
            {error &&
                <div className="invalidEmail">
                    <span className="invalidText">Invalid email</span>

                </div>
            }
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                
                <input
                    type="email"
                    className="input_form_auth"
                    placeholder="Email"
                    aria-label="Email"
                    value={email}
                    onChange={handleChange}
                />
                
            </div>
            <div className="form_pass_container">
                <div className="btn_resetpass_container">

                    <button className="btn_signup btn_signin" type="submit">Reset Password</button>

                </div>
            </div>
            </form>
        </div>

    )
}
