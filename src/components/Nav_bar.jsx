"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { Dropdown } from "flowbite-react";

export default function Nav_bar(props) {
    const router = useRouter()
    const flag = (props.flag.toLowerCase?.() === 'true');
    const [user, setUser] = useState('');

    function Signout() {
        sessionStorage.clear();
        router.push('/');
    }

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
