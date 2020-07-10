import React,{Component} from 'react';
import Preloader from "../../../Preloader";
import Layout from "../../_layout";
import connect from "react-redux/es/connect/connect";
import ListDepartment from "./list_department";
import ListSubDepartment from "./list_sub_department";
import {sessionService} from "redux-react-session";
import {FetchDepartment} from "../../../actions/masterdata/department/department.action";
import {FetchSubDepartment} from "../../../actions/masterdata/department/sub_department.action";

class Department extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:''
        }
    }
    componentWillMount(){
        sessionService.loadSession().then(session => {
            this.setState({
                token:session.token
            },()=>{
                this.setState({token:session.token});
                this.props.dispatch(FetchDepartment());
                this.props.dispatch(FetchSubDepartment());
            })}
        );
        sessionService.loadUser()
            .then(user=>{
                console.log(user);
                this.setState({
                    id:user.id
                },()=>{
                })
            })
    }
    render(){
        return (
            <Layout page="Department">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-ld-6 col-md-6 col-sm-12 col-xs-12">
                                    {
                                        !this.props.isLoading ? (  <ListDepartment token={this.state.token} data={this.props.department}/> ) : <Preloader/>
                                    }
                                </div>
                                <div className="col-12 col-ld-6 col-md-6 col-sm-12 col-xs-12">
                                    {
                                        !this.props.isLoading1 ? (  <ListSubDepartment token={this.state.token} data={this.props.subDepartment}/> ) : <Preloader/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.sessionReducer.authenticated,
        department:state.departmentReducer.data,
        subDepartment:state.subDepartmentReducer.data,
        isLoading: state.departmentReducer.isLoading,
        isLoading1: state.subDepartmentReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Department)