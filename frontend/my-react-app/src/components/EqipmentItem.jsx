import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import choiceSound from '../assets/choice.mp3';


const EquipmentDetails = ({ token }) => {
  const [equipment, setEquipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updatedEquipment, setUpdatedEquipment] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const location = useLocation().pathname;

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
        setUpdatedEquipment(response.data); // инициализация updatedEquipment
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

  const handleDeleteModal = () => {
    setDeleteModal(true);
  }

  const handleDeleteModalPlayClick = () => {
    audioRef.current.play();
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
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
      if (error.response.status === 400) {
        // Отображение сообщения об ошибке в модальном окне
        alert('Такой серийный номер уже существует в базе либо он не прошёл валидацию');
      }
      if (error.response.status === 403) {
        alert('Необходимо пройти аутентификацию');
      }
      if (error.response.status === 500) {
        alert('Выбран не существующий тип оборудования');
      }
    }
  };

  if (!equipment) {
    return <div>Нет такого оборудования</div>;
  }

  return (
    <div className="container">
      <audio ref={audioRef} src={choiceSound} />
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
      <div className='group'>
        {/* <button className='btn btn-danger' onClick={handleDelete}>Удалить оборудование</button> */}
        {/* <button className='btn btn-danger' onClick={handleDeleteModal}>Удалить оборудование</button> */}
        <button className='btn btn-danger' onClick={() => { handleDeleteModal(); handleDeleteModalPlayClick() }}>Удалить оборудование</button>
        <button className='btn btn-primary' onClick={handleOpenModal}>Редактировать оборудование</button>
      </div>

      <Modal show={deleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Удалить оборудование</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>оборудование с серийным номером {equipment.serial_number} будет удалено</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            удалить
          </button>
          {/* <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
            отмена
          </button> */}
          <button type="button" className="btn btn-secondary" onClick={(e) => { handleCloseDeleteModal(); audioRef.current.pause(); }}>
            отмена
          </button>

        </Modal.Footer>
      </Modal>

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
                className="textarea-container"
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