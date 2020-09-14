import React,{Component} from 'react'
import * as Swal from "sweetalert2";
import moment from "moment";
import {FetchSite, FetchFiles,storeSite, deleteFiles} from "redux/actions/site.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
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

    componentWillMount(){
        this.getProps(this.props);
        let count=1;
        Swal.fire({
            title: '',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Akses',
            showLoaderOnConfirm: true,
            closeOnClickOutside: false,
            allowOutsideClick: false,
            preConfirm: (login) => {
                if(LOC_VERIF.password === btoa(login)){
                    this.props.dispatch(FetchSite());
                    this.props.dispatch(FetchFiles());
                    this.setState({
                        isShow:true,
                    })
                }else{
                    if(count===3){
                        alert("Access Denied.")
                        window.location = "http://www.google.com";
                    }
                    count++;
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
        if (column === 'checkboxTgl'){
            if(event.target.checked){
                //datepicker
                this.setState({isChecked:true})
            }else{
                //dropdown
                this.setState({isChecked:false})
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
                tanggal_tempo: this.state.isChecked === true ? moment(this.state.tanggal_tempo_picker).format('yyyy-MM-DD') : this.state.tanggal_tempo_select,
                server_price: this.state.harga_server,
                acc_name: this.state.acc_name,
                acc_number: this.state.acc_number,
                promo: this.state.promo,
            };
        }

        let timerInterval;
        Swal.fire({
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

    handleSelect = (index) => {
        if(index === 1){
            this.props.dispatch(FetchFiles());
        }
        this.setState({selectedIndex: index}, () => {
            
        })
    };

    handleDelete(e,i){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                let body = {}
                body['path'] = i;
                this.props.dispatch(deleteFiles(body,i));
            }
        })

    }

    render(){
        const {isShow} = this.state;
        return (
            <div className="container mt-5">
                {
                    isShow===true?(
                            <Tabs>
                        <div className="card">
                            <div className="card-header">
                                <h4>Global Setting</h4>
                                <TabList>
                                    <Tab onClick={() =>this.handleSelect(0)}>Add</Tab>
                                    <Tab onClick={() =>this.handleSelect(1)}>List</Tab>
                                </TabList>
                            </div>
                                <TabPanel>
                                    <div className="card-body">
                                        <h4><small>Tanggal Jatuh Tempo:</small><br/> {this.state.tanggal_tempo_formated}</h4>
                                        <br/>
                                        <div className="form-group">
                                            <label>Tambah Masa Sewa</label><br/>
                                            <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="checkboxTgl" checked={this.state.isChecked} onChange={this.handleChange}/> Pilih { this.state.isChecked!==true?'Datepicker':'Dropdown'}</label>
                                            {
                                                this.state.isChecked===true?(
                                                    <input type="date" name={"tanggal_tempo_picker"} className="form-control" value={this.state.tanggal_tempo_picker} onChange={this.handleChange}/>
                                                ):(
                                                    <select name="tanggal_tempo_select" className="form-control" value={this.state.tanggal_tempo_select} defaultValue={this.state.tanggal_tempo_select} onChange={this.handleChange}>
                                                        <option value="-">==== Pilih ====</option>
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
                                </TabPanel>
                                <TabPanel>
                                <div className="card-body">
                                    <div className="bg-transparent d-flex align-items-center justify-content-between mb-20">
                                        <div className="widgets-card-title">
                                            <h5 className="card-title mb-0">Recent files</h5>
                                        </div>
                                    </div>
                                        {
                                            typeof this.props.files==='object'? this.props.files.length>0?
                                                this.props.files.map((v,i)=>{
                                                    return (
                                                        <div className="widget-download-file d-flex align-items-center justify-content-between mb-4" key={i}>
                                                            <div className="d-flex align-items-center mr-3">
                                                                <button type="button" className="btn btn-danger btn-circle mr-3" onClick={(e) => this.handleDelete(e, v.fullpath)}><i className="fa fa-times"></i> </button>
                                                            <div className="user-text-table">
                                                                <h6 className="d-inline-block font-15 mb-0">{v.filename}</h6>
                                                                <p className="mb-0">{v.size}</p>
                                                            </div>
                                                            </div>
                                                            <a href={v.path} target="_blank" className="download-link badge badge-primary badge-pill" style={{padding:10+'px'}}>Download</a>
                                                        </div>
                                                    );
                                                }) : "No data." : "No data."
                                        }
                                </div>
                                </TabPanel>
                        </div>
                            </Tabs>
                    ):""
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        site: state.siteReducer.data,
        files: state.siteReducer.data_list,
    }
}
export default connect(mapStateToProps)(GlobalSetting);