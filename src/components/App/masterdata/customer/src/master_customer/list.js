import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import {
    deleteCustomer,
    FetchCustomer,
    FetchCustomerEdit,
    setCustomerEdit
} from "redux/actions/masterdata/customer/customer.action";
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';
import FormCustomer from "components/App/modals/masterdata/customer/form_customer";
import {
    FetchCustomerTypeAll
} from "redux/actions/masterdata/customer_type/customer_type.action";
import Swal from "sweetalert2";

class ListCustomer extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModalEdit = this.toggleModalEdit.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_customer",pageNumber);
        this.props.dispatch(FetchCustomer(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchCustomer(1,''))
        }else{
            this.props.dispatch(FetchCustomer(1,any))
        }
    }
    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCustomer"));
        this.props.dispatch(FetchCustomerTypeAll());
        this.props.dispatch(setCustomerEdit([]))
    }
    toggleModalEdit(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCustomer"));
        this.props.dispatch(FetchCustomerTypeAll());
        this.props.dispatch(FetchCustomerEdit(i))
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
                this.props.dispatch(deleteCustomer(id,this.props.token));
            }
        })

    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
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
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Address</th>
                            <th className="text-black" style={columnStyle}>Status</th>
                            <th className="text-black" style={columnStyle}>Handphone</th>
                            <th className="text-black" style={columnStyle}>Special Price</th>
                            <th className="text-black" style={columnStyle}>Cust Type</th>
                            <th className="text-black" style={columnStyle}>Gender</th>
                            <th className="text-black" style={columnStyle}>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>
                                                    <div className="btn-group">
                                                            <UncontrolledButtonDropdown>
                                                            <DropdownToggle caret>
                                                                Aksi
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem onClick={(e)=>this.toggleModalEdit(e,v.kd_cust)}>Edit</DropdownItem>
                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.kd_cust)}>Delete</DropdownItem>
                                                            </DropdownMenu>
                                                            </UncontrolledButtonDropdown>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.kd_cust}</td>
                                                <td style={columnStyle}>{v.nama}</td>
                                                <td style={columnStyle}>{v.alamat}</td>
                                                <td style={columnStyle}>{v.status==='1'?statusQ('success','Active'):statusQ('danger','In Active')}</td>
                                                <td style={columnStyle}>{v.tlp}</td>
                                                <td style={columnStyle}>{v.special_price==='1'?statusQ('success','Yes'):statusQ('danger','No')}</td>
                                                <td style={columnStyle}>{v.cust_type}</td>
                                                <td style={columnStyle}>{v.jenis_kelamin==='1'?'Male':'Female'}</td>
                                                <td style={columnStyle}>{v.email}</td>
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
                {
                    // this.props.dataCustomerEdit!==undefined?
                        <FormCustomer
                            dataCustomerEdit={this.props.dataCustomerEdit}
                            dataCustomerTypeAll={this.props.dataCustomerTypeAll}
                        />
                        // : <Preloader/>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataCustomerEdit:state.customerReducer.edit,
        dataCustomerTypeAll:state.customerTypeReducer.all,
        isLoading: state.customerReducer.isLoading,
    }
}
export default connect(mapStateToProps)(ListCustomer)