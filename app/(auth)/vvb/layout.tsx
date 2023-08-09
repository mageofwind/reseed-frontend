
import React from 'react'

import '../../styles/darkview.css'
import { AuthHeader } from './components'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}
 