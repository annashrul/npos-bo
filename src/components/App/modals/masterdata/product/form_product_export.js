import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import {to_pdf} from 'helper'
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import moment from "moment";
import XLSX from 'xlsx'
import Select from "react-select";
import { FetchBrgAll, setProductbrgAll } from '../../../../../redux/actions/masterdata/product/product.action';
import Spinner from '../../../../../Spinner';
// import MyProgressbar from '../../../../../myProgressbar';
import { RESET_PROPS_ARR } from '../../../../../redux/actions/_constants';

// kategori 1 = Dijual, kategori 0 = TIdak Dijual
// jenis 0 = Karton, jenis 1 = Satuan, jenis 2 = Paket, jenis 3 = Servis, jenis 4 = Bahan
class FormProductExport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleView = this.handleView.bind(this);
        this.printDocument = this.printDocument.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.state = {
            title:'',
            jenis: '',
            type:'',
            view:false,
            location_data:[],
            location:"",
            error:{
                title:'',
                jenis: '',
                type:'',
            }
        };

    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let lk = [];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
    }
    HandleChangeLokasi(lk) {
        this.setState({
          location: lk.value,
        });
        this.props.dispatch(setProductbrgAll(RESET_PROPS_ARR));
        this.props.dispatch(FetchBrgAll(encodeURIComponent(lk.value)))
    }
    handleView = (e) => {
        e.preventDefault();
        this.setState({
            view:!this.state.view
        })
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(setProductbrgAll(RESET_PROPS_ARR));
    };
    printDocument = (e) => {
        e.preventDefault();
        let stringHtml = '';
        stringHtml+=
        '<div style="text-align:center>'+
        // '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN OMSET PENJUALAN</center></h3>'+
        '</div>';
        
        const headers = [[
            'No',
            'Kode Barang',
            'Barcode',
            'Satuan',
            'Nama Barang',
            'Raw Nama Barang',
            'Harga',
            'Lokasi',
            'PPN Sale',
            'Service Sale',
            'Kel. Barang Sale',
            'Harga Beli Sale',
            'Stock Sale',
            'Kategori Sale',
            'Stock Min',
            'Sub-Dept',
            'Supplier',
            'Deskripsi Item',
            'Jenis Item',
            'KCP Trx',
            'Poin Trx',
            'online Trx',
            'Favorit',
            'Berat',
            'Harga 2',
            'Harga 3',
            'Harga 4',
            'Satuan Jual',
            'Qty Konversi',
            'Tanggal Input',
            'Tanggal Update',
        ]];
        let data = typeof this.props.resBarangAll === 'object'?this.props.resBarangAll.map((v,i)=> [
            i+1,
            v.kd_brg,
            v.barcode,
            v.satuan,
            v.nm_brg,
            v.raw_nmbrg,
            v.harga,
            v.nama_toko,
            v.ppn,
            v.service,
            v.kel_brg,
            v.hrg_beli,
            v.stock,
            parseInt(v.kategori,10)===0?'Kartonan':parseInt(v.kategori,10)===1?'Satuan':parseInt(v.kategori,10)===2?'Paket':parseInt(v.kategori,10)===3?'Servis':parseInt(v.kategori,10)===4?'Bahan':'Tidak diketahui!',
            v.stock_min,
            v.subdept,
            v.supplier,
            v.deskripsi,
            parseInt(v.jenis,10)===1?'Dijual':parseInt(v.jenis,10)===0?'Tidak dijual':'Tidak diketahui!',
            v.kcp,
            v.poin,
            v.online,
            v.fav,
            v.berat,
            v.harga2,
            v.harga3,
            v.harga4,
            v.satuan_jual,
            v.qty_konversi,
            v.tgl_input,
            v.tgl_update,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "sale_omset_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    printDocumentXLsx = (e, param) => {
        e.preventDefault();
        // {
        //     "kd_brg": "420001",
        //     "barcode": "WCAT1C999050",
        //     "satuan": "PCS",
        //     "nm_brg": "BARANG TEST",
        //     "raw_nmbrg": "BARANG TEST",
        //     "harga": "41000",
        //     "nama_toko": "TOKO BANDUNG",
        //     "ppn": 0,
        //     "service": 0,
        //     "kel_brg": "42",
        //     "hrg_beli": "37500",
        //     "stock": "0",
        //     "kategori": "1",
        //     "stock_min": "0",
        //     "subdept": "Sub-Dept01",
        //     "supplier": "FREEZE FRESH FOOD",
        //     "deskripsi": "BARANG TEST",
        //     "gambar": null,
        //     "jenis": "1",
        //     "kcp": "-",
        //     "poin": "0",
        //     "online": "0",
        //     "fav": "0",
        //     "berat": "0",
        //     "harga2": "0",
        //     "harga3": "0",
        //     "harga4": "0",
        //     "satuan_jual": 1,
        //     "qty_konversi": 0,
        //     "tgl_input": "2020-06-11T08:51:29.000Z",
        //     "tgl_update": "2020-06-11T08:51:29.000Z"
        //   }
        let header = [
            ['SEMUA DATA BARANG'],
            // ['PERIODE : ' + this.props.startDate + ' - ' + this.props.endDate + ''],
            [''],
            [
                'No',
                'Kode Barang',
                'Barcode',
                'Satuan',
                'Nama Barang',
                'Raw Nama Barang',
                'Harga',
                'Lokasi',
                'PPN Sale',
                'Service Sale',
                'Kel. Barang Sale',
                'Harga Beli Sale',
                'Stock Sale',
                'Kategori Sale',
                'Stock Min',
                'Sub-Dept',
                'Supplier',
                'Deskripsi Item',
                'Jenis Item',
                'KCP Trx',
                'Poin Trx',
                'online Trx',
                'Favorit',
                'Berat',
                'Harga 2',
                'Harga 3',
                'Harga 4',
                'Satuan Jual',
                'Qty Konversi',
                'Tanggal Input',
                'Tanggal Update',
            ]
        ]
        let raw = typeof this.props.resBarangAll === 'object' ? this.props.resBarangAll.map((v,i) => [
            i+1,
            v.kd_brg,
            v.barcode,
            v.satuan,
            v.nm_brg,
            v.raw_nmbrg,
            v.harga,
            v.nama_toko,
            v.ppn,
            v.service,
            v.kel_brg,
            v.hrg_beli,
            v.stock,
            parseInt(v.kategori,10)===0?'Kartonan':parseInt(v.kategori,10)===1?'Satuan':parseInt(v.kategori,10)===2?'Paket':parseInt(v.kategori,10)===3?'Servis':parseInt(v.kategori,10)===4?'Bahan':'Tidak diketahui!',
            v.stock_min,
            v.subdept,
            v.supplier,
            v.deskripsi,
            parseInt(v.jenis,10)===1?'Dijual':parseInt(v.jenis,10)===0?'Tidak dijual':'Tidak diketahui!',
            v.kcp,
            v.poin,
            v.online,
            v.fav,
            v.berat,
            v.harga2,
            v.harga3,
            v.harga4,
            v.satuan_jual,
            v.qty_konversi,
            v.tgl_input,
            v.tgl_update,
        ]) : '';

        let body = header.concat(raw);

        let data = body;
        let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let exportFileName = `Semua_Data_Barang_${moment(new Date()).format('YYYYMMDDHHMMss')}.${param === 'csv' ? `csv` : `xlsx`}`;
        XLSX.writeFile(wb, exportFileName, { type: 'file', bookType: param === 'csv' ? "csv" : "xlsx" });

        this.toggle(e);
    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProductExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span className="text-dark" aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Pilih Lokasi
                                    </label>
                                    <Select
                                        // menuPortalTarget={document.body}
                                        // menuPosition={'fixed'} 
                                        styles={{
                                            // Fixes the overlapping problem of the component
                                            menu: provided => ({ ...provided, zIndex: 9999 })
                                          }}
                                        options={this.state.location_data}
                                        // placeholder="Pilih Tipe Kas"
                                        onChange={this.HandleChangeLokasi}
                                        value={
                                            this.state.location_data.find(op => {
                                                return op.value === this.state.location
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {this.props.isLoadingBrgAll?
                        <div>
                            <Spinner/>
                            <br/>
                            {/* <MyProgressbar myprogressbarLabel={`Sedang memuat data ${this.props.persenDl}%`} myprogressbarPersen={this.props.persenDl+'%'}/> */}
                            </div>
                        :''}
                        {this.props.resBarangAll.length>0?
                        <div className="row mb-4">
                            <div className="col-6 d-none">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgPdf} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-danger" onClick={(e => this.printDocument(e))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 offset-3">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e, 'xlsx'))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:''}
                    </ModalBody>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    
    return {
        resBarangAll:state.productReducer.pagin_brg,
        isLoadingBrgAll:state.productReducer.isLoadingBrg,
        persenDl:state.productReducer.persenDl,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        auth:state.auth
    }
}
export default connect(mapStateToProps)(FormProductExport);