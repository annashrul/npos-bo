import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BgAuth from "../../../../assets/images/logo2.png"
import './login.css'
import {loginUser} from 'redux/actions/authActions';
import Swal from 'sweetalert2'
import {HEADERS} from 'redux/actions/_constants'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            errors:{
            },
            logo: BgAuth,
            width:'100px'
         };
    }
    getFaviconEl() {
        return document.getElementById("favicon");
    }

    componentDidMount (){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/')
        }
        fetch(HEADERS.URL + `site/logo`)
        .then(res => res.json())
        .then(
            (data) => {
                this.setState({
                    logo: data.result.logo,
                    width:data.result.width
                })
                const favicon = this.getFaviconEl(); // Accessing favicon element
                favicon.href = data.result.fav_icon;
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )

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
        if(email!==''&&password!==''){
            const user = {
                username: email,
                password: password
            }
            this.props.loginUser(user);
        }else{
            Swal.fire(
                'Error!',
                'Isi username dan password terlebih dahulu.',
                'error'
            )
        }
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
        return (
        <div class="limiter">
            <div class="container-login100">
                <div class="wrap-login100 p-b-160 p-t-50">
                    <form class="login100-form validate-form" action="#">

                        <span class="login100-form-title p-b-43 mb-5">
                        <img alt="logos" src={this.state.logo} className='img-responsive' width={this.state.width} style={{textAlign:'center',marginLeft:'auto',marginRight:'auto',display:'block'}}/>
                        {/* Account Login */}
                        </span>
                        <div class="wrap-input100 rs1 validate-input" data-validate="Username is required">
                            <input type="text" 
                                className = {email!==''?'input100 has-val':'input100'}
                                placeholder="Username" 
                                name="email"  
                                value={email}
                                onChange={this.handleInputChange}/>
                            <span class="label-input100">Username</span>
                            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                        </div>
                        <div class="wrap-input100 rs2 validate-input" data-validate="Password is required">
                            <input 
                                type="password" 
                                className = {password!==''?'input100 has-val':'input100'}
                                placeholder="Password" 
                                name="password"        
                                value={password}
                                onChange={this.handleInputChange}/>
                            <span class="label-input100">Password</span>
                            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                        </div>
                        <div class="container-login100-form-btn">
                            <button class="login100-form-btn" type="submit" onClick={this.submitHandelar}>
                            Sign in
                            </button>
                        </div>
                        <div class="text-center w-full p-t-23">
                            <a href="#" class="txt1">
                            {/* Login ke backoffice. */}
                            </a>
                        </div>
                    </form>
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