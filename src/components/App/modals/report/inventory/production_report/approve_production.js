import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {storeApproval} from "redux/actions/inventory/produksi.action";
import Swal from 'sweetalert2';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
class ApproveProduction extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleCommonInputChange = this.HandleCommonInputChange.bind(this);
        this.state = {
            txtHpp:'',
            txtSisaApproval:'',
            error:{
                txtHpp:"",
                txtSisaApproval:"",
            },
        }
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        localStorage.removeItem("code");
        localStorage.removeItem("barcode");
        localStorage.removeItem("name");
    };

    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;
        this.setState({
            [column]: val
        });
        if(errs){
            let err = Object.assign({}, this.state.error, {
                [column]: ""
            });
            this.setState({
                error: err
            });
        }
    }

    HandleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        if (this.state.txtHpp === "" || this.state.txtSisaApproval === ""){
            if(this.state.txtHpp===""){
                err = Object.assign({}, err, {
                    txtHpp:"Hpp tidak boleh kosong."
                });
            }
            if (this.state.txtSisaApproval === "") {
                err = Object.assign({}, err, {
                    txtSisaApproval: "Sisa Approval tidak boleh kosong."
                });
            }
            this.setState({
                error: err
            })
        }else{
            Swal.fire({
                title: 'Approve?',
                text: "Pastikan data yang anda masukan sudah benar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Simpan!',
                cancelButtonText: 'Tidak!'
            }).then((result) => {
                if (result.value) {
                    let data={};
                    data['hpp'] = this.state.txtHpp;
                    data['sisa_approval'] = this.state.txtSisaApproval;
                    data['kd_trx'] = localStorage.getItem('code_for_approve');
                    this.props.dispatch(storeApproval(data));
                }
            })
        }
    }

    render(){
        console.log("############# STATE SIITU",this.props);
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "approveProduction"} size="md">
                <ModalHeader toggle={this.toggle}>Approve Production {localStorage.getItem('code_for_approve')}</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>HPP</th>
                                    <th className="text-black" style={columnStyle}>Sisa Approval</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{textAlign:"center"}}>
                                            <input type="text" className="form-control" name="txtHpp" value={this.state.txtHpp === ''?localStorage.getItem('hpp_for_approve'):this.state.txtHpp} onChange={(e => this.HandleCommonInputChange(e))}></input>
                                            <div className="invalid-feedback"
                                                     style={this.state.error.txtHpp !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.txtHpp}
                                                </div>
                                        </td>
                                        <td style={{textAlign:"center"}}>
                                            <input type="text" className="form-control" name="txtSisaApproval" value={this.state.txtSisaApproval} onChange={(e => this.HandleCommonInputChange(e))}></input>
                                            <div className="invalid-feedback"
                                                     style={this.state.error.txtSisaApproval !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.txtSisaApproval}
                                                </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-light">
                                    <tr>
                                        <td colSpan="2"><button type="button" className="btn btn-primary btn-block" onClick={(e => this.HandleSubmit(e))}>APPROVE</button></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </ModalBody>

                </WrapperModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapState", state);
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        // stockReportApproveProduction:state.stockReportReducer.dataApproveTransaksi,
        // isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(ApproveProduction);