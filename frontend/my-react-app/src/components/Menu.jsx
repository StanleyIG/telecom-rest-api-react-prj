import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div className="mainmenu">
                <ul className="mainmenu-style">
                    <li> <Link to='/'>Оборудование</Link> </li>
                    <li> <Link to='/create_equipment'>Создать оборудование</Link> </li>
                    <li> <Link to='/equipments_type'>Тип оборудования</Link></li>
                    <li>
                        {this.props.isAuth ? 
                            <Link onClick={this.props.logOut} to='#'>Logout</Link>
                            : 
                            <Link to='/login'>Login</Link>
                        }
                    </li>
                </ul>
            </div>
        );
    }
}

export default Menu;