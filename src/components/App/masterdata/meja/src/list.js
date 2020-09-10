import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {deleteMeja, FetchMeja} from "redux/actions/masterdata/meja/meja.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq from "helper";
import FormMeja from "components/App/modals/masterdata/area/form_meja";
import Swal from "sweetalert2";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

class ListMeja extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_customer",pageNumber);
        this.props.dispatch(FetchMeja(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchMeja(1,''))
        }else{
            this.props.dispatch(FetchMeja(1,any))
        }
    }
    toggleModal(e,i) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formMeja"));
        if(i===null){
            this.setState({detail:undefined});
        }else{
            this.setState({
                detail:{
                    "nama":this.props.data.data[i].nama,
                    "kapasitas":this.props.data.data[i].kapasitas,
                    "area":this.props.data.data[i].area,
                    "height":this.props.data.data[i].height,
                    "width":this.props.data.data[i].width,
                    "bentuk":this.props.data.data[i].bentuk,
                    "id":this.props.data.data[i].id_meja,
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
                this.props.dispatch(deleteMeja(id,this.props.token));
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
                            {/* <th className="text-black" style={columnStyle}>Area</th> */}
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Capasity</th>
                            <th className="text-black" style={columnStyle}>Height</th>
                            <th className="text-black" style={columnStyle}>Width</th>
                            <th className="text-black" style={columnStyle}>Shape</th>
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
                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.id_meja)}>Delete</DropdownItem>
                                                            </DropdownMenu>
                                                            </UncontrolledButtonDropdown>
                                                    </div>
                                                </td>
                                                {/* <td style={columnStyle}>{v.area}</td> */}
                                                <td style={columnStyle}>{v.nama}</td>
                                                <td style={columnStyle}>{v.kapasitas}</td>
                                                <td style={columnStyle}>{v.height}</td>
                                                <td style={columnStyle}>{v.width}</td>
                                                <td style={columnStyle}>{v.bentuk}</td>
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
                <FormMeja token={this.props.token} detail={this.state.detail} area={this.props.area}/>
            </div>
        )
    }
}

export default connect()(ListMeja)