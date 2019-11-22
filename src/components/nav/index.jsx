import React, { Component } from 'react'
import './index.less'
import { NavLink } from 'react-router-dom'

class Nav extends Component {
    render() { 
        return (
            <div className='nav-wrapper'>
                <div className='nav'>
                    <NavLink exact to='/recommend' activeClassName='active'>推荐</NavLink>
                </div>
                <div className='nav'>
                    <NavLink exact to='/ranking' activeClassName='active'>排行榜</NavLink>
                </div>
                <div className='nav'>
                    <NavLink exact to='/singer' activeClassName='active'>歌手</NavLink>
                </div>
                <div className='nav'>
                    <NavLink exact to='/search' activeClassName='active'>搜索</NavLink>
                </div>
            </div>
        );
    }
}
 
export default Nav;