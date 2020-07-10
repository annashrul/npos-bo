import React,{Component} from 'react';
import {connect} from "react-redux";
import {statusQ} from "../../../../../helper";
import {
    deleteGroupProduct,
    FetchGroupProduct
} from "../../../../../actions/masterdata/group_product/group_product.action";
import Paginationq from "../../../../../helper";
import {ModalToggle, ModalType} from "../../../../../actions/modal.action";
import Swal from "sweetalert2";
import {deleteLocationCategory} from "../../../../../actions/masterdata/location_category/location_category.action";
import {FetchSubDepartmentAll} from "../../../../../actions/masterdata/department/sub_department.action";
import FormGroupProduct from "../../../../modals/masterdata/group_product/form_group_product";

class ListGroupProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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

    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formGroupProduct"));
        this.props.dispatch(FetchSubDepartmentAll());
        if(i===null){
            this.setState({detail:undefined});
        }else{
            console.log(this.props.data.data[i].kel_brg);
            this.setState({detail:{
                "kel_brg":this.props.data.data[i].kel_brg,
                "nm_kel_brg":this.props.data.data[i].nm_kel_brg,
                "margin":this.props.data.data[i].margin,
                "status":this.props.data.data[i].status,
                "group2":this.props.data.data[i].group2,
                "dis_persen":this.props.data.data[i].dis_persen,
                "gambar":this.props.data.data[i].gambar,
            }});
        }

    }
    handleDelete(e,i){
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
                this.props.dispatch(deleteGroupProduct(i,this.props.token));
            }
        })
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        console.log(this.props.data);
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
                               <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                               <button style={{marginTop:"27px"}} type="button" onClick={(e)=>this.toggleModal(e,null)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
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
                           <th className="text-black" style={columnStyle}>Sub Dept</th>
                           <th className="text-black" style={columnStyle}>Margin</th>
                           <th className="text-black" style={columnStyle}>Discount (%)</th>
                           <th className="text-black" style={columnStyle}>Status</th>
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
                                                       <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                           Action
                                                       </button>
                                                       <div className="dropdown-menu">
                                                           <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(e,i)}>Edit</a>
                                                           <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.kel_brg)}>Delete</a>
                                                       </div>
                                                   </div>
                                               </td>
                                               <td style={columnStyle}>{v.kel_brg}</td>
                                               <td style={columnStyle}>{v.nm_kel_brg}</td>
                                               <td style={columnStyle}>{v.group2}</td>
                                               <td style={columnStyle}>{v.margin?v.margin:'0'}</td>
                                               <td style={columnStyle}>{v.dis_persen?v.dis_persen:'0'}</td>
                                               <td style={columnStyle}>{v.status==='1'?statusQ('success','Active'): statusQ('danger','In Active')}</td>
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