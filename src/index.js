import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Header from "@/components/header";
import "@/assets/less/index.less";
import RouterMap from "@/router/index.js";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { HashRouter as Router } from "react-router-dom";
import MusicPlayer from "@/components/player";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Header />
      <RouterMap />
      <MusicPlayer />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// 测试 sourceTree
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
