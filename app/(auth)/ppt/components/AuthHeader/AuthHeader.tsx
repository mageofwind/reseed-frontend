import React from 'react';
import './AuthHeader.css';
import Image from 'next/image';
import Link from "next/link";

export default function AuthHeader() {
    return (
        <div className='container ah_container_main'>
            <div className='au_logo_title_container'>
                <Link href={"/"}>
                <Image
                    src={require('../../../../../assets/icons/reseed_logo_white.svg')}
                    className='au_logo_img'
                    alt='Reseed logo'
                />
                </Link>
            </div>
        </div>
    )
}
