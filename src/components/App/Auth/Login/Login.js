import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BgAuth from "../../../../assets/images/logo2.png"
import './login.css'
import {loginUser} from 'redux/actions/authActions';
import Swal from 'sweetalert2'
import {HEADERS} from 'redux/actions/_constants'
import moment from "moment";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '',
            password: '',
            // disableButton:false,
            // server_price:0,
            // acc_name:"",
            // acc_number:0,
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
                console.log("respon site",data);
                let tgl_tempo = new Date(data.result.tanggal_tempo);

                let lastWeek = new Date(tgl_tempo.getFullYear(), tgl_tempo.getMonth(), tgl_tempo.getDate() - 7);
                let tgl_local = moment(new Date()).format("yyyy-MM-DD");

                localStorage.setItem("tanggal_tempo",moment(tgl_tempo).format("yyyy-MM-DD"));
                localStorage.setItem("tanggal_lokal",tgl_local);
                localStorage.setItem("tanggal_info",moment(lastWeek).format("yyyy-MM-DD"));
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
        this.getProps(nextProps)
     }
     componentWillMount(){
        this.getProps(this.props);
     }
     getProps(param){
         if(param.auth.isAuthenticated){
             param.history.push('/');
         }else{
             if(param.errors){
                 this.setState({errors: param.errors})
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
        const {email,password, errors,disableButton,server_price,acc_name,acc_number} = this.state;
        console.log(this.state);
        return (
        <div class="limiter">
            <div class="container-login100">
                <div className="row">
                    <div className={'col-md-12'}>
                        <div className="wrap-login100 p-b-160 p-t-50">
                            <form className="login100-form validate-form" action="#">
                                <span className="login100-form-title p-b-43 mb-5">
                                <img alt="logos" src={this.state.logo} className='img-responsive' width={this.state.width} style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}/>
                                    {/* Account Login */}
                                </span>
                                <div className="wrap-input100 rs1 validate-input" data-validate="Username is required">
                                    <input type="text" readOnly={disableButton}
                                           className={email !== '' ? 'input100 has-val' : 'input100'}
                                           placeholder="Username"
                                           name="email"
                                           value={email}
                                           onChange={this.handleInputChange}/>
                                    <span className="label-input100">Username</span>
                                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                </div>
                                <div className="wrap-input100 rs2 validate-input" data-validate="Password is required">
                                    <input
                                        readOnly={disableButton}
                                        type="password"
                                        className={password !== '' ? 'input100 has-val' : 'input100'}
                                        placeholder="Password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleInputChange}/>
                                    <span className="label-input100">Password</span>
                                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                </div>
                                <div className="container-login100-form-btn">
                                    <button disabled={disableButton} className="login100-form-btn" type="submit"
                                            onClick={this.submitHandelar}>
                                        Sign in
                                    </button>
                                </div>
                                <div className="text-center w-full p-t-23">
                                    <a href="about:blank" className="txt1">
                                        {/* Login ke backoffice. */}
                                    </a>
                                </div>
                            </form>
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