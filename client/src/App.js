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
      years: [...Array(80).keys()].map(i => i + 1940).reverse(),
      fuel: ['Dizel', 'Benzin'],
      type: [],
      km: [...Array(11).keys()].map(i => i * 20000).reverse(),
      tags: [],
      inputTag: ''
    }

    this.load = this.load.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.loadMoreTag = this.loadMoreTag.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    this.clickSearch = this.clickSearch.bind(this)
    this.markChange = this.markChange.bind(this)
    this.modelChange = this.modelChange.bind(this)
    this.toYearChange = this.toYearChange.bind(this)
    this.fromYearChange = this.fromYearChange.bind(this)
    this.handleGas = this.handleGas.bind(this)
    this.handleType = this.handleType.bind(this)
    this.fromKm = this.fromKm.bind(this)
    this.toKm = this.toKm.bind(this)
    this.fromKub = this.fromKub.bind(this)
    this.toKub = this.toKub.bind(this)
    this.fromHp = this.fromHp.bind(this)
    this.toHp = this.toHp.bind(this)
    this.fromPrice = this.fromPrice.bind(this)
    this.toPrice = this.toPrice.bind(this)

    this.addTag = this.addTag.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.inputTagChange = this.inputTagChange.bind(this)
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

    axios.post('/makeUnique')
      .then((res) => {
        console.log(res.data)
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
      if(this.state.tags.length === 0){
        console.log('usao')
        this.loadMore()
      }
        
      else {
        console.log('usao tag')
        this.loadMoreTag()
      }
        
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

  handleGas = (e) => {
    e.persist()
  }

  handleType = (e) => {
    e.persist()
  }

  toKm = (e) => {
    e.persist()
  }

  fromKm = (e) => {
    e.persist()
  }

  toKub = (e) => {
    e.persist()
  }

  fromKub = (e) => {
    e.persist()
  }

  toHp = (e) => {
    e.persist()
  }

  fromHp = (e) => {
    e.persist()
  }

  toPrice = (e) => {
    e.persist()
  }

  fromPrice = (e) => {
    e.persist()
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
  loadMoreTag = () => {
    let body = {
      tags : this.state.tags,
      chunkNumber: this.state.chunkNumber + 1
    }
    console.log(body)
    axios.post('/smartSearch', body)
      .then((res) => {
        this.setState({
          cars: [...this.state.cars, ...res.data]
        })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  addTag = (e) => {
    e.preventDefault()
    let newP =  this.state.inputTag
    let tagsarr = this.state.tags
    tagsarr.push(newP)

    let body = {
      tags : tagsarr,
      chunkNumber: this.state.chunkNumber 
    }
    console.log(body)
    axios.post('/smartSearch', body)
      .then((res) => {
        this.setState({
          cars: res.data,
          tags: tagsarr
        })
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

  }

  inputTagChange = (e) => {
    e.persist()
    this.setState({
      inputTag: e.target.value
    })
  }

  handleCloseClick =  (i) => {
    let arr = [...this.state.tags]
    arr.splice(i)
    this.setState({
      tags: arr
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
                  <option key={i + elem + 14}>{elem}</option>
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
                  <option key={i + elem + 13}>{elem}</option>
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
                  <option key={i + elem + 12 * Math.random()}>{elem}</option>
                )
              })}
            </select>
            
            <label htmlFor="doGodina">Do godine:</label>
            <select onChange={this.toYearChange} className="form-control" id="doGodina">
              <option>None</option>
              {this.state.years.map((elem, i) => {
                return(
                  <option key={i + elem + 11* Math.random()}>{elem}</option>
                )
              })}
            </select>
 

            <label  htmlFor="gorivo">Gorivo:</label>
            <select onChange={this.handleGas} className="form-control" id="gorivo">
              <option>None</option>
              {this.state.fuel.map((elem, i) => {
                return(
                  <option key={i + elem + 10}>{elem}</option>
                )
              })}
            </select>
            
            <label htmlFor="karoserija">Karoserija:</label>
            <select onChange={this.handleType} className="form-control" id="karoserija">
              <option>None</option>
              {this.state.type.map((elem, i) => {
                return(
                  <option key={i + elem + 9}>{elem}</option>
                )
              })}
            </select>

          </div>
            
          <div className="form-inline form-group mx-sm-3 mb-2">
            <label  htmlFor="odKilometraza">Kilometraža od:</label>
            <select onChange={this.fromKm} className="form-control" id="odKilometraza">
              <option>None</option>
              
            </select>
            
            <label htmlFor="doKm">Kilometraža do:</label>
            <select onChange={this.toKm} className="form-control" id="doKm">
              <option>None</option>
              {this.state.km.map((elem, i) => {
                return(
                  <option key={i + elem +7}>{elem}</option>
                )
              })}
            </select>
          

            <label  htmlFor="odKub">Kubikaža od:</label>
            <select onChange={this.fromKub} className="form-control" id="odKub">
              <option>None</option>
              
            </select>
            
            <label htmlFor="doKub">Kubikaža do:</label>
            <select onChange={this.toKub} className="form-control" id="doKub">
              <option>None</option>
              
            </select>
          </div>

          <div className="form-inline form-group mx-sm-3 mb-2">
            <label  htmlFor="odSnaga">Snaga motora od:</label>
            <select onChange={this.fromHp} className="form-control" id="odSnaga">
              <option>None</option>
              
            </select>
            
            <label htmlFor="doSnaga">Snaga motora do:</label>
            <select onChange={this.toHp} className="form-control" id="doSnaga">
              <option>None</option>
              
            </select>
          

            <label  htmlFor="odcena">Cena od:</label>
            <select onChange={this.fromPrice} className="form-control" id="odcena">
              <option>None</option>
              
            </select>
            
            <label htmlFor="docena">Cena do:</label>
            <select onChange={this.toPrice} className="form-control" id="docena">
              <option>None</option>
              
            </select>
          </div>


          <div className="form-group">
            <button onClick={this.clickSearch} type="submit" className="btn btn-primary mb-2">Pretraga</button>
          </div>
        </form>
        

        <form className="form search-bar">
          
          <div className="form-inline  form-group mx-sm-3 mb-2">
            <input onChange={this.inputTagChange} type="text" className="form-control" placeholder="Tag" />
            <button onClick={this.addTag} type="submit" className="btn btn-primary mb-2">Dodaj</button>
          </div>
        </form>
        {this.state.tags.map((elem, i) => {
                return(
                  <p key={i + elem} className="btn btn-primary mb-2"> {elem} <span onClick={(e) => this.handleCloseClick(i)}  className="close">&times;</span> </p>
                )
              })}

        <br/>

        {this.state.cars.map((elem, i) => {
          let cena = '0'
          if(elem['cena'] == -1) 
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

export default App;
