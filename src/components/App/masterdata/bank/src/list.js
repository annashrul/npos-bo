import React,{Component} from 'react';
import {deleteBank, FetchBank} from "redux/actions/masterdata/bank/bank.action";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import FormBank from "components/App/modals/masterdata/bank/form_bank";
import Swal from "sweetalert2";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import Default from 'assets/default.png';

class ListBank extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        this.props.pagin(pageNumber);
    }
    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let any = data.get('any');
        localStorage.setItem('any_bank',any);

        if(any!==''||any!==undefined||any!==null){
            this.props.dispatch(FetchBank(1,any));
        }else{
            this.props.dispatch(FetchBank(1,''));
        }
    }
    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBank"));
        this.setState({detail:{}})
    }
    handleEdit(e,id,akun,debit,kredit,edc,foto,status,nama) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBank"));
        this.setState({
            detail:{
                "id":id,
                "akun":akun,
                "charge_debit":debit,
                "charge_kredit":kredit,
                "edc":edc,
                "foto":foto,
                "status":status,
                "nama":nama,
            }
        });
    }

    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteBank(id));
            }
        })

    }
    render(){
        const {current_page,data,per_page,total} = this.props.data;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-8 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_bank')}/>
                            </div>
                        </div>
                        <div className="col-4 col-xs-2 col-md-3">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                </form>
                <div className="row">
                    {
                        (
                            total !== '0'?
                            typeof data === 'object' ?
                                data.map((v,i)=>{
                                    return(
                                        <div className="col-xl-3 col-md-6 mb-4" key={i}>
                                            <div className="card">
                                                <div className="social-widget">
                                                    <div className={v.status==='1'?'bg-success p-3 text-center text-white font-30':'bg-danger p-3 text-center text-white font-30'}>
                                                        <img src={v.foto === null?'error':v.foto} alt="netindo" onError={(e)=>{e.target.onerror = null; e.target.src=`${Default}`}} style={{height:"120px"}}/>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 text-left">
                                                            <div className="p-2">
                                                                <p style={{fontSize:"12px"}}>{v.akun}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 text-center">
                                                            <div className="p-2">
                                                                <div className="dashboard-dropdown">
                                                                    <div className="dropdown">
                                                                    <UncontrolledButtonDropdown>
                                                                    <DropdownToggle caret>
                                                                        <i style={{color:'white '}} className="fa fa-sort-desc"/>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu>
                                                                        <DropdownItem  onClick={(e)=>this.handleEdit(
                                                                                e,v.id,v.akun,v.charge_debit,v.charge_kredit,v.edc,v.foto,v.status,v.nama
                                                                            )}><i className="ti-pencil-alt"></i> Edit</DropdownItem>
                                                                        <DropdownItem onClick={(e)=>this.handleDelete(e,v.id)}><i className="ti-trash"></i> Delete</DropdownItem>
                                                                    </DropdownMenu>
                                                                    </UncontrolledButtonDropdown>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12 text-left">
                                                            <div className="p-2">
                                                                <table className="table" style={{padding:0,border:"none"}}>
                                                                    <thead>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Bank Name</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.nama}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Charge Debit</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.charge_debit}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Charge Credit</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.charge_kredit}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>EDC</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.edc==='1'?<i className="fa fa-check-circle" style={{color:"green"}}></i>:<i className="fa fa-close" style={{color:"red"}}></i>}</th>
                                                                    </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : "No data." : <div className="col-md-12">
                                    <h1 className="text-center">No Data</h1>
                                </div>
                        )
                    }
                </div>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
                 <FormBank token={this.props.token} detail={this.state.detail}/>
            </div>
        );
    }
}

export default connect()(ListBank)
