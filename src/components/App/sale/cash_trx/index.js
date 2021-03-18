import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import Select from 'react-select'
import Swal from 'sweetalert2'
import {FetchCash, StoreCashTrx} from "redux/actions/masterdata/cash/cash.action";
import {kassa,toCurrency,rmComma} from "../../../../helper";
import moment from "moment"
class Sale extends Component{

    constructor(props) {
        super(props);
        this.HandleInput = this.HandleInput.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSubmit = this.HandleSubmit.bind(this);
        this.HandleChangeJenis = this.HandleChangeJenis.bind(this);
        this.HandleChangeKassa = this.HandleChangeKassa.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleEvent = this.handleEvent.bind(this);

        this.state = {
            addingItemName: "",
            perpage: 99999,
            kategori: "masuk",
            jumlah: "",
            keterangan: "",
            userid: "",
            jenis: "",
            jenis_data: [],
            location: "LK/0001",
            location_data: [],
            kassa: "Z",
            startDate: moment().format("yyyy-MM-DD"),
            selectedOpt:"",
            jns:[],
            error:{
                kassa:"",
                location:"",
                jenis:"",
                jumlah:"",
                keterangan:""
            },
        };
    }

    componentDidMount(){
        this.props.dispatch(FetchCash(1,this.state.kategori,'',this.state.perpage));
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.cash.data) {
            let j = []
            let jns = nextProps.cash.data;
            if(jns!==this.state.jns){
                
                jns.map((i) => {
                    j.push({
                        value: i.id,
                        label: i.title
                    });
                    return true;
                })
                this.setState({
                    jenis_data: j,
                    jns:jns,
                    jenis: "",
                    userid: nextProps.auth.user.id
                })
            }
        }
        if (nextProps.auth.user) {
            let lk = [];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                if (loc.length === 1) {
                    this.setState({
                        location: loc[0].kode,
                    })
                }
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return true;
                });
                this.setState({
                    location_data: lk,
                })
            }
        }
        if (nextProps.isSuccessTrx){
            this.setState({
                jumlah: "",
                keterangan: "",
                jenis: "",
                location: "LK/0001",
                kassa: "Z",
            })
        }
    }

    componentWillUnmount(){
    }

    handleEvent = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    }

    HandleInput(e){
        // e.preventDefault();
        const column = e.target.name;
        const val = e.target.value;
        if(column==='jumlah'){
            this.setState({
                jumlah: (val.replace(/,/g,'').replace(/\D/,''))
            });
        } else {
            this.setState({
                [column]: val
            });
        }
        if(column==='kategori'){
            this.setState({
                jumlah : '',
                keterangan : '',
                jenis: '',
                jenis_data: [],
                location : 'LK/0001',
                kassa : 'Z',
            });
            this.props.dispatch(FetchCash(1,val,'',this.state.perpage));
        }
        if(column==='jumlah'){
            let err = Object.assign({}, this.state.error, {
                jumlah: "",
                error: ""
            });
            this.setState({
                error: err
            })
        }
        if(column==='keterangan'){
            let err = Object.assign({}, this.state.error, {
                keterangan: "",
                error: ""
            });
            this.setState({
                error: err
            })
        }
    }

    HandleChangeJenis(jn){
        let err = Object.assign({}, this.state.error, {
            jenis: ""
        });
        this.setState({
            jenis: jn.value,
            error: err
        })
    }

    HandleChangeKassa(ks) {
        let err = Object.assign({}, this.state.error, {
            kassa: ""
        });

        this.setState({
            kassa: ks.value,
            error: err
        });
        // localStorage.setItem('kassa_cash_report', ks.value);
    }

    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            error: err
        })
    }
    HandleReset(e){
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value) {
                this.setState({
                    kategori:"masuk",
                    jumlah:"",
                    keterangan:"",
                    jenis:"",
                    location:"LK/0001",
                    kassa:"A",
                    selectedOpt:"",
                })
                        this.props.dispatch(FetchCash(1, this.state.kategori, '', this.state.perpage));

            }
        })
    }

    HandleSubmit(e){
        // e.preventDefault();
        let err = this.state.error;
        if (this.state.jenis === "" || this.state.jumlah === "" || this.state.keterangan === "" || this.state.location === "" || this.state.kassa==="") {
            if(this.state.jenis===""){
                err = Object.assign({}, err, {
                    jenis:"Jenis tidak boleh kosong."
                });
            }
            if (this.state.jumlah === "") {
                err = Object.assign({}, err, {
                    jumlah: "Jumlah tidak boleh kosong."
                });
            }

            if (this.state.keterangan === "") {
                err = Object.assign({}, err, {
                    keterangan: "Informasi tidak boleh kosong."
                });
            }
            if (this.state.location === "") {
                err = Object.assign({}, err, {
                    location: "Lokasi tidak boleh kosong."
                });
            }
            if (this.state.kassa === "") {
                err = Object.assign({}, err, {
                    kassa: "Kassa tidak boleh kosong."
                });
            }
            this.setState({
                error: err
            })
        }else{
            let data = {
                "kd_kasir": this.state.userid,
                "jumlah": rmComma(this.state.jumlah),
                "keterangan": this.state.keterangan,
                "lokasi": this.state.location,
                "kassa": this.state.kassa,
                "kd_trx": "",
                "type_kas": this.state.kategori,
                "jenis": this.state.jenis,
                tanggal: this.state.startDate
            };
            
            Swal.fire({allowOutsideClick: false,
                title: 'Informasi',
                text: "Pastikan data telah diisi dengan benar!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Save'
            }).then((result) => {
                if (result.value) {
                    this.props.dispatch((StoreCashTrx(data)));
                    this.props.dispatch(FetchCash(1, this.state.kategori, '', this.state.perpage));

                }
            })
        }
    }

    render() {
        return (
            <Layout page="Kas Masuk/Keluar">
                {/* <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Kas Masuk/Keluar</h5>
                        </div>
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-sm-12 offset-sm-0">
                                <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-6 col-xs-6 col-6">
                                            <div className="custom-control custom-radio" style={{textAlign:'end'}}>
                                                <input type="radio" id="customRadio1" checked={this.state.kategori === 'masuk'} onChange={(e) => this.HandleInput(e)} value={'masuk'} name="kategori" className="custom-control-input" />
                                                <label className="custom-control-label" htmlFor="customRadio1">Kas Masuk</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 col-xs-6 col-6">
                                            <div className="custom-control custom-radio">
                                                <input type="radio" id="customRadio2" checked={this.state.kategori === 'keluar'} onChange={(e) => this.HandleInput(e)} value={'keluar'} name="kategori" className="custom-control-input" />
                                                <label className="custom-control-label" htmlFor="customRadio2">Kas Keluar</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                {/* <label className="control-label font-12">
                                                    Lokasi
                                                </label> */}
                                                <Select
                                                    options={this.state.location_data}
                                                    placeholder="Pilih Lokasi"
                                                    onChange={this.HandleChangeLokasi}
                                                    value={
                                                        this.state.location_data.find(op => {
                                                            return op.value === this.state.location
                                                        })
                                                    }

                                                />
                                                <div className="invalid-feedback"
                                                    style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input type="date" name="startDate" className="form-control" value={this.state.startDate===undefined?moment(new Date()).format("yyyy-MM-DD"):moment(this.state.startDate).format("yyyy-MM-DD")} onChange={this.handleEvent} />

                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <Select
                                                    options={kassa('')}
                                                    placeholder="Pilih Kassa"
                                                    onChange={this.HandleChangeKassa}
                                                    value={
                                                        kassa('').find(op => {
                                                            return op.value === this.state.kassa
                                                        })
                                                    }
                                                />
                                                <div className="invalid-feedback"
                                                        style={this.state.error.kassa !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.kassa}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <Select
                                                    options={this.state.jenis_data}
                                                    placeholder="Pilih Jenis Kas"
                                                    onChange={this.HandleChangeJenis}
                                                    value={
                                                        this.state.jenis!==''?
                                                            this.state.jenis_data.find(op => {
                                                                return op.value === this.state.jenis
                                                            })
                                                        :''
                                                    }


                                                />
                                                <div className="invalid-feedback"
                                                        style={this.state.error.jenis !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.jenis}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Jumlah
                                                </label>
                                                <input
                                                    type="text"
                                                    readOnly={false}
                                                    className="form-control"
                                                    id="jumlah"
                                                    name="jumlah"
                                                    onChange={(e) => this.HandleInput(e)}
                                                    value={toCurrency(this.state.jumlah)}
                                                />
                                                <div className="invalid-feedback"
                                                        style={this.state.error.jumlah !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.jumlah}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div class="form-group">
                                                <label for="exampleTextarea1">Informasi</label>
                                                <textarea
                                                    class="form-control"
                                                    readOnly={false}
                                                    className="form-control"
                                                    id="keterangan"
                                                    name="keterangan"
                                                    onChange={(e) => this.HandleInput(e)}
                                                    value={this.state.keterangan}
                                                    rows="4"
                                                />
                                                <div className="invalid-feedback"
                                                        style={this.state.error.keterangan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.keterangan}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div class="form-group">
                                                <label>&nbsp;</label>
                                                <button type="button" className="btn btn-primary btn-block" onClick={(e) => this.HandleSubmit(e)}>SIMPAN</button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div class="form-group">
                                                <label>&nbsp;</label>
                                                <button type="button" className="btn btn-danger btn-block" onClick={(e) => this.HandleReset(e)}>RESET</button>
                                            </div>
                                        </div>
                                    </div>
                                </div> {/* end col */}
                            </div> {/* end row */}
                            </div> {/* end row */}
                        </div> {/* end col */}
                    </div>
                </div>

            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => {
    
    return {
    cash:state.cashReducer.data,
    isLoading: state.cashReducer.isLoading,
    auth:state.auth,
    isSuccessTrx: state.cashReducer.isSuccessTrx
}};

export default (connect(mapStateToPropsCreateItem)(Sale));