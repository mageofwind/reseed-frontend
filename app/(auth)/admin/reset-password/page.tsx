"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ForgotForm from "../../../../components/forgotpassForm";

export default function ResetPasswordPage() {
  const [ accountValidated, setAccountValidated ] = useState(false);
 
  return (
    <div className="passWordContainer">
      <div className="lightborderContainer signinContainer">
        <div className="icon_reseed_container_form">
          <p className="welcome_title_admin">Forgot your Password?</p>
        </div>
        
        {accountValidated ?
          <div className="form_pass_container">
            <p className="admin_text_recover text-center">
              An email is on its way to you. Follow the instructions to reset
              your password.
            </p>
            <p className="admin_text_recover text-center">
              Do you have not received the mail? <span className="tryAgain"><Link href={"/admin/reset-password"}>Try again</Link></span>
            </p>
            <div className="btn_resetpass_container">
              <Link href={"/"}>
                <button className="btn_signup btn_signin">
                  Go to Home Page
                </button>
              </Link>
            </div>
          </div>
          :
          <ForgotForm account={accountValidated} setAccount={setAccountValidated}/>
        }
      </div>
    </div>
  );
}
