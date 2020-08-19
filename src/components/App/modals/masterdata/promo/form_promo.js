import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createPromo} from "redux/actions/masterdata/promo/promo.action";
import Select from "react-select";
import {HEADERS} from "redux/actions/_constants";
import {FetchBrg} from "redux/actions/masterdata/product/product.action";
import {FetchUserLevel} from "redux/actions/masterdata/user_level/user_level.action";
import {FetchCustomerType} from "redux/actions/masterdata/customer_type/customer_type.action";
import {FetchBrgSame} from "redux/actions/masterdata/product/product.action";
import {toRp} from "helper";
import moment from "moment";
import {FetchAllLocation} from "redux/actions/masterdata/location/location.action";
import FileBase64 from "react-file-base64";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import {FetchSupplierAll} from "redux/actions/masterdata/supplier/supplier.action";
import Preloader from "../../../../../Preloader";

class FormPromo extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeJenisMember = this.handleChangeJenisMember.bind(this);
        this.handleChangeLokasi = this.handleChangeLokasi.bind(this);
        this.handleChangeKelBarang = this.handleChangeKelBarang.bind(this);
        this.handleChangeSupplier = this.handleChangeSupplier.bind(this);
        this.handleChangeDynamic = this.handleChangeDynamic.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            barang_data:[],
            nama:'',
            category: '-',
            category_data:[],
            jenis_member: '-',
            jenis_member_data:[],
            kel_brg: '-',
            kel_brg_data:[],
            supplier: '-',
            supplier_data:[],
            lokasi:"",
            lokasi_data:[],
            hanya_member:false,
            tanpa_periode:false,
            tgl_mulai:moment(new Date()).format("yyyy-MM-DD"),
            tgl_selesai:moment(new Date()).format("yyyy-MM-DD"),
            keterangan:'-',
            min_trx:0,
            gambar:'-',
            isCheckedLokasi:false,

        };
    }
    componentWillMount(){
        this.getProps(this.props);
        this.props.dispatch(FetchBrgSame(1, 'barcode', '', null, null,null));
        this.props.dispatch(FetchAllLocation());

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    getProps(param){
        console.log('get props',param)
        if(param.customerType.data!==undefined){
            let cust=[];
            param.customerType.data.map((v,i)=>{
                cust.push({
                    value:v.kode,
                    label:v.nama,
                })
            });
            this.setState({jenis_member_data:cust});
        }
        if(param.kategori!==undefined){
            let kategori=[];
            param.kategori.map((v,i)=>{
                kategori.push({
                    value:v.kode,
                    label:v.title,
                })
            });
            this.setState({category_data:kategori});
        }
        if(param.barang!==undefined){
            let brg=param.barang;
            for(let i=0;i<brg.length;i++){
                Object.assign(brg[i],{qty:0,qty2:0,checked:false,jenis:"persen"});
            }
            this.setState({barang_data:brg});
        }
        if(param.lokasi.data!==undefined){
            let lokasi=[];
            param.lokasi.data.map((v,i)=>{
                lokasi.push({
                    value:v.kode,
                    label:v.nama_toko,
                })
            });
            this.setState({lokasi_data:lokasi});
        }
        if(param.kel_barang.data!==undefined){
            let kel_brg=[];
            param.kel_barang.data.map((v,i)=>{
                kel_brg.push({
                    value:v.kel_brg,
                    label:v.nm_kel_brg,
                })
            });
            this.setState({kel_brg_data:kel_brg});
        }
        if(param.supplier!==undefined){
            let supplier=[];
            param.supplier.map((v,i)=>{
                supplier.push({
                    value:v.kode,
                    label:v.nama,
                })
            });
            this.setState({supplier_data:supplier});
        }
    }
    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        let checked=event.target.checked;
        this.setState({ [column]: value});
        if(column==='hanya_member'){
            if(checked){
                this.props.dispatch(FetchCustomerType(1,'',100));
                this.setState({hanya_member:true});
            }else{
                this.setState({hanya_member:false});
            }
        }
        if(column==='tanpa_periode'){
            this.setState({tanpa_periode:!this.state.tanpa_periode});
        }
        if(column==='checked_lokasi'){
            let lokasi=[];let lok=[];
            if(checked===true){
               this.state.lokasi_data.map((v,i)=>{
                   lok.push(`${v.value}`).toString()
                });
                this.setState({
                    lokasi:lok,
                    isCheckedLokasi:true
                });
            }else{
                this.state.lokasi_data.map((v,i)=>{
                    lokasi.push({
                        value:v.value,
                        label:v.label,
                    });
                    lok.push(`${v.value}`);
                });
                this.setState({lokasi:'',isCheckedLokasi:false});
            }

        }
    }
    handleChangeCategory(val){
        console.log("kategori",val)
        this.setState({
            category:val.value,
        })
        if(val.value==='kelbrg'){
            this.props.dispatch(FetchGroupProduct(1,'',100));
        }
        if(val.value==='spr'){
            this.props.dispatch(FetchSupplierAll());
        }
    }
    handleChangeJenisMember(val){
        this.setState({
            jenis_member:val.value,
        })
    }
    handleChangeLokasi(val){
        if(val!==null){
            let lok=[];
            for(let i=0;i<val.length;i++){
                lok.push(`${val[i].value}`);
            }
            this.setState({lokasi:lok});
        }
    }
    handleChangeKelBarang(val){
        this.setState({kel_brg:val.value})
    }
    handleChangeSupplier(val){
        this.setState({supplier:val.value})
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    handleChangeDynamic(e,i){
        let column = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        let barang_data = [...this.state.barang_data];
        if(column === 'checked'){
            barang_data[i] = {...barang_data[i], [column]: checked};
        }
        if(column === 'qty'|| column === 'qty2'|| column=== 'jenis'){
            barang_data[i] = {...barang_data[i], [column]: value};
        }

        this.setState({ barang_data });
    }
    getFiles(files) {
        this.setState({
            gambar: files
        })
    };
    handleSubmit(e){
        e.preventDefault();
        let parseData={};

        parseData['category']=this.state.category;
        parseData['daritgl']=this.state.tgl_mulai;
        parseData['sampaitgl']=this.state.tgl_selesai;
        parseData['lokasi']=this.state.lokasi.toString();
        parseData['gambar']=this.state.gambar==='-'?'-':this.state.gambar.base64;
        parseData['member']=this.state.hanya_member?this.state.jenis_member:0;
        parseData['periode']=!this.state.tanpa_periode?0:1;
        parseData['keterangan']=this.state.keterangan;
        let detail=[];
        this.state.barang_data.map((v,i)=>{
            if(this.state.category==='brg'){
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode, diskon:v.qty, diskon2:v.qty2, min_trx:0, min_qty:0, open_price:0, hrg_jual:v.harga, bonus:0, isbuy:0
                    })
                }
            }
            if(this.state.category==='kelbrg'){

            }

        })
        parseData['detail']=detail;
        this.props.dispatch(createPromo(parseData));
        console.log("submitted",parseData);
    }
    render(){
        const {lokasi_data} = this.state;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPromo"}  size="lg" style={this.state.category==='brg'? {maxWidth: '1600px', width: '100%'}:{border:"1px solid black"}}>
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Promo":"Update Promo"}</ModalHeader>
                <ModalBody>

                    <div className="row">
                        <div className={this.state.category==='brg'?'col-md-4':'col-md-12'}>
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="hanya_member" checked={this.state.hanya_member} onChange={this.handleChange}/> Hanya Member</label>
                                &nbsp;&nbsp;&nbsp;
                                <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="tanpa_periode" checked={this.state.tanpa_periode} onChange={this.handleChange}/> Tanpa Periode</label>
                            </div>

                            <div className="form-group" style={this.state.hanya_member?{display:"block"}:{display:"none"}}>
                                <label>Jenis Member</label>
                                <Select options={this.state.jenis_member_data} placeholder="==== Pilih ====" onChange={this.handleChangeJenisMember} value={this.state.jenis_member_data.find(op => {return op.value === this.state.jenis_member})}/>
                            </div>
                            <div className="form-group">
                                <label>Kategori</label>
                                <Select options={this.state.category_data} placeholder="==== Pilih ====" onChange={this.handleChangeCategory} value={this.state.category_data.find(op => {return op.value === this.state.category})}/>
                            </div>
                            <div className="form-group" style={this.state.category==='kelbrg'?{display:"block"}:{display:"none"}}>
                                <label>Kelompok Barang</label>
                                <Select options={this.state.kel_brg_data} placeholder="==== Pilih ====" onChange={this.handleChangeKelBarang} value={this.state.kel_brg_data.find(op => {return op.value === this.state.kel_brg})}/>
                            </div>
                            <div className="form-group" style={this.state.category==='spr'?{display:"block"}:{display:"none"}}>
                                <label>Supplier</label>
                                <Select options={this.state.supplier_data} placeholder="==== Pilih ====" onChange={this.handleChangeSupplier} value={this.state.supplier_data.find(op => {return op.value === this.state.supplier})}/>
                            </div>
                            <div className="form-group" style={!this.state.tanpa_periode?{display:'block'}:{display:'none'}}>
                                <label>Tanggal Mulai</label>
                                <input type="datetime-local" name="tgl_mulai" className="form-control" value={this.state.tgl_mulai} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group" style={!this.state.tanpa_periode?{display:'block'}:{display:'none'}}>
                                <label>Tanggal Selesai</label>
                                <input type="datetime-local" name="tgl_selesai" className="form-control" value={this.state.tgl_selesai} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="checked_lokasi" value={this.state.isChechkedLokasi} onChange={this.handleChange}/> Pilih Semua Lokasi</label>
                                {
                                    this.state.isCheckedLokasi?(
                                        <input type="text" value={this.state.lokasi} className="form-control" readOnly={true}/>
                                        ):(
                                        <Select
                                            required isMulti closeMenuOnSelect={false}
                                            value={lokasi_data.find(op => {return op.value === this.state.lokasi})}
                                            onChange={this.handleChangeLokasi}
                                            options={lokasi_data}
                                            name="lokasi"
                                        />
                                    )
                                }

                            </div>
                            <div className="form-group">
                                <label>Keterangan</label>
                                <input type="text" name="keterangan" className="form-control" value={this.state.keterangan} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Minimal Transaksi</label>
                                <input type="text" name="min_trx" className="form-control" value={this.state.min_trx} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                                <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getFiles.bind(this) } />
                            </div>
                        </div>
                        <div className="col-md-8" style={this.state.category==='brg'?{display:"block"}:{display:"none"}}>
                            <div className="table-responsive" style={{overflowX: 'auto'}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>#</th>
                                        <th style={columnStyle}>Nama</th>
                                        <th style={columnStyle}>Barcode</th>
                                        <th style={columnStyle}>Harga jual</th>
                                        <th style={columnStyle}>Jenis</th>
                                        <th style={columnStyle}>Diskon 1</th>
                                        <th style={columnStyle}>Diskon 2</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {
                                        this.state.barang_data.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}>{i+1}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked" checked={v.checked} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{toRp(v.harga)}</td>
                                                    <td style={columnStyle}>
                                                        <select name="jenis" className="form-control" value={v.jenis} defaultValue={v.jenis} onChange={(e)=>this.handleChangeDynamic(e,i)}>
                                                            <option value="persen">Persen (%)</option>
                                                            <option value="nominal">Nominal (rp)</option>
                                                        </select>
                                                    </td>
                                                    <td style={columnStyle}>
                                                        <input style={{textAlign:"right"}} type="number" name="qty" className="form-control" value={
                                                            parseInt(v.qty)<0?0:(v.jenis==='persen'?parseInt(v.qty)>100?0:v.qty:v.qty)
                                                        } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                        {
                                                            v.jenis==='persen'?
                                                                parseInt(v.qty)>100 ?
                                                                    (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                :""
                                                            :''
                                                        }
                                                        {
                                                            parseInt(v.qty)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                        }
                                                    </td>
                                                    <td style={columnStyle}>
                                                        <input style={{textAlign:"right"}} type="number" name="qty2" className="form-control" value={
                                                            parseInt(v.qty2)<0?0:(v.jenis==='persen'?parseInt(v.qty2)>100?0:v.qty2:v.qty2)
                                                        } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                        {
                                                            v.jenis==='persen'?
                                                                parseInt(v.qty2)>100 ?
                                                                    (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                    :""
                                                                :''
                                                        }
                                                        {
                                                            parseInt(v.qty2)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit}><i className="ti-save" /> Simpan</button>
                    </div>
                </ModalFooter>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        barang: state.productReducer.result_brg,
        customerType: state.customerTypeReducer.data,
        lokasi:state.locationReducer.allData,
        kel_barang:state.groupProductReducer.data,
        supplier:state.supplierReducer.dataSupllier,

    }
}
export default connect(mapStateToProps)(FormPromo);