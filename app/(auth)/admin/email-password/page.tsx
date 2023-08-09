import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function EmailPasswordPage() {
  return (
    <div className="client_main_container_form_password">
      <div className="container">
        <div className="icon_reseed_container_form">
          <Image
            src={require("../../../../assets/icons/reseed_icon.svg")}
            alt="Reseed Icon"
            width={66}
            height={60}
            placeholder="blur"
            blurDataURL={"../../../../assets/icons/reseed_icon.svg"}
          />
          <p className="welcome_title_form_client">Forgot your Password?</p>
        </div>

        <div className="form_pass_container">
          <p className="email_text_recover text-center">
            An email is on its way to you. Follow the instructions to reset your
            password.
          </p>
          <p className="email_text_recover text-center">
            Do you have not received the mail? Try again
          </p>
          <div className="btn_resetpass_container">
            <Link href={"/"}>
              <button className="btn_signup btn_signin">Go to Home Page</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
