import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
import axios from 'axios'
import { connect } from "react-redux";
import CarMedia from './CarMedia'
import SearchBar from './SearchBar';
import Tags from './Tags'
import { addCars } from "./js/actions/index";

class App extends Component {
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
    this.scrollListener = window.addEventListener("scroll", this.handleScroll)
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
        if(res.data.length === 0){
          alert('Niste koristili pretragu po tagovima!')
        } else {
          let arrTags = [...res.data]
          console.log(res.data)
          let body = {
            tags: arrTags,
            chunkNumber: 1
          }
          console.log(body)
          axios.post('/smartSearch', body)
          .then((res) => {
            
              this.setState({ 
                cars: [...res.data],
                tags: arrTags
              })
              this.props.addCars(res.data)
              console.log(res.data)
            
            
          })
          .catch((err) => {
            console.log(err)
          })
        }
        

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
    
    return (
      <div className="App container">
        <button onClick={this.clickShowSearch} type="submit" className="btn btn-primary mb-2">Pretraga po parametrima</button>
        <span>{" "}</span>
        <button onClick={this.clickShowTags} type="submit" className="btn btn-primary mb-2">Pretraga sa tagovima</button>
        <span>{" "}</span>
        <button onClick={this.clickForMe} type="submit" className="btn btn-primary mb-2">Preporucena kola</button>
        <br/>
        
        <div style={styleSearch}>
          <SearchBar />
        </div>
        <div style={styleTags}>
          <Tags />  
        </div>
        
        <br/>
        <CarMedia />        
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

export default connect(mapStateToProps, mapDispatchToProps)(App);


function isEquivalent(a, b) {
  // Create arrays of property names
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
      return false;
  }

  for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
          return false;
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}