import React,{Component} from 'react';
import {connect} from "react-redux";
import {
    deleteGroupProduct,
    FetchGroupProduct
} from "redux/actions/masterdata/group_product/group_product.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Swal from "sweetalert2";
import {FetchSubDepartmentAll} from "redux/actions/masterdata/department/sub_department.action";
import FormGroupProduct from "components/App/modals/masterdata/group_product/form_group_product";
import {statusQ} from "helper";
import Paginationq from 'helper';
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';

class ListGroupProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        let any = localStorage.getItem('any_group_product');
        localStorage.setItem("page_group_product",pageNumber);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchGroupProduct(pageNumber,''));
        }else{
            this.props.dispatch(FetchGroupProduct(pageNumber,any));
        }
    }


    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_group_product',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchGroupProduct(1,''));
        }else{
            this.props.dispatch(FetchGroupProduct(1,any));
        }

    }

    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formGroupProduct"));
        this.props.dispatch(FetchSubDepartmentAll());
        this.setState({detail:undefined});
    }
    handleEdit(e,kel_brg,nm_kel_brg,group2,margin,dis_persen,status,gambar) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formGroupProduct"));
        this.props.dispatch(FetchSubDepartmentAll());
        this.setState({
            detail:{
                "kel_brg":kel_brg,
                "nm_kel_brg":nm_kel_brg,
                "margin":margin,
                "status":status,
                "group2":group2,
                "dis_persen":dis_persen,
                "gambar":gambar,
            }
        });

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
                this.props.dispatch(deleteGroupProduct(i,this.props.token));
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
                               <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem('any_group_product')}/>
                           </div>
                       </div>
                       <div className="col-2 col-xs-2 col-md-3">
                           <div className="form-group">
                               <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"/></button>
                               <button style={{marginTop:"27px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"/></button>
                           </div>
                       </div>
                   </div>

               </form>
               <div className="table-responsive" style={{overflowX: "auto"}}>
                   <table className="table table-hover table-bordered">
                       <thead className="bg-light">
                       <tr>
                           <th className="text-black" style={columnStyle}>#</th>
                           <th className="text-black" style={columnStyle}>Kode</th>
                           <th className="text-black" style={columnStyle}>Nama</th>
                           <th className="text-black" style={columnStyle}>Sub Dept</th>
                           {/*<th className="text-black" style={columnStyle}>Margin</th>*/}
                           {/*<th className="text-black" style={columnStyle}>Diskon (%)</th>*/}
                           <th className="text-black" style={columnStyle}>Status</th>
                           <th className="text-black" style={columnStyle}>Gambar</th>
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
                                                   
                                                            <DropdownItem onClick={(e)=>this.handleEdit(
                                                               e,v.kel_brg,v.nm_kel_brg,v.group2,v.margin,v.dis_persen,v.status,'-'
                                                           )}>Edit</DropdownItem>
                                                            <DropdownItem onClick={(e)=>this.handleDelete(e,v.kel_brg)}>Delete</DropdownItem>
                                                        </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                   </div>
                                               </td>
                                               <td style={columnStyle}>{v.kel_brg}</td>
                                               <td style={columnStyle}>{v.nm_kel_brg}</td>
                                               <td style={columnStyle}>{v.group2}</td>
                                               <td style={columnStyle}>{v.status==='1'?statusQ('success','Aktif'): statusQ('danger','Tidak Aktif')}</td>
                                               <td style={columnStyle}>
                                                   <img src={v.gambar==='-'||v.gambar===''?'https://icoconvert.com/images/noimage2.png':v.gambar} style={{height:"50px",objectFit:"scale-down"}} alt=""/>
                                               </td>
                                           </tr>
                                       )
                                   })
                                   : "No data."
                           )
                       }
                       </tbody>
                   </table>
                   <div style={{"marginTop":"20px","float":"right"}}>
                       <Paginationq
                           current_page={current_page}
                           per_page={per_page}
                           total={total}
                           callback={this.handlePageChange.bind(this)}
                       />
                   </div>
               </div>

               <FormGroupProduct group2={this.props.group2} detail={this.state.detail} token={this.props.token}/>
           </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        group2:state.subDepartmentReducer.all,
    }
}
export default connect(mapStateToProps) (ListGroupProduct);