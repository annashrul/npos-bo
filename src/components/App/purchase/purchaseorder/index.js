import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
// import { Scrollbars } from "react-custom-scrollbars";
import {FetchBrg,setProductbrg} from 'redux/actions/masterdata/product/product.action'
import {FetchSupplierAll} from 'redux/actions/masterdata/supplier/supplier.action'
import {FetchNota,storePo} from 'redux/actions/purchase/purchase_order/po.action'

import { Scrollbars } from "react-custom-scrollbars";
import DatePicker from "react-datepicker";
import Select from 'react-select'
import Swal from 'sweetalert2'
import Preloader from 'Preloader'
import moment from 'moment';

const table='purchase_order'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
      let count = 0;

class PurchaseOrder extends Component{

    constructor(props) {
        super(props);

        this.state = {
          addingItemName: "",
          databrg: [],
          brgval:[],
          tgl_order: new Date(),
          tgl_kirim: new Date(),
          harga_beli: 0,
          diskon:0,
          ppn:0,
          qty:0,
          location_data:[],
          location:"",
          supplier:"",
          catatan:"",
          jenis_trx:"Tunai",
          userid:0,
          searchby:1,
          search:"",
          error:{
            location:"",
            supplier:"",
            catatan:""
          }
        };
        this.HandleRemove = this.HandleRemove.bind(this);
        this.HandleAddBrg = this.HandleAddBrg.bind(this);
        this.HandleChangeInput = this.HandleChangeInput.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeSupplier = this.HandleChangeSupplier.bind(this);
        this.setTglOrder=this.setTglOrder.bind(this);
        this.setTglEx=this.setTglEx.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSearch = this.HandleSearch.bind(this);
    }

    componentDidMount(){
      this.props.dispatch(FetchSupplierAll())
      this.getData();
      if(localStorage.lk!==undefined&&localStorage.lk!==''){
        this.props.dispatch(FetchNota(localStorage.lk))
        this.setState({
          location:localStorage.lk
        })
      }
      if (localStorage.sp !== undefined && localStorage.sp !== '') {
        this.setState({
          supplier: localStorage.sp
        })
      }
      if (localStorage.sp !== undefined && localStorage.sp !== '' && localStorage.lk!==undefined&&localStorage.lk!=='') {
        this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, localStorage.sp, this.autoSetQty))

      }
    }

    componentWillReceiveProps = (nextProps) => {
      if (nextProps.auth.user) {
        let lk = []
        let loc = nextProps.auth.user.lokasi;
        if(loc!==undefined){
            loc.map((i) => {
              lk.push({
                value: i.kode,
                label: i.nama
              });
            })
            this.setState({
              location_data: lk,
              userid: nextProps.auth.user.id
            })
        }
      }
      if(nextProps.barang.length>0){
        this.getData();

      }
     
    }

    componentWillUnmount(){
      this.props.dispatch(setProductbrg({status:'',msg:'',result:{data:[]}}));
      destroy(table);
      localStorage.removeItem('sp');
      localStorage.removeItem('lk');
    }

    HandleChangeLokasi(lk){
      let err = Object.assign({}, this.state.error, {
        location: ""
      });
      this.setState({
        location:lk.value,
        error: err
      })
      localStorage.setItem('lk', lk.value);
      this.props.dispatch(FetchNota(lk.value))
      if (this.state.supplier!==""){
        this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, this.state.supplier, this.autoSetQty))
      }
      destroy(table)
      this.getData();
    }

    HandleChangeSupplier(sp) {
      let err = Object.assign({}, this.state.error, {
          supplier: ""
      });
      this.setState({
        supplier: sp.value,
        error: err
      })
      localStorage.setItem('sp', sp.value);

      if (this.state.location !== "") {
        this.props.dispatch(FetchBrg(1, 'barcode', '', this.state.location, sp.value, this.autoSetQty))
      }
      destroy(table)
      this.getData();
    }

    HandleCommonInputChange(e,errs=true){
      const column = e.target.name;
      const val = e.target.value;
      this.setState({
        [column]: val
      });
      if(errs){
        let err = Object.assign({}, this.state.error, {
          [column]: ""
        });
        this.setState({ 
          error: err
          });
      }
    }

    HandleChangeInput(e,id){
        const column = e.target.name;
        const val = e.target.value;
       
        const cek = cekData('barcode', id, table);
        cek.then(res => {
            if (res == undefined) {
                 Toast.fire({
                     icon: 'error',
                     title: `not found.`
                 })
            } else {

                let final= {}
                Object.keys(res).forEach((k, i) => {
                    if(k!==column){
                       final[k] = res[k];
                    }else{
                        final[column]=val
                    }
                })
                update(table, final)
                 Toast.fire({
                     icon: 'success',
                     title: `${column} has been changed.`
                 })
            }
            this.getData();
        })
       
    }

    HandleChangeInputValue(e,i,barcode=null,datas=[]) {
        const column = e.target.name;
        const val = e.target.value;
        console.log(column,val);
        let brgval = [...this.state.brgval];
        brgval[i] = {...brgval[i], [column]: val};
        this.setState({ brgval });

        if(column==='satuan'){
          const cek = cekData('barcode', barcode, table);
          cek.then(res => {
              if (res == undefined) {
                  Toast.fire({
                      icon: 'error',
                      title: `not found.`
                  })
              } else {
                let newbrg=[];
                datas.map(i=>{
                  if(i.satuan===val){
                    newbrg=i;
                  }
                })

                  let final= {
                      id: res.id,
                      qty: 0,
                      kd_brg: res.kd_brg,
                      barcode: newbrg.barcode,
                      satuan: newbrg.satuan,
                      diskon: res.diskon,
                      diskon2: res.diskon2,
                      diskon3: 0,
                      diskon4: 0,
                      ppn: res.ppn,
                      stock: newbrg.stock,
                      harga_beli: newbrg.harga_beli,
                      nm_brg: res.nm_brg,
                      tambahan: res.tambahan
                  }
                  update(table, final)
                  Toast.fire({
                      icon: 'success',
                      title: `${column} has been changed.`
                  })
              }
              this.getData();
          })
        }

    }

    setTglOrder(date) {
        this.setState({
          tgl_order: date
        });
    };

    setTglEx(date) {
      this.setState({
        tgl_kirim: date
      });
    };

    HandleRemove(e, id){
        e.preventDefault()
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
                del(table,id)
                .then(res=>{
                  this.getData();
                  Swal.fire(
                      'Deleted!',
                      'Your data has been deleted.',
                      'success'
                  )

                })
            }
        })
    }

    HandleAddBrg(e,item,index) {  
        e.preventDefault();
        const finaldt = {
            kd_brg: item.kd_brg,
            barcode:item.barcode,
            satuan:item.satuan,
            diskon:item.diskon,
            diskon2:0,
            diskon3:0,
            diskon4:0,
            ppn:item.ppn,
            harga_beli:item.harga_beli,
            qty:item.qty,
            stock:item.stock,
            nm_brg:item.nm_brg,
            tambahan:item.tambahan
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
           cek.then(res => {
               if(res==undefined){
                    store(table, finaldt)
               }else{
                   update(table,{
                        id:res.id,
                        qty:parseFloat(res.qty)+1,
                        kd_brg: res.kd_brg,
                        barcode: res.barcode,
                        satuan: res.satuan,
                        diskon: res.diskon,
                        diskon2: res.diskon2,
                        diskon3: 0,
                        diskon4: 0,
                        ppn: res.ppn,
                        stock: res.stock,
                        harga_beli: res.harga_beli,
                        nm_brg:res.nm_brg,
                        tambahan: res.tambahan
                   })
               }
               

               this.getData();
           })
    }

    HandleReset(e){
      e.preventDefault();
       Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value) {
                destroy(table);
                localStorage.removeItem('sp');
                localStorage.removeItem('lk');
                window.location.reload(false);
            }
        })
    }

    HandleSubmit(e){
      e.preventDefault();

      // validator head form
      let err = this.state.error;
      if (this.state.catatan === "" || this.state.location === "" || this.state.supplier === ""){
        if(this.state.catatan===""){
          err = Object.assign({}, err, {
            catatan:"Catatan tidak boleh kosong."
          });
        }
        if (this.state.location === "") {
          err = Object.assign({}, err, {
            location: "Lokasi tidak boleh kosong."
          });
        }
  
        if (this.state.supplier === "") {
          err = Object.assign({}, err, {
            supplier: "Supplier tidak boleh kosong."
          });
        }
        this.setState({
          error: err
        })
      }else{
        const data = get(table);
        data.then(res => {
            if (res.length==0){
               Swal.fire(
                 'Error!',
                 'Pilih barang untuk melanjutkan PO.',
                 'error'
               )
            }else{
              Swal.fire({
                title: 'Simpan Purchase Order?',
                text: "Pastikan data yang anda masukan sudah benar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Simpan!',
                cancelButtonText: 'Tidak!'
              }).then((result) => {
                if (result.value) {
                  let subtotal = 0;
                  let detail = [];
                  res.map(item => {
                    let disc1 = 0;
                    let disc2 = 0;
                    let ppn = 0;
                    if (item.diskon != 0) {
                      disc1 = parseInt(item.harga_beli) * (parseFloat(item.diskon) / 100);
                      disc2 = disc1;
                      if (item.diskon2 != 0) {
                        disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                      }
                    }
                    if (item.ppn != 0) {
                      ppn = parseInt(item.harga_beli) * (parseFloat(item.ppn) / 100);
                    }
                    subtotal += ((parseInt(item.harga_beli) - disc2) + ppn) * parseFloat(item.qty);
                    detail.push({
                      kd_brg: item.kd_brg,
                      barcode: item.barcode,
                      satuan: item.satuan,
                      diskon: item.diskon,
                      diskon2: item.diskon2,
                      diskon3: item.diskon3,
                      diskon4: item.diskon4,
                      ppn: item.ppn,
                      harga_beli: item.harga_beli,
                      qty: item.qty
                    })
                  })
                  let data_final = {
                    tgl_order: moment(this.state.tgl_order).format("YYYY-MM-DD"),
                    tgl_kirim: moment(this.state.tgl_kirim).format("YYYY-MM-DD"),
                    catatan: this.state.catatan,
                    jenis_transaksi: this.state.jenis_trx,
                    supplier: this.state.supplier,
                    lokasi: this.state.location,
                    userid: this.state.userid,
                    sub_total: subtotal,
                    detail: detail
                  };
                  this.props.dispatch(storePo(data_final));
                }
              })
            }
        })
      }

    }

    autoSetQty(kode,data){
    console.log("DATA SET QTY",data);
      const cek = cekData('kd_brg', kode, table);
      return cek.then(res => {
          if (res == undefined) {
              console.log('GADA');
              store(table, {
                  kd_brg: data[0].kd_brg,
                  barcode: data[0].barcode,
                  satuan: data[0].satuan,
                  diskon: 0,
                  diskon2: 0,
                  diskon3: 0,
                  diskon4: 0,
                  ppn: 0,
                  harga_beli: data[0].harga_beli,
                  qty: 1,
                  stock: data[0].stock,
                  nm_brg: data[0].nm_brg,
                  tambahan: data[0].tambahan
              })
          } else {
                  update(table, {
                      id: res.id,
                      qty: parseFloat(res.qty) + 1,
                      kd_brg: res.kd_brg,
                      barcode: res.barcode,
                      satuan: res.satuan,
                      diskon: res.diskon,
                      diskon2: res.diskon2,
                      diskon3: 0,
                      diskon4: 0,
                      ppn: res.ppn,
                      stock: res.stock,
                      harga_beli: res.harga_beli,
                      nm_brg: res.nm_brg,
                      tambahan: res.tambahan
                  })
          }
          return true
      })
    }

    HandleSearch(){
      if (this.state.supplier === "" || this.state.lokasi === "") {
          Swal.fire(
            'Gagal!',
            'Pilih lokasi dan supplier terlebih dahulu.',
            'error'
          )
      }else{
        const searchby = parseInt(this.state.searchby)===1?'kd_brg':(parseInt(this.state.searchby)===2?'barcode':'deskripsi')
        this.props.dispatch(FetchBrg(1, searchby, this.state.search, this.state.lokasi, this.state.supplier,this.autoSetQty));
        this.setState({search: ''});
        
      }
    }
    getData() {
      const data = get(table);
      console.log(data);
      data.then(res => {
        let brg = []
        res.map((i) => {
          brg.push({
            harga_beli: i.harga_beli,
            diskon: i.diskon,
            ppn: i.ppn,
            qty: i.qty,
            satuan: i.satuan
          });
        })
        this.setState({
          databrg: res,
          brgval: brg
        })
      });
    }

    render() {
      
      // if(this.props.isLoading){
      //   return <Preloader/>
      // }

      let opSupplier=[];
      if(this.props.supplier!=[]){
        this.props.supplier.map(i=>{
            opSupplier.push({
              value: i.kode,
              label: i.nama
          })
        })
      }
       let subtotal=0;
        return (
          <Layout page="Purchase Order">
              <div className="row align-items-center">
                <div className="col-6">
                    <div className="dashboard-header-title mb-3">
                    <h5 className="mb-0 font-weight-bold">Purchase Order</h5>
                    {/* <p className="mb-0 font-weight-bold">Welcome to Motrila Dashboard.</p> */}
                    </div>
                </div>
                {/* Dashboard Info Area */}
                <div className="col-6">
                    <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                    <div className="dashboard-btn-group d-flex align-items-center">
                        <a href="#" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-info ml-1">Simpan</a>
                        <a href="#" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                    </div>
                    </div>
                </div>
                </div>

            <div className="row">
                {/* LEFT SIDE */}
              <div className="col-lg-5 col-md-4 col-xl-3 box-margin">
                <div className="card" style={{height: "100vh"}}>
                  <div className="card-body">
                    <div className="chat-area">
                      <div className="chat-header-text d-flex border-none mb-10">
                        <div className="chat-about">
                          <div className="chat-with font-18">Pilih Barang</div>
                        </div>
                      </div>
                      <div className="chat-search">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                                <div className="input-group input-group-sm">
                                  <select name='searchby' class="form-control form-control-sm" onChange={(e)=>this.HandleCommonInputChange(e,false)}>
                                    <option value={1}>Kode Barang</option>
                                    <option value={2}>Barcode</option>
                                    <option value={3}>Deskripsi</option>
                                  </select>
                                  </div>
                                <small
                                  id="passwordHelpBlock"
                                  class="form-text text-muted"
                                >
                                  Cari berdasarkan {parseInt(this.state.searchby)==1?'Kode Barang':(parseInt(this.state.searchby)===2?'Barcode':'Deskripsi')}
                                </small>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="input-group input-group-sm">
                                <input
                                  autoFocus
                                  type="text"
                                  id="chat-search"
                                  name="search"
                                  className="form-control form-control-sm"
                                  placeholder="Search"
                                  value={this.state.search}
                                   onChange={(e)=>this.HandleCommonInputChange(e,false)}
                                   onKeyPress = {
                                     event => {
                                       if (event.key === 'Enter') {
                                         this.HandleSearch();
                                       }
                                     }
                                   }
                                />
                                <span className="input-group-append">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick = {
                                      event => {
                                        event.preventDefault();
                                        this.HandleSearch();
                                      }
                                    }
                                  >
                                    <i className="fa fa-search" />
                                  </button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*end chat-search*/}
                      <Scrollbars style={{ width: "100%", height: "500px", maxHeight:'100%' }}>
                        <div className="people-list">
                          <div id="chat_user_2">
                            <ul className="chat-list list-unstyled">
                              {
                                this.props.barang.length!==0?
                                  this.props.barang.map((i,inx)=>{
                                    return(
                                      <li className="clearfix" key={inx} onClick={(e)=>this.HandleAddBrg(e,{
                                          kd_brg:i.kd_brg,
                                          barcode:i.barcode,
                                          satuan:i.satuan,
                                          diskon:0,
                                          diskon2:0,
                                          ppn:0,
                                          harga_beli: i.harga_beli,
                                          qty:1,
                                          stock:i.stock,
                                          nm_brg:i.nm_brg,
                                          tambahan:i.tambahan
                                      })}>
                                        <img src={i.gambar} alt="avatar" />
                                        <div className="about">
                                          <div className="name">{i.nm_brg}</div>
                                          <div className="status" style={{fontStyle:'italic'}}>{i.supplier}</div>
                                        </div>
                                      </li>
                                    )
                                  }):(
                                    <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                  )

                                }
                              
                              
                            </ul>
                          </div>
                        </div>
                      </Scrollbars>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-md-8 col-xl-9 box-margin">
                <div className="card" style={{height: "100vh"}}>
                  <div className="container" style={{ marginTop: "20px" }}>
                    <form className=''>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              readOnly
                              className="form-control-plaintext form-control-sm"
                              id="nota"
                              style={{fontWeight:'bolder'}}
                              value={this.props.nota}
                            />
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Tanggal Order
                                </label>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <i className="fa fa-calendar" />
                                    </span>
                                  </div>
                                  <DatePicker
                                    className="form-control rounded-right"
                                    selected={this.state.tgl_order}
                                    onChange={this.setTglOrder}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Tanggal Order
                                </label>
                                <div className="input-group">
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <i className="fa fa-calendar" />
                                    </span>
                                  </div>
                                  <DatePicker
                                    className="form-control rounded-right"
                                    selected={this.state.tgl_kirim}
                                    onChange={this.setTglEx}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Jenis Transaksi
                                </label>
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    id="customRadio1"
                                    name="jenis_trx"
                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                    value="Tunai"
                                    className="custom-control-input"
                                    checked={this.state.jenis_trx==='Tunai'}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="customRadio1"
                                  >
                                    Tunai
                                  </label>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    id="customRadio2"
                                    name="jenis_trx"
                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                    value="Kredit"
                                    className="custom-control-input"
                                    checked={this.state.jenis_trx==='Kredit'}

                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="customRadio2"
                                  >
                                    Kredit
                                  </label>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    id="customRadio3"
                                    name="jenis_trx"
                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                    value="Konsinyasi"
                                    className="custom-control-input"
                                    checked={this.state.jenis_trx==='Konsinyasi'}

                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="customRadio3"
                                  >
                                    Konsinyasi
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-7">
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Lokasi
                                </label>
                                <Select 
                                  options={this.state.location_data} 
                                  placeholder = "Pilih Lokasi"
                                  onChange={this.HandleChangeLokasi}
                                  value = {
                                    this.state.location_data.find(op => {
                                      return op.value === this.state.location
                                    })
                                  }

                                />
                                <div class="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                      {this.state.error.location}
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Supplier
                                </label>
                                <Select 
                                  options={opSupplier} 
                                  placeholder="Pilih Supplier"
                                  onChange={this.HandleChangeSupplier}
                                  value = {
                                    opSupplier.find(op => {
                                      return op.value === this.state.supplier
                                    })
                                  }
                                />
                                <div class="invalid-feedback" style={this.state.error.supplier!==""?{display:'block'}:{display:'none'}}>
                                      {this.state.error.supplier}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <div className="form-group">
                                <label className="control-label font-12">
                                  Catatan
                                </label>
                                <textarea
                                  className="form-control"
                                  id="exampleTextarea1"
                                  rows={7}
                                  defaultValue={""}
                                  onChange={(e=>this.HandleCommonInputChange(e))}
                                  name="catatan"
                                />
                                <div class="invalid-feedback" style={this.state.error.catatan!==""?{display:'block'}:{display:'none'}}>
                                      {this.state.error.catatan}
                                </div>
                                {/* {
                                  this.state.error.catatan!==""?(
                                    <div class="invalid-feedback">
                                      {this.state.error.catatan}
                                    </div>
                                  ):""
                                } */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-body">
                    <div id="tableContainer">
                      <div className="table-responsive">
                        <Scrollbars style={{width:'100%', height: "400px", maxHeight:'100%' }}>

                        <table className="table table-hover">
                          <thead>
                            <tr>
                                <th>#</th>
                                <th>barang</th>
                                <th>barcode</th>
                                <th>satuan</th>
                                <th>harga beli</th>
                                <th>diskon</th>
                                <th>ppn</th>
                                <th>stock</th>
                                <th>qty</th>
                                <th>Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {
                                this.state.databrg.map((item,index)=>{
                                    let disc1=0;
                                    let disc2=0;
                                    let ppn=0;
                                    if(item.diskon!=0){
                                        disc1 = parseInt(item.harga_beli) * (parseFloat(item.diskon) / 100);
                                        disc2=disc1;
                                        if(item.diskon2!=0){
                                            disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                                        }
                                      }
                                    if(item.ppn!=0){
                                        ppn = parseInt(item.harga_beli) * (parseFloat(item.ppn) / 100);
                                    }
                                    subtotal+=((parseInt(item.harga_beli)-disc2)+ppn)*parseFloat(item.qty);
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href="#" className='btn btn-danger btn-sm' onClick={(e)=>this.HandleRemove(e,item.id)}><i className='fa fa-trash'/></a>
                                            </td>
                                            <td>{item.nm_brg}</td>
                                            <td>{item.barcode}</td>
                                            <td><select name='satuan' onChange={(e)=>this.HandleChangeInputValue(e,index,item.barcode,item.tambahan)}>
                                                {
                                                  item.tambahan.map(i=>{
                                                    return(
                                                      <option value={i.satuan} selected={i.satuan == item.satuan}>{i.satuan}</option>
                                                    )
                                                  })
                                                }
                                              </select></td>
                                            <td><input type='text' style={{width:'80px',textAlign:'center'}} name='harga_beli' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].harga_beli}/></td>
                                            <td><input type='text' name='diskon' style={{width:'35px',textAlign:'center'}} onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)} value={this.state.brgval[index].diskon}/></td>
                                            <td><input type='text' name='ppn' style={{width:'35px',textAlign:'center'}} onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].ppn}/></td>
                                            <td>{item.stock}</td>
                                            <td><input type='text' name='qty' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} style={{width:'35px',textAlign:'center'}} onChange={(e)=>this.HandleChangeInputValue(e,index)}  value={this.state.brgval[index].qty}/></td>
                                            <td>{((parseInt(item.harga_beli)-disc2)+ppn)*parseFloat(item.qty)}</td>
                                        </tr>
                                    )
                                })
                            }
                          </tbody>
                             <tfoot>
                                <tr style={{background:'#eee'}}>
                                    <td colSpan='9' style={{textAlign:'right !important'}}>Total</td>
                                    <td colSpan='1'>{subtotal}</td>
                                </tr>
                            </tfoot>
                        </table>
                        </Scrollbars>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
  barang: state.productReducer.result_brg,
  loadingbrg: state.productReducer.isLoadingBrg,
  nota: state.poReducer.code,
  supplier: state.supplierReducer.dataSupllier,
  isLoading:state.poReducer.isLoading,
  auth:state.auth
});

export default connect(mapStateToPropsCreateItem)(PurchaseOrder);