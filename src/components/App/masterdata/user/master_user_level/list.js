import React,{Component} from 'react';
import Paginationq from "helper";
import connect from "react-redux/es/connect/connect";
import FormUserLevel from "components/App/modals/masterdata/user_level/form_user_level";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Swal from "sweetalert2";
import {FetchUserLevel,deleteUserLevel} from "redux/actions/masterdata/user_level/user_level.action";

class ListUserLevel extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state={
            detail:{}
        }
    }

    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let any = data.get('any');
        localStorage.setItem('any_user_level',any);
        this.props.dispatch(FetchUserLevel(1,any===null||any===''||any===undefined?'':any,15));
    }

    handlePageChange(pageNumber){
        let any = localStorage.getItem('any_user_level');
        this.props.dispatch(FetchUserLevel(pageNumber,any===null||any===''||any===undefined?null:any,15))
    }
    toggleModal(e,id) {
        e.preventDefault();
        // const bool = !this.props.isOpen;
        // this.props.dispatch(ModalToggle(bool));
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formUserLevel"));
        if(id!==null){
            this.setState({
                detail:{"id":this.props.data.data[id].id,"access":this.props.data.data[id].access,"lvl":this.props.data.data[id].lvl}
            })
        }else{
            this.setState({detail:undefined})
        }


    }
    handleDelete(e, id) {
        let any = localStorage.getItem('any_user_level');
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
                // console.log(this.props);
                this.props.dispatch(deleteUserLevel(id,this.props.token));
                // this.props.dispatch(FetchUserLevel())
            }
        })
    }
    render(){
        const handleDelete = this.handleDelete;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        return (
           <div>
               <form onSubmit={this.handlesearch} noValidate>
                   <div className="row">
                       <div className="col-10 col-xs-10 col-md-3">
                           <div className="form-group">
                               <label>Search</label>
                               <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_user_level')}/>
                           </div>
                       </div>
                       <div className="col-2 col-xs-2 col-md-3">
                           <div className="form-group">
                               <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                               <button style={{marginTop:"27px",marginLeft:"2px"}} type="button" className="btn btn-primary" onClick={(e)=>this.toggleModal(e,null)}><i className="fa fa-plus"></i></button>
                           </div>
                       </div>
                   </div>

               </form>
               <div className="row">
                   {
                       (
                           typeof data === 'object' ? data.map((v,i)=>{
                               return (
                                   <div className="col-xl-3 col-md-6" key={i}>
                                       <div className="card">
                                           <div className="card-body">
                                               <div className="row">
                                                   <div className="col-9 col-md-9">
                                                       <p className="mb-0">{v.lvl}</p>
                                                   </div>
                                                   <div className="col-3">
                                                       <div className="dashboard-dropdown">
                                                           <div className="dropdown">
                                                               <button style={{marginTop:"-5px"}} className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                               <div className="dropdown-menu dropdown-menu-right"
                                                                    aria-labelledby="dashboardDropdown50">
                                                                   <a className="dropdown-item" href="!#" onClick={(e)=>this.toggleModal(e,i)}><i className="ti-pencil-alt"></i> Edit</a>
                                                                   <a className="dropdown-item" href="!#" onClick={(e)=>handleDelete(e,v.id)}><i className="ti-trash"></i> Delete</a>
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                                   <div className="col-12">
                                                       <div className="progress h-8 mb-0 mt-20 h-8">
                                                           <div className="progress-bar bg-primary" role="progressbar" style={{width:'100%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               );
                           }) : 'no data'
                       )
                   }
               </div>

               <div className="row" style={{"float":"right"}}>
                   <Paginationq
                       current_page={current_page}
                       per_page={per_page}
                       total={total}
                       callback={this.handlePageChange.bind(this)}
                   />
               </div>
               <FormUserLevel token={this.props.token} detail={this.state.detail}/>
           </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
    }
}
export default connect(mapStateToProps)(ListUserLevel);