import React, { Component } from 'react'
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import * as Swal from "sweetalert2";
import {storeSite} from "redux/actions/site.action";
import Preloader from "Preloader";

class Billing extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChecked:false,
            harga_server:"",
            acc_name:'',
            acc_number:'',
            promo:'-',
            tanggal_tempo:'-',
            tanggal_tempo_formated: moment(new Date()).format("Do MMMM YYYY"),
            tanggal_tempo_picker:moment(new Date()).format("yyyy-MM-DD"),
            tanggal_tempo_select:'-'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    getProps(param){
        if(param.site.result!==undefined){
            this.setState({
                tanggal_tempo:moment(param.site.result.tanggal_tempo).format("yyyy/MM/DD"),
                tanggal_tempo_formated: moment(param.site.result.tanggal_tempo).format("Do MMMM YYYY"),
                harga_server:param.site.result.server_price,
                acc_name:param.site.result.acc_name,
                acc_number:param.site.result.acc_number,
                promo:param.site.result.promo,
            })
        }
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        this.setState({ [column]: value });
        if (column === 'checkboxTgl'){
            if(event.target.checked){
                //datepicker
                this.setState({isChecked:true})
            }else{
                //dropdown
                this.setState({isChecked:false,tanggal_tempo_select:'-'})
            }
        }
    }
    handleSubmit(e){
        e.preventDefault();
        let parsedata=[];
        if (this.state.tanggal_tempo_select==='-'){
            parsedata = {
                server_price: this.state.harga_server,
                acc_name: this.state.acc_name,
                acc_number: this.state.acc_number,
                promo: this.state.promo,
            };
        }else{
            parsedata = {
                // tanggal_tempo: this.state.isChecked === true ? moment(this.state.tanggal_tempo_picker).format('yyyy-MM-DD') : this.state.tanggal_tempo_select,
                tanggal_tempo: this.state.tanggal_tempo_select,
                server_price: this.state.harga_server,
                acc_name: this.state.acc_name,
                acc_number: this.state.acc_number,
                promo: this.state.promo,
            };
        }

        let timerInterval;
        Swal.fire({allowOutsideClick: false,
            title: 'Tunggu Sebentar',
            html: 'data sedang dikirim ke server',
            timer: 1000,
            timerProgressBar: true,
            onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onClose: () => {
                clearInterval(timerInterval)
                // this.props.dispatch(storeSite(parsedata));
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                this.props.dispatch(storeSite(parsedata));
            }
        })


    }

    render(){


        return (
            !this.props.isLoading?(
                <div>
                    <div className="card-body">
                        <h4><small>Tanggal Jatuh Tempo:</small><br/> {this.state.tanggal_tempo_formated}</h4>
                        <br/>
                        <div className="form-group">
                            <label>Tambah Masa Sewa</label><br/>
                            <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="checkboxTgl" checked={this.state.isChecked} onChange={this.handleChange}/> Pilih { this.state.isChecked!==true?'Datepicker':'Dropdown'}</label>
                            {
                                this.state.isChecked===true?(
                                    <input type="date" name={"tanggal_tempo_select"} className="form-control" value={this.state.tanggal_tempo_select} onChange={this.handleChange}/>
                                ):(
                                    <select name="tanggal_tempo_select" className="form-control" value={this.state.tanggal_tempo_select} defaultValue={this.state.tanggal_tempo_select} onChange={this.handleChange}>
                                        <option value="-">==== Pilih ====</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(30, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(30, 'days').format('yyyy-MM-DD')}>1 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(60, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(60, 'days').format('yyyy-MM-DD')}>2 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(90, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(90, 'days').format('yyyy-MM-DD')}>3 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(120, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(120, 'days').format('yyyy-MM-DD')}>4 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(150, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(150, 'days').format('yyyy-MM-DD')}>5 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(180, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(180, 'days').format('yyyy-MM-DD')}>6 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(210, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(210, 'days').format('yyyy-MM-DD')}>7 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(240, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(240, 'days').format('yyyy-MM-DD')}>8 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(270, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(270, 'days').format('yyyy-MM-DD')}>9 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(300, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(300, 'days').format('yyyy-MM-DD')}>10 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(330, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(330, 'days').format('yyyy-MM-DD')}>11 Bulan</option>
                                        <option value={this.props.site.result===undefined?moment(new Date()).add(360, 'days').format('yyyy-MM-DD'):moment(this.props.site.result.tanggal_tempo).add(360, 'days').format('yyyy-MM-DD')}>12 Bulan</option>
                                    </select>
                                )
                            }

                        </div>
                        <div className="form-group">
                            <label>Harga Server</label>
                            <input type="text" name={"harga_server"} className="form-control" value={this.state.harga_server} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Nama Akun</label>
                            <input type="text" name={"acc_name"} className="form-control" value={this.state.acc_name} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Nomer Akun</label>
                            <input type="text" name={"acc_number"} className="form-control" value={this.state.acc_number} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Promo</label>
                            <input type="text" name={"promo"} className="form-control" value={this.state.promo} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="card-header">
                        <button className="btn btn-primary" onClick={this.handleSubmit}>Simpan</button>
                    </div>
                </div>
            ):<Preloader/>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        site: state.siteReducer.data,
        files: state.siteReducer.data_list,
        isLoading: state.siteReducer.isLoading,
    }
}
export default connect(mapStateToProps)(Billing);