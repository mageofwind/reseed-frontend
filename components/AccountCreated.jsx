import React from "react";
import Image from "next/image";

export default function AccountCreated({ setNewUser, newUser }) {

    return (

        <div className="newAccount">
            <div className="accountMain">
                <div className="icon_reseed_container_form">
                    <Image
                        src={require("../assets/icons/reseed_icon.svg")}
                        alt="Reseed Icon"
                        width={66}
                        height={60}
                        placeholder="blur"
                        blurDataURL={"../assets/icons/reseed_icon.svg"}
                    />
                </div>
                <div className="account_created_Container">
                    <p className="account_created_text text-center mt-4">
                        To complete the registration, continue to provide the following corporate information
                    </p>
                    <p className="account_created_text text-center mt-4">
                        To complete the registration, continue to provide the following corporate information
                    </p>
                    

                    <div className="btn_next_newAccount">
                        <button className="btn_signup btn_signin" onClick={() => setNewUser(false)}>Next to Continue</button>
                    </div>
                </div>
            </div>
        </div>

    );
}