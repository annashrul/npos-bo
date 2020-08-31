import React,{Component} from 'react';
import {ModalBody, ModalHeader, ModalFooter} from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {ModalToggle} from "redux/actions/modal.action";
import {saveCustomerPrice,FetchCustomerPrice} from "redux/actions/masterdata/customer/customer.action";
import Paginationq from "helper";

class CustomerPrice extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnEnter = this.handleOnEnter.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleOnSearch = this.handleOnSearch.bind(this);
        this.state = {
            dataCustomer: [],
            q:''
        }
    }
    componentWillReceiveProps(nextProps){
        
        let data=[];
        typeof nextProps.dataCustomerPrice.data==='object'?
            nextProps.dataCustomerPrice.data.map((v,i)=>{
                data.push({"kd_cust":v.kd_cust,"nama":v.nama,"harga":v.harga});
            })
        : "";
        this.setState({dataCustomer:data});
    }
    handleChange(event,i){
        this.setState({ [event.target.name]: event.target.value });
        let dataCustomer = [...this.state.dataCustomer];
        dataCustomer[i] = {...dataCustomer[i], [event.target.name]: event.target.value};
        this.setState({ dataCustomer });
    }
    handleOnEnter(i){
        
        let data={};
        data['kd_cust'] = this.state.dataCustomer[i].kd_cust;
        data['kd_brg'] = localStorage.getItem("kd_brg_price_customer");
        data['harga'] = this.state.dataCustomer[i].harga;
        
        this.props.dispatch(saveCustomerPrice(data));


    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        localStorage.removeItem("nm_brg_price_customer");
        localStorage.removeItem("kd_brg_price_customer");
        localStorage.removeItem("q_price_customer");
        localStorage.removeItem("page_price_customer");
    };
    handlePageChange(pageNumber){
        let q=localStorage.getItem("q_price_customer");
        localStorage.setItem("page_price_customer",pageNumber);
        this.props.dispatch(FetchCustomerPrice(localStorage.getItem("kd_brg_price_customer"),pageNumber,q===undefined&&q===null?'':q));
    }
    handleOnSearch(){
        let page=localStorage.getItem("page_price_customer");
        
        localStorage.setItem("q_price_customer",this.state.q);
        this.props.dispatch(FetchCustomerPrice(localStorage.getItem("kd_brg_price_customer"),page===null?1:page,this.state.q));

    }


    render(){
        const {total,per_page,current_page} = this.props.dataCustomerPrice;

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "CustomerPrice"} size="md">
                <ModalHeader toggle={this.toggle}><p>{localStorage.getItem("nm_brg_price_customer")} ( {localStorage.getItem("kd_brg_price_customer")} ) <br/> <small>( Enter Untuk Menyimpan Data )</small> </p></ModalHeader>
                <ModalBody>
                    <input type="text" placeholder="Cari berdasarkan nama customer" name="q" className="form-control" value={this.state.q}  onChange={(e)=>this.handleChange(e,null)} onKeyPress = {
                        event => {
                            if (event.key === 'Enter') {
                                this.handleOnSearch();
                            }
                        }}/>
                    <br/>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Customer</th>
                            <th>Harga</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                this.state.dataCustomer.length > 0 ? this.state.dataCustomer.map((v, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i+1}</td>
                                            <td>{v.nama}</td>
                                            <td>
                                                <input type="text" name="harga" className="form-control" value={v.harga} onChange={(e)=>this.handleChange(e,i)}  onKeyPress = {
                                                    event => {
                                                        if (event.key === 'Enter') {
                                                            this.handleOnEnter(i);
                                                        }
                                                    }
                                                }/>
                                            </td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan="3"><p className="text-center">tidak ada data</p></td></tr>
                            )
                        }
                        </tbody>
                    </table>
                </ModalBody>
                <ModalFooter>
                    <div style={{"marginTop":"20px","float":"right"}}>
                        <Paginationq
                            current_page={current_page}
                            per_page={per_page}
                            total={total}
                            callback={this.handlePageChange.bind(this)}
                        />
                    </div>
                </ModalFooter>
            </WrapperModal>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(CustomerPrice);