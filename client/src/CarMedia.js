import React, { Component } from 'react';
import { connect } from "react-redux";
import './bootstrap.min.css'
import './App.css';
// import axios from 'axios'


class CarMedia extends Component {
  constructor(props) {
    super(props);
    let newElem = props.elem
    this.state = {
        elem : newElem,
        cars : props.cars
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
          <div onClick={()=> window.open(elem["link"], "_blank")} className="media-car media border border-info rounded">
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
              <img className="img-thumbnail" src={elem['logo']} alt="Auto" />
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

export default connect(mapStateToProps)(CarMedia);
