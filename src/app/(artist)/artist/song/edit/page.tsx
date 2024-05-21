"use client";
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Nav_bar from '@/components/Nav_bar';
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../../../firebase/config'
import { error } from 'console';

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

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const role = sessionStorage.getItem('role');
        const id = sessionStorage.getItem('id');
        if (username != null && role != null && id != null)
            if (role == 'artist') {
                setId(id);
                fetch('http://localhost:3000/getArtistAlbums', {
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
                        setData(data)
                        // setLoading(false)
                    })
                    .catch((error) => { console.log(error) })

                fetch('http://localhost:3000/getArtistsong', {
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
                        setData2(data[0])
                        setTrackid(data[0]['albumid'])
                        setTitle(data[0]['title'])
                        setLoading(false)
                    })
                    .catch((error) => { console.log(error) })
                return;
            }
        router.push('/')
    }, [])

    async function update_butt() {
        const albumid = window.document.getElementById('cars') as HTMLInputElement;
        console.log(data2)
        if (albumid != null && title.length != 0) {
            /* 
            // @ts-ignore */
            let name = data2['image'];
            setWarning('UPLOADING...')
            if (imgRef.current?.files?.length) {
                //FIREBASE UPLOAD
                const img = imgRef.current.files[0]

                //DELTHE EXIST FILE
                const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
                const desertRef = ref(storage, `music/${del_name}`);
                await deleteObject(desertRef).then(() => {
                    console.log(`DEL: music/${del_name}`)
                }).catch((error) => {
                    console.log(error)
                });

                name = img.name.split('.')[0] + img.lastModified + '.' + img.name.split('.')[1]
                console.log(img)
                console.log(name)

                const storageRef = ref(storage, `music/${name}`);
                await uploadBytes(storageRef, img).then((snapshot) => {
                    console.log('UPLOAD')
                    console.log(snapshot);
                    console.log(`image link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
                    // console.log(`sound link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
                }).catch((error) => {
                    console.log(error);
                });
            }

            setLoading(true);

            await fetch('http://localhost:3000/updateArtistsong', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                    "title": title,
                    "albumid": albumid.value,
                    "image": `https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`,
                    "id": id,
                })
            })
                .then((res) => res.json()) // Return the promise from res.json()
                .then((data) => {
                    if (Object.keys(data[0]).length == 0)
                        setWarning('Update Failed')
                    else {
                        setData2(data[0])
                        setWarning('Update successfully!')
                    }
                    // setLoading(false)
                })
                .catch((error) => { console.log(error) })
            setTimeout(() => { setLoading(false) }, 1000)
        }
        else
            setWarning('Please fill in everything')
    }

    async function del_butt() {
        /* 
        // @ts-ignore */
        const name = data2['image'];
        //DELTHE EXIST FILE
        const del_name = decodeURI(name.split('music%2F')[1].split('?alt')[0])
        const desertRef = ref(storage, `music/${del_name}`);
        setLoading(true);
        await deleteObject(desertRef).then(() => {
            console.log(`DEL: music/${del_name}`)
        }).catch((error) => {
            console.log(error)
        });

        await fetch('http://localhost:3000/delArtistsong', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
                "id": id
            })
        })
            .then((res) => res.json()) // Return the promise from res.json()
            .then((data) => {
                setLoading(true);
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
            .catch((error) => { console.log(error) })

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
