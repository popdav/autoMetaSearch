import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
// import axios from 'axios'
import { connect } from "react-redux";
import { addCmpCars } from "./js/actions/index"

import CarView from './CarView'
import CmpCars from './CmpCars'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


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
    
    return (
      <Router>
          <div className="App container">
            
            
            <Switch>
              <Route exact path="/">
              <Link to="/cmp">
                <button onClick={this.clickCompare} type="submit" className="btn btn-primary mb-2 btnComapre">Poredi</button>
              </Link>
                <CarView  />
              </Route>
              <Route path="/cmp">
                <CmpCars />
              </Route>
            </Switch>

          </div>
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


