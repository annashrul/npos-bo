import React,{Component} from 'react';
import Layout from "../../Layout";
import ListCash from "./src/list";
import connect from "react-redux/es/connect/connect";
import Preloader from "Preloader";
import {deleteCash,FetchCash} from "redux/actions/masterdata/cash/cash.action";

class Cash extends Component{
    constructor(props){
        super(props);
        this.state = {
            section:"list",
            token:"",
            type:localStorage.getItem('type')!==null && localStorage.getItem('type')!==undefined?localStorage.getItem('type'):"0",
            any:localStorage.getItem('any')!==null && localStorage.getItem('any')!==undefined?localStorage.getItem('any'):"",
        }
        this.handlePagin=this.handlePagin.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[16]['label']==="0"){
                    alert("bukan halaman kamu");
                    this.props.history.push({
                        pathname: '/',
                        state: {from: this.props.location.pathname}
                    });
                }
            }
        }
    }

    componentWillMount(){
        let type = this.state.type;
        let any = this.state.any;
        this.props.dispatch(FetchCash(1,type===undefined&&type===null?'masuk':type,any===undefined?'':any));
    }

    handlePagin(param){
        let type = this.state.type;
        let any = this.state.any;
        this.props.dispatch(FetchCash(param,type===undefined&&type===null?'masuk':type,any===undefined?'':any))
    }

    handleDelete(id){
        this.props.dispatch(deleteCash(id));
        let type = this.state.type;
        let any = this.state.any;
        this.props.dispatch(FetchCash(1,type===undefined&&type===null?'masuk':type,any===undefined?'':any))
    }

    render(){
        return (
            <Layout page="Cash">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? ( <ListCash
                                    pagin={this.handlePagin}
                                    data={this.props.cash}
                                    deletes={this.handleDelete}
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
        authenticated: state.auth,
        cash:state.cashReducer.data,
        isLoading: state.cashReducer.isLoading,
        currentPage: state.cashReducer.currentPage,
        per_page: state.cashReducer.per_page,
        total: state.cashReducer.total,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Cash)