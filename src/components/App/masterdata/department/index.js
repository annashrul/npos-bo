import React,{Component} from 'react';
import Preloader from "Preloader";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import ListDepartment from "./list_department";
import ListSubDepartment from "./list_sub_department";
import {FetchDepartment} from "redux/actions/masterdata/department/department.action";
import {FetchSubDepartment} from "redux/actions/masterdata/department/sub_department.action";

class Department extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:''
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchDepartment());
        this.props.dispatch(FetchSubDepartment());
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
        department:state.departmentReducer.data,
        subDepartment:state.subDepartmentReducer.data,
        isLoading: state.departmentReducer.isLoading,
        isLoading1: state.subDepartmentReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Department)