import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BgAuth from "../../../../assets/img/bg-img/1.png"

import {loginUser} from '../../../../redux/actions/authActions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            errors:{
            }
         };
    }
    componentDidMount = ()=>{
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/')
        }
    }
    componentWillReceiveProps = (nextProps)=>{
        if(nextProps.auth.isAuthenticated){
            this.props.history.push('/');
        }else{
            if(nextProps.errors){
                this.setState({errors: nextProps.errors})
            }
        }
     }

    submitHandelar = (event)=>{
        event.preventDefault();
        const {email,password} = this.state;
        const user = {
            username: email,
            password: password
        }
        this.props.loginUser(user);
    }

    handleInputChange =(event)=> {
        event.preventDefault();
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    render() {
        const {email,password, errors} = this.state;
        const {user} = this.props;
        console.log(errors);
        return (
             <div className="main-content- h-100vh">
                <div className="container h-100">
                    <div className="row h-100 align-items-center justify-content-center">
                        <div className="col-12">
                            {/* Middle Box */}
                            <div className="middle-box">
                                <div className="card">
                                    <div className="card-body p-4">
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="xs-d-none mb-50-xs break-320-576-none">
                                                    <img src={BgAuth} alt="" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {/* Logo */}
                                                <h4 className="font-18 mb-30">Welcome back! Log in to your account.</h4>
                                                {/* <form action="#"> */}
                                                    <div className="form-group">
                                                        <label className="float-left" htmlFor="emailaddress">Username</label>
                                                        {/* <input autoFocus type="text" name="username" onChange={this.handleOnChange} required placeholder="Username" className="form-control"  /> */}
                                                        <input type="text" 
                                                            className="form-control" 
                                                            placeholder="Username" 
                                                            name="email"  
                                                            value={email}
                                                            onChange={this.handleInputChange}/>
                                                        {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                                    </div>
                                                    <div className="form-group">
                                                        <a href="forget-password.html" className="text-dark float-right" />
                                                        <label className="float-left" htmlFor="password">Password</label>
                                                        <input 
                                                            type="password" 
                                                            className="form-control" 
                                                            placeholder="Password" 
                                                            name="password"        
                                                            value={password}
                                                            onChange={this.handleInputChange}/>
                                                        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                                        {/* <input type="password" name="password" onChange={this.handleOnChange} required placeholder="Password" className="form-control"  /> */}

                                                        {/* <input className="form-control" type="password" required id="password" placeholder="Enter your password" /> */}
                                                    </div>
                                                    <div className="form-group d-flex justify-content-between align-items-center mb-3">
                                                        <div className="checkbox d-inline mb-0">
                                                            <input type="checkbox" name="checkbox-1" id="checkbox-8" />
                                                            <label htmlFor="checkbox-8" className="cr mb-0">Remember me</label>
                                                        </div>
                                                        <span className="font-13 text-primary"><a href="javascript:void(0)">Forgot your password?</a></span>
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <button className="btn btn-primary btn-block" type="submit" onClick={this.submitHandelar}> Log In </button>
                                                    </div>
                                                {/* </form> */}
                                            </div> {/* end card-body */}
                                        </div>
                                        {/* end card */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
              );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object,
    errors: PropTypes.object
}

const mapStateToProps = ({auth, errors}) =>{
    return{
        auth : auth,
        errors: errors.errors
    }
}

export default connect(mapStateToProps,{loginUser})(Login);