import React, { Component } from 'react';
import './bootstrap.min.css'
import './App.css';
import axios from 'axios'
import { connect } from "react-redux";
import { addSearchBody } from "./js/actions/index";
import { Link } from "react-router-dom"


class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        marks : [],
        selectedMark: 'None',
        models : [],
        selectedModel: 'None',
       
    }

    this.clickSearch = this.clickSearch.bind(this)
    this.markChange = this.markChange.bind(this)
    this.modelChange = this.modelChange.bind(this)

  }

  componentDidMount() {
    axios.post('/makeUnique')
    .then((res) => {
      this.setState({ marks: res.data })
      
    })
    .catch((err) => {
      console.log(err)
    })
  }

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

  

  clickSearch = (e) => {
    e.preventDefault()
    

    let body = {
        Marka: this.state.selectedMark === 'None' ? undefined : this.state.selectedMark,
        Model: this.state.selectedModel === 'None' ? undefined : this.state.selectedModel,
      }
    console.log(body)

    this.props.addSearchBody(body)

  }

  render() {
    
    return (
        <div className="media-card" >

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

            <div className="form-group">
                <Link onClick={this.clickSearch} type="submit" className="btn btn-secondary mb-2" to="/search">
                  Pretraga
                </Link>
            </div>
            </form>
                
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addSearchBody: body => dispatch(addSearchBody(body))
  };
}

export default connect(null, mapDispatchToProps)(SearchBar);
