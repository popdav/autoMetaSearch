import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
// import axios from 'axios'
import { connect } from "react-redux";





class CmpCars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }


  render() {
    console.log(this.props)
    
    return (
      <div className="App container" style={this.props.style}>
          <table className="table">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Marka</th>
                    <th scope="col">Modela</th>
                    <th scope="col">Snaga</th>
                    <th scope="col">Cena</th>
                    <th scope="col">Kilometraža</th>
                    <th scope="col">Godište</th>
                    <th scope="col">Gorivo</th>
                    <th scope="col">Karoserija</th>
                    <th scope="col">Kubikaža</th>

                </tr>
            </thead>
            <tbody>
            {
                this.props.cmpCarList.map((e, i) => {
                  let cena = '0'
                  if(e['cena'] === -1) 
                    cena = 'Dogovor'
                  else 
                    cena = e['cena'] + '€'
                    return(
                        <tr key={i}>
                            <td> <img className="media-object img-thumbnail" src={e['slika']} alt="Auto" /> </td>
                            <td >{e['Marka']}</td>
                            <td>{e['Model']}</td>
                            <td>{e['Snaga motora'] + ' KS (' + Math.ceil(e['Snaga motora'] * 0.745699872) + ' KW)'}</td>
                            <td>{cena}</td>
                            <td>{e['Kilometraža'] + ' km'}</td>
                            <td>{e['Godište'] + '.'}</td>
                            <td>{e['Gorivo']}</td>
                            <td>{e['Karoserija']}</td>
                            <td>{e['Kubikaža'] + ' cm3'}</td>
                        </tr>
                            
                    )
                })
            }
            </tbody>
          </table>
          
        
      </div>
    );
  }
}

const mapStateToProps = state => {
    return { 
        cmpCarList: state.cmpCarList 
    };
  };

export default connect(mapStateToProps)(CmpCars);


