import React, {Component} from 'react'
import Layout from "../../Layout";
import {connect} from 'react-redux'

import {FetchLocation} from "redux/actions/masterdata/location/location.action";
import Preloader from "Preloader";
import ListLocation from "./master_location/list";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ListLocationCategory from "./master_location_catergory/list";
import {FetchLocationCategory} from "redux/actions/masterdata/location_category/location_category.action";

class Location extends Component{
    constructor(props){
        super(props);
        this.state = {
            section:"list",
            token:"",
            selectedIndex : 0
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[14]['label']==="0"){
                    // alert("bukan halaman kamu");
                    // this.props.history.push({
                    //     pathname: '/',
                    //     state: {from: this.props.location.pathname}
                    // });
                }
            }
        }
    }

    componentWillMount(){
        let anyLocation = localStorage.getItem("any_location");
        let anyLocationCategory = localStorage.getItem("any_location_category");
        let pageLocation = localStorage.getItem('pageLocation');
        let pageLocationCategory = localStorage.getItem('pageLocationCategory');
        this.props.dispatch(FetchLocation(pageLocation?pageLocation:1,anyLocation?anyLocation:''));
        this.props.dispatch(FetchLocationCategory(pageLocationCategory?pageLocationCategory:1,anyLocationCategory?anyLocationCategory:''));

    }

    handleSelect = (e,index) => {
        e.preventDefault();
        this.setState({selectedIndex: index});
    };

    render(){
        return (
            <Layout page="Location">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <Tabs>
                                <TabList>
                                    <Tab onClick={(e) =>this.handleSelect(e,0)} >Location</Tab>
                                    <Tab onClick={(e) =>this.handleSelect(e,1)} >Location Category</Tab>
                                </TabList>
                                <TabPanel>
                                    {
                                        !this.props.isLoading ? ( <ListLocation
                                            token={this.state.token}

                                            data={this.props.location}
                                            dataLocationCategory={this.props.locationCategory}/>
                                        ) : <Preloader/>
                                    }
                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading1 ? (  <ListLocationCategory
                                            token={this.state.token}
                                            data={this.props.locationCategory}/>
                                        ) : <Preloader/>
                                    }
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
                {/*<Form/>*/}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        location:state.locationReducer.data,
        locationCategory:state.locationCategoryReducer.data,
        isLoading: state.locationReducer.isLoading,
        isLoading1: state.locationCategoryReducer.isLoading,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Location)