import React,{Component} from 'react';
import Layout from "../../_layout";
import connect from "react-redux/es/connect/connect";
import {sessionService} from "redux-react-session";
import {FetchSupplier} from "../../../actions/masterdata/supplier/supplier.action";
import Preloader from "../../../Preloader";
import ListSupplier from "./src/list";

class Supplier extends Component{
    constructor(props){
        super(props);
        this.state={token:''}
    }
    componentWillMount(){
        sessionService.loadSession().then(session => {
            this.setState({
                token:session.token
            },()=>{
                this.setState({token:session.token});
                let any = localStorage.getItem("any_supplier");
                let page = localStorage.getItem("page_supplier");
                this.props.dispatch(FetchSupplier(page?page:1,any?any:''));
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
            <Layout page="Supplier">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListSupplier
                                    data={this.props.supplier}
                                    pagin={this.handlePagin}
                                    search={this.handleSearch}
                                    token={this.state.token}
                                /> ) : <Preloader/>
                            }
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
        supplier:state.supplierReducer.data,
        isLoading: state.supplierReducer.isLoading,
    }
}

export default connect(mapStateToProps)(Supplier)