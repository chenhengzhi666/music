import React, { Component } from 'react'
import './index.less'
import Nav from '@/components/nav'
import logo from '@/assets/img/logo.png'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <div className='header-wrapper'>
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h1 className="app-title">Music</h1>
                </header>
                <Nav />
            </div>
        );
    }
}
 
export default Header;