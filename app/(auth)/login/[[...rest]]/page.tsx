import { SignIn } from '@clerk/nextjs'

import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <div className='flex items-center justify-center h-screen'>
            <SignIn fallbackRedirectUrl="/dashboard" />
        </div>
    )
}

export default page