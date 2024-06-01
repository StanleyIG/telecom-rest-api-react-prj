import React from 'react';
//import logo from './logo.svg';
import './App.css';
import './Menu.css';
//import Menu from './components/Menu'
import EquipmentList from './components/Equipment.jsx'
import LoginForm from './components/LoginForm.jsx';
import Menu from './components/Menu.jsx';
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
      'users': [],
      'token': '',
      'redirect': false
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
    //        console.log(bookId)
  }


  createEquipment(name, equipmentType) {
    //        console.log(title, authors)

            let headers = this.getHeaders()

            axios
                .post('http://127.0.0.1:8000/api/equipments/', {'name': name, 'equipmentType': equipmentType}, {headers})
                .then(response => {
                    this.setState({
                      'redirect': '/'
                    }, this.getData)
                })
                .catch(error => {
                    console.log(error)
                })
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
    //        return { 'Accept': 'application/json; version=2.0' }
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
      <body>
        
      
      <div>
        <BrowserRouter>
          {this.state.redirect ? <Navigate to={this.state.redirect} /> : <div />}
          <div className="container2">
            <span>
              <a className="navbar-brand" rel="nofollow" href='#'>
                telecom
              </a>
            </span>

          </div>
          <Menu isAuth={this.isAuth()} logOut={() => this.logOut()} />
          <Routes>
            <Route exact path='/' element={<Navigate to='/equipments' />} />
            <Route exact path='/login' element={<LoginForm obtainAuthToken={(login, password) => this.obtainAuthToken(login, password)} />} />
            <Route exact path='/equipments' element={<EquipmentList token={this.state.token} />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <footer className="footer">
         telecom
        </footer>
      </div>
      </body>
    )
  }
}


export default App;