import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
import axios from 'axios'


class App extends Component {
  constructor() {
    super();
    this.state = {
      cars: []
    }
    axios.post('/findPolovni')
    .then((res) => {
      this.setState({cars: res.data})
      console.log(res.data)
    })
    .catch((err) => {
        console.log(err)
    })
  }


  render() {
    
    return (
      <div>

        {this.state.cars.map((elem, i) => {
          return(
            <div key={i}>
              <div className="media">
                <img className="mr-3" src={elem['slika']} alt="Generic placeholder image"/>
                <div className="media-body">
                  <h5 className="mt-0">{elem['Marka'] + ' ' + elem['Model']}</h5>
                    {"Fiksna cena: " + elem['Fiksna cena']+ "\n" +
                    "Godište: " + elem['Godište']+ "\n" +
                    "Gorivo: " + elem['Gorivo']+ "\n" +
                    "Karoserija: " + elem['Karoserija']+ "\n" +
                    "Kilometraža: " + elem['Kilometraža']+ "\n" +
                    "Kubikaža: " + elem['Kubikaža']+ "\n" +
                    "Snaga motora: " + elem['Snaga motora']+ "\n" +
                    "Vozilo: " + elem['Vozilo:']+ "\n" +
                    "Zamena: " + elem["Zamena: "]+ "\n" +
                    "cena: " + elem['cena']+ "\n"}

                  
                </div>
              </div>
              <br/>
            </div>
          )
        })}

      </div>
    );
  }
}

export default App;
