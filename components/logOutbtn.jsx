"use client"
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Service from "@/utils/api/services";
import ls from "@/utils/localStorage/ls";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function LogOutbtn() {
    const [user, setUser] = useState ({});
    const router = useRouter();

    const informationAccount = async () => {
        let userResponse = ls.getStorage("user")
        if (userResponse) {
            setUser(userResponse);
        }
    }
    
    const handleSubmit = () => {
        Swal.fire({
            title: 'Log Out', 
            text: `Do you really want to close Session?`,
            icon: 'question',
            confirmButtonText: 'Yes i´m sure',
            showCloseButton: true,
            customClass:{
                confirmButton:'confirmBtn_modal',
                cancelButton: 'cancelBtn_modal',
                cancelButtonText:'canceltxt'
            }
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            console.log(result)
            if (result.isConfirmed) {
                if (user.role === 'pp'){
                    // router.push('/pp/signup')
                    // Service.User.logOut(user._id, user.token)
                    ls.removeStorage("user")
                    location.href = `${ENDPOINT}/v1/api/auth/logout`;

                }
                if (user.role === 'vvb'){
                    // router.push('/vvb/signup')
                    // Service.User.logOut(user._id, user.token)
                    ls.removeStorage("user")
                    location.href = `${ENDPOINT}/v1/api/auth/logout`;

                }
                if (user.role === 'admin'){
                    // router.push('/')
                    // Service.User.logOut(user._id, user.token)
                    ls.removeStorage("user")
                    location.href = `${ENDPOINT}/v1/api/auth/logout`;

                }
            } 
          })
        ;
    }

    useEffect(() => {
        informationAccount();
    }, []);

    return (
        <>
            <button className="logout_btn" onClick={() => handleSubmit()}>Log Out</button>
        </>
    )
}