"use client";
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Nav_bar from '@/components/Nav_bar';
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../../../firebase/config'
import { error } from 'console';
import ip from '@/api/api';

export default function page() {
    // State hooks for managing form data, loading status, warnings, and info messages
    const [id, setId] = useState('');
    const [data2, setData2] = useState({})
    const [title, setTitle] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [info, setInfo] = useState('');
    const router = useRouter()
    const [warning, setWarning] = useState('');
    const imgRef = useRef<HTMLInputElement>(null)

    // useEffect hook to check user authentication and role when component mounts
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        const id = sessionStorage.getItem('id');
        // Check if user is logged in and has artist role
        if (username != null && role != null && id != null)
            if (role == 'artist') {
                setId(id);
                // Fetch artist album details
                fetch(`http://${ip}:3000/getArtistAlbum`, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify({
                        "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                        "id": id
                    })
                })
                    .then((res) => res.json()) // Return the promise from res.json()
                    .then((data) => {
                        console.log(data);
                        setData2(data[0]) // Set fetched data
                        setInfo(data[0]['info']) // Set album info
                        setTitle(data[0]['title']) // Set album title
                        setLoading(false) // Update loading status
                    })
                return;
            }
        // Redirect to home if not artist
        router.push('/')
    }, [])

    // Function to handle album update
    async function update_butt() {
        console.log(data2)

        if (title.length != 0) {
            setWarning('UPLOADING...')
            /* 
            // @ts-ignore */
            // Initialize image name
            let name = data2['image'];

            if (imgRef.current?.files?.length) {
                // If a new image is uploaded
                const img = imgRef.current.files[0]

                // Delete the existing file from Firebase storage
                const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
                const desertRef = ref(storage, `music/${del_name}`);
                await deleteObject(desertRef).then(() => {
                    console.log(`DEL: music/${del_name}`)
                }).catch((error) => {
                    console.log(error)
                });

                // Prepare the new image name and upload to Firebase
                name = img.name.split('.')[0] + img.lastModified + '.' + img.name.split('.')[1]
                console.log(img)
                console.log(name)

                const storageRef = ref(storage, `music/${name}`);
                await uploadBytes(storageRef, img).then((snapshot) => {
                    console.log('UPLOAD')
                    console.log(snapshot);
                    console.log(`image link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
                    name = `https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`
                    // console.log(`sound link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
                }).catch((error) => {
                    console.log(error);
                });
            }

            setLoading(true);

            // Send updated album details to the server
            await fetch(`http://${ip}:3000/updateArtistAlbum`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                    "title": title,
                    "userid": sessionStorage.getItem('userid'),
                    "image": name,
                    "info": info,
                    "id": id,
                })
            })
                .then((res) => res.json()) // Return the promise from res.json()
                .then((data) => {
                    if (Object.keys(data[0]).length == 0)
                        setWarning('Update Failed')
                    else {
                        setData2(data[0]) // Update state with new data
                        setWarning('Update successfully!')
                    }
                    // setLoading(false)
                }).catch((error) => {
                    console.log(error)
                })
            setTimeout(() => { setLoading(false) }, 1000)
        }
        else {
            setWarning('TITLE MUST NOT BE EMPTY!')
        }
    }

    // Function to handle album deletion
    async function del_butt() {
        /* 
        // @ts-ignore */
        const name = data2['image'];
        // Delete the existing file from Firebase storage
        const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
        const desertRef = ref(storage, `music/${del_name}`);
        setLoading(true);
        await deleteObject(desertRef).then(() => {
            console.log(`DEL: music/${del_name}`)
        }).catch((error) => {
            console.log(error)
        });

        // Send delete request to the server
        await fetch(`http://${ip}:3000/delArtistAlbum`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                "id": id
            })
        })
            .then((res) => res.json()) // Return the promise from res.json()
            .then((data) => {
                if (Object.keys(data[0]).length == 0) {
                    setWarning('Delete Failed')
                    setTimeout(() => { setLoading(false) }, 1000)
                }
                else {
                    setWarning('Delete successfully!')
                    sessionStorage.removeItem('id')
                    setTimeout(() => { router.back() }, 1000)
                }
                // setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setTimeout(() => { setLoading(false) }, 1000)
            })

    }

    if (isLoading) return (

        <div className="flex-col gap-4 w-full h-screen flex items-center justify-center bg-black">
            <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className="animate-ping">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
                </svg>
            </div>
        </div>
    )

    return (
        <div>
            <Nav_bar flag="true"></Nav_bar>
            <div className="flex flex-col items-center justify-center dark bg-black" style={{ height: '95vh' }}>
                <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                    <h1 className='text-red-400 font-bold mb-4'>{warning}</h1>
                    <h1 className='text-white font-bold mb-4'>EDIT ALBUM</h1>
                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <input maxLength={50} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song Name" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />

                        <input maxLength={50} value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Info" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />

                        <label htmlFor="file2" className='text-gray-300 mb-1'>Select image cover (you can skip this)</label>
                        <input ref={imgRef} id='file2' type='file' className='text-gray-300' accept="image/*"></input>

                        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 mb-1 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={update_butt} type="submit">SUBMIT</button>

                        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={del_butt} type="submit">DELETE</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
