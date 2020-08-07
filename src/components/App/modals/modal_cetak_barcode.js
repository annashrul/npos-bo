import React,{Component} from 'react';
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "./_wrapper.modal";

class ModalCetakBarcode extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
        window.location.reload();
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "modal_cetak_barcode"} size="sm">
                <ModalHeader toggle={this.toggle}>Cetak Barcode</ModalHeader>
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
export default connect(mapStateToProps)(ModalCetakBarcode);