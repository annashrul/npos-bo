import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createLocation,updateLocation} from "redux/actions/masterdata/location/location.action";
// import PlacesAutocomplete, {geocodeByAddress, getLatLng,} from 'react-places-autocomplete'
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
class FormLocation extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            kode:'', dc:'-', serial:'', ket:'-', footer1:'-', footer2:'-', footer3:'-', footer4:'-',
            kota:'', email:'', web:'-', nama_toko:'', phone:'0', lokasi_ktg:0, logo:'-', jam_buka:'', jam_tutup:'',
            alamat:'', lat:'0', lng:'0', status:'1', status_show:'1',nama:''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataDetailLocation !== [] && nextProps.dataDetailLocation !== undefined) {
            this.setState({
                kode: nextProps.dataDetailLocation.kode,
                dc: nextProps.dataDetailLocation.dc,
                nama_toko: nextProps.dataDetailLocation.nama_toko,
                serial:nextProps.dataDetailLocation.serial,
                ket:nextProps.dataDetailLocation.ket,
                footer1:nextProps.dataDetailLocation.footer1,
                footer2:nextProps.dataDetailLocation.footer2,
                footer3:nextProps.dataDetailLocation.footer3,
                footer4: nextProps.dataDetailLocation.footer4,
                kota: nextProps.dataDetailLocation.kota,
                email: nextProps.dataDetailLocation.email,
                web: nextProps.dataDetailLocation.web,
                phone: nextProps.dataDetailLocation.phone,
                lokasi_ktg: nextProps.dataDetailLocation.lokasi_ktg,
                jam_buka: nextProps.dataDetailLocation.jam_buka,
                jam_tutup: nextProps.dataDetailLocation.jam_tutup,
                alamat: nextProps.dataDetailLocation.alamat,
                lat: nextProps.dataDetailLocation.lat,
                lng: nextProps.dataDetailLocation.lng,
                status: nextProps.dataDetailLocation.status,
                status_show: nextProps.dataDetailLocation.status_show,
            })
        }
    }
    handleOnChange = alamat => {
        this.setState({ alamat });
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({lat:latLng.lat,lng:latLng.lng}))
            .catch(error => console.error('Error', error));
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
        parseData['nama'] = this.state.nama_toko;
        parseData['lokasi_ktg'] = this.state.lokasi_ktg;
        parseData['status'] = this.state.status;
        parseData['status_show'] = this.state.status_show;
        parseData['phone'] = this.state.phone;
        parseData['email'] = this.state.email;
        parseData['kota'] = this.state.kota;
        parseData['web'] = this.state.web;
        parseData['footer1'] = this.state.footer1;
        parseData['footer2'] = this.state.footer2;
        parseData['footer3'] = this.state.footer3;
        parseData['footer4'] = this.state.footer4;
        parseData['ket'] = this.state.ket;
        parseData['jam_buka'] = this.state.jam_buka;
        parseData['jam_tutup'] = this.state.jam_tutup;
        parseData['lat'] = this.state.lat;
        parseData['lng'] = this.state.lng;
        parseData['alamat'] = this.state.alamat;

        if (this.props.dataDetailLocation !== undefined) {
            this.props.dispatch(updateLocation(this.state.kode,parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createLocation(parseData,this.props.token));
            this.props.dispatch(ModalToggle(false));
        }

    }

    render(){
        const curr = new Date();
        curr.setDate(curr.getDate() + 3);
        const date = curr.toISOString().substr(0, 10);
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formLocation"} size="lg" className="custom-map-modal">
                <ModalHeader toggle={this.toggle}>{this.props.dataDetailLocation===undefined?"Add Location":"Update Location"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="nama_toko" value={this.state.nama_toko} onChange={this.handleChange}  required/>
                                </div>
                                <div className="form-group">
                                    <label>Location Category</label>
                                    <select id="inputState" className="form-control" name="lokasi_ktg" defaultValue={this.state.lokasi_ktg} value={this.state.lokasi_ktg} onChange={this.handleChange} required>
                                        <option value="">Choose Location Category</option>
                                        {
                                            (
                                                typeof this.props.dataLocationCategory.data === 'object' ?
                                                    this.props.dataLocationCategory.data.map((v,i)=>{
                                                        return(
                                                            <option key={i} value={v.id}>{v.nama}</option>
                                                        )
                                                    })
                                                    :  <option value="">No Option</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange} required>
                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="number" className="form-control" name="phone" value={this.state.phone} onChange={this.handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Kota</label>
                                    <input type="text" className="form-control" name="kota" value={this.state.kota} onChange={this.handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Web</label>
                                    <input type="text" className="form-control" name="web" value={this.state.web} onChange={this.handleChange}  required/>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Footer 1</label>
                                    <input type="text" className="form-control" name="footer1" value={this.state.footer1} onChange={this.handleChange}  required/>
                                </div>
                                <div className="form-group">
                                    <label>Footer 2</label>
                                    <input type="text" className="form-control" name="footer2" value={this.state.footer2} onChange={this.handleChange}  required/>
                                </div>
                                <div className="form-group">
                                    <label>Footer 3</label>
                                    <input type="text" className="form-control" name="footer3" value={this.state.footer3} onChange={this.handleChange}  required/>
                                </div>
                                <div className="form-group">
                                    <label>Footer 4</label>
                                    <input type="text" className="form-control" name="footer4" value={this.state.footer4} onChange={this.handleChange}  required/>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label>Display in the member app ?</label>
                                    <select className="form-control" name="status_show" defaultValue={this.state.status_show} value={this.state.status_show} onChange={this.handleChange} required>
                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-4">
                               <div className="row">
                                   <div className="col-6">
                                       <div className="form-group">
                                           <label htmlFor="">Open</label>
                                           <input
                                               type="time"
                                               name="jam_buka"
                                               className="form-control"
                                               data-parse="date"
                                               placeholder="MM/DD//YYYY"
                                               defaultValue={date}
                                               value={this.state.jam_buka}
                                               pattern="\d{2}\/\d{2}/\d{4}"
                                               onChange={this.handleChange}
                                               required
                                           />
                                       </div>
                                   </div>
                                   <div className="col-6">
                                       <div className="form-group">
                                           <label htmlFor="">Close</label>
                                           <input
                                               type="time"
                                               name="jam_tutup"
                                               className="form-control"
                                               data-parse="date"
                                               placeholder="MM/DD//YYYY"
                                               defaultValue={date}
                                               value={this.state.jam_tutup}
                                               pattern="\d{2}\/\d{2}/\d{4}"
                                               onChange={this.handleChange}
                                               required
                                           />
                                       </div>
                                   </div>
                               </div>
                            </div>
                            <div className="col-4">
                                <label htmlFor="">Note</label>
                                <input className="form-control" name="ket" value={this.state.ket} onChange={this.handleChange} required/>
                            </div>
                            <div className="col-6">
                                <PlacesAutocomplete value={this.state.alamat} onClick={this.handleSelect} onChange={this.handleOnChange} onSelect={this.handleSelect}>
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div>
                                            <label htmlFor="">Search Location</label>
                                            <input {...getInputProps({onClick:this.handleSelect,placeholder: 'Search Places ...', className: 'location-search-input'})}/>
                                            <div className="autocomplete-dropdown-container" style={{width:"96%"}}>
                                                {loading && <div>Loading...</div>}
                                                {suggestions.map(suggestion => {
                                                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                                                    const style = suggestion.active ? { backgroundColor: '#000000', cursor: 'pointer',color:'white' } : { backgroundColor: 'white', cursor: 'pointer' };
                                                    return (
                                                        <div {...getSuggestionItemProps(suggestion, {className, style,})}>
                                                            <span>{suggestion.description}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="">Latitude</label>
                                            <input readOnly className="form-control" name="lat" value={this.state.lat} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="">Longitude</label>
                                            <input readOnly className="form-control" name="lng" value={this.state.lng} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Cancel</button>
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
export default connect(mapStateToProps)(FormLocation);