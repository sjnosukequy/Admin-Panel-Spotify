"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { Dropdown } from "flowbite-react";

export default function Nav_bar(props) {
    const router = useRouter()
    // Check if the flag is true and convert it to a boolean
    const flag = (props.flag.toLowerCase?.() === 'true');
    // State hook to manage the username
    const [user, setUser] = useState('');

    // Function to sign out the user
    function Signout() {
        // Clear session storage and redirect to the home page
        sessionStorage.clear();
        router.push('/');
    }

    // Effect hook to set the username from session storage
    useEffect(() => {
        setUser(sessionStorage.getItem('username'))
    }, [])

    return (
        <nav className="bg-black px-5 pt-3 text-white flex top-0" style={{ height: '5vh' }}>
            {
                flag ? <button className="text-white" onClick={() => router.back()}>
                    <Image alt='back butt' src='/back.svg' width={25} height={25} />
                </button> : null
            }
            <div className="flex justify-end w-full">
                <Dropdown label={user} inline>
                    <Dropdown.Item className="bg-white" onClick={Signout}>Sign out</Dropdown.Item>
                </Dropdown>
            </div>

        </nav>
    )
}
