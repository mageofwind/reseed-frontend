import React from 'react';
import '../styles/ClientFormStyle.css';
import './styles/SigninStyles.css';
import "../../../styles/lightview.css";
import { DarkHeader } from "../components/DarkHeader";

export default function layout({children}: {children: React.ReactNode}) {
    return (
        <div className="lightBackground">
        <DarkHeader />
        <div className="container">
            {children}
        </div>
        </div>
    )
}
