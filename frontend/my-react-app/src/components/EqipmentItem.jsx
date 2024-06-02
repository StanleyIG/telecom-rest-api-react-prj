import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';


const EquipmentDetails = ({ token }) => {
    const [equipment, setEquipment] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();


    const isAuth = () => {
        return !!token;
    };

    const getHeaders = () => {
        if (isAuth()) {
            console.log('Авторизован', token)
            return {
                Authorization: 'Token ' + token,
            };
        }
        return {};
    };

    const headers = getHeaders();
    console.log(id);

    useEffect(() => {
        async function fetchEquipment() {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/equipments/${id}`,
                    { headers }
                );
                setEquipment(response.data);
            } catch (error) {
                console.error('Error fetching equipment', error);
            }
        }
        fetchEquipment();
    }, [id, token]);

    const handleDelete = async () => {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/equipments/${id}/`,
            { headers }
          );
          navigate('/'); 
        } catch (error) {
          console.error('ошибка удаления:', error);
        }
      };

    if (!equipment) {
        return <div>Нет такого оборудования</div>;
    }

    return (
        <div className="container">
            <table>
                <thead>
                    <tr>
                        <th className="table-header-cell">ID</th>
                        <th className="table-header-cell">Серийный номер</th>
                        <th className="table-header-cell">Тип оборудования</th>
                        <th className="table-header-cell">Примечание</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="table-data-cell">{equipment.id}</td>
                        <td className="table-data-cell">{equipment.serial_number}</td>
                        <td className="table-data-cell">{equipment.equipment_type}</td>
                        <td className="table-data-cell">{equipment.note}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={handleDelete}>Удалить оборудование</button>
        </div>
    );
};

export default EquipmentDetails;
