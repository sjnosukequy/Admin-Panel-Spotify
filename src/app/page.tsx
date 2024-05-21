"use client";
import Image from "next/image";
import { Inter, Lexend } from "next/font/google";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";


export default function Home() {
  const [role, setRole] = useState('');
  const [warning, setWarning] = useState('');
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const router = useRouter()

  async function auth() {
    if (userName == '' && passWord == '') {
      setWarning('Please fill in everything')
      return;
    }
    if (role == 'Admin') {
      await fetch('http://localhost:3000/getAdmin', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({
          "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
          "username": userName,
          "password": passWord
        })
      })
        .then((res) => res.json()) // Return the promise from res.json()
        .then((data) => {
          console.log(data);
          if (Object.keys(data[0]).length != 0) {
            if (data[0]['ban']) {
              setWarning('SORRY YOUT ACCOUNT IS BANNED OR DELETED')
              console.log('bannn')
              return;
            }
            sessionStorage.setItem('username', data[0]['username'])
            sessionStorage.setItem('role', data[0]['role'])
            router.push('/admin')
          }
          else {
            sessionStorage.clear();
            setWarning('Wrong email/username or password')
          }
        })
    }
    else if (role == 'Artist') {
      await fetch('http://localhost:3000/getArtist', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({
          "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
          "username": userName,
          "password": passWord
        })
      })
        .then((res) => res.json()) // Return the promise from res.json()
        .then((data) => {
          console.log(data);
          if (Object.keys(data[0]).length != 0) {
            if (data[0]['ban']) {
              setWarning('SORRY YOUT ACCOUNT IS BANNED OR DELETED')
              console.log('bannn')
              return;
            }
            sessionStorage.setItem('username', data[0]['username'])
            sessionStorage.setItem('role', data[0]['role'])
            sessionStorage.setItem('userid', data[0]['id'])
            router.push('/artist/album')
          }
          else {
            sessionStorage.clear();
            setWarning('Wrong email/username or password')
          }
        })
    }
    else
      setWarning('Please Choose Admin/Artist Login')
  }

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    if (username != null && role != null)
      if (role == 'admin')
        router.push('/admin')
      else if (role == 'artist')
        router.push('/artist/album')
  }, [])

  async function upArtist() {
    if (userName == '' && passWord == '') {
      setWarning('Please fill in everything')
      return;
    }
    await fetch('http://localhost:3000/upArtist', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({
        "key": "8/k0Y-EJj5S>#/OIA>XB?/q7}",
        "username": userName,
        "password": passWord
      })
    })
      .then((res) => res.json()) // Return the promise from res.json()
      .then((data) => {
        console.log(data);
        if (Object.keys(data[0]).length != 0) {
          if (data[0]['ban']) {
            setWarning('SORRY YOUT ACCOUNT IS BANNED OR DELETED')
            console.log('bannn')
            return;
          }
          sessionStorage.setItem('username', data[0]['username'])
          sessionStorage.setItem('role', data[0]['role'])
          sessionStorage.setItem('userid', data[0]['user_id'])
          router.push('/artist/album')
        }
        else {
          sessionStorage.clear();
          setWarning('CANNOT UPGRADE TO ARTIST')
        }
      })
  }


  return (
    <main>

      <div className="flex flex-col items-center justify-center h-screen dark bg-black">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-s font-bold text-red-600 mb-4">{warning}</h2>
          <h2 className="text-2xl font-bold text-gray-200 mb-4">LOG IN TO MUZZIX</h2>

          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <input value={userName} onChange={(value) => setUserName(value.target.value)} placeholder="Email or Username" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />
            <input value={passWord} onChange={(value) => setPassWord(value.target.value)} placeholder="Password" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="password" />

            <div className="flex flex-row gap-4">
              <div onClick={() => { setRole('Artist'); const a = document.getElementById('Artist') as HTMLInputElement; a.checked = true; }} className="flex flex-row cursor-pointer">
                <input type="radio" id="Artist" name="role" value="Artist" className="cursor-pointer me-2" />
                <label htmlFor="html" className="text-gray-50 cursor-pointer">Artist</label>
              </div>
              <div onClick={() => { setRole('Admin'); const a = document.getElementById('Admin') as HTMLInputElement; a.checked = true; }} className="flex flex-row cursor-pointer">
                <input type="radio" id="Admin" name="role" value="Admin" className="cursor-pointer me-2" />
                <label htmlFor="Admin" className="text-gray-50 cursor-pointer">Admin</label>
              </div>
            </div>

            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" type="submit" onClick={auth}>LOG IN</button>

            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150" onClick={upArtist}>UPGRADE TO ARTIST</button>
          </form>
          {/* <button className="bg-gray-700 p-2" onClick={() => router.push('/admin')}>{role}</button> */}
          {/* <div className="flex justify-center mt-4">
            <a className="text-sm text-gray-400 hover:underline" href="#">Privacy Policy</a>
          </div> */}
        </div>
      </div>

    </main>
  );
}
