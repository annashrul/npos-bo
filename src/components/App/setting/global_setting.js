import React,{Component} from 'react'
import * as Swal from "sweetalert2";
import moment from "moment";
import {FetchSite,storeSite} from "redux/actions/site.action";
import connect from "react-redux/es/connect/connect";
import {LOC_VERIF} from "../../../redux/actions/_constants";

class GlobalSetting extends Component{
    constructor(props){
        super(props);
        this.state={
            isShow:false,
            isChecked:false,
            harga_server:"",
            acc_name:'',
            acc_number:'',
            promo:'-',
            tanggal_tempo:moment(new Date()).format("yyyy/MM/DD"),
            tanggal_tempo_picker:moment(new Date()).format("yyyy-MM-DD"),
            tanggal_tempo_select:moment(new Date()).format("yyyy-MM-DD")
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    getProps(param){
        if(param.site.result!==undefined){
            this.setState({
                tanggal_tempo:moment(param.site.result.tanggal_tempo).format("yyyy/MM/DD"),
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
    componentWillMount(){
        this.getProps(this.props);
        Swal.fire({
            title: 'Masukan Password Anda',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Masuk',
            showLoaderOnConfirm: true,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            preConfirm: (login) => {
                if(LOC_VERIF.password === login){
                    this.props.dispatch(FetchSite());
                    this.setState({
                        isShow:true,
                    })
                }else{
                    Swal.showValidationMessage(
                        `Password Salah`
                    )
                    this.setState({
                        isShow:false,
                    })
                }
            },

        }).then((result) => {

        })
    }
    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        this.setState({ [column]: value });
        if(event.target.checked){
            this.setState({isChecked:true})
        }else{
            this.setState({isChecked:false})
        }
    }
    handleSubmit(e){
        e.preventDefault();
        let parsedata={
            tanggal_promo:this.state.isChecked===true?moment(this.state.tanggal_tempo_picker).format('yyyy-MM-DD'):this.state.tanggal_tempo_select,
            server_price:this.state.harga_server,
            acc_name:this.state.acc_name,
            acc_number:this.state.acc_number,
            promo:this.state.promo,
        };
        let timerInterval;
        Swal.fire({
            title: 'Tunggu Sebentar',
            html: 'data sedang dikirim ke server',
            timer: 2000,
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
        const {isShow} = this.state;
        return (
            <div className="container">
                {
                    isShow===true?(
                        <div className="card">
                            <div className="card-header">
                                <h4>Form Global Setting</h4>
                            </div>
                            <div className="card-body">
                                <h2>Waktu Jatuh Tempo {this.state.tanggal_tempo}</h2>
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label"><input type="checkbox" checked={this.state.isChecked} onChange={this.handleChange}/> Pilih { this.state.isChecked===true?'Datepicker':'Dropdown'}</label>
                                    {
                                        this.state.isChecked===true?(
                                            <input type="date" name={"tanggal_tempo_picker"} className="form-control" value={this.state.tanggal_tempo_picker} onChange={this.handleChange}/>
                                        ):(
                                            <select name="tanggal_tempo_select" className="form-control" value={this.state.tanggal_tempo_select} defaultValue={this.state.tanggal_tempo_select} onChange={this.handleChange}>
                                                <option value="">==== Pilih ====</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(30, 'days').format('yyyy-MM-DD')}>1 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(60, 'days').format('yyyy-MM-DD')}>2 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(90, 'days').format('yyyy-MM-DD')}>3 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(120, 'days').format('yyyy-MM-DD')}>4 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(150, 'days').format('yyyy-MM-DD')}>5 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(180, 'days').format('yyyy-MM-DD')}>6 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(210, 'days').format('yyyy-MM-DD')}>7 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(240, 'days').format('yyyy-MM-DD')}>8 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(270, 'days').format('yyyy-MM-DD')}>9 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(300, 'days').format('yyyy-MM-DD')}>10 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(330, 'days').format('yyyy-MM-DD')}>11 Bulan</option>
                                                <option value={this.props.site.result===undefined?"":moment(this.props.site.result.tanggal_tempo).add(360, 'days').format('yyyy-MM-DD')}>12 Bulan</option>
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
                    ):""
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        site: state.siteReducer.data,
    }
}
export default connect(mapStateToProps)(GlobalSetting);