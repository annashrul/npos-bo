import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Preloader from "Preloader";
import {FetchClosing} from "redux/actions/report/closing/closing.action";
import connect from "react-redux/es/connect/connect";
import ListClosing from "./src/list";
class Closing extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:"",
            selectedIndex : 0
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillMount(){
        // sessionService.loadSession().then(session => {
        //     this.setState({
        //         token:session.token
        //     },()=>{
                // this.setState({token:session.token});
                let any = localStorage.getItem("any_closing_report");
                let page = localStorage.getItem('page_closing_report');
                // this.props.dispatch(FetchClosing(page?page:1,any?any:''));
        //     })}
        // );
        // sessionService.loadUser()
        //     .then(user=>{
        //         this.setState({
        //             id:user.id
        //         },()=>{
        //         })
        //     })
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };
componentWillReceiveProps = (nextProps) => {
    console.log("nextProps index", nextProps)
    // if (nextProps.auth.user) {
    //     let lk = []
    //     let loc = nextProps.auth.user.lokasi;
    //     if(loc!==undefined){
    //         loc.map((i) => {
    //             lk.push({
    //             value: i.kode,
    //             label: i.nama
    //             });
    //         })
    //         this.setState({
    //             location_data: lk,
    //             userid: nextProps.auth.user.id
    //         })
    //     }
    // }
}
    render(){
        return (
            <Layout page="Closing">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListClosing
                                    data={this.props.closing}
                                    // pagin={this.handlePagin}
                                    // search={this.handleSearch}
                                    // token={this.state.token}
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
    console.log("mapstate closing", state.closingReducer);
    return {
        // authenticated: state.sessionReducer.authenticated,
        closing:state.closingReducer.data,
        // total:state.closingReducer.total,
        isLoading: state.closingReducer.isLoading,
        // isLoadingDetail: state.closingReducer.isLoadingDetail,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(Closing);