import React,{Component} from 'react';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import ListUserList from "./master_user_list/list";
import Preloader from "Preloader";
import {FetchUserLevel} from "redux/actions/masterdata/user_level/user_level.action";
import {FetchUserList} from "redux/actions/masterdata/user_list/user_list.action";

import ListUserLevel from "./master_user_level/list";


class User extends Component{
    constructor(props){
        super(props);
        this.handlePagin=this.handlePagin.bind(this);
        this.state = {
            token : ""
        }

    }
    componentWillMount(){
        this.props.dispatch(FetchUserList());
        this.props.dispatch(FetchUserLevel(1,'',15));
    }
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
            console.log('Selected tab: ' + this.state.selectedIndex);
        });
        if(index !== 0){
            localStorage.setItem('page_user','level');
            // this.props.dispatch(FetchUserLevel(1,'',15));
        }else{
            localStorage.setItem('page_user','list')
        }
    };
    handlePagin(page,any){
        let sess = localStorage.getItem("page_user");
        if(sess === null || sess === undefined || sess === 'list'){
            this.props.dispatch(FetchUserList(page,any))
        }else{
            this.props.dispatch(FetchUserLevel(page,any,3))
        }
    }

    render(){
        return (
            <Layout page="User">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <Tabs>
                                <TabList>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(0)}>User List</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(1)}>User Level</Tab>
                                </TabList>
                                <TabPanel>
                                    {
                                        !this.props.isLoading?
                                            <ListUserList
                                                token={this.state.token}
                                                userListData={this.props.userlist}
                                                pagin={this.handlePagin}/>
                                        :<Preloader/>
                                    }

                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading1?
                                            <ListUserLevel
                                                token={this.state.token}
                                                data={this.props.userLevel}
                                                pagin={this.handlePagin}
                                            />
                                        :<Preloader/>
                                    }
                                    {/*<MasterUserLevel/>*/}
                                </TabPanel>
                            </Tabs>

                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // authenticated: state.sessionReducer.authenticated,
        userlist: state.userListReducer.data,
        userLevel: state.userLevelReducer.data,
        isOpen:state.modalReducer,
        isLoading: state.userListReducer.isLoading,
        isLoading1: state.userLevelReducer.isLoading
    }
}
export default connect(mapStateToProps)(User)