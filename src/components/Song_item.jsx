import React, { useState } from 'react'

export default function Song_item({ props, select }) {
    // const [checked, setChecked] = useState(props.ban);
    return (<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {props.id}
        </th>
        <td className="px-6 py-4 max-w-40 truncate">
            {props.title}
        </td>
        <td className="px-6 py-4 max-w-40 truncate text-blue-500">
            <a href={props.image} target="_blank">{props.image}</a>
        </td>
        <td className="px-6 py-4 max-w-40 truncate text-blue-500">
            <a href={props.link} target="_blank">{props.link}</a>
        </td>
        <td className="px-6 py-4 max-w-40 truncate">
            {props.username}
        </td>
        <td className="px-6 py-4 max-w-40 truncate">
            {props.album_title}
        </td>
        <td className="px-6 py-4 flex justify-center">
            <input
                type="radio"
                id={`react-option-${props.id}`}
                name='select_song'
                className="hidden peer"
                // checked={checked}
                onChange={() => {
                    select.setSelect(props.id)
                }}
            />
            <label
                htmlFor={`react-option-${props.id}`}
                className="flex items-center justify-center w-5 h-5 [box-shadow:0px_0px_0px_3px_#09F815] duration-300 hover:[box-shadow:0px_0px_0px_2px_#09F815] hover:translate-y-0.5 hover:translate-x-0.5 rounded-full cursor-pointer text-neutral-50 peer-checked:[box-shadow:0px_0px_0px_3px_#E90D0D] peer-checked:border-none peer-checked:hover:[box-shadow:0px_0px_0px_2px_#E90D0D] peer-checked:bg-neutral-50 peer-checked:text-gray-800"
            >
            </label>
        </td>
    </tr>);
}
