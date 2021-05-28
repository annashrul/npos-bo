import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import {
    deleteCustomerType,
    FetchCustomerType
} from "redux/actions/masterdata/customer_type/customer_type.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Swal from "sweetalert2";
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';
import FormCustomerType from "components/App/modals/masterdata/customer_type/form_customer_type";

class ListCustomerType extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state={
            field_any:'',
            detail:{}
        }
    }
    handleChange = (e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    handlePageChange(pageNumber){
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer_type',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchCustomerType(1,''));
        }else{
            this.props.dispatch(FetchCustomerType(1,any));
        }
    }
    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCustomerType"));
        if(i===null){
            this.setState({detail:undefined});
        }else{
            this.setState({detail:{"kode":this.props.data.data[i].kode,"nama":this.props.data.data[i].nama}});
        }

    }
    handleDelete(e,i){
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
                this.props.dispatch(deleteCustomerType(i,this.props.token));
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
                                <input type="text" className="form-control" name="field_any" value={this.state.field_any} onChange={this.handleChange}/>
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
                <div style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
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
                                                <td style={columnStyle}>{v.kode}</td>
                                                <td style={columnStyle}>{v.nama}</td>
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
                <FormCustomerType detail={this.state.detail} token={this.props.token}/>
            </div>
        );
    }
}

export default connect()(ListCustomerType)