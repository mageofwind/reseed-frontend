import React from 'react';
import '../styles/ClientFormStyle.css';
import '../../../styles/darkview.css';
import { AuthHeader } from '../components/AuthHeader';

export default function layout({children}: { children: React.ReactNode }) {
    return (
        <div className='darkBackground'>
            <AuthHeader />
            <div className='container'>
                {children}
            </div>
        </div>
    )
}