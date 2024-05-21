"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Nav_bar from '../../../../components/Nav_bar'
import Album_item from '../../../../components/Album_item'

function Artist() {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [select, setSelect] = useState(null);
  const [warning, setWarning] = useState('');
  const router = useRouter();
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    if (username != null && role != null)
      if (role == 'artist') {
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
            console.log(data);
            setData(data)
            setLoading(false)
          })
        return;
      }
    router.push('/')
  }, [])

  function edit_butt() {
    if (select == null)
      setWarning('Please select a album');
    else {
      console.log(select)
      sessionStorage.setItem('id', select);
      router.push('/artist/album/edit')
    }
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
      <Nav_bar flag="false"></Nav_bar>
      <div className="flex flex-col items-center justify-center dark bg-black" style={{ height: '95vh' }}>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-red-400 font-bold mb-2">{warning}</h1>
          <h1 className="text-white font-bold mb-2">LIST OF ALBUMS</h1>

          <div className="shadow-md h-60 overflow-y-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 max-w-40">
                    id
                  </th>
                  <th scope="col" className="px-6 py-3 max-w-40">
                    title
                  </th>
                  <th scope="col" className="px-6 py-3 max-w-40">
                    image
                  </th>
                  <th scope="col" className="px-6 py-3 max-w-40">
                    info
                  </th>
                  <th scope="col" className="px-6 py-3">
                    select
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {Array.from(data).map((item, index) => (
                  <Album_item key={index} props={item} select={{ select, setSelect }}></Album_item>
                ))}
                {/* <UserItem props={test}></UserItem> */}

              </tbody>
            </table>
          </div>

          <div className="flex flex-row gap-4 mt-4 items-center justify-center">
            <button className="relative duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-56 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold" onClick={() => router.push('/artist/album/add')}>
              <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
              <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
              <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
              <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
              <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
              <p className="z-10">ADD ALBUM</p>
            </button>

            <button className="relative duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-56 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold" onClick={edit_butt}>
              <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
              <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
              <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
              <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
              <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
              <p className="z-10">EDIT ALBUM</p>
            </button>
          </div>
          <div className="w-full">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150 w-full" onClick={() => router.push('/artist/song')} >LIST OF SONGS</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Artist;
