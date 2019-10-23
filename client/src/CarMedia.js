import React, { Component } from 'react';
import { connect } from "react-redux";
import './bootstrap.min.css'
import './App.css';
// import axios from 'axios'

import { addCmpCars } from './js/actions/index'


class CarMedia extends Component {
  constructor(props) {
    super(props);
    let newElem = props.elem
    this.state = {
        elem : newElem,
        cars : [...props.cars],
        cmpCarList : [],
        btnClasses : "btn btn-primary mb-2 btnAddCmp"
    }
    this.clickAddComapre = this.clickAddComapre.bind(this)
  }

  clickAddComapre = (e) => {
    e.preventDefault()
    console.log(e.target.className)
    e.target.disabled = false
    let i = e.target.value
    let tmpCmpCarList = [...this.state.cmpCarList]
    tmpCmpCarList.push(this.props.cars[i])
    this.props.addCmpCars(tmpCmpCarList)
    this.setState({
      cmpCarList: tmpCmpCarList,
      // btnClasses : "btn btn-primary mb-2 btnAddCmp disabled"
    })

  }

  render() {
    
    return (
      <div>
      {this.props.cars.map((elem, i) => {
        let cena = '0'
        if(elem['cena'] === -1) 
          cena = 'Dogovor'
        else 
          cena = elem['cena'] + '€'
        return (
          
          <div className="" key={i}>
            
            <div className="media-car media border border-info rounded">
              <img className="media-object img-thumbnail" src={elem['slika']} alt="Auto" />
              <div className="media-body ">
                <h5 className="mt-0">{elem['Marka'] + ' ' + elem['Model'] }</h5>
                <p>
                  
                  <b>{"   Godište: " }</b> { elem['Godište']  + '. godište'}
                  <br/>
                  <b>{"Gorivo: " }</b> { elem['Gorivo'] }
                  <b>{"   Karoserija: " }</b> { elem['Karoserija'] }
                  <br/>
                  <b>{"Kilometraža: " }</b> { elem['Kilometraža'] + ' km'}
                  <b>{"   Kubikaža: " }</b> { elem['Kubikaža']  + ' cm3'}
                  <br/>
                  <b>{"Snaga motora: " }</b> { elem['Snaga motora'] + ' KS (' + Math.ceil(elem['Snaga motora'] * 0.745699872) + ' KW)'}
                  <br/>
                  <b>{"   cena: " }</b> { cena}
                  <br/>
                </p>
                <img onClick={()=> window.open(elem["link"], "_blank")} className="img-thumbnail btn" src={elem['logo']} alt="Auto" />
                <button onClick={this.clickAddComapre} disabled={false} value={i} type="submit" className={this.state.btnClasses}>Dodaj u poredi</button>
              </div>
            
          </div>
          <br />
        </div>
          
          
        )
      })}
      </div> 
    );
  }
}

const mapStateToProps = state => {
  return { cars: state.cars };
};

function mapDispatchToProps(dispatch) {
  return {
    addCmpCars: cmpCarList => dispatch(addCmpCars(cmpCarList))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarMedia);
