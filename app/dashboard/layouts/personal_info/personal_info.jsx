"use client";
import Image from "next/image"
import ICONS from "@/assets/icons/icons"
import personal_style from "./personal_info.module.scss"

export default function PersonalInfo ({ user }) {
    const config = {
        "name": user.nickname || "",
        "email": user.email || "",
        "img": user.picture || ICONS.camera,
    }

    return (
        <div id={personal_style["whiteContainer"]}>
            <div id={personal_style["sec1"]}>
                <h1>Personal Info</h1>
                <div>
                    <button className={personal_style["btn_cancel"]}>Cancel</button>
                    <button className={personal_style["btn_save"]}>Save</button>
                </div>
            </div>
            <hr />
            <div id={personal_style["sec2"]}>
                <div id={personal_style["photo_container"]}>
                    <p>Profile photo</p>
                    <div>
                        <div id={personal_style["photo"]}>
                            <Image src={config.img} width={30} height={30} alt="camera" />
                        </div>
                        <div id={personal_style["photo_btns"]}>
                            <button className={personal_style["upload"]}>Upload</button>
                            <button className={personal_style["reseat"]}>Reseat</button>
                        </div>
                    </div>
                </div>
                <ul id={personal_style["photo_form"]}>
                    <li>
                        <label htmlFor="">Name</label>
                        <input type="text" placeholder={config.name} />
                    </li>
                    <li>
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder={config.email} />
                    </li>
                </ul>
            </div>
            <hr />
            <div id={personal_style["pass_reset"]}>
                <h1>Password Reset</h1>
                <p>
                    Your password must included the following: 8 characters max, upper
                    & lowercase letters and at least one numer or special character.
                </p>
                <ul id={personal_style["photo_form"]}>
                    <li>
                        <label htmlFor="">Actual Password</label>
                        <input type="text" />
                    </li>
                    <li>
                        <label htmlFor="">Confirm Password</label>
                        <input type="text" />
                    </li>
                </ul>
            </div>
        </div>
    )
}