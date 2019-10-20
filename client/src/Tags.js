import React, { Component } from 'react';
import { connect } from "react-redux";
import './bootstrap.min.css'
import './App.css';
import { addTags } from './js/actions/index'
// import axios from 'axios'


class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tags : [],
        allTags: ['sportski', 'biznis']
    }
  }

  addTag = (e) => {
    e.preventDefault()
    console.log('Vrednost:')
    console.log(e.target.value)
    let newP =  e.target.value
    let tagsarr = [...this.state.tags]
    tagsarr.push(newP)

    this.setState({
        tags : tagsarr
    })
    this.props.addTags(tagsarr)
 

  }

  inputTagChange = (e) => {
    e.persist()
    this.setState({
      inputTag: e.target.value
    })
  }

  handleCloseClick =  (i) => {
    let arr = [...this.state.tags]
    arr.splice(i, 1)
    
    this.setState({
      tags: arr
    })
    this.props.addTags(arr)
  }

  render() {
    
    return (
      <div>

        <form className="form search-bar">
          
          <div className="form-inline  form-group mx-sm-3 mb-2">
            {/* <input onChange={this.inputTagChange} type="text" className="form-control" placeholder="Tag" />
            <button onClick={this.addTag} type="submit" className="btn btn-primary mb-2">Dodaj</button> */}
            {this.state.allTags.map((e, i) => {
                return(
                    <div key={i}>
                        <button  onClick={this.addTag} value={e} type="submit" className="btn btn-secondary mb-2">{e}</button>
                        <span>&nbsp;</span>
                    </div>
                )
            })}
          </div>
        </form>
        {this.state.tags.map((elem, i) => {
            return(
                <span key={i + elem}>
                    <p  className="btn btn-primary mb-2"> {elem} <span onClick={(e) => this.handleCloseClick(i)}  className="close">&times;</span> </p>&nbsp;
                </span>
            )
        })}
      
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
