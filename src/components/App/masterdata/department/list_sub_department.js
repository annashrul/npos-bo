import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import {deleteSubDepartment, FetchSubDepartment} from "redux/actions/masterdata/department/sub_department.action";
import FormSubDepartment from "components/App/modals/masterdata/department/form_sub_department";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Swal from "sweetalert2";
import {FetchAllDepartment} from "../../../../redux/actions/masterdata/department/department.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

class ListSubDepartment extends Component{
    constructor(props){
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_sub_department',any);
        if(any!==''||any!==undefined||any!==null){
            this.props.dispatch(FetchSubDepartment(1,any));
        }else{
            this.props.dispatch(FetchSubDepartment(1,''));
        }
    }
    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSubDepartment"));
        this.props.dispatch(FetchAllDepartment());
        if(i === null){
            this.setState({detail:undefined});
        }else{
            this.setState({
                detail: {"kode":this.props.data.data[i].kode,"kode_dept":this.props.data.data[i].kode_dept,"nama":this.props.data.data[i].nama}
            })
        }
    }
    handleDelete(e, id) {
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
                this.props.dispatch(deleteSubDepartment(id,this.props.token));
            }
        })
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,per_page,current_page,data} = this.props.data;

        return (
            <div className="row">
                <div className="col-md-6 offset-3">
                    <form onSubmit={this.handlesearch} noValidate>
                        <div className="row">
                            <div className="col-8 col-xs-8 col-md-6">
                                <div className="form-group">
                                    <label>Search Sub Department</label>
                                    <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_sub_department')}/>
                                </div>
                            </div>
                            <div className="col-4 col-xs-4 col-md-4">
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
                                                    <td style={columnStyle}>
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
                </div>
                <FormSubDepartment dataDepartment={this.props.dataDepartment} token={this.props.token} detail={this.state.detail}/>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        dataDepartment:state.departmentReducer.allData,
    }
}
export default connect(mapStateToProps)(ListSubDepartment)