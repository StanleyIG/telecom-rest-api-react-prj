import React from 'react'
//import App from '../App'

const EquipmentTypeItem = ({ type }) => {
    return (
        <tr>
            <td className="table-data-cell">
                {type.type_name}
            </td>
            <td className="table-data-cell">
                {type.serial_number_mask}
            </td>
        </tr>
    )
}

const EquipmentTypeList = ({ types }) => {
    return (
        <div className="container">
            <table>
                <th className="table-data-cell">
                    Название типа оборудования
                </th>
                <th className="table-data-cell">
                    Маска серийного номера
                </th>
                {types.map((type) => <EquipmentTypeItem type={type} />)}
            </table>
        </div>
    )
}

export default EquipmentTypeList