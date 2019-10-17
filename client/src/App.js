import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
import axios from 'axios'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      chunkNumber: 1,
      marks : [],
      selectedMark: undefined,
      models : [],
      selectedModel: undefined,
      fromYear: 'None',
      toYear: 'None',
      years: [...Array(120).keys()].map(i => i + 1900)
    }

    this.load = this.load.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.markChange = this.markChange.bind(this)
    this.modelChange = this.modelChange.bind(this)
    this.clickSearch = this.clickSearch.bind(this)
    this.toYearChange = this.toYearChange.bind(this)
    this.fromYearChange = this.fromYearChange.bind(this)
  }

  load() {
    axios.post('/findPolovni', { chunkNumber: this.state.chunkNumber })
      .then((res) => {
        this.setState({ cars: res.data })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

    axios.post('/markUnique')
      .then((res) => {
        this.setState({ marks: res.data })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  loadMore() {
    let body = {
      findQuery:{
        Marka: this.state.selectedMark,
        Model: this.state.selectedModel,
      },
      chunkNumber: this.state.chunkNumber + 1
    }
    axios.post('/findPolovni', body)
      .then((res) => {
        this.setState({
          cars: [...this.state.cars, ...res.data],
          chunkNumber: this.state.chunkNumber + 1
        })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.load()
    this.scrollListener = window.addEventListener("scroll", this.handleScroll)
  }

  handleScroll = (e) => {
    e.preventDefault()
    const bottom = e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop  <= e.target.scrollingElement.clientHeight
    console.log(e)
    console.log(e.target.scrollingElement.scrollHeight)
    console.log(e.target.scrollingElement.scrollTop)
    console.log(e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop)
    console.log(e.target.scrollingElement.clientHeight)
    if (bottom) {
      this.loadMore()
    }
  };

  markChange = (e) => {
    e.persist()
    console.log(e.target.value)
    if(e.target.value !== 'None'){
      let callString = '/modelUnique'// + e.target.value
      axios.post(callString, {model: e.target.value})
        .then((res) => {
          this.setState({ 
            models: res.data,
            selectedMark: e.target.value
          })
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      this.setState({ 
        models: [],
        selectedMark: undefined,
        selectedModel: undefined
      })
    }
  }

  modelChange = (e) => {
    e.persist()
    console.log(e.target.value)
    this.setState({ 
      selectedModel: e.target.value
    })
  }

  fromYearChange = (e) => {
    e.persist()
    console.log(e.target.value)
    this.setState({
      fromYear: e.target.value
    })
  }


  toYearChange = (e) => {
    e.persist()
    console.log(e.target.value)
    this.setState({
      toYear: e.target.value
    })
  }

  clickSearch = (e) => {
    e.preventDefault()
    let godisteBody = {$lte:this.state.toYear === 'None' ? undefined : parseInt(this.state.toYear), $gte:this.state.fromYear === 'None' ? undefined : parseInt(this.state.fromYear)}
    
    if(godisteBody['$lte'] === undefined && godisteBody['$gte'] === undefined)
      godisteBody = undefined

    let body = {
      findQuery:{
        Marka: this.state.selectedMark === 'None' ? undefined : this.state.selectedMark,
        Model: this.state.selectedModel === 'None' ? undefined : this.state.selectedModel,
        Godište: godisteBody
      },
      chunkNumber: 1
    }
    console.log(body)
    axios.post('/findPolovni', body)
      .then((res) => {
        this.setState({ cars: res.data })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

  }

  render() {

    return (
      <div className="App container">
        
        <form className="form search-bar">
          
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="exampleFormControlSelect1">Marka:</label>
            <select onChange={this.markChange} className="form-control" id="exampleFormControlSelect1">
              <option>None</option>
              {this.state.marks.map((elem, i) => {
                return(
                  <option key={i + elem}>{elem}</option>
                )
              })}
            </select>
          </div>
         
          <div className="form-group mx-sm-3 mb-2">
            <label htmlFor="exampleFormControlSelect1">Model: </label>
            <select onChange={this.modelChange} className="form-control" id="exampleFormControlSelect1">
              <option>None</option>
              {this.state.models.map((elem, i) => {
                return(
                  <option key={i + elem}>{elem}</option>
                )
              })}
            </select>
          </div>

          <div className="form-inline form-group mx-sm-3 mb-2">
            <label  htmlFor="odGodina">Od godine:</label>
            <select onChange={this.fromYearChange} className="form-control" id="odGodina">
              <option>None</option>
              {this.state.years.map((elem, i) => {
                return(
                  <option key={i + elem}>{elem}</option>
                )
              })}
            </select>
            
            <label htmlFor="doGodina">Do godine:</label>
            <select onChange={this.toYearChange} className="form-control" id="doGodina">
              <option>None</option>
              {this.state.years.map((elem, i) => {
                return(
                  <option key={i + elem}>{elem}</option>
                )
              })}
            </select>

          </div>

          <div className="form-group">
            <button onClick={this.clickSearch} type="submit" className="btn btn-primary mb-2">Search</button>
          </div>
        </form>

        <br/>

        {this.state.cars.map((elem, i) => {
          let cena = 'Dogovor'
          if(elem['cena'] !== '') cena = elem['cena']
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
                    <b>{"Kilometraža: " }</b> { elem['Kilometraža'] }
                    <b>{"   Kubikaža: " }</b> { elem['Kubikaža'] }
                    <br/>
                    <b>{"Snaga motora: " }</b> { elem['Snaga motora'] }
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

export default App;
