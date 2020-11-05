import React, { Component } from 'react'
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import decoder from 'jwt-decode'
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css'

const hist = createBrowserHistory();
class App extends Component {
    state = {
        user: {}
    }
    componentDidMount() {
        let token = window.localStorage.getItem('load-token')
        if (token) {
            let userData = decoder(token)
            this.setState({
                user: userData
            })
        }
    }

    render() {
        return (
            <Router history={hist}>
                <Switch>
                    <Route path='/' exact  component={Profile} />
                    <Route path='/signup'  component={Signup} />
                    <Route path='/login' component={Login} />
                    <Redirect from='*' to="/"  />
                </Switch>
            </Router>
        )
    }
}
export default App