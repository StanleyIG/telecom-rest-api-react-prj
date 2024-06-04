import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div className="mainmenu">
                <ul className="mainmenu-style">
                    <li> 
                        <Link to='/' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={(e) => { this.addActiveClass(e); new Audio("chik.mp3").play(); }}>Оборудование</Link> 
                    </li>
                    <li> 
                        <Link to='/create_equipment' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={(e) => { this.addActiveClass(e); new Audio("chik.mp3").play(); }}>Создать оборудование</Link> 
                    </li>
                    <li> 
                        <Link to='/equipments_type' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={(e) => { this.addActiveClass(e); new Audio("chik.mp3").play(); }}>Тип оборудования</Link>
                    </li>
                    <li>
                        {this.props.isAuth ? 
                            <Link onClick={this.props.logOut} to='#' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }}>Logout</Link>
                            : 
                            <Link to='/login' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={(e) => { this.addActiveClass(e); new Audio("chik.mp3").play(); }}>Login</Link>
                        }
                    </li>
                </ul>
            </div>
        );
    }

    addActiveClass(e) {
        const currentLink = e.target;
        const links = document.querySelectorAll('.mainmenu-style li a');

        links.forEach((link) => {
            link.classList.remove('active');
        });

        currentLink.classList.add('active');
    }
}

export default Menu;



// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

// class Menu extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         };
//     }
//     render() {
//         return (
//             <div className="mainmenu">
//                 <ul className="mainmenu-style">
//                     <li> 
//                         <Link to='/' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={() => { new Audio("chik.mp3").play(); }}>Оборудование</Link> 
//                     </li>
//                     <li> 
//                         <Link to='/create_equipment' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={() => { new Audio("chik.mp3").play(); }}>Создать оборудование</Link> 
//                     </li>
//                     <li> 
//                         <Link to='/equipments_type' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={() => { new Audio("chik.mp3").play(); }}>Тип оборудования</Link>
//                     </li>
//                     <li>
//                         {this.props.isAuth ? 
//                             <Link onClick={this.props.logOut} to='#' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }}>Logout</Link>
//                             : 
//                             <Link to='/login' onMouseEnter={() => { new Audio("zvuk41.mp3").play(); }} onClick={() => { new Audio("chik.mp3").play(); }}>Login</Link>
//                         }
//                     </li>
//                 </ul>
//             </div>
//         );
//     }
// }

// export default Menu;