import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
import axios from 'axios'
import { connect } from "react-redux";
import CarMedia from './CarMedia'
import SearchBar from './SearchBar';
import Tags from './Tags'
import { addCars } from "./js/actions/index";
import { MobileView, isBrowser } from "react-device-detect";
import ReactGA from 'react-ga';

import { Link } from "react-router-dom";

function initializeReactGA() {
  ReactGA.initialize('UA-150447549-1');
  ReactGA.pageview('/');
}

class CarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      chunkNumber: 1,
      body : props.body,
      tags: [],
      inputTag: '',
      showSearch: false,
      showTags: false
    }

    this.load = this.load.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

    this.clickShowSearch = this.clickShowSearch.bind(this)
    this.clickShowTags = this.clickShowTags.bind(this)
    this.clickForMe = this.clickForMe.bind(this)
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log(props)
    let newBody = props.body
    let newTags = [...props.tags]
    if(!isEquivalent(newBody, {}) && this.state.showSearch){
      console.log('Usao search')
      let body = {
        findQuery: newBody,
        chunkNumber: 1
      }
      console.log(body)
      axios.post('/findPolovni', body)
      .then((res) => {
        this.setState({
          cars: [...res.data],
          tags: newTags
        })
        this.props.addCars(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    if(newTags.length > 0 && this.state.showTags) {
      console.log('Usao tags')
      let body = {
        tags: newTags,
        chunkNumber: 1
      }
      console.log(body)
      axios.post('/smartSearch', body)
      .then((res) => {
        this.setState({ 
          cars: [...res.data],
          tags: newTags
         })
        this.props.addCars(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }

    if((newTags.length === 0 && isEquivalent(newBody, {})) || (!this.state.showTags && !this.state.showSearch) || (!this.state.showSearch && newTags.length === 0))
      this.load()
    
    
  }

  load() {
    axios.post('/findPolovni',{chunkNumber: 1})
      .then((res) => {
        this.setState({ cars: res.data })
        this.props.addCars(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

    
  }

  loadMore() {
    let body = {
      findQuery:this.props.body,
      chunkNumber: this.state.chunkNumber + 1
    }
    axios.post('/findPolovni', body)
      .then((res) => {
        this.setState({
          cars: [...this.state.cars, ...res.data],
          chunkNumber: this.state.chunkNumber + 1
        })
        this.props.addCars(this.state.cars)
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

  componentDidMount() {
    this.load()
    initializeReactGA()
    this.scrollListener = window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (e) => {
    e.preventDefault()
    const bottom = e.target.scrollingElement.scrollHeight - e.target.scrollingElement.scrollTop  <= e.target.scrollingElement.clientHeight
    
    if (bottom) {
        
      if(this.state.tags.length === 0){
        this.loadMore()
      }
        
      else {
        this.loadMoreTag()
      }
       
    }
  };

  clickShowSearch = () => {
    
    if(this.state.showSearch){
      this.setState({showSearch: false})
    } else {
      this.setState({
        showSearch: true,
        showTags: false
      })
    }
    

  }
  
  clickShowTags = () => {
    if(this.state.showTags){
      this.setState({showTags: false})
    } else {
      this.setState({
        showSearch: false,
        showTags: true
      })
    }
  }

  clickForMe = () => {
    axios.get('/getCarsForMe')
      .then((res) => {
        console.log(res.data)
        let carsNew = [...res.data.arr]
        let newBody = {$or: [...res.data.query]}
        this.setState({
          cars: carsNew,
          body: newBody
        })
        this.props.addCars(carsNew)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    let styleSearch = {};
    if(!this.state.showSearch)
      styleSearch = {display: "none"};

    
    let styleTags = {};
    if(!this.state.showTags)
      styleTags = {display: "none"};

    let mobileStyle = { "textAlign" : "center" }
    
    let styleSideBar = "media-card rounded"
    let styleRight = ""
    if(isBrowser){
      styleSideBar = "sidebar media-card rounded"
      styleRight = "right-side"
    }

    return (
      <div className="App container" style={this.props.style}>
        
          <div className={styleSideBar}>
            <div className="iner-sidebar">
              <button onClick={this.clickShowSearch} type="submit" className="btn dropdown-toggle btn-warning">Pretraga po parametrima</button>
              <div style={styleSearch}>
                <SearchBar />
              </div>

              <button onClick={this.clickShowTags} type="submit" className="btn dropdown-toggle btn-warning">Pretraga sa tagovima</button>        
              <div style={styleTags}>
                <Tags />  
              </div>

              <button onClick={this.clickForMe} type="submit" className="btn btn-warning">Preporucena kola</button>
              <br/>
              <Link to="/cmp">
                <button onClick={this.clickCompare} type="submit" className="btn btn-warning btnComapre ">Poredi</button>
              </Link>
            </div>
          </div>
        
        
        <br/>

        <div className={styleRight}>
          <CarMedia />

          <div style={mobileStyle}>
            <MobileView>
              <button onClick={this.loadMore} type="submit" className="btn btn-primary mb-2">Učitaj još</button>
            </MobileView>    
          </div>
        </div>
        

      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
    body: state.body,
    tags: state.tags 
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addCars: cars => dispatch(addCars(cars))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarView);


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