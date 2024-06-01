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
    const [id, setId] = useState('');
    const [data, setData] = useState([])
    const [data2, setData2] = useState({})
    const [title, setTitle] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [trackid, setTrackid] = useState('');
    const router = useRouter()
    const [warning, setWarning] = useState('');
    const imgRef = useRef<HTMLInputElement>(null)

    // useEffect hook to check user authentication and role when component mounts
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        const id = sessionStorage.getItem('id');
        // Check if user is logged in, has artist role, and if id is available in session storage
        if (username != null && role != null && id != null)
            if (role == 'artist') {
                setId(id);
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
                        // console.log(data);
                        setData(data) // Set fetched data for albums
                        // setLoading(false)
                    })
                    .catch((error) => { console.log(error) }) // Log any errors encountered during fetch

                // Fetch artist song details from the server
                fetch(`http://${ip}:3000/getArtistsong`, {
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
                        setData2(data[0]) // Set fetched song data
                        setTrackid(data[0]['albumid']) // Set the track ID
                        setTitle(data[0]['title']) // Set the song title
                        setLoading(false) // Update loading status
                    })
                    .catch((error) => { console.log(error) }) // Log any errors encountered during fetch
                return;
            }
        // Redirect to home if not artist
        router.push('/')
    }, [])

    // Function to handle song update
    async function update_butt() {
        // Get the album ID from the dropdown
        const albumid = window.document.getElementById('cars') as HTMLInputElement;
        console.log(data2)
        if (albumid != null && title.length != 0) {
            /* 
            // @ts-ignore */
            let name = data2['image']; // Get the current image URL
            setWarning('UPLOADING...') // Set a warning message for uploading status
            // Check if there is a new image file to upload
            if (imgRef.current?.files?.length) {
                //FIREBASE UPLOAD
                const img = imgRef.current.files[0] // Get the new image file

                // Delete the existing file in Firebase storage
                const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
                const desertRef = ref(storage, `music/${del_name}`);
                await deleteObject(desertRef).then(() => {
                    console.log(`DEL: music/${del_name}`)
                }).catch((error) => {
                    console.log(error)
                });

                // Prepare the new image file for upload
                name = img.name.split('.')[0] + img.lastModified + '.' + img.name.split('.')[1]
                console.log(img)
                console.log(name)

                // Upload the new image file to Firebase storage
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

            setLoading(true); // Set loading state to true

            // Send a request to update the song details on the server
            await fetch(`http://${ip}:3000/updateArtistsong`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                    "title": title,
                    "albumid": albumid.value,
                    "image": name,
                    "id": id,
                })
            })
                .then((res) => res.json()) // Return the promise from res.json()
                .then((data) => {
                    // Check if the update was successful
                    if (Object.keys(data[0]).length == 0)
                        setWarning('Update Failed') // Set warning message if update failed
                    else {
                        setData2(data[0]) // Update the state with new data
                        setWarning('Update successfully!') // Set success message
                    }
                    // setLoading(false)
                })
                .catch((error) => { console.log(error) }) // Log any errors encountered during fetch
            setTimeout(() => { setLoading(false) }, 1000) // Delay setting the loading state to false by 1 second
        }
        else
            setWarning('Please fill in everything') // Set warning message if validation fails
    }

    // Function to handle song deletion
    async function del_butt() {
        /* 
        // @ts-ignore */
        // Retrieve the current image URL from the state data
        const name = data2['image'];
        // Extract the file name from the image URL for deletion
        const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
        const desertRef = ref(storage, `music/${del_name}`);
        // Set loading state to true while deletion is in progress
        setLoading(true);
        // Delete the existing file from Firebase storage
        await deleteObject(desertRef).then(() => {
            console.log(`DEL: music/${del_name}`) 
        }).catch((error) => {
            console.log(error) // Log any errors encountered during deletion
        });

        await fetch(`http://${ip}:3000/delArtistsong`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                "id": id
            })
        })
            .then((res) => res.json()) // Return the promise from res.json()
            .then((data) => {
                setLoading(true); // Ensure loading state is true while processing response

                // Check if the deletion was successful
                if (Object.keys(data[0]).length == 0) {
                    setWarning('Delete Failed') // Set warning message if deletion failed
                    setTimeout(() => { setLoading(false) }, 1000) // Delay setting the loading state to false by 1 second
                }
                else {
                    setWarning('Delete successfully!') // Set success message
                    sessionStorage.removeItem('id') // Remove the ID from session storage
                    setTimeout(() => { router.back() }, 1000) // Navigate back to the previous page after 1 second
                }
                // setLoading(false)
            })
            .catch((error) => { console.log(error) }) // Log any errors encountered during fetch

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
                    <h1 className='text-white font-bold mb-4'>EDIT SONG</h1>
                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <input maxLength={50} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song Name" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />
                        <label htmlFor="cars" className='text-gray-200'>Song Album:</label>
                        <select name="cars" id="cars" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" defaultValue={trackid}>
                            {Array.from(data).map((item, index) => (
                                <option key={index} value={item['id']} >{item['title']}</option>
                            ))}
                            {/* <option value="volvo">Volvo</option> */}
                        </select>

                        <label htmlFor="file2" className='text-gray-300 mb-1'>Select image cover</label>
                        <input ref={imgRef} id='file2' type='file' className='text-gray-300' accept="image/*"></input>

                        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 mb-1 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={update_butt} type="submit">SUBMIT</button>

                        <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={del_butt} type="submit">DELETE</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
