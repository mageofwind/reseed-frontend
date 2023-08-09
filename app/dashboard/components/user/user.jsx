"use client";
import Image from "next/image"
import "./user.style.scss"
import ICONS from "@/assets/icons/icons"
import { useState } from "react";
import LogOutbtn from "@/components/logOutbtn"

export default function Userdiv({ data, controler, user }) {
    const [showLetter, setShowLetter] = useState(true)

    const showLetterName = () => {
        //TODO agregar letra de nombre si no hay imagen valida
        return "u"
    }

    const config = {
        "selected": data || 1,
        "name": user.nickname ?? "user",
        "img": user?.picture || showLetterName
    }

    const radioChange = e => controler(Number(e.target.value))

    return (
        <div tabIndex={50} id="user_container">
            <div id="user_image">
                <p>U</p>
            </div>
            <p id="user_name">{config.name}<Image src={ICONS.expand} alt="expand" width={20} height={20} /></p>
            <div id="user_dropdown">
                <ul>
                    <li>
                        <label htmlFor="prof1" className={`user_list ${config.selected === 10 ? "selected" : ""}`}>
                            <input type="radio" name="cat" id="prof1" value={10} onChange={e => radioChange(e)} />
                            <p>Personal Info</p>
                        </label>
                    </li>
                    <li>
                        <label htmlFor="prof2" className={`user_list ${config.selected === 11 ? "selected" : ""}`}>
                            <input type="radio" name="cat" id="prof2" value={11} onChange={e => radioChange(e)} />
                            <p>Email Settings</p>
                        </label>
                    </li>
                    <li>
                        <label htmlFor="prof3" className={`user_list ${config.selected === 12 ? "selected" : ""}`}>
                            <input type="radio" name="cat" id="prof3" value={12} onChange={e => radioChange(e)} />
                            <p>Data & Privacy</p>
                        </label>
                    </li>
                    <li className="user_logout_buton_jlcc">
                        <LogOutbtn />
                    </li>
                </ul>
            </div>
        </div>
    )
}