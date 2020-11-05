import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Axios from "axios";
import { Link } from "react-router-dom";
import jwtDecoder from 'jwt-decode'

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID } from "../config";


class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: {}
  }

  componentDidMount() {
    document.body.classList.add("white-content");

    let token = window.localStorage.getItem('load-token')
    if (token) {
      window.location.href = '/profile'
    }
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  submitHandler = (e) => {
    e.preventDefault()
    let { email, password } = this.state
    Axios.post('/login', { email, password })
      .then(res => {
        window.localStorage.setItem('load-token', res.data.token)
        window.location.href = '/'
      })
      .catch(err => {
        this.setState({
          error: err.response.data
        })
      })
  }
  responseGoogle = (res) => {
    Axios.post('/socialLogin', {
      name: res.profileObj.name,
      email: res.profileObj.email
    })
      .then(response => {
        console.log(res, ' response')
        window.localStorage.setItem('load-token', response.data.token)
        window.location.href = '/profile'
      })
      .catch(err => {
        console.log(err);
      })
  }
  responseFacebook = (res) => {
    console.log(res, ' from facebook')
    Axios.post('/socialLogin', {
      name: res.name,
      email: res.email
    })
      .then(response => {
        console.log('response')
        window.localStorage.setItem('load-token', response.data.token)
        window.location.href = '/profile'
      })
      .catch(err => {
        console.log(err);
      })
  }
  render() {
    return (
      <div>
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3">
            <Col xs="12">
              <Card className="card-chart p-4">
                <CardHeader>
                  <Row>
                    <Col className="text-center" >
                      <CardTitle tag="h2">Login Page</CardTitle>
                      <hr />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Your Email</Label>
                      <Input onChange={(e) => this.changeHandler(e)} type="email" name="email" placeholder="Enter Your Email" />
                      {
                        this.state.error.email ?
                          <p className="text-danger text-capitalize"> {this.state.error.email} </p>
                          : ''
                      }
                    </div>

                    <div className="col-md-6">
                      <Label>Password</Label>
                      <Input onChange={(e) => this.changeHandler(e)} type="password" name="password" placeholder="Enter Password" />
                      {
                        this.state.error.password ?
                          <p className="text-danger text-capitalize"> {this.state.error.password} </p>
                          : ''
                      }
                      {
                        this.state.error.massage ?
                          <p className="text-danger text-capitalize"> {this.state.error.massage} </p>
                          : ''
                      }
                    </div>
                  </div>
                  <Button onClick={e => { this.submitHandler(e) }} color="info" size="sm" className="mt-3" ><span style={{ fontWeight: '300' }}>Login</span> </Button>
                  <p className="mt-3 text-center">Not have account ? <Link to='/signup'>Sign up now </Link> </p>
                  <div className="text-center">
                    <GoogleLogin
                      style={{marginBottom:'30px'}}
                      clientId={GOOGLE_CLIENT_ID}
                      buttonText="Sign up with Google "
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <div className="p-2"></div>
                    <FacebookLogin
                      appId={FACEBOOK_CLIENT_ID}
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={() => { console.log('clicked') }}
                      callback={this.responseFacebook} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
