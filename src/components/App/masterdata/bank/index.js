import React,{Component} from 'react';
import Preloader from "Preloader";
import Layout from "../../Layout";
import ListBank from "./src/list";
import connect from "react-redux/es/connect/connect";
import {FetchBank} from "redux/actions/masterdata/bank/bank.action";

class Bank extends Component{
    constructor(props){
        super(props);
        this.state = {
            section:"list",
            token:"",
            any:localStorage.getItem('any_bank'),
        }
        this.handlePagin=this.handlePagin.bind(this);
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
        let any = this.state.any;
        this.props.dispatch(FetchBank(1,any===undefined?'':any));
    }
    handlePagin(param){
        let any = this.state.any;
        this.props.dispatch(FetchBank(param,any===undefined?'':any));
    }

    render(){
        return (
            <Layout page="Cash">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {

                                !this.props.isLoading ? ( <ListBank
                                    pagin={this.handlePagin}
                                    data={this.props.bank}
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
        bank:state.bankReducer.data,
        isLoading: state.bankReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Bank)