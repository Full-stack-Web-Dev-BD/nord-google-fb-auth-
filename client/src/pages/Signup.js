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
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID } from "../config";
class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: {},
    google: false,
    successMessage:""
  }

  componentDidMount() {
    document.body.classList.add("white-content");
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
    let { name, email, password, confirmPassword } = this.state
    let obj = { name, email, password, confirmPassword }
    Axios.post('http://localhost:5000/register', obj)
      .then((res) => {
        // window.location.href = '/login'
        this.setState({
          successMessage:res.data.massage
        })
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          error: err.response.data
        })
      })
  }
  responseGoogle = (res) => {
    console.log(res, ' from google')
    if (res.profileObj) {
      Axios.post('http://localhost:5000/socialLogin', {
        name: res.profileObj.name,
        email: res.profileObj.email
      })
        .then(response => {
          window.localStorage.setItem('load-token', response.data.token)
          window.location.href = '/'
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.setState({ error: { massage: "Try Later" } })
    }
  }
  responseFacebook = (res) => {
    console.log(res, ' from facebook')
    if (res.name) {
      Axios.post('http://localhost:5000/socialLogin', {
        name: res.name,
        email: res.email
      })
        .then(response => {
          window.localStorage.setItem('load-token', response.data.token)
          window.location.href = '/'
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.setState({ error: { massage: "Try Later" } })
    }
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
                      <CardTitle tag="h2">Signup Page</CardTitle>
                      <hr />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="row">
                    {
                      this.state.successMessage?
                      <h5 className="text-center text-success" > {this.state.successMessage} </h5>:''
                    }
                    <div className="col-md-6">
                      <Label>Your Name</Label>
                      <Input  value={this.state.name} onChange={(e) => this.changeHandler(e)} type="text" name="name" placeholder="Enter Your Name" />

                      {
                        this.state.error.name ?
                          <p className="text-danger text-capitalize"> {this.state.error.name} </p>
                          : ''
                      }
                    </div>
                    <div className="col-md-6">
                      <Label>Your Email</Label>
                      <Input value={this.state.email} onChange={(e) => this.changeHandler(e)} type="email" name="email" placeholder="Enter Your Email" />
                      {
                        this.state.error.email ?
                          <p className="text-danger text-capitalize"> {this.state.error.email} </p>
                          : ''
                      }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Label>Password</Label>
                      <Input onChange={(e) => this.changeHandler(e)} type="password" name="password" placeholder="Enter Password" />
                      {
                        this.state.error.password ?
                          <p className="text-danger text-capitalize"> {this.state.error.password} </p>
                          : ''
                      }
                    </div>
                    <div className="col-md-6">
                      <Label>Confirm Password</Label>
                      <Input onChange={(e) => this.changeHandler(e)} type="password" name="confirmPassword" placeholder="Enter Confirm Password" />
                      {
                        this.state.error.confirmPassword ?
                          <p className="text-danger text-capitalize"> {this.state.error.confirmPassword} </p>
                          : ''
                      }
                      {
                        this.state.error.massage ?
                          <p className="text-danger text-capitalize"> {this.state.error.massage} </p>
                          : ''
                      }
                    </div>
                  </div>
                  <Button onClick={e => { this.submitHandler(e) }} color="info" size="sm" className="mt-3" ><span style={{ fontWeight: '300' }}>Signup</span> </Button>
                  {
                    this.state.google ?
                      <p className="text-info mt-5 text-center  text-capitalize">Please give password for confirm Sign up with Google  </p>
                      : ''
                  }
                  <p className="mt-3 text-center">Already have account ? <Link to='/login'>Login page. </Link> </p>
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
export default Signup
