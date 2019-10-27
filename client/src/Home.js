import React, { Component } from 'react';
import { MobileView, BrowserView } from "react-device-detect";
// import { connect } from "react-redux";
import './bootstrap.min.css'
import SearchBar from './SearchBar';
import Tags from './Tags'
import './App.css';
const pic = require('./vw.jpg')
const picMobile = require('./vw-mobile.jpg')


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showSearch: false,
      showTags: false
    }
  }
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


  render() {
    let styleSearch = {};
    if(!this.state.showSearch)
      styleSearch = {display: "none"};

    
    let styleTags = {};
    if(!this.state.showTags)
      styleTags = {display: "none"};
    
    return (
      <div className="">
        <div>
            <BrowserView>
                <img src={pic} className="img-fluid imgHome" alt="vw"/>
            </BrowserView>
            <MobileView>
                <img src={picMobile} className="img-fluid imgHome" alt="vw"/>
            </MobileView>

          {/* <div className="homeSearch media-card rounded">
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
              
              
            </div>
          </div> */}
        </div> 
        <div className="footer">
            &#169; metaSearch 2019
        </div>
        
      </div> 
    );
  }
}


export default Home;
