import React, { useState } from 'react'

export default function User_item({ props, banList, unBanList }) {
    const [checked, setChecked] = useState(props.ban);
    return (<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {props.id}
        </th>
        <td className="px-6 py-4">
            {props.username}
        </td>
        <td className="px-6 py-4">
            {props.email}
        </td>
        <td className="px-6 py-4">
            {props.nickname}
        </td>
        <td className="px-6 py-4">
            <input
                type="checkbox"
                id={`react-option_${props.id}`}
                className="hidden peer"
                checked={checked}
                onChange={() => {
                    setChecked(!checked);
                    if (banList != null && unBanList != null) {
                        if (!checked) {
                            const unBan = Array.from(unBanList.unBanList).filter(item => item[0] != props.id)
                            unBanList.setUnBanList([...unBan])
                            banList.setBanList(old_array => [...old_array, [props.id]])
                        }
                        else {
                            const ban = Array.from(banList.banList).filter(item => item[0] != props.id)
                            banList.setBanList([...ban])
                            unBanList.setUnBanList(old_array => [...old_array, [props.id]])
                        }
                    }
                }}
            />
            <label
                htmlFor={`react-option_${props.id}`}
                className="flex items-center justify-center w-5 h-5 [box-shadow:0px_0px_0px_3px_#09F815] duration-300 hover:[box-shadow:0px_0px_0px_2px_#09F815] hover:translate-y-0.5 hover:translate-x-0.5 rounded-full cursor-pointer text-neutral-50 peer-checked:[box-shadow:0px_0px_0px_3px_#E90D0D] peer-checked:border-none peer-checked:hover:[box-shadow:0px_0px_0px_2px_#E90D0D] peer-checked:bg-neutral-50 peer-checked:text-gray-800"
            >
            </label>
        </td>
    </tr>);
}
