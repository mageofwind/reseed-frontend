"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ForgotForm from "../../../../components/forgotpassForm";

export default function ResetPasswordPage() {
  const [ accountValidated, setAccountValidated ] = useState(false);
 
  return (
    <div className="passWordContainer">
      <div className="borderContainer forgotForm">
        <div className="icon_reseed_container_form">
          <Image
            src={require("../../../../assets/icons/reseed_light.svg")}
            alt="Reseed Icon"
            width={66}
            height={60}
            placeholder="blur"
            blurDataURL={"../../../../assets/icons/reseed_light.svg"}
          />
          <p className="welcome_title_form_client">Forgot your Password?</p>
        </div>
        
        {accountValidated ?
          <div className="form_pass_container">
            <p className="email_text_recover text-center">
              An email is on its way to you. Follow the instructions to reset
              your password.
            </p>
            <p className="email_text_recover text-center">
              Do you have not received the mail? <span className="tryAgain"><Link href={"/vvb/reset-password"}>Try again</Link></span>
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
