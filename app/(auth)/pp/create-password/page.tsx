"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 

import PasswordForm from '../../../../components/passwordform'

export default function Page() {
  const [ accountValidated, setAccountValidated ] = useState(false);
  return (
    <div className="passWordContainer">
      <div className="borderContainer">
        <div className="icon_reseed_container_form">
          <Image
            src={require("../../../../assets/icons/reseed_light.svg")}
            alt="Reseed Icon"
            width={66}
            height={60}
            placeholder="blur"
            blurDataURL={"../../../../assets/icons/reseed_icon.svg"}
          />
        </div>
        {accountValidated ?
          <div className="form_pass_container">
          <p className="account_created_text text-center mt-4">
          To complete the registration, continue to provide the following corporate information
          </p>
          
          <div className="btn_resetpass_container">
            <Link href={"pp/approval/"}>
              <button className="btn_signup btn_signin">Next to Continue</button>
            </Link>
          </div>
        </div>
        :
        <div>
          <p className="welcome_title_form_client">Create Password?</p>
        <p className="si_bottom_text text-center">
          Your password must included the following: 8 characters max, upper &
          lowercase letters and at least one numer or special character.
        </p>
        <div className="form_pass_container">
          <PasswordForm account={accountValidated} setAccount={setAccountValidated} />
          
          <div className="su_question">
            <p className="doyouhaveanaccount_text">Do you have an account ? </p>
            <Link href={"/pp/signin"}>
              <p className="signin_text">Sign In</p>
            </Link>
          </div>
        </div>
        </div>
        }
      </div>
    </div>
  );
}
