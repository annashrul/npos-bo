import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchMeja} from "redux/actions/masterdata/meja/meja.action";
import {FetchAreaAll} from "redux/actions/masterdata/area/area.action";
import Preloader from "Preloader";
import ListMeja from "./src/list";

class Meja extends Component{
    constructor(props){
        super(props);
        this.state={token:''}
    }
    componentWillMount(){
        let any = localStorage.getItem("any_meja");
        let page = localStorage.getItem("page_meja");
        this.props.dispatch(FetchMeja(page?page:1,any?any:''));
        this.props.dispatch(FetchAreaAll());
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[13]['label']==="0"){
                    alert("bukan halaman kamu");
                    this.props.history.push({
                        pathname: '/',
                        state: {from: this.props.location.pathname}
                    });
                }
            }
        }
    }


    render(){
        return (
            <Layout page="Meja">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListMeja
                                    data={this.props.meja}
                                    area={this.props.area}
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
        area:state.areaReducer.dataArea,
        meja:state.mejaReducer.data,
        isLoading: state.mejaReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Meja)