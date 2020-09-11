import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
class DetailLocationModal extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            geo:'https://maps.google.com/maps?q=-6.9115069,107.6443159&hl=en&z=18&output=embed',
            nama:'',kode:'',jam_buka:'',jam_tutup:'',footer1:'',footer2:'',footer3:'',footer4:'',
            serial:'',ket:'',kota:'',email:'',web:'',phone:'',lokasi_ktg:'',status:'',dc:'',alamat:''
        }

    }
    componentDidMount(){
        this.setState({
            geo:`https://maps.google.com/maps?q=${this.props.dataDetailLocation.lat},${this.props.dataDetailLocation.lng}&hl=en&z=18&output=embed`,
            nama:this.props.dataDetailLocation.nama,
            kode:this.props.dataDetailLocation.kode,
            jam_buka:this.props.dataDetailLocation.jam_buka,
            jam_tutup:this.props.dataDetailLocation.jam_tutup,
            footer1:this.props.dataDetailLocation.footer1,
            footer2:this.props.dataDetailLocation.footer2,
            footer3:this.props.dataDetailLocation.footer3,
            footer4:this.props.dataDetailLocation.footer4,
            serial:this.props.dataDetailLocation.serial,
            ket:this.props.dataDetailLocation.ket,
            kota:this.props.dataDetailLocation.kota,
            email:this.props.dataDetailLocation.email,
            web:this.props.dataDetailLocation.web,
            phone:this.props.dataDetailLocation.phone,
            lokasi_ktg:this.props.dataDetailLocation.lokasi_ktg,
            status:this.props.dataDetailLocation.status,
            alamat:this.props.dataDetailLocation.alamat,
        })
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailLocationModal"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>Detail Location {this.state.nama}</ModalHeader>
                    <ModalBody>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className="text-black">Name</td>
                                <td className="text-black">: {this.state.nama}</td>
                                <td className="text-black">Serial</td>
                                <td className="text-black">: {this.state.serial}</td>
                                <td className="text-black">Code</td>
                                <td className="text-black">: {this.state.kode}</td>
                            </tr>
                            <tr>
                                <td className="text-black">Phone</td>
                                <td className="text-black">: {this.state.phone}</td>
                                <td className="text-black">Web</td>
                                <td className="text-black">: {this.state.web}</td>
                                <td className="text-black">Email</td>
                                <th className="text-black">: {this.state.email}</th>
                            </tr>
                            <tr>
                                <th className="text-black">Category</th>
                                <th className="text-black">: {this.state.lokasi_ktg}</th>
                                <th className="text-black">Status</th>
                                <th className="text-black">: {this.state.status==='0'?'In Active':'Active'}</th>
                            </tr>
                            </tbody>
                        </table>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Open</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Close</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Note</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Address</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Footer</th>
                                </tr>
                                <tr>
                                    <td className="text-black" style={columnStyle}>1</td>
                                    <td className="text-black" style={columnStyle}>2</td>
                                    <td className="text-black" style={columnStyle}>3</td>
                                    <td className="text-black" style={columnStyle}>4</td>
                                </tr>
                                </thead>
                                <tbody>
                                <td style={columnStyle}>{this.state.jam_buka}</td>
                                <td style={columnStyle}>{this.state.jam_tutup}</td>
                                <td style={columnStyle}>{this.state.ket}</td>
                                <td style={columnStyle}>{this.state.alamat}</td>
                                <td style={columnStyle}>{this.state.footer1}</td>
                                <td style={columnStyle}>{this.state.footer2}</td>
                                <td style={columnStyle}>{this.state.footer3}</td>
                                <td style={columnStyle}>{this.state.footer4}</td>
                                </tbody>
                            </table>
                            <iframe src={this.state.geo} id="maps-contact" title="maps-contact" className="google-map__contact" allowFullScreen  style={{maxWidth: '1600px', width: '100%',height:'300px'}}></iframe>
                        </div>
                    </ModalBody>
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
export default connect(mapStateToProps)(DetailLocationModal);