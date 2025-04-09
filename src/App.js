import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from 'react-router-dom'
import Register from './Components/Register'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Header from './Containers/Header'
import Govt_login from './Components/Govt_Login'
import RegistrationForm from './Containers/RegistrationForm'
import Dashboard_Govt from './Components/Dashboard_Govt'
import Profile from './Components/Profile'
import Help from './Components/Help'
import Home from './Components/Home'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: true,
    }
  }
  async componentWillMount() {
    // This method initializes the blockchain environment
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  componentDidMount() {
    // This method checks the authentication state from localStorage
    if (!window.localStorage.getItem('authenticated'))
       this.setState({ isAuthenticated: false })
     const isAuthenticated =
       window.localStorage.getItem('authenticated') === 'true'
     this.setState({ isAuthenticated })
  }
  async loadBlockchainData() {
    // TODO: Remove this later if blockchain browser is not required
    // This method retrieves the user's Ethereum accounts
     const web3 = window.web3

     const accounts = await web3.eth.getAccounts()
     window.localStorage.setItem('web3account', accounts[0])
  }

  async loadWeb3() {
    // TODO: Remove this later if blockchain browser is not required
    // This method sets up Web3 for blockchain interaction
     if (window.ethereum) {
       window.web3 = new Web3(window.ethereum)
       await window.ethereum.enable()
     } else if (window.web3) {
       window.web3 = new Web3(window.web3.currentProvider)
     } else {
       window.alert(
         'Non-Ethereum browser detected. You should consider trying MetaMask!',
       )
     }
  }
  render() {
    return (
      <Router>
        <Switch>
          {/* {console.log(this.state.isAuthenticated)} */}
          <div className="App">
            <Route exact path="*" component={Header} />
            <Route path="/" exact component={Home} />
            <Route exact path="/signup" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/govt_login" component={Govt_login} />
            <Route exact path="/profile" component={Profile} />
            <Route
              exact
              path="/registration_form"
              component={RegistrationForm}
            />
            <Route exact path="/dashboard_govt" component={Dashboard_Govt} />
            <Route exact path="/guide" component={Help} />
          </div>
        </Switch>
      </Router>
    )
  }
}

export default App
