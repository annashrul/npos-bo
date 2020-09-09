import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchArea} from "redux/actions/masterdata/area/area.action";
import Preloader from "Preloader";
import ListArea from "./src/list";

class Area extends Component{
    constructor(props){
        super(props);
        this.state={token:''}
    }
    componentWillMount(){
        let any = localStorage.getItem("any_area");
        let page = localStorage.getItem("page_area");
        this.props.dispatch(FetchArea(page?page:1,any?any:''));
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
            <Layout page="Area">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListArea
                                    data={this.props.area}
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
        area:state.areaReducer.data,
        isLoading: state.areaReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Area)