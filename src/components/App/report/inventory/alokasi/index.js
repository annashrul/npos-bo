import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Preloader from "Preloader";
import {FetchAlokasi} from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import ListAlokasiReport from "./src/list";
class AlokasiReport extends Component{
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
                let any = localStorage.getItem("any_alokasi_report");
                let page = localStorage.getItem('page_alokasi_report');
                this.props.dispatch(FetchAlokasi(page?page:1,any?any:''));
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

    componentWillReceiveProps = (nextProps) => {
        console.log("log lok",nextProps);
    }
    
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('lk_alokasi_report', lk.value);
    }

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };
    render(){
        return (
            <Layout page="AlokasiReport">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {
                                !this.props.isLoading ? (  <ListAlokasiReport
                                    data={this.props.alokasiReport}
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
    console.log("mapstate alokasi", state.alokasiReducer);
    return {
        auth: state.auth,
        alokasiReport:state.alokasiReducer.data,
        // total:state.alokasiReducer.total,
        isLoading: state.alokasiReducer.isLoading,
        isLoadingDetail: state.alokasiReducer.isLoadingDetail,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(AlokasiReport);