"use client"
import React, { useState } from "react";
import Swal from 'sweetalert2';
import Link from "next/link";

export default function SignUpForm({ signupSubmit, values, setValues }) {
    
    const handleSubmit = event => {
        event.preventDefault();
        if (values.email.trim() === "" || values.password.trim() === "" || values.retype_password.trim() === "" || values.company_legal_name.trim() === "") return Swal.fire({
            title: 'Empty spaces',
            text: 'Please verify the form and complete all spaces.',
            icon: 'warning',
            timer: 3000,
            showConfirmButton: false,
        });
        if (values.password !== values.retype_password) return Swal.fire({
            title: 'Error in Password',
            text: 'The Password and Confirm Password doesn´t match.',
            icon: 'warning',
            timer: 3000,
            showConfirmButton: false,
        });
        signupSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row row-cols-1 g-3">
                <div className="col">
                    <input
                        type="email"
                        className="input_form_auth"
                        placeholder="Email"
                        aria-label="Email"
                        value={values.email}
                        onChange={(e) => setValues({ ...values, ['email']: e.target.value })}
                    />
                </div>
                <div className="col">
                    <input
                        type="text"
                        className="input_form_auth"
                        placeholder="Company name"
                        aria-label="Company name"
                        value={values.company_legal_name}
                        onChange={(e) => setValues({ ...values, ['company_legal_name']: e.target.value })}
                    />
                </div>
                <div className="col">
                    <input
                        type="password"
                        className="input_form_auth"
                        placeholder="Password"
                        aria-label="Password"
                        value={values.password}
                        onChange={(e) => setValues({ ...values, ['password']: e.target.value })}
                    />
                </div>
                <div className="col">
                    <input
                        type="password"
                        className="input_form_auth"
                        placeholder="Confirm Password"
                        aria-label="Confirm Password"
                        value={values.retype_password}
                        onChange={(e) => setValues({ ...values, ['retype_password']: e.target.value })}
                    />
                </div>
            </div>
            <div className="su_question si_more_margin_top">
                <p className="si_bottom_text">
                    By continuing, you are accepting our {" "}
                    <Link className="si_termofusespan" href={"/"}>
                        Terms of Use {" "}
                    </Link>
                    and our{" "}
                    <Link className="si_termofusespan" href={"/"}>
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="btn_signup_container">
                <button className="btn_signup" type="submit">Sign Up</button>
            </div>
        </form>
    )
}
