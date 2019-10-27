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
        isChecked: [...Array(40).keys()].map(e=>false)
    }
    this.clickAddComapre = this.clickAddComapre.bind(this)
  }

  clickAddComapre = (e) => {
    console.log(e.target.className)
    e.target.disabled = false
    let i = e.target.value

    // let newCheckVal = !this.state.isChecked[i]
    let newCheckArr = [...this.state.isChecked]
    newCheckArr[i] = !this.state.isChecked[i]
    if(newCheckArr[i]){
      let tmpCmpCarList = [...this.state.cmpCarList]
      tmpCmpCarList.push(this.props.cars[i])
      this.props.addCmpCars(tmpCmpCarList)
      this.setState({
        cmpCarList: tmpCmpCarList,
        isChecked: newCheckArr
      })
    } else {
      let tmpCmpCarList = [...this.state.cmpCarList]

      for( var j = 0; j < tmpCmpCarList.length; j++){ 
        if (isEquivalent(tmpCmpCarList[j], this.props.cars[i])) {
          tmpCmpCarList.splice(j, 1); 
        }
     }

      console.log(tmpCmpCarList)
      this.props.addCmpCars(tmpCmpCarList)
      this.setState({
        cmpCarList: tmpCmpCarList,
        isChecked: newCheckArr
      })
    }

    

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if(nextProps.cars.length !== this.state.isChecked.length){
      let newArr = []
      for(let i=this.state.isChecked.length; i<nextProps.cars.length; i++)
        newArr.push(false)

      let isCheckedNew = [...this.state.isChecked, ...newArr]
      console.log(isCheckedNew)

      this.setState({
        isChecked: isCheckedNew
      })
    }
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
            
            <div className="media-card media rounded">
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
                <span className="form-check btnAddCmp">
                  <label  className="form-check-label" htmlFor="cmpCheck">
                    <input checked={this.state.isChecked[i]} onChange={this.clickAddComapre} value={i} type="checkbox" className="form-check-input" id="cmpCheck"/>
                    Dodaj u poredjenje
                  </label>
                </span>
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



function isEquivalent(a, b) {
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
      return false;
  }

  for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];

      if (a[propName] !== b[propName]) {
          return false;
      }
  }
  return true;
}