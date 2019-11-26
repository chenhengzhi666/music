import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from '@/components/header';
import '@/assets/less/index.less'
import RouterMap from '@/router/index.js'
import { Provider }  from 'react-redux'
import store from '@/redux/store'
import { BrowserRouter as Router } from 'react-router-dom'
import Player from '@/containers/Player'

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Header />
            <RouterMap />
            <Player />
        </Router>
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
