import React from 'react';
//import logo from './logo.svg';
import './App.css';
import './Menu.css';
//import Menu from './components/Menu'
import EquipmentList from './components/Equipment.jsx';
import EquipmentForm from './components/EquipmentForm.jsx';
import EquipmentDetails from './components/EqipmentItem.jsx';
import LoginForm from './components/LoginForm.jsx';
import Menu from './components/Menu.jsx';
import EquipmentTypeList from './components/EquipmentType.jsx';
import axios from 'axios'
import { HashRouter, BrowserRouter, Route, Link, Navigate, Routes, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';



const NotFound = () => {
  let { pathname } = useLocation()

  return (
    <div>
      Page "{pathname}" not found
    </div>
  )

}


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'equipments': [],
      'equipments_type': [],
      'users': [],
      'token': '',
      'redirect': false,
      'apiResponse': null
    }
  }


  deleteEquipment(equipId) {
    let headers = this.getHeaders()

    axios
      .delete(`http://127.0.0.1:8000/api/equipments/${equipId}`, { headers })
      .then(response => {
        this.setState({
          'equipments': this.state.equipments.filter((equipment) => equipment.id != equipId)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  // createEquipment(equipmentType, serialNumber, note) {
  //   let headers = this.getHeaders()

  //   axios
  //     .post('http://127.0.0.1:8000/api/equipments/', {
  //       'equipment_type': equipmentType,
  //       'serial_number': serialNumber,
  //       'note': note,
  //     }, { headers })
  //     .then(response => {
  //       this.setState({
  //         apiResponse: response.data,
  //         redirect: '/' // Перенаправление на домашнюю страницу после успеха
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }
  // createEquipment(equipmentType, serialNumber, note) {
  //           let headers = this.getHeaders()

  //           axios
  //               .post('http://127.0.0.1:8000/api/equipments/', {'equipment_type': equipmentType, 'serial_number': serialNumber, 'note': note}, {headers})
  //               .then(response => {
  //                   this.setState({
  //                     // 'redirect': '/'
  //                   }, this.getData)
  //               })
  //               .catch(error => {
  //                   console.log(error)
  //               })
  //       }

  async createEquipment(equipmentType, bulkSerialNumbersArray, note) {
    let headers = this.getHeaders()
  
    try {
      const response = await axios
        .post('http://127.0.0.1:8000/api/equipments/', { 'equipment_type': equipmentType, 'serial_number': bulkSerialNumbersArray, 'note': note }, { headers });
      return response.data;
    } catch (error) {
      console.log(error);
      return await Promise.reject(error);
    }
  }
  

  obtainAuthToken(login, password) {
    //console.log('obtainAuthToken', login, password)
    axios
      .post('http://127.0.0.1:8000/auth/token/login/', {
        'username': login,
        'password': password
      })
      .then(response => {
        const token = response.data.auth_token
        console.log('token:', token)
        localStorage.setItem('token', token)

        this.setState({
          'token': token,
          'redirect': '/'
        }, this.getData)
      })
      .catch(error => console.log(error))
  }


  isAuth() {
    return !!this.state.token
  }


  componentDidMount() {
    let token = localStorage.getItem('token')
    this.setState({
      'token': token
    }, this.getData)
  }

  getHeaders() {
    if (this.isAuth()) {
      return {
        'Authorization': 'Token ' + this.state.token
      }
    }

    return {}
  }

  getData() {
    this.setState({
      'redirect': false
    })

    let headers = this.getHeaders()

    axios.get('http://127.0.0.1:8000/api/equipments/', { headers })
      .then(response => {
        const equipments = response.data.results
        this.setState({
          'equipments': equipments
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ 'equipments': [] })
      })

    axios.get('http://127.0.0.1:8000/api/equipments_types/', { headers })
      .then(response => {
        const equipments_type = response.data.results
        this.setState({
          'equipments_type': equipments_type
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ 'equipments': [] })
      })
  }

  logOut() {
    axios
      .post('http://127.0.0.1:8000/auth/token/logout/', {}, {
        headers: this.getHeaders()
      })
      .then(() => {
        localStorage.setItem('token', '')

        this.setState({
          'token': '',
          'redirect': false
        }, this.getData)
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          {this.state.redirect ? <Navigate to={this.state.redirect} /> : <div />}
          <div className="container2">
            <span>
              <a className="navbar-brand" rel="nofollow" href='#'>
                Telecom
              </a>
            </span>

          </div>
          <Menu isAuth={this.isAuth()} logOut={() => this.logOut()} />
          <Routes>
            <Route exact path='/' element={<Navigate to='/equipments' />} />
            <Route exact path='/login' element={<LoginForm obtainAuthToken={(login, password) => this.obtainAuthToken(login, password)} />} />
            <Route exact path='/equipments' element={<EquipmentList token={this.state.token} />} />
            <Route path="/equipments/:id" element={<EquipmentDetails token={this.state.token} />} />
            <Route exact path='/create_equipment' element={<EquipmentForm equipments_type={this.state.equipments_type} createEquipment={(equipments_type, serialNumber, note) => this.createEquipment(equipments_type, serialNumber, note)} />} />
            <Route exact path='/equipments_type' element={<EquipmentTypeList types={this.state.equipments_type} />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <footer className="footer">
          Telecom
        </footer>
      </div>
    )
  }
}


export default App;