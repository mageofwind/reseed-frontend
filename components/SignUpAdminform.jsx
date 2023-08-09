"use client"
import React, { useState } from "react";
import Swal from 'sweetalert2'
import Link from "next/link";
import EmailModal from '../components/Modals/email-sent';

export default function SignUpAdminForm({ account, setAccount }) {
    const [ validate, setValidate ] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const logo = require('../assets/icons/emails.png');
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
        setShowModal(true);
      };

    return (
        <form onSubmit={handleSubmit}>
            <EmailModal onClose={() => setShowModal(false)} show={showModal} />
            <div className="row row-cols-1 g-3">
                <div className="col">
                    <input
                        type="text"
                        className="input_form_auth"
                        placeholder="First Name"
                        aria-label="First Name"
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="input_form_auth"
                        placeholder="Last Name"
                        aria-label="Last Name"
                    />
                </div>
                <div className="col">
                    <input
                        type="email"
                        className="input_form_auth"
                        placeholder="Email"
                        aria-label="Email"
                    />
                </div>

            </div>
            <div className="btn_signup_container">
                
                    <button className="btn_signup" type="submit">Sign Up</button>
                
            </div>
        </form>
    )
}
