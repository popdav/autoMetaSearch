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
                </tr>
            </thead>
            <tbody>
            {
                this.props.cmpCarList.map((e, i) => {
                    return(
                        <tr key={i}>
                            <td> <img className="media-object img-thumbnail" src={e['slika']} alt="Auto" /> </td>
                            <td >{e['Marka']}</td>
                            <td>{e['Model']}</td>
                            <td>{e['Snaga motora']}</td>
                            <td>{e['cena']}</td>
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


