import React,{Component} from 'react';
import {ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "./_wrapper.modal";
import {destroy} from "components/model/app.model";

class ModalCetakBarcode extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }
    componentWillReceiveProps(nextProps){
    }

    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        window.location.reload();
        localStorage.removeItem('lk');
        destroy('cetak_barcode');
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "modal_cetak_barcode"} size="sm">
                <ModalHeader toggle={this.toggle}>
                    <a href="NetindoAppBartend:" className="btn btn-primary">Buka Aplikasi Bartender</a>
                </ModalHeader>

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