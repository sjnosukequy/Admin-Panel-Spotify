'use client'
import React, { useRef } from 'react'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../firebase/config'

// Define the component
export default function page() {
    // useRef hook to access the file input element
    const imgRef = useRef<HTMLInputElement>(null)

    // Function to handle file upload
    async function upload() {
        if (imgRef.current?.files?.length) {
            // Get the selected file
            const img = imgRef.current.files[0]
            // Generate a unique name for the file using its original name and last modified timestamp
            const name = img.name.split('.')[0] + img.lastModified + '.' + img.name.split('.')[1]
            console.log(img)
            // console.log(name)
            // Upload the file to Firebase storage
            const storageRef = ref(storage, `music/${name}`);
            await uploadBytes(storageRef, img).then((snapshot) => {
                console.log('up')
                console.log(snapshot);
                // Log the link to the uploaded image
                console.log(`image link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
                // console.log(`sound link: https://firebasestorage.googleapis.com/v0/b/fir-27651.appspot.com/o/music%2F${encodeURIComponent(name)}?alt=media`)
            });
        }
        else
            console.log("nu")
    }

    // Render the component
    return (
        <div className='p-3 bg-blue-700 h-screen flex flex-col justify-center items-center'>
            <form onSubmit={(e) => e.preventDefault()} className='flex flex-col border border-2 p-5 rounded'>

                <label htmlFor="file" className='text-white mb-1'>Select Song</label>
                <input ref={imgRef} id='file' type='file' className='text-white mb-4' accept="audio/*"></input>

                <label htmlFor="file2" className='text-white mb-1'>Select image cover</label>
                <input  id='file2' type='file' className='text-white' accept="image/*"></input>

                <button onClick={upload} className='mt-5 bg-black text-white border border-2' type='submit'> UPLOAD FILE</button>
            </form>
        </div>
    )
}
