"use client";
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Nav_bar from '@/components/Nav_bar';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../../../firebase/config'
import { error } from 'console';
import ip from '@/api/api';

export default function page() {
    const [data, setData] = useState([])
    const [title, setTitle] = useState('')
    const [isLoading, setLoading] = useState(true)
    const router = useRouter()
    const [warning, setWarning] = useState('');
    const imgRef = useRef<HTMLInputElement>(null)
    const songRef = useRef<HTMLInputElement>(null)

    // useEffect hook to check user authentication and role when component mounts
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        // Check if user is logged in and has artist role
        if (username != null && role != null)
            if (role == 'artist') {
                // Fetch artist albums from the server
                fetch(`http://${ip}:3000/getArtistAlbums`, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json',
                    }, body: JSON.stringify({
                        "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                        "username": username
                    })
                })
                    .then((res) => res.json()) // Return the promise from res.json()
                    .then((data) => {
                        console.log(data);
                        setData(data) // Set fetched data
                        setLoading(false) // Update loading status
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                return;
            }
        // Redirect to home if not artist
        router.push('/')
    }, [])

    // Function to handle adding a new track
    async function addTrack() {
        const albumid = window.document.getElementById('cars') as HTMLInputElement;
        // Check if all required fields are filled
        if (albumid != null && title.length != 0 && imgRef.current?.files?.length && songRef.current?.files?.length) {
           
            // Firebase upload for image
            const img = imgRef.current.files[0]
            const img_name = img.name.split('.')[0] + img.lastModified + '.' + img.name.split('.')[1]
            // Firebase upload for song
            const song = songRef.current.files[0]
            const song_name = song.name.split('.')[0] + song.lastModified + '.' + song.name.split('.')[1]

            setLoading(true);
            
            console.log(img)
            // console.log(name)

            // Upload image to Firebase storagev
            const storageRef = ref(storage, `music/${img_name}`);
            await uploadBytes(storageRef, img).then((snapshot) => {
                console.log('up')
                console.log(snapshot);
                console.log(`image link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(img_name)}?alt=media`)
                // console.log(`sound link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
            }).catch((error) => {
                console.log(error)
            });
          
            // Upload song to Firebase storage
            const storageRef2 = ref(storage, `music/${song_name}`);
            await uploadBytes(storageRef2, song).then((snapshot) => {
                console.log('up')
                console.log(snapshot);
                // console.log(`image link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(song_name)}?alt=media`)
                console.log(`sound link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(song_name)}?alt=media`)
            }).catch((error) => {
                console.log(error)
            });

            // Add the new track to the server
            await fetch(`http://${ip}:3000/addArtistsong`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                    "title": title,
                    "albumid": albumid.value,
                    "image": `https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(img_name)}?alt=media`,
                    "link": `https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(song_name)}?alt=media`,
                    "userid": sessionStorage.getItem('userid')
                })
            })
                .then((res) => res.json()) // Return the promise from res.json()
                .then((data) => {
                    // Check if the response data is empty
                    if (Object.keys(data[0]).length == 0) {
                        setWarning('Add Failed') // Set a warning message if the addition failed
                        setTimeout(() => { setLoading(false) }, 1000) // Delay setting the loading state to false by 1 second
                    }
                    else {
                        console.log(data) // Log the response data if the addition succeeded
                        setWarning('Add successfully!') // Set a success message
                        setTimeout(() => { router.back() }, 1000) // Navigate back to the previous page after 1 second
                    }
                    // setLoading(false)
                })
                .catch((error) => {
                    console.log(error) // Log any errors encountered during the fetch
                    setTimeout(() => { setLoading(false) }, 1000) // Delay setting the loading state to false by 1 second in case of an error
                })
        }
        else
            // Show warning if not all fields are filled
            setWarning('Please fill in everything')
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
                    <h1 className='text-white font-bold mb-4'>SUBMIT A SONG</h1>
                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <input maxLength={50} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song Name" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />

                        <label htmlFor="cars" className='text-gray-200'>Song Album:</label>
                        <select name="cars" id="cars" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150">
                            {Array.from(data).map((item, index) => (
                                <option key={index} value={item['id']} >{item['title']}</option>
                            ))}
                            {/* <option value="volvo">Volvo</option> */}
                        </select>

                        <label htmlFor="file" className='text-gray-300 mb-1'>Select Song</label>
                        <input ref={songRef} id='file' type='file' className='text-gray-300 mb-4' accept="audio/*"></input>

                        <label htmlFor="file2" className='text-gray-300 mb-1'>Select image cover</label>
                        <input ref={imgRef} id='file2' type='file' className='text-gray-300' accept="image/*"></input>

                        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={addTrack} type="submit">SUBMIT</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
