"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import LoginForm from '../../../../components/loginForm';
 
export default function page() {
  return ( 
    <div className="passWordContainer">
      <div className="lightborderContainer signinContainer">
        <div className="icon_reseed_container_form">
          <p className="welcome_title_admin">Admin Sign-In</p>
        </div>
        <div className="loginFormContainer">
          <LoginForm />
        </div>
        <Link href={"/dashboard"}>
          <button className="btn_signup" type="submit">Direct to Dashboard</button>
        </Link>
        <div className="su_question">
          <Link href={"/admin/reset-password"}>
            <p className="signin_text">Forgot your password?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
