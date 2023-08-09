'use client'

import React, { useEffect } from 'react';
import "./styles/HomePage.css";
import Link from "next/link";
import Image from "next/image";
import { AuthHeader } from "./(auth)/pp/components";
import ls from '@/utils/localStorage/ls';

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;

export default function HomePage() {

  useEffect(() => {
    ls.removeStorage('user');
  }, []);

  return (
      <div className="Home_Container">
        <AuthHeader />
        <div className="interContainer">
          <div className=" borderContainer">
            <div className="icon_reseed_container_form_home">
              <Image
                src={require("../assets/icons/reseed_light.svg")}
                alt="Reseed Icon"
                width={66}
                height={60}
                placeholder="blur"
                blurDataURL={"../assets/icons/reseed_light.svg"}
              />
              <p className="welcome_title">Select Account Type</p>
            </div>

            <div className="btn_companie_container">
              
              <Link href={"/pp/signup"}>
                <button className="btn_homePage">Project Proponent</button>
              </Link>
            </div>
            <div className="btn_companie_container">
              <Link href={"/vvb/signup"}>
                <button className="btn_homePage">Validator/Verifier</button>
              </Link>
            </div>
            <div className="btn_companie_container">
              <Link href={"/customer/signup"}>
                <button className="btn_homePage">Customer</button>
              </Link>
            </div>
            <div className="btn_companie_container">
              <Link href={`${ENDPOINT}${PREFIX}/auth/login`}>
                <button className="btn_homePage">ReSeed Admin</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
