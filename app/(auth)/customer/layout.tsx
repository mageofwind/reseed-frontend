
import React from 'react'
import '../../styles/darkview.css'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}
