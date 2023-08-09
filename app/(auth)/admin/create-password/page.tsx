"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react"; 

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
          <p className="welcome_title_form_client">Create Password?</p>
        </div>
        <p className="si_bottom_text text-center">
          Your password must included the following: 8 characters max, upper &
          lowercase letters and at least one numer or special character.
        </p>
        <div className="form_pass_container">
          <PasswordForm account={accountValidated} setAccount={setAccountValidated} />
          <div className="btn_password_container">
            <Link href={"/vvb/ppt-account-created"}>
            <button className="btn_signup btn_signin">Create Password</button>
            </Link>
          </div>
          <div className="su_question">
            <p className="doyouhaveanaccount_text">Do you have an account ? </p>
            <Link href={"/vvb/signin"}>
              <p className="signin_text">Sign In</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
