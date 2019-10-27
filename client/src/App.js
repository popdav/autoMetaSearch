import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
// import axios from 'axios'
import { connect } from "react-redux";
import { addCmpCars } from "./js/actions/index"

import { isMobile } from "react-device-detect";

import CarView from './CarView'
import CmpCars from './CmpCars'
import Home from './Home'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

let logoPic = require('./ms-icon-310x310.png')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }

    this.props.addCmpCars([])
    
    this.clickCompare = this.clickCompare.bind(this)
  }

  clickCompare = () => {
    
  }

  render() {

    let styleTop = {"marginTop": "5%"}
    if(isMobile){
      styleTop = {"marginTop": "20%"}
    }
    
    return (
      <Router>
        <nav className="navbar navbar-light bg-warning fixed-top">
          
          <a className="navbar-brand" href="/">
            <img src={logoPic} width="30" height="30" alt=""/>
            Početna
          </a>
          <a className="navbar-brand" href="/search">Pretraga <span aria-label="img" role="img">&#x1F50E;</span></a>
                    
        </nav>

        
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            <div style={styleTop} className="App">
            <Route exact path="/search">
              <CarView  />
            </Route>
            <Route path="/cmp">
              <CmpCars />
            </Route>
            </div>
          </Switch>

        
      </Router>
        
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addCmpCars: cmpCarList => dispatch(addCmpCars(cmpCarList))
  };
}


export default connect(null, mapDispatchToProps)(App);


