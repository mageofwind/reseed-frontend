import React from "react";
import "./AuthHeader.css";
import Image from "next/image";
import Link from "next/link";
import LogOutbtn from "../../../../../components/logOutbtn";

export default function DarkHeader() {
    
  return (
    <div className="container ah_container_main">
      <div className="row">
        <Link href={"/"} className="col-10">
          <Image
            src={require("../../../../../assets/icons/logo_complete.svg")}
            className="au_logo_img"
            alt="Reseed logo"
          />
        </Link>
        <div className="col-2">
          <LogOutbtn />
        </div>
      </div>
    </div>
  );
}
