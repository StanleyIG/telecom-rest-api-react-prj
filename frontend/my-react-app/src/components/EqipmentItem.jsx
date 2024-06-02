import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EquipmentDetails = ({ token }) => {
  const [equipment, setEquipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedEquipment, setUpdatedEquipment] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const isAuth = () => {
    return !!token;
  };

  const getHeaders = () => {
    if (isAuth()) {
      return {
        Authorization: 'Token ' + token,
      };
    }
    return {};
  };

  const headers = getHeaders();

  useEffect(() => {
    async function fetchEquipment() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/equipments/${id}/`,
          { headers }
        );
        setEquipment(response.data);
        setUpdatedEquipment(response.data); // Инициализируем updatedEquipment
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
      console.error('Ошибка удаления:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (event) => {
    setUpdatedEquipment({
      ...updatedEquipment,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/equipments/${id}/`,
        updatedEquipment,
        { headers }
      );
      setEquipment(updatedEquipment);
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка обновления:', error);
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
      <button onClick={handleOpenModal}>Редактировать оборудование</button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать оборудование</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div>
              <label htmlFor="serial_number">Серийный номер:</label>
              <input
                type="text"
                id="serial_number"
                name="serial_number"
                value={updatedEquipment.serial_number}
                onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="equipment_type">Тип оборудования:</label>
                <input
                  type="text"
                  id="equipment_type"
                  name="equipment_type"
                  value={updatedEquipment.equipment_type}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="note">Примечание:</label>
                <textarea
                  id="note"
                  name="note"
                  value={updatedEquipment.note}
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Отмена
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Сохранить
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  export default EquipmentDetails;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';




// const EquipmentDetails = ({ token }) => {
//   const [equipment, setEquipment] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [updatedEquipment, setUpdatedEquipment] = useState({});
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const isAuth = () => {
//     return !!token;
//   };

//   const getHeaders = () => {
//     if (isAuth()) {
//     //   console.log('Авторизован', token);
//       return {
//         Authorization: 'Token ' + token,
//       };
//     }
//     return {};
//   };

//   const headers = getHeaders();
// //   console.log(id);

//   useEffect(() => {
//     async function fetchEquipment() {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/equipments/${id}/`,
//           { headers }
//         );
//         setEquipment(response.data);
//         setUpdatedEquipment(response.data); // Инициализируем updatedEquipment
//       } catch (error) {
//         console.error('Error fetching equipment', error);
//       }
//     }
//     fetchEquipment();
//   }, [id, token]);

//   const handleDelete = async () => {
//     try {
//       await axios.delete(
//         `http://127.0.0.1:8000/api/equipments/${id}/`,
//         { headers }
//       );
//       navigate('/');
//     } catch (error) {
//       console.error('Ошибка удаления:', error);
//     }
//   };

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleChange = (event) => {
//     setUpdatedEquipment({
//       ...updatedEquipment,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSave = async () => {
//     try {
//       await axios.patch(
//         `http://127.0.0.1:8000/api/equipments/${id}/`,
//         updatedEquipment,
//         { headers }
//       );
//       setEquipment(updatedEquipment);
//       handleCloseModal();
//     } catch (error) {
//       console.error('Ошибка обновления:', error);
//     }
//   };

//   if (!equipment) {
//     return <div>Нет такого оборудования</div>;
//   }

//   console.log(showModal);
//   return (
//     <div className="container">
//       <table>
//         <thead>
//           <tr>
//             <th className="table-header-cell">ID</th>
//             <th className="table-header-cell">Серийный номер</th>
//             <th className="table-header-cell">Тип оборудования</th>
//             <th className="table-header-cell">Примечание</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="table-data-cell">{equipment.id}</td>
//             <td className="table-data-cell">{equipment.serial_number}</td>
//             <td className="table-data-cell">{equipment.equipment_type}</td>
//             <td className="table-data-cell">{equipment.note}</td>
//           </tr>
//         </tbody>
//       </table>
//       <div class='group'> 
//       <button class="btn btn-danger" onClick={handleDelete}>Удалить оборудование</button>
//       <button class="btn btn-primary" onClick={handleOpenModal}>Редактировать оборудование</button>
//       </div>

//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={handleCloseModal}>
//               &times;
//             </span>
//             <h2>Редактировать оборудование</h2>
//             <form>
//               <div>
//                 <label htmlFor="serial_number">Серийный номер:</label>
//                 <input
//                   type="text"
//                   id="serial_number"
//                   name="serial_number"
//                   value={updatedEquipment.serial_number}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="equipment_type">Тип оборудования:</label>
//                 <input
//                   type="text"
//                   id="equipment_type"
//                   name="equipment_type"
//                   value={updatedEquipment.equipment_type}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="note">Примечание:</label>
//                 <textarea
//                   id="note"
//                   name="note"
//                   value={updatedEquipment.note}
//                   onChange={handleChange}
//                 />
//               </div>
//               <button type="button" onClick={handleSave}>
//                 Сохранить
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EquipmentDetails;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';


// const EquipmentDetails = ({ token }) => {
//     const [equipment, setEquipment] = useState(null);
//     // const [updatedEquipment, setUpdatedEquipment] = useState({});
//     const { id } = useParams();
//     const navigate = useNavigate();


//     const isAuth = () => {
//         return !!token;
//     };

//     const getHeaders = () => {
//         if (isAuth()) {
//             console.log('Авторизован', token)
//             return {
//                 Authorization: 'Token ' + token,
//             };
//         }
//         return {};
//     };

//     const headers = getHeaders();
//     console.log(id);

//     useEffect(() => {
//         async function fetchEquipment() {
//             try {
//                 const response = await axios.get(
//                     `http://127.0.0.1:8000/api/equipments/${id}`,
//                     { headers }
//                 );
//                 setEquipment(response.data);
//             } catch (error) {
//                 console.error('Error fetching equipment', error);
//             }
//         }
//         fetchEquipment();
//     }, [id, token]);

//     const handleDelete = async () => {
//         try {
//           await axios.delete(
//             `http://127.0.0.1:8000/api/equipments/${id}/`,
//             { headers }
//           );
//           navigate('/'); 
//         } catch (error) {
//           console.error('ошибка удаления:', error);
//         }
//       };

//       const handleEdit = () => {
//         // реализация редактирования оборудования
//     };

//     if (!equipment) {
//         return <div>Нет такого оборудования</div>;
//     }

//     return (
//         <div className="container">
//             <table>
//                 <thead>
//                     <tr>
//                         <th className="table-header-cell">ID</th>
//                         <th className="table-header-cell">Серийный номер</th>
//                         <th className="table-header-cell">Тип оборудования</th>
//                         <th className="table-header-cell">Примечание</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td className="table-data-cell">{equipment.id}</td>
//                         <td className="table-data-cell">{equipment.serial_number}</td>
//                         <td className="table-data-cell">{equipment.equipment_type}</td>
//                         <td className="table-data-cell">{equipment.note}</td>
//                     </tr>
//                 </tbody>
//             </table>
//             <button onClick={handleDelete}>Удалить оборудование</button>
//             <button onClick={handleEdit}>Редактировать оборудование</button>
//         </div>
//     );
// };

// export default EquipmentDetails;