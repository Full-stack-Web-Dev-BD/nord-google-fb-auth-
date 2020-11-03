import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col
} from "reactstrap";
import Axios from "axios";
import decoder from 'jwt-decode'
class Profile extends React.Component {

  state = {
    user: {},
  }


  componentDidMount() {
    let token = window.localStorage.getItem('load-token')
    if (token) {
      let userData = decoder(token)
      this.setState({
        user: userData
      })
    }else{
      window.location.href='/login'
    }
  }
  logout(){
    window.localStorage.removeItem('load-token')
    window.location.href='/login'
  }
  render() {
    return (
      <>
        <div className="content" style={{marginTop:"200px"}}>
          <Row>
            <div className="col-md-6 offset-md-3">
              <Card className="p-4">
                <CardBody>
                  <div className="p-4 text-center">
                    <h2 className="title text-success">Welcome To Profile Page.</h2>
                    <h2 className="title"> Hi <span className="text-info" > {this.state.user.name}</span> </h2>
                     <Button color="danger"  className="btn-danger btn-sm mt-5" onClick={e=>{this.logout()}}> Logout </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Row>
        </div>
      </>
    );
  }
}
export default Profile