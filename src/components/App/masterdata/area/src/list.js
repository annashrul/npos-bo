import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {deleteArea, FetchArea} from "redux/actions/masterdata/area/area.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq from "helper";
import FormArea from "components/App/modals/masterdata/area/form_area";
import Swal from "sweetalert2";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import Default from 'assets/default.png';

class ListArea extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{},
            lokasi_data:[]
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            lokasi_data:nextProps.auth.user.lokasi
        })
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_customer",pageNumber);
        this.props.dispatch(FetchArea(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchArea(1,''))
        }else{
            this.props.dispatch(FetchArea(1,any))
        }
    }
    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formArea"));
        if(i===null){
            this.setState({detail:undefined});
        }else{
            console.log("ccccccccccccc",this.props.data)
            this.setState({
                detail:{
                    "lokasi":this.props.data.data[i].lokasi,
                    "nama":this.props.data.data[i].nama,
                    "gambar":this.props.data.data[i].gambar,
                    "id":this.props.data.data[i].id_area,
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
                this.props.dispatch(deleteArea(id,this.props.token));
            }
        })

    }
    render(){
        const {total,per_page,current_page,data} = this.props.data;
        let getImg = Default;
        console.log("ooooooooooo",this.state.lokasi_data);
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
                <div className="row">
                    {
                        (
                            typeof data === 'object' ?
                                data.map((v,i)=>{
                                    let getLok = this.state.lokasi_data.filter(item => item.kode === v.lokasi);
                                    console.log("kkkkkkkkkkk",getLok);
                                    return(
                                        <div className="col-sm-6 col-xl-3" key={i}>
                                            <div className="single-gallery--item mb-50">
                                                <div className="gallery-thumb">
                                                <img src={v.gambar === null?'error':v.gambar} alt="netindo" onError={(e)=>{e.target.onerror = null; e.target.src=`${getImg}`}} />
                                                </div>
                                                <div className="gallery-text-area">
                                                <h6 className="text-white font-16 mb-0">Area : {v.nama}</h6>
                                                <p className="text-white mb-10">Lokasi : {getLok[0]===undefined?'':getLok[0].nama}</p>
                                                    <div className="btn-group">
                                                        <UncontrolledButtonDropdown>
                                                        <DropdownToggle caret>
                                                            Aksi
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={(e)=>this.toggleModal(e,i)}>Edit</DropdownItem>
                                                            <DropdownItem onClick={(e)=>this.handleDelete(e,v.id_area)}>Delete</DropdownItem>
                                                        </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : "No data."
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
                <FormArea token={this.props.token} detail={this.state.detail}/>
            </div>
        )
    }
}

export default connect()(ListArea)