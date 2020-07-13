import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import FormCash from "components/App/modals/masterdata/cash/form_cash";
import Swal from "sweetalert2";
import Paginationq from "helper";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {FetchCash} from "redux/actions/masterdata/cash/cash.action";



class ListCash extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        // this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            value: 'masuk',
            any:'',
            detail:{}
        }
    }



    handlePageChange(pageNumber){
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
        this.props.pagin(pageNumber);
    }

    handlesearch (event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let type = data.get('type');
        let any = data.get('any');
        localStorage.setItem('type',type);
        localStorage.setItem('any',any);

        if(type!==''||type!==undefined && any!==''||any!==undefined){
            this.props.dispatch(FetchCash(1,type,any));
        }else if(type!==''||type!==undefined){
            this.props.dispatch(FetchCash(1,type,''));
        }else if(any!==''||any!==undefined){
            this.props.dispatch(FetchCash(1,type,any));
        }else{
            this.props.dispatch(FetchCash(1,'masuk',''));
        }
    }

    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCash"));
        if(i!==null){
            console.log(this.props.data.data[i].title);
            this.state.detail = {"id":this.props.data.data[i].id,"jenis":parseInt(this.props.data.data[i].jenis),"type":parseInt(this.props.data.data[i].type),"title":this.props.data.data[i].title};
        }else{
            this.state.detail = undefined;
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
                console.log(this.props);
                this.props.deletes(id);
            }
        })
    }

    render(){
        const toggleModal = this.toggleModal;
        const toggleModalUpdate = this.toggleModalUpdate;
        const handleDelete = this.handleDelete;
        const {current_page,data,from,last_page,per_page,to,total} = this.props.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Choose Type</label>
                                <select className="form-control form-control-lg" id="type" name="type" defaultValue={localStorage.getItem('type')}>
                                    <option value="masuk" selected={localStorage.getItem('type')==='masuk'?true:false}>Cash In</option>
                                    <option value="keluar" selected={localStorage.getItem('type')==='keluar'?true:false}>Cash Out</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="any"  ref={(input) => { this.nameInput = input; }}  defaultValue={localStorage.getItem('any')}/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginLeft:"2px"}} type="button" className="btn btn-primary" onClick={(e)=>toggleModal(e,null)}><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                </form>

                <div className="row">
                    <div className="col-12 col-md-12">
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>#</th>
                                    <th className="text-black" style={columnStyle}>Note</th>
                                    <th className="text-black" style={columnStyle}>Name</th>
                                    <th className="text-black" style={columnStyle}>Type</th>
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
                                                                    <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>toggleModal(e,i)}>Edit</a>
                                                                    <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>handleDelete(e,v.id)}>Delete</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={columnStyle}>{v.title}</td>
                                                        <td style={columnStyle}>{v.jenis===0?'KAS KECIL':'KAS BESAR'}</td>
                                                        <td style={columnStyle}>{v.type===0?'KAS MASUK':'KAS KELUAR'}</td>
                                                    </tr>
                                                )
                                            })
                                            : "No data."
                                    )
                                }
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
                <FormCash detail={this.state.detail}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
    }
}

export default connect(mapStateToProps)(ListCash)

// export default ListCash;