import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Equipmentlist.css';
import { useRef } from 'react';
import chikSound from '../assets/chik.mp3';


// const EquipmentItem = ({ equipment }) => {
//   return (
//     <tr>
//       <td>{equipment.serial_number}</td>
//       <td>{equipment.equipment_type}</td>
//       <td>{equipment.note}</td>
//     </tr>
//   );
// };
const EquipmentItem = ({ equipment }) => {
  return (
    <tr>
      <td className="table-data-cell">{equipment.id}</td>
      <td className="table-data-cell">
        {/* {equipment.serial_number} */}
        <Link to={`/equipments/${equipment.id}`}>{equipment.serial_number}</Link>
      </td>
      <td className="table-data-cell">{equipment.equipment_type}</td>
      <td className="table-data-cell">{equipment.note}</td>
    </tr>
  );
};


const EquipmentList = ({ token }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [equipmentList, setEquipmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef(null);

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

  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePlayClick  =  ()  => {
    audioRef.current.play();
   };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        // const response = await axios.get(
        //   `http://127.0.0.1:8000/api/equipments/?offset=${(page - 1) * limit}&limit=${limit}&sn=${searchTerm}`,
        //   { headers }
        // );
        const response = await axios.get(
          `http://127.0.0.1:8000/api/equipments/?page=${page}&sn=${searchTerm}`,
          { headers }
        );
        const data = response.data;
        console.log(data.results);
        setEquipmentList(data.results);
        setTotalPages(Math.ceil(data.count / limit));
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 403) {
          setEquipmentList([]);
        }
      }
    };
    fetchEquipment();
  }, [page, limit, searchTerm, token]);

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
        {i}
      </button>
    );
  }

  return (
    <div className="container">
      <audio ref={audioRef} src={chikSound} />
      <div className="search"> 
        <h1>Поиск оборудования</h1>
        <input type="text" placeholder="введите серийный номер либо примечание" onChange={handleSearch} />
      </div>
      <table>
        <thead>
          <tr>
            <th className="table-header-cell">id</th>
            <th className="table-header-cell">Серийный номер</th>
            <th className="table-header-cell">Тип оборудования</th>
            <th className="table-header-cell">примечание</th>
          </tr>
        </thead>
        <tbody>
          {equipmentList.map((equipment) => (
            <EquipmentItem key={equipment.id} equipment={equipment} />
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        {/* <button onClick={handlePrevClick} disabled={page === 1} class="btn btn-primary"> */}
        <button onClick={() => { handlePrevClick(); handlePlayClick(); }} disabled={page === 1} class="btn btn-primary">
          назад
        </button>
        {/* {pageButtons} */}
        <span>{`страница ${page} / ${totalPages}`}</span>
        {/* <button onClick={handleNextClick} disabled={page === totalPages} class="btn btn-primary"> */}
        <button onClick={() => { handleNextClick(); handlePlayClick(); }} disabled={page === totalPages} class="btn btn-primary">
          вперёд
        </button>
        <p></p>
      </div>
    </div>
  );
};

export default EquipmentList;