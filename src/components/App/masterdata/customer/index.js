import React,{Component} from 'react'
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Preloader from "../../../Preloader";
import Layout from "../../_layout";
import connect from "react-redux/es/connect/connect";
import {sessionService} from "redux-react-session";
import {FetchCustomer} from "../../../actions/masterdata/customer/customer.action";
import ListCustomer from "./src/master_customer/list";
import {FetchCustomerType} from "../../../actions/masterdata/customer_type/customer_type.action";
import ListCustomerType from "./src/master_customer_type/list";

class Customer extends Component{
    constructor(props){
        super(props);
        this.state={
            token:''
        }
    }
    componentWillMount(){
        sessionService.loadSession().then(session => {
            this.setState({
                token:session.token
            },()=>{
                this.setState({token:session.token})
                let anyCustomer = localStorage.getItem("any_customer");
                let anyCustomerType = localStorage.getItem("any_customer_type");
                let pageCustomer = localStorage.getItem("page_customer");
                let pageCustomerType = localStorage.getItem("page_customer_type");
                this.props.dispatch(FetchCustomer(pageCustomer?pageCustomer:1,anyCustomer?anyCustomer:''));
                this.props.dispatch(FetchCustomerType(pageCustomerType?pageCustomerType:1,anyCustomerType?anyCustomerType:''));
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
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
            console.log('Selected tab: ' + this.state.selectedIndex);
        })
    };


    render(){
        return (
            <Layout page="Customer">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <Tabs>
                                <TabList>
                                    <Tab onClick={() =>this.handleSelect(0)}>Master Customer</Tab>
                                    <Tab onClick={() =>this.handleSelect(1)}>Master Customer Type</Tab>
                                </TabList>
                                <TabPanel>
                                    {
                                        !this.props.isLoading?<ListCustomer token={this.state.token} data={this.props.customer}/>:<Preloader/>
                                    }

                                </TabPanel>
                                <TabPanel>
                                    {
                                        !this.props.isLoading1?<ListCustomerType token={this.state.token} data={this.props.customerType}/>:<Preloader/>
                                    }
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
        authenticated: state.sessionReducer.authenticated,
        customer: state.customerReducer.data,
        customerType: state.customerTypeReducer.data,
        isOpen:state.modalReducer,
        isLoading: state.customerReducer.isLoading,
        isLoading1: state.customerTypeReducer.isLoading,
    }
}
export default connect(mapStateToProps)(Customer)