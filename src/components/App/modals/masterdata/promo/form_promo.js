import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "helper";
import {createPromo} from "redux/actions/masterdata/promo/promo.action";
import {updatePromo} from "../../../../../redux/actions/masterdata/promo/promo.action";
import {toMoney} from "../../../../../helper";
import Autosuggest from 'react-autosuggest';

class FormPromo extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toCurrency = this.toCurrency.bind(this);
        this.handleChange = this.handleChange  .bind(this);
        this.state = {
            akun:0,
            nama:'',
            category: '-',
            status: '1',
            charge_debit:'0',
            charge_kredit:'0',
            foto:"",
            token:'',
            value: '',
            suggestions: []
        };
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    getProps(param){
        if(param.detail!==undefined&&param.detail!==[]){
            this.setState({
                akun:param.detail.akun,
                nama:param.detail.nama,
                edc:param.detail.edc,
                status:param.detail.status,
                charge_debit:param.detail.charge_debit,
                charge_kredit:param.detail.charge_kredit,
                foto:"",
            })
        }else{
            this.setState({
                akun:'',
                nama:'',
                category: '-',
                status: '1',
                charge_debit:'0',
                charge_kredit:'0',
                foto:"",
            })
        }
    }

    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        this.setState({ [column]: value});
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['nama'] = this.state.nama;
        parseData['akun'] = this.state.akun;
        parseData['edc'] = this.state.edc;
        parseData['status'] = this.state.status;
        parseData['charge_debit'] = this.state.charge_debit;
        parseData['charge_kredit'] = this.state.charge_kredit;
        if(this.state.foto!==undefined){
            parseData['foto'] = this.state.foto.base64;
        }else{
            parseData['foto'] = '-';
        }
        if(this.props.detail!==undefined&&this.props.detail!==null){
            this.props.dispatch(updatePromo(this.props.detail.id,parseData));
        }else{
            this.props.dispatch(createPromo(parseData));
        }

        this.props.dispatch(ModalToggle(false));
    }
    getFiles(files) {
        this.setState({
            foto: files
        })
    };
    toCurrency(number) {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        });

        return formatter.format(number);
    }
    
    // Filter logic
    getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        let response = await fetch("http://203.190.54.4:6692/barang?page=1&lokasi=LK%2F0001&q=" + inputValue);
        let data = await response.json()
        return data;
    };

    // Trigger suggestions
    getSuggestionValue = suggestion => suggestion.kd_brg;

    // Render Each Option
    renderSuggestion = suggestion => (
        <a className="dropdown-item">
            <span className="nm_brg">
                {suggestion.nm_brg}
            </span>&nbsp;|&nbsp;
            <span className="kd_brg">
                {suggestion.kd_brg}
            </span>
        </a>
    );

    // OnChange event handler
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Suggestion rerender when user types
    onSuggestionsFetchRequested = ({ value }) => {
        this.getSuggestions(value)
            .then(data => {
                if (data.Error) {
                    this.setState({
                        suggestions: []
                    });
                } else {
                    this.setState({
                        suggestions: data.result.data
                    });
                }
                console.log("autosg2",data);
            })
        console.log("autosg", value)
    };

    // Triggered on clear
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = () => {
        // const finaldt = {
        //     kd_brg: item.kd_brg,
        //     nm_brg: item.nm_brg,
        //     barcode: item.barcode,
        //     satuan: item.satuan,
        //     harga_beli: item.harga_beli,
        //     hrg_jual: item.hrg_jual,
        //     stock: item.stock,
        //     qty: item.qty,
        //     tambahan: item.tambahan
        // };
        // const cek = cekData('kd_brg',item.kd_brg,table);
        // cek.then(res => {
        //     if(res==undefined){
        //             store(table, finaldt)
        //     }else{
        //         update(table,{
        //                 id:res.id,
        //                 kd_brg: res.kd_brg,
        //                 nm_brg: res.nm_brg,
        //                 barcode: res.barcode,
        //                 satuan: res.satuan,
        //                 harga_beli: res.harga_beli,
        //                 hrg_jual: res.hrg_jual,
        //                 stock: res.stock,
        //                 qty: parseFloat(res.qty)+1,
        //                 tambahan: res.tambahan
        //         })
        //     }
            

        //     this.getData()
        // })
        this.setState({
            suggestions: [],
            value:''
        });
    }


    render(){

        const kategori = this.props.kategori;
        console.log(kategori);
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Cari Barang",
            value,
            onChange: this.onChange
        };
        const theme = {
            container: 'autosuggest',
            input: 'form-control',
            suggestionsContainer: 'dropdown',
            suggestionsList: `dropdown-menu ${suggestions.length ? 'show' : ''}`,
            suggestion: 'dropdown-item',
            suggestionHighlighted: 'active'
        };
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPromo"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Promo":"Update Promo"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="form-group">
                            <label>Account Name</label>
                            <input type="text" className="form-control" name="akun" value={this.state.akun} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" className="form-control" id="category" defaultValue={this.state.category} value={this.state.category} onChange={this.handleChange}>
                            <option value="-">Choose Category</option>
                            {kategori.map((v,i)=>{
                                return(
                                    <option value={v.kode} key={i}>{v.title}</option>
                                )
                            })}
                            </select>
                        </div>

                        <div className="form-group" style={{display:this.state.category==='brg'?'block':'none'}}>
                            <label>Product Code</label>
                            <input type="text" className="form-control" name="kd_brg" value={this.toCurrency(this.state.kd_brg)} onChange={this.handleChange} required/>
                        </div>
                        <div className="form-group" style={{display:this.state.category==='brg'?'block':'none'}}>
                            <label>Product Code</label>
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                onSuggestionSelected={this.onSuggestionSelected}
                                getSuggestionValue={this.getSuggestionValue}
                                renderSuggestion={this.renderSuggestion}
                                inputProps={inputProps}
                                theme={theme}
                                />
                        </div>
                        <div className="table-responsive" style={{overflowX: 'auto'}}>
                        {/* <table className="table table-hover table-bordered">
                            <thead>
                            <tr>
                                <th style={columnStyle}>#</th>
                                <th style={columnStyle}>Nama</th>
                                <th style={columnStyle}>Barcode</th>
                                <th style={columnStyle}>Harga jual</th>
                                <th style={columnStyle}>Jenis</th>
                                <th style={columnStyle}>Diskon</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.databrg.map((item, index) => {
                                    console.log(item);

                                    subtotal += parseInt(item.harga_beli) * parseFloat(item.qty);
                                    // console.log('gt',grandtotal);
                                    return (
                                        <tr key={index}>
                                            <td style={columnStyle}>
                                                <a href="about:blank" className='btn btn-danger btn-sm'
                                                    onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                    className='fa fa-trash'/></a>
                                            </td>
                                            <td style={columnStyle}>{item.nm_brg}</td>
                                            <td style={columnStyle}>{item.barcode}</td>
                                            <td style={columnStyle}>{item.barcode}</td>
                                            <td style={columnStyle}><select className="form-control" name='satuan' style={{width:"100px"}} onChange={(e) => this.HandleChangeInputValue(e, index, item.barcode, item.tambahan)}>
                                                {
                                                    item.tambahan.map(i => {
                                                        return (
                                                            <option value={i.satuan} selected={i.satuan == item.satuan}>{i.satuan}</option>
                                                        )
                                                    })
                                                }
                                            </select></td>
                                            <td style={columnStyle}>
                                                <input type='text' name='qty'
                                                        onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                        style={{width: '100%', textAlign: 'center'}}
                                                        onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                        className="form-control"
                                                        value={this.state.brgval[index].qty}/>
                                                <div className="invalid-feedback"
                                                    style={parseInt(this.state.brgval[index].qty) > parseInt(item.stock) ? {display: 'block'} : {display: 'none'}}>
                                                    Qty Melebihi Stock.
                                                </div>
                                            </td>
                                            <td style={columnStyle}>{parseInt(item.harga_beli) * parseFloat(item.qty)}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table> */}
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
export default connect(mapStateToProps)(FormPromo);