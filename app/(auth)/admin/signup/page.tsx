"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react"; 
import SignUpAdminForm from '../../../../components/SignUpAdminform';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export default function SignUpPage() {
  const [ accountValidated, setAccountValidated ] = useState(false);

  return (
    <div className="AdminsignUpContainer">
      <div className="lightborderContainer">
        <div className="icon_reseed_container_form">
         <p className="smalltitle">Sign Up</p>
          <p className="welcome_title_admin">Welcome to ReSeed</p>
        </div>
        <div className="SignFormContaier">
          <SignUpAdminForm account={accountValidated} setAccount={setAccountValidated} />
        </div>
        <div className="su_question">
          <p className="doyouhaveanaccount_text">Do you have an account?</p>
            <a className="signin_text" href={`${ENDPOINT}${PREFIX}/auth/login`}>Sign In</a>
        </div>
      </div>
    </div>
  );
}
