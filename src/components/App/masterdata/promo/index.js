import React,{Component} from 'react';
import Preloader from "Preloader";
import Layout from "../../Layout";
import ListPromo from "./src/list";
import connect from "react-redux/es/connect/connect";
import {FetchPromo, FetchPromoKategori} from "redux/actions/masterdata/promo/promo.action";

class Promo extends Component{
    constructor(props){
        super(props);
        this.state = {
            section:"list",
            token:"",
            any:localStorage.getItem('any_promo'),
        }
        this.handlePagin=this.handlePagin.bind(this);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[18]['label']==="0"){
                    alert("bukan halaman kamu");
                    this.props.history.push({
                        pathname: '/',
                        state: {from: this.props.location.pathname}
                    });
                }
            }
        }
    }

    componentDidMount(){
        this.props.dispatch(FetchPromoKategori());
    }

    componentWillMount(){
        let any = this.state.any;
        this.props.dispatch(FetchPromoKategori());
        this.props.dispatch(FetchPromo(1,any===undefined?'':any));
    }
    handlePagin(param){
        let any = this.state.any;
        this.props.dispatch(FetchPromo(param,any===undefined?'':any));
    }

    render(){
        return (
            <Layout page="Cash">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            {

                                !this.props.isLoading ? ( <ListPromo
                                    pagin={this.handlePagin}
                                    data={this.props.promo}
                                    data_kategori={this.props.promo_kategori}
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
    console.log("mapStateToProps promo", state.promoReducer)
    return {
        authenticated: state.auth,
        promo:state.promoReducer.data,
        promo_kategori:state.promoReducer.data_kategori,
        isLoading: state.promoReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Promo)