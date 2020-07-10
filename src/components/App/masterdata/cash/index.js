import React,{Component} from 'react';
import Layout from "../../_layout";
import ListCash from "./src/list";
import connect from "react-redux/es/connect/connect";
import {sessionService} from "redux-react-session";
import {deleteCash, FetchCash} from "../../../actions/masterdata/cash/cash.action";
import Preloader from "../../../Preloader";

class Cash extends Component{
    constructor(props){
        super(props);
        this.state = {
            section:"list",
            token:"",
            type:localStorage.getItem('type'),
            any:localStorage.getItem('any'),
        }
        this.handlePagin=this.handlePagin.bind(this);
        this.handleDelete=this.handleDelete.bind(this);
    }

    componentWillMount(){
        sessionService.loadSession().then(session => {
            this.setState({
                token:session.token
            },()=>{
                this.setState({token:session.token});
                // this.getMem()
                let type = this.state.type;
                let any = this.state.any;
                this.props.dispatch(FetchCash(1,type===undefined?'masuk':type,any===undefined?'':any));

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

    handlePagin(param){
        let type = this.state.type;
        let any = this.state.any;
        this.props.dispatch(FetchCash(param,type===undefined?'masuk':type,any===undefined?'':any))
    }

    handleDelete(id){
        console.log("ID",id);
        console.log("TOKEN",this.state.token);
        this.props.dispatch(deleteCash(id,this.state.token));
        let type = this.state.type;
        let any = this.state.any;
        this.props.dispatch(FetchCash(1,type===undefined?'masuk':type,any===undefined?'':any))
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
        authenticated: state.sessionReducer.authenticated,
        cash:state.cashReducer.data,
        isLoading: state.cashReducer.isLoading,
        currentPage: state.cashReducer.currentPage,
        per_page: state.cashReducer.per_page,
        total: state.cashReducer.total,
    }
}

export default connect(mapStateToProps)(Cash)