import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {deleteSupplier, FetchSupplier} from "redux/actions/masterdata/supplier/supplier.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import FormSupplier from "components/App/modals/masterdata/supplier/form_supplier";
import Swal from "sweetalert2";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

class ListSupplier extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_customer",pageNumber);
        this.props.dispatch(FetchSupplier(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchSupplier(1,''))
        }else{
            this.props.dispatch(FetchSupplier(1,any))
        }
    }
    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSupplier"));
        if(i===null){
            this.setState({detail:undefined});
        }else{
            this.setState({
                detail:{
                    "kode":this.props.data.data[i].kode,
                    "nama":this.props.data.data[i].nama,
                    "alamat":this.props.data.data[i].alamat,
                    "kota":this.props.data.data[i].kota,
                    "telp":this.props.data.data[i].telp,
                    "penanggung_jawab":this.props.data.data[i].penanggung_jawab,
                    "no_penanggung_jawab":this.props.data.data[i].no_penanggung_jawab,
                    "status":this.props.data.data[i].status,
                    "email":this.props.data.data[i].email,
                }
            })
        }
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
                this.props.dispatch(deleteSupplier(id,this.props.token));
            }
        })

    }
    render(){
        const centerStyle = {verticalAlign: "middle", textAlign: "center"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        // const noWrap = {whiteSpace: "nowrap"};
        const {total,per_page,current_page,data} = this.props.data;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_customer')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-4 col-md-4">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e,null)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>


                    </div>

                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={centerStyle}>#</th>
                            <th className="text-black" style={centerStyle}>Code</th>
                            <th className="text-black" style={centerStyle}>Name</th>
                            <th className="text-black" style={centerStyle}>Address</th>
                            <th className="text-black" style={centerStyle}>City</th>
                            <th className="text-black" style={centerStyle}>Phone</th>
                            <th className="text-black" style={centerStyle}>responsible</th>
                            <th className="text-black" style={centerStyle}>responsible No</th>
                            <th className="text-black" style={centerStyle}>Status</th>
                            <th className="text-black" style={centerStyle}>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={centerStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                            <UncontrolledButtonDropdown>
                                                            <DropdownToggle caret>
                                                                Aksi
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem onClick={(e)=>this.toggleModal(e,i)}>Edit</DropdownItem>
                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.kode)}>Delete</DropdownItem>
                                                            </DropdownMenu>
                                                            </UncontrolledButtonDropdown>
                                                    </div>
                                                </td>
                                                <td style={leftStyle}>{v.kode}</td>
                                                <td style={leftStyle}>{v.nama}</td>
                                                <td style={leftStyle}>{v.alamat}</td>
                                                <td style={leftStyle}>{v.kota}</td>
                                                <td style={rightStyle}>{v.telp}</td>
                                                <td style={leftStyle}>{v.penanggung_jawab}</td>
                                                <td style={rightStyle}>{v.no_penanggung_jawab}</td>
                                                <td style={centerStyle}>{v.status==='1'?statusQ('success','Active'):statusQ('danger','In Active')}</td>
                                                <td style={leftStyle}>{v.email}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                    </table>

                </div>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
                <FormSupplier token={this.props.token} detail={this.state.detail}/>
            </div>
        )
    }
}

export default connect()(ListSupplier)