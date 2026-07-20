import React from 'react'
import Navigation from '@/components/site/navigation'

const layout = ({children} : {children: React.ReactNode}) => {  
    return <main className='h-screen w-screen bg-background text-foreground'>
        <Navigation />
        {children}
    </main>
}

export default layout