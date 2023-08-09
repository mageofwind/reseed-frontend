import React from 'react';
import '../styles/ClientFormStyle.css';
import '../signin/styles/SigninStyles.css';

export default function EmailPasswordLayout({children}: {children: React.ReactNode}) {
    return (
        <div className='layout_client_form_container'>
            {children}
        </div>
    )
}