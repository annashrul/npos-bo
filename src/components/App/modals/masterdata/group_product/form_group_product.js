import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "../../../../actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "../../../../helper";
import {
    createLocationCategory,
    updateLocationCategory
} from "../../../../actions/masterdata/location_category/location_category.action";
import {
    createGroupProduct,
    updateGroupProduct
} from "../../../../actions/masterdata/group_product/group_product.action";
class FormGroupProduct extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            kel_brg:'',
            nm_kel_brg:'',
            margin:'0',
            status:'1',
            group2:'',
            dis_persen:'0',
            gambar:'-'
        };
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (nextProps.detail !== [] && nextProps.detail !== undefined) {
            this.setState({
                kel_brg: nextProps.detail.kel_brg,
                nm_kel_brg: nextProps.detail.nm_kel_brg,
                margin: nextProps.detail.margin,
                status: nextProps.detail.status,
                group2: nextProps.detail.group2,
                dis_persen: nextProps.detail.dis_persen,
                gambar: nextProps.detail.gambar,
            })
        }else{
            this.setState({
                kel_brg:'',
                nm_kel_brg:'',
                margin:'0',
                status:'0',
                group2:'',
                dis_persen:'0',
                gambar:'-'
            })
        }
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nm_kel_brg'] = this.state.nm_kel_brg;
        parseData['margin'] = this.state.margin;
        parseData['status'] = this.state.status;
        parseData['group2'] = this.state.group2;
        parseData['dis_persen'] = this.state.dis_persen;
        parseData['gambar'] = this.state.gambar;
        if (this.props.detail !== undefined) {
            this.props.dispatch(updateGroupProduct(this.props.detail.kel_brg,parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createGroupProduct(parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }
        console.log(parseData)

    }

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formGroupProduct"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Product Group":"Update Product Group"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" name="nm_kel_brg" value={this.state.nm_kel_brg} onChange={this.handleChange}  />
                        </div>
                        <div className="form-group">
                            <label>Sub Department</label>
                            <select id="inputState" className="form-control" name="group2" defaultValue={this.state.group2} value={this.state.group2} onChange={this.handleChange} required>
                                <option value="">Choose</option>
                                {
                                    (
                                        typeof this.props.group2.data === 'object' ?
                                            this.props.group2.data.map((v,i)=>{
                                                return(
                                                    <option key={i} value={v.kode}>{v.nama}</option>
                                                )
                                            })
                                            : <option value="">No Option</option>
                                    )
                                }

                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                                <option value="1">Active</option>
                                <option value="0">In Active</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Margin</label>
                            <input type="number" className="form-control" name="margin" value={this.state.margin} onChange={this.handleChange}  />
                        </div>
                        <div className="form-group">
                            <label>Discount (%)</label>
                            <input type="number" className="form-control" name="dis_persen" value={this.state.dis_persen} onChange={this.handleChange}  />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
                        </div>
                    </ModalFooter>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(FormGroupProduct);