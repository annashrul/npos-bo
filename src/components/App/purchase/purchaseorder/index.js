import React,{Component} from 'react';
import {store,get,destroy} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import { Scrollbars } from "react-custom-scrollbars";
import DatePicker from "react-datepicker";
import Logo from "assets/images/logo.png"
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]


class PurchaseOrder extends Component{

    constructor(props) {
        super(props);

        this.state = {
          addingItemName: "",
          data: "",
          startDate: new Date(),
          searchby: 'kode barang',
        };
        this.create = this.create.bind(this);
        this.onChangeAddValue = this.onChangeAddValue.bind(this);
        this.createItem = this.createItem.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setStartDate = this.setStartDate(this);
    }

    setStartDate(date) {
        console.log(date);
        this.setState({
        startDate: date
        });
    };

    onChangeAddValue(newValue) {
        this.setState(() => ({
            addingItemName: newValue
        }));
    }

    refresh(e) {
        e.preventDefault()
        const data=destroy('purchase_order');
       
        data.then(res => {
        })

        const data2 = get('purchase_order');
        data2.then(res => {
            this.setState({
                data: JSON.stringify(res)
            })
        })
    }

    create() {
        const item = {
            kd_brg: this.state.addingItemName,
            barcode: this.state.addingItemName,
            satuan: this.state.addingItemName,
            diskon: this.state.addingItemName,
            diskon2: this.state.addingItemName,
            diskon3: this.state.addingItemName,
            diskon4: this.state.addingItemName,
            ppn: this.state.addingItemName,
            harga_beli: this.state.addingItemName,
            qty:0
        };
        store('purchase_order',item)
        this.setState({
            addingItemName: ''
        });
        const data = get('purchase_order');
        data.then(res => {
            this.setState({
                data: JSON.stringify(res)
            })
        })
        console.log("New item added: " + item.Name);
    }

    createItem(event) {
        event.preventDefault();
        (this.state.addingItemName.length > 50 || this.state.addingItemName.length === 0)
            ? alert("Check number of symbols, it must be in range (1-50)!")
            : this.create();
    }

    render() {
        return (
          <Layout page="Purchase Order">
            <div className="row">
              <div className="col-lg-5 col-md-4 col-xl-3 height-card box-margin">
                <div className="card">
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
                      <Scrollbars style={{ width: "100%", height: "100vh" }}>
                        <div className="people-list">
                          <div id="chat_user_2">
                            <ul className="chat-list list-unstyled">
                              <li className="clearfix">
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
              <div className="col-lg-7 col-md-8 col-xl-9 height-card box-margin">
                <div className="card">
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
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>First Name</th>
                              <th>LAST NAME</th>
                              <th>USERNAME</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>1</th>
                              <td>Mark</td>
                              <td>Otto</td>
                              <td>@mdo</td>
                            </tr>
                            <tr>
                              <th>2</th>
                              <td>Jacob</td>
                              <td>Thornton</td>
                              <td>@fat</td>
                            </tr>
                            <tr>
                              <th>3</th>
                              <td>Larry</td>
                              <td>the Bird</td>
                              <td>@twitter</td>
                            </tr>
                            <tr>
                              <th>4</th>
                              <td>Larry</td>
                              <td>Jellybean</td>
                              <td>@lajelly</td>
                            </tr>
                            <tr>
                              <th>5</th>
                              <td>Larry</td>
                              <td>Kikat</td>
                              <td>@lakitkat</td>
                            </tr>
                          </tbody>
                        </table>
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