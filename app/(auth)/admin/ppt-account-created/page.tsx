import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PptAccountCreatedPage() {
  return (
    <div className="client_main_container_form_signin">
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
        </div>

        <div className="form_pass_container">
          <p className="account_created_text text-center mt-4">
          To complete the registration, continue to provide the following corporate information
          </p>
          
          <div className="btn_resetpass_container">
            <Link href={"/"}>
              <button className="btn_signup btn_signin">Next to Continue</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}