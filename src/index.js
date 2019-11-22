import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from '@/components/header';
import '@/assets/less/index.less'
import RouterMap from '@/router/index.js'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
    <Router>
        <Header />
        <RouterMap />
    </Router>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
