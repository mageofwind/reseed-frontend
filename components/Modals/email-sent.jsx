import React, { useEffect, useState } from "react";
import Image from "next/image";
import './modals.css'
import Link from "next/link";

const EmailModal = ({ show, onClose }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        window.location.href = "signin";
        onClose();
    };

    return (
        <>
        {show ? 
        <div className="StyledModalOverlay">
        <div className="StyledModal">
            <div className="imageModal_top">
                <Image
                    src={require("../../assets/icons/emails.png")}
                    alt="Email Sent It"
                    width={134}
                    height={94}
                    
                />
            </div>
            <div className="StyledModalTitle">
                Success!
            </div>
            <div className="StyledModalBody">
                You will receipt an email containning  instructions to login.
            </div>
            <div className="btn_modal_container">
                <button className="btn_loginModal" onClick={handleCloseClick}>Go to Login</button>
            </div>
        </div>
    </div>
    :null
        }
        </>
    )

};

export default EmailModal;