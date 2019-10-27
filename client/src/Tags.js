import React, { Component } from 'react';
import { connect } from "react-redux";
import './bootstrap.min.css'

import './App.css';
import { addTags } from './js/actions/index'


class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tags : [],
        isChecked: {'sportski':false, 'biznis':false, "gradski":false, "porodicni":false, "studentski":false},
        allTags: ['sportski', 'biznis', "gradski", "porodicni", "studentski"]
    }
  }

  addTag = (e) => {
    console.log('Vrednost:')
    console.log(e.target.name)
    let newP =  e.target.name
    let tagsarr = [...this.state.tags]
    

    let newCheck = Object.assign({}, this.state.isChecked) 

    newCheck[newP] = !this.state.isChecked[newP]
    console.log(newCheck)
    
    if(newCheck[newP]) {
      tagsarr.push(newP)
    } else {
      for( var i = 0; i < tagsarr.length; i++){ 
        if ( tagsarr[i] === newP) {
          tagsarr.splice(i, 1); 
        }
     }
    }
      
    console.log(tagsarr)

    this.setState({
        tags : tagsarr,
        isChecked : newCheck
    })
    
 

  }

  clickSearch = (e) => {
    e.preventDefault()
    let tagsarr = [...this.state.tags]
    this.props.addTags(tagsarr)
  }

  // handleCloseClick =  (i) => {
  //   let arr = [...this.state.tags]
  //   arr.splice(i, 1)
    
  //   this.setState({
  //     tags: arr
  //   })
  //   this.props.addTags(arr)
  // }

  render() {

    
    
    return (
      <div className="media-card">
        <form className="form">
       
          {this.state.allTags.map((e, i) => {
              return(
                <div key={e+i} className="form-check">
                  
                  <input id={e + i} checked={this.state.isChecked[e]} onChange={this.addTag} className="form-check-input" type="checkbox" name={e}  />
                  <label htmlFor={e + i} key={e}>{e}</label>
                </div>
              )
          })}
         
          <div className="form-group">
            <button onClick={this.clickSearch} type="submit" className="btn btn-secondary mb-2">Pretraga</button>
          </div>
        </form>
        

        {/* {this.state.tags.map((elem, i) => {
            return(
                <span key={i + elem}>
                    <p  className="btn btn-primary mb-2"> {elem} <span onClick={(e) => this.handleCloseClick(i)}  className="close">&times;</span> </p>&nbsp;
                </span>
            )
        })} */}
        
      </div> 
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        addTags: tags => dispatch(addTags(tags))
    };
}


export default connect(null, mapDispatchToProps)(Tags);
