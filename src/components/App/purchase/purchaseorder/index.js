import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import { Scrollbars } from "react-custom-scrollbars";
import DatePicker from "react-datepicker";
import Logo from "assets/images/logo.png"
import Select from 'react-select'
import Swal from 'sweetalert2'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const table='purchase_order'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

class PurchaseOrder extends Component{

    constructor(props) {
        super(props);

        this.state = {
          addingItemName: "",
          databrg: [],
          brgval:[],
          startDate: new Date(),
          searchby: 'kode barang',
          harga_beli: 0,
          diskon:0,
          ppn:0,
          qty:0
        };
        this.HandleRemove = this.HandleRemove.bind(this);
        this.HandleAddBrg = this.HandleAddBrg.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.HandleChangeInput = this.HandleChangeInput.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this)
    }
    componentDidMount(){
        const data = get(table);
        data.then(res => {
            let brg = this.state.brgval
            res.map((i)=>{
                 brg.push({
                    harga_beli: i.harga_beli,
                    diskon: i.diskon,
                    ppn: i.ppn,
                    qty: i.qty
                });
            })
            this.setState({
                databrg: res,
                brgval: brg
            })
        })
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
            const data = get(table);
            data.then(res => {
                this.setState({
                    databrg: res
                })
            })
        })
       
    }

    HandleChangeInputValue(e,i) {
        const column = e.target.name;
        const val = e.target.value;
        let brgval = [...this.state.brgval];
        brgval[i] = {...brgval[i], [column]: val};
        this.setState({ brgval });

    }

    setStartDate(date) {
        console.log(date);
        this.setState({
        startDate: date
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
                del(table,id);
                const data = get(table);
                data.then(res => {
                    this.setState({
                        databrg: res
                    })
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
            stock:item.stock
        };
        const cek = cekData('barcode',item.barcode,table);
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
                   })
               }
               

               const data = get(table);
               data.then(res => {
                   let brg = []
                   res.map((i) => {
                       brg.push({
                           harga_beli: i.harga_beli,
                           diskon: i.diskon,
                           ppn: i.ppn,
                           qty: i.qty
                       });
                   })
                   this.setState({
                       databrg: res,
                       brgval: brg
                   })
               });
               console.log(this.state.brgval);

           })
    }

    render() {
        console.log(this.state.brgval);
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
                        <a href="#" className="btn btn-info ml-1">Simpan</a>
                        <a href="#" className="btn btn-danger ml-1">Reset</a>
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
                                <select class="form-control form-control-sm">
                                  <option value={1}>Kode Barang</option>
                                  <option value={2}>Barcode</option>
                                  <option value={3}>Deskripsi</option>
                                  <option value={4}>Kode Packing</option>
                                </select>
                                </div>
                                <small
                                  id="passwordHelpBlock"
                                  class="form-text text-muted"
                                >
                                  Cari berdasarkan {this.state.searchby}
                                </small>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <div className="input-group input-group-sm">
                                <input
                                  type="text"
                                  id="chat-search"
                                  name="chat-search"
                                  className="form-control form-control-sm"
                                  placeholder="Search"
                                />{" "}
                                <span className="input-group-append">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
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
                              <li className="clearfix" onClick={(e)=>this.HandleAddBrg(e,{
                                  kd_brg:"100001",
                                  barcode:"1000013",
                                  satuan:"Karton",
                                  diskon:10,
                                  diskon2:0,
                                  ppn:10,
                                  harga_beli:5000,
                                  qty:2,
                                  stock:10
                              })}>
                                <img src={Logo} alt="avatar" />
                                <div className="about">
                                  <div className="name">Koka Kola</div>
                                  <div className="status"></div>
                                </div>
                              </li>
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
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            readOnly
                            className="form-control-plaintext form-control-sm"
                            id="nota"
                            defaultValue="Nota PO"
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
                                  selected={this.state.startDate}
                                  onChange={this.setStartDate}
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
                                  selected={this.state.startDate}
                                  onChange={this.setStartDate}
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
                                  name="customRadio"
                                  className="custom-control-input"
                                  checked
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
                                  name="customRadio"
                                  className="custom-control-input"
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
                                  name="customRadio"
                                  className="custom-control-input"
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
                              <Select options={options} />
                            </div>
                            <div className="form-group">
                              <label className="control-label font-12">
                                Supplier
                              </label>
                              <Select options={options} />
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
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div id="tableContainer">
                      <div className="table-responsive">
                        <Scrollbars style={{width:'100%', height: "400px", maxHeight:'100%' }}>

                        <table className="table table-hover">
                          <thead>
                            <tr>
                                <th>#</th>
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
                                    if(item.diskon!=0){
                                        disc1 = parseInt(item.harga_beli) * (parseFloat(item.diskon) / 100);
                                        disc2=disc1;
                                        if(item.diskon2!=0){
                                            disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                                        }
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href="#" className='btn btn-danger btn-sm' onClick={(e)=>this.HandleRemove(e,item.id)}><i className='fa fa-trash'/></a>
                                            </td>
                                            <td>{item.barcode}</td>
                                            <td>{item.satuan}</td>
                                            <td><input type='text' style={{width:'80px',textAlign:'center'}} name='harga_beli' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].harga_beli}/></td>
                                            <td><input type='text' name='diskon' style={{width:'35px',textAlign:'center'}} onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)} value={this.state.brgval[index].diskon}/></td>
                                            <td><input type='text' name='ppn' style={{width:'35px',textAlign:'center'}} onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].ppn}/></td>
                                            <td>{item.stock}</td>
                                            <td><input type='text' name='qty' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} style={{width:'35px',textAlign:'center'}} onChange={(e)=>this.HandleChangeInputValue(e,index)}  value={this.state.brgval[index].qty}/></td>
                                            <td>{(parseInt(item.harga_beli)-disc2)*parseFloat(item.qty)}</td>
                                        </tr>
                                    )
                                })
                            }
                          </tbody>
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
});

export default connect(mapStateToPropsCreateItem)(PurchaseOrder);