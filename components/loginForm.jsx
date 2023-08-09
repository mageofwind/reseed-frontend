"use client"
import React, { useState } from "react";
import Link from "next/link";
import { AdminLogin, userInfo } from "@/app/(auth)/admin/services/approval.service";
import { useRouter } from 'next/navigation';

export default function LogInForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    const handleChange = event => {
        setEmail(event.target.value);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        AdminLogin()
      };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input
                    type="text"
                    className="input_form_auth"
                    placeholder="Email"
                    aria-label="Email"
                />
            </div>
            <div className="">
                <input
                    type="password"
                    className="input_form_auth"
                    placeholder="Password"
                    aria-label="Password"
                />
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
            <div className="btn_login_container">
                <div className="loginbtn">
                    <button className="btn_signup" type="submit">Continue</button>
                </div>
            </div>
        </form>
    )
}
