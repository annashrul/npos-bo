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
        this.handleChange = this.handleChange.bind(this);
        this.state={
            field_any:'',
            detail:{},
        }
    }
    handleChange = (e)=>{
        this.setState({[e.target.name]:e.target.value})
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
        Swal.fire({allowOutsideClick: false,
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
        const centerStyle = {verticalAlign: "middle", textAlign: "center"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {total,per_page,current_page,data} = this.props.data;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="field_any" value={this.state.field_any} onChange={this.handleChange}/>
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
                <div style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={centerStyle}>#</th>
                            <th className="text-black" style={centerStyle}>Code</th>
                            <th className="text-black" style={centerStyle}>Name</th>
                            <th className="text-black" style={centerStyle}>Handphone</th>
                            <th className="text-black" style={centerStyle}>Cust Type</th>
                            <th className="text-black" style={centerStyle}>Email</th>
                            <th className="text-black" style={centerStyle}>Location</th>
                            <th className="text-black" style={centerStyle}>Keterangan</th>
                            <th className="text-black" style={centerStyle}>Address</th>
                            <th className="text-black" style={centerStyle}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={centerStyle}>
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
                                                <td style={leftStyle}>{v.kd_cust}</td>
                                                <td style={leftStyle}>{v.nama}</td>
                                                <td style={rightStyle}>{v.tlp}</td>
                                                <td style={leftStyle}>{v.cust_type}</td>
                                                <td style={leftStyle}>{v.email}</td>
                                                <td style={leftStyle}>{v.lokasi}</td>
                                                <td style={leftStyle}>{v.keterangan}</td>
                                                <td style={leftStyle}>{v.alamat}</td>
                                                <td style={centerStyle}>{v.status==='1'?statusQ('success','Active'):statusQ('danger','In Active')}</td>
                                            </tr>
                                        )
                                    })
                                    : <tr><td>No Data.</td></tr>
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
        auth:state.auth,
        dataCustomerEdit:state.customerReducer.edit,
        dataCustomerTypeAll:state.customerTypeReducer.all,
        isLoading: state.customerReducer.isLoading,
    }
}
export default connect(mapStateToProps)(ListCustomer)