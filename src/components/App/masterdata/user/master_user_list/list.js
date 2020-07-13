import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import FormUserList from "components/App/modals/masterdata/user_list/form_user_list";

import profile from "assets/profile.png";
import Swal from "sweetalert2";
import Paginationq from "helper";
import DetailUserList from "../../../modals/masterdata/user_list/detail_user_list";
import {
    deleteUserList,
    FetchUserList,
    FetchUserListDetail,
    FetchUserListEdit,
    setUserListEdit
} from "redux/actions/masterdata/user_list/user_list.action";
import {FetchAllLocation, FetchLocation} from "redux/actions/masterdata/location/location.action";
import {FetchUserLevel} from "redux/actions/masterdata/user_level/user_level.action";

class ListUserList extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('any');
        localStorage.setItem('any_user_list',any);
        this.props.dispatch(FetchUserList(1,any===null||any===''||any===undefined?'':any));
    }

    handlePageChange(pageNumber) {
        let any = localStorage.getItem("any_user_list");
        this.props.pagin(pageNumber,any===null||any===''||any===undefined?'':any);
    }

    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // this.props.dispatch(ModalToggle(bool));
        // this.props.dispatch(ModalType("formUserList"));
        this.props.dispatch(FetchAllLocation());
        this.props.dispatch(FetchUserLevel(1,'','100'));
        this.props.dispatch(setUserListEdit([]));
    }

    toggleEdit(e,id) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // this.props.dispatch(ModalToggle(bool));
        // this.props.dispatch(ModalType("formUserList"));
        this.props.dispatch(FetchAllLocation());
        this.props.dispatch(FetchUserLevel(1,'','100'));
        this.props.dispatch(FetchUserListEdit(id));
    }

    handleDetail(e,id){
        e.preventDefault();
        const bool = !this.props.isOpen;
        // this.props.dispatch(ModalToggle(bool));
        // this.props.dispatch(ModalType("detailUserList"));
        this.props.dispatch(FetchUserListDetail(id));
        this.props.dispatch(FetchAllLocation());
    }

    handleDelete(e, id) {
        console.log(id);
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
                this.props.dispatch(deleteUserList(id,this.props.token));
            }
        })
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.userListData;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_user_list')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-2 col-md-3">
                            <div className="form-group">
                                <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginLeft:"2px"}} type="button" className="btn btn-primary" onClick={(e)=>this.toggleModal(e)}><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                </form>
                <div className="row">
                    {
                        (
                            typeof data==='object'? data.map((v,i)=> {
                                return (
                                    <div className="col-md-6 col-xl-4" key={i}>
                                        <div className="card rounded box-margin">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between mb-2 pb-2">
                                                    <div className="d-flex align-items-center">
                                                        <img className="chat-img" src={v.foto===null||v.foto==='-'?profile:v.foto} alt=""/>
                                                        <div className="ml-3">
                                                            <h6 className="mb-0">{v.nama}</h6>
                                                            <p className="text-12 mb-0">{v.lvl}</p>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-dropdown">
                                                        <div className="dropdown">
                                                            <button className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                            <div className="dropdown-menu dropdown-menu-right"
                                                                 aria-labelledby="dashboardDropdown50">
                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleEdit(e,v.id)}><i className="ti-pencil-alt"></i> Edit</a>
                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDetail(e,v.id)}><i className="ti-eye"></i> Detail</a>
                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.id)}><i className="ti-trash"></i> Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }):"No data."
                        )
                    }
                </div>
                <hr/>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
                <FormUserList
                    token={this.props.token}
                    lokasi={this.props.lokasi}
                    userLevel={this.props.userLevel}
                    userListEdit={this.props.userListEdit}
                />
                <DetailUserList userListDetail={this.props.userListDetail} lokasi={this.props.lokasi}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.userListReducer.isLoading,
        isOpen:state.modalReducer,
        lokasi:state.locationReducer.allData,
        userLevel : state.userLevelReducer.data,
        userListEdit:state.userListReducer.edit,
        userListDetail:state.userListReducer.detail,
    }
}


export default connect(mapStateToProps)(ListUserList);