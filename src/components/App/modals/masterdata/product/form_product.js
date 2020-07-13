import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "../../../../actions/modal.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

class FormProduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOption: null,
            selectedIndex:0,
            kd_brg:'',
            nm_brg:'',
            kel_brg:'',
            stock:'0',
            kategori:'0',
            stock_min:'0',
            group1:'',
            group2:'',
            deskripsi:'-',
            gambar:'',
            jenis:'0',
            kcp:'',
            poin:'0',
            online:'0',
            berat:'0',
            divBrgSku:[{name: "item1", id: 1}, {name: "item2", id: 2}, {name: "item3", id: 3}],
            isChecked:false,
            check : [],
            hrg_beli:'0'

        };
        this.handleChange = this.handleChange.bind(this);
        this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
    }
    onAddingItem = (i) => (event) => {
        this.setState((state, props) => {
            state.productsList[i].isChecked = !state.productsList[i].isChecked;
            return {
                productsList: state.productsList
            }
        })
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };

    componentWillReceiveProps(nextProps){
        const {data} = nextProps.dataLocation;
        this.state.check = nextProps.dataLocation;
        if(typeof data === 'object'){
            for(let i=0;i<data.length;i++){
                Object.assign(data[i],{
                    isChecked:false,
                    hrg_beli:'0',

                });
                // console.log(data);
            }
            console.log("DATA STATE CHECK",this.state.check);
        }
    }
    // onHandleChangeChild
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        if(event.target.name === 'jenis'){
            if(event.target.value === '0'){
                localStorage.setItem("colBrgSku","3");
            }else{
                localStorage.setItem("colBrgSku","1");
            }
        }
    }

    onHandleChangeChild = (e,i)=>{
        console.log(e.target.value);
        // console.log(e.target.value);
        let val = e.target.value;
        console.lo
        this.setState((state, props) => {
            state.check.data[i].hrg_beli = e.target.value;
            return {
                check: state.check
            }
            // check=state.check.data;
        });
    }
    handleSelect = (index) => {
        this.setState({selectedIndex: index}, () => {
            console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    handleAllChecked = (event) => {
        console.log(event.target.checked);
        let cik=[];
        for(let i=0;i<this.state.check.data.length;i++){
            this.state.check.data[i].isChecked = event.target.checked;
        }
        console.log("DATA CIK",cik);
        this.setState({
            isChecked:event.target.checked,
        });
    };
    handleCheckChieldElement = (i) => (event=>{
        this.setState((state, props) => {
            state.check.data[i].isChecked = !state.check.data[i].isChecked;
            return {
                check: state.check
            }
            // check=state.check.data;
        });
        console.log("DATA STATE CHECK ONCHECK",this.state.check);

    });

    render(){
        const {data} = this.props.data;
        const dataSupplier = this.props.dataSupplier.data;
        const dataSubDep = this.props.dataSubDept.data;
        // console.log("LOKASI STATE",this.state.check.data);
        // let {productsList} =  this.state;
        // let {datas} = this.state.check;

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProduct"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Product":"Update Product"}</ModalHeader>
                    <form>
                        <ModalBody>
                            <Tabs>
                                <TabList>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(0)}>Form 1</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(1)}>Form 2</Tab>
                                    <Tab label="Core Courses" onClick={() =>this.handleSelect(2)}>Form 3</Tab>
                                </TabList>
                                <TabPanel>
                                   <div className="row">
                                       <div className="col-md-4">
                                           <div className="form-group">
                                               <label>Code</label>
                                               <input type="text" className="form-control" name="kd_brg" value={this.state.kd_brg} onChange={this.handleChange} required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Name</label>
                                               <input type="text" className="form-control" name="nm_brg" value={this.state.nm_brg} onChange={this.handleChange} required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Group</label>
                                               <select name="kel_brg" className="form-control form-control-lg" value={this.state.kel_brg} onChange={this.handleChange}>
                                                   {
                                                       typeof data === 'object' ? data.map((v,i)=>{return (<option key={i} value={v.kel_brg} >{v.nm_kel_brg}</option>)}) : (<option value="" >no data</option>)
                                                   }
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>Stock</label>
                                               <input type="text" className="form-control" name="stock" value={this.state.stock} onChange={this.handleChange} required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Product Category</label>
                                               <select name="kategori" className="form-control form-control-lg" value={this.state.kategori} onChange={this.handleChange}>
                                                   <option value="1">selling items</option>
                                                   <option value="0">Not selling items</option>
                                               </select>
                                           </div>
                                       </div>
                                       <div className="col-md-4">
                                           <div className="form-group">
                                               <label>Stock Min</label>
                                               <input type="number" className="form-control" name="stock_min" value={this.state.stock_min} onChange={this.handleChange} required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Supplier</label>
                                               <select name="group1" className="form-control form-control-lg" value={this.state.group1} onChange={this.handleChange}>
                                                   {
                                                       typeof dataSupplier === 'object' ? dataSupplier.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                   }
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>Sub Dept</label>
                                               <select name="group2" className="form-control form-control-lg" value={this.state.group2} onChange={this.handleChange}>
                                                   {
                                                       typeof dataSubDep === 'object' ? dataSubDep.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                   }
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>Description</label>
                                               <input type="text" className="form-control" name="deskripsi" value={this.state.deskripsi} onChange={this.handleChange}  required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Image</label>
                                               <input type="file" className="form-control" name="gambar" value={this.state.gambar} onChange={this.handleChange}  required/>
                                           </div>
                                       </div>
                                       <div className="col-md-4">
                                           <div className="form-group">
                                               <label>Product Type</label>
                                               <select name="jenis" id="jenis" className="form-control form-control-lg" value={this.state.jenis} onChange={this.handleChange}>
                                                   <option value="0">Cardboard</option>
                                                   <option value="1">Packet</option>
                                                   <option value="2">Unit</option>
                                                   <option value="3">Service</option>
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>KCP</label>
                                               <select name="kcp" id="kcp" className="form-control form-control-lg" value={this.state.kcp} onChange={this.handleChange}>
                                                   <option value="0">Kitchen 1</option>
                                                   <option value="1">Kitchen 2</option>
                                                   <option value="2">Kitchen 3</option>
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>Point</label>
                                               <input type="text" className="form-control" name="poin" value={this.state.poin} onChange={this.handleChange} required/>
                                           </div>
                                           <div className="form-group">
                                               <label>Product Status</label>
                                               <select name="online" className="form-control form-control-lg" value={this.state.online} onChange={this.handleChange}>
                                                   <option value="0">Offline</option>
                                                   <option value="1">Online</option>
                                               </select>
                                           </div>
                                           <div className="form-group">
                                               <label>Weight</label>
                                               <input type="text" className="form-control" name="berat" value={this.state.berat} onChange={this.handleChange} required/>
                                           </div>
                                       </div>
                                   </div>
                                </TabPanel>
                                <TabPanel>
                                   <div className="row">
                                       <div className="col-md-12">
                                           <table className="table table-hover">
                                               <thead>
                                               <tr>
                                                   <th>No</th>
                                                   <th>Barcode</th>
                                                   <th>Satuan</th>
                                                   <th>Konversi Qty</th>
                                                   <th>Satuan Jual</th>
                                               </tr>
                                               </thead>
                                               <tbody>
                                               {(()=>{
                                                   let container =[];
                                                   for(let i=0; i<parseInt(localStorage.getItem("colBrgSku")); i++){
                                                       container.push(
                                                           <tr key={i}>
                                                               <td>
                                                                   {i+1}
                                                               </td>
                                                               <td>
                                                                   <input type="text" className="form-control" name="barcode" onChange={this.handleChange} required/>
                                                               </td>
                                                               <td>
                                                                   <input type="text" className="form-control" name="qty" onChange={this.handleChange} required/>
                                                               </td>
                                                               <td>
                                                                   <input type="text" className="form-control" name="konversi" onChange={this.handleChange} required/>
                                                               </td>
                                                               <td>
                                                                   <input type="text" className="form-control" name="satuan_jual" onChange={this.handleChange} required/>
                                                               </td>
                                                           </tr>
                                                       )
                                                   }
                                                   return container;
                                               })()}
                                               </tbody>
                                           </table>
                                       </div>

                                   </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <label style={{fontSize:"10px"}}>Lokasi</label>
                                                </div>
                                                <div className="col-md-10">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <label className="control-label" style={{fontSize:"10px"}}>Harga Beli</label>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label" style={{fontSize:"10px"}}>Margin %</label>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label className="control-label" style={{fontSize:"10px"}}>Harga Jual</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <label className="control-label" style={{fontSize:"10px"}}>Service %</label>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="control-label" style={{fontSize:"10px"}}>PPN %</label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                                {/*END LABEL*/}
                                                <div className="col-md-12">
                                                    <hr/>
                                                </div>
                                                {/*ATUR SEMUA*/}
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <label className="col-md-8"  style={{fontSize:"10px"}}>Atur Semua (PCS)</label>
                                                            <input type="checkbox" className="form-control col-md-2" onChange={this.handleAllChecked}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-10">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <input type="text" name="hrg_beli" placeholder="hrg beli" className="form-control hrg_beli" onChange={this.handleChange} value={this.state.hrg_beli} style={{fontSize:"10px"}}/>
                                                                </div>
                                                                <div className="col-md-4 text-center">
                                                                    <input type="text" placeholder="margin 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="margin 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="margin 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="margin 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                </div>
                                                                <div className="col-md-4 text-center">
                                                                    <input type="text" placeholder="hrg jual 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="hrg jual 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="hrg jual 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                    <input type="text" placeholder="hrg jual 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <input type="text" placeholder="service" className="form-control" style={{fontSize:"10px"}}/>
                                                                </div>
                                                                <div className="col-md-3 text-center">
                                                                    <input type="text" placeholder="PPN" className="form-control" style={{fontSize:"10px"}}/>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                {localStorage.getItem("colBrgSku")=== '3' ? (()=>{
                                                    let container =[];
                                                    let lbl = '';
                                                    for(let i=0; i<2; i++){
                                                        lbl = (i%2===0)?'PACK':'KARTON';
                                                        container.push(
                                                            <div className="col-md-12">
                                                                <div className="row" key={i}>
                                                                    <div className="col-md-2">
                                                                        <div className="form-group">
                                                                            <div className="row">
                                                                                <label className="col-md-8"  style={{fontSize:"10px"}}>Atur Semua ({lbl})</label>
                                                                                <input type="checkbox" className="form-control col-md-2" checked={this.state.isChecked}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="row">
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" name="hrg_beli" placeholder="hrg beli" className="form-control  hrg_beli" value={this.state.hrg_beli} style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" placeholder="margin 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" placeholder="hrg jual 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            {/*service,ppn,stock min,stock max */}
                                                                            <div className="col-md-6">
                                                                                <div className="row">
                                                                                    <div className="col-md-3">
                                                                                        <input type="text" placeholder="service" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-3 text-center">
                                                                                        <input type="text" placeholder="PPN" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        )
                                                    }
                                                    return container;
                                                })():''}
                                                {/*END ATUR SEMUA*/}
                                                <div className="col-md-12">
                                                    <hr/>
                                                </div>
                                                <div className="col-md-12">
                                                    <hr/>
                                                </div>
                                                {/*dynamic  */}
                                                {
                                                    typeof this.props.location.data === 'object' ? this.props.location.data.map((v,i)=>{
                                                        return (
                                                            <div className="col-md-12" key={i}>
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <div className="form-group">
                                                                            <div className="row">
                                                                                <label className="col-md-8"  style={{fontSize:"10px"}}>{v.nama_toko} (PCS)</label>
                                                                                <input type="checkbox" value={v.kode} checked={v.isChecked} onChange={this.handleCheckChieldElement(i)}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="row">
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" placeholder="hrg beli" name="hrg_beli" value={v.hrg_beli} onChange={(e)=>this.onHandleChangeChild(e,i)} className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" placeholder="margin 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="margin 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        <input type="text" placeholder="hrg jual 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                        <input type="text" placeholder="hrg jual 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            {/*service,ppn,stock min,stock max */}
                                                                            <div className="col-md-6">
                                                                                <div className="row">
                                                                                    <div className="col-md-3">
                                                                                        <input type="text" placeholder="service" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                    <div className="col-md-3 text-center">
                                                                                        <input type="text" placeholder="PPN" className="form-control" style={{fontSize:"10px"}}/>
                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {localStorage.getItem("colBrgSku")=== '3' ? (()=>{
                                                                    let container =[];
                                                                    let lbl = '';
                                                                    for(let i=0; i<2; i++){
                                                                        lbl = (i%2===0)?'PACK':'KARTON';
                                                                        container.push(
                                                                            <div className="row" key={i}>
                                                                                <div className="col-md-2">
                                                                                    <div className="form-group">
                                                                                        <div className="row">
                                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}>{v.nama_toko} ({lbl})</label>
                                                                                            <input type="checkbox" value={v.kode} checked={v.isChecked} onChange={this.handleCheckChieldElement(i)}/>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-10">
                                                                                    <div className="row">
                                                                                        <div className="col-md-6">
                                                                                            <div className="row">
                                                                                                <div className="col-md-4">
                                                                                                    <input type="text" placeholder="hrg beli" name={`hrg_beli_${i}`} value={this.state.hrg_beli} onChange={(e)=>this.onHandleChangeChild(e,i)} className="form-control" style={{fontSize:"10px"}}/>
                                                                                                </div>
                                                                                                <div className="col-md-4">
                                                                                                    <input type="text" placeholder="margin 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="margin 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="margin 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="margin 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                </div>
                                                                                                <div className="col-md-4">
                                                                                                    <input type="text" placeholder="hrg jual 1" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="hrg jual 2" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="hrg jual 3" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                    <input type="text" placeholder="hrg jual 4" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                        {/*service,ppn,stock min,stock max */}
                                                                                        <div className="col-md-6">
                                                                                            <div className="row">
                                                                                                <div className="col-md-3">
                                                                                                    <input type="text" placeholder="service" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                </div>
                                                                                                <div className="col-md-3 text-center">
                                                                                                    <input type="text" placeholder="PPN" className="form-control" style={{fontSize:"10px"}}/>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    return container;
                                                                })():''}
                                                                <hr/>

                                                            </div>

                                                        )
                                                    }) : (<option value="" >no data</option>)
                                                }
                                                {/*END DYNAMIC  */}


                                            </div>

                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                            <div className="row">


                                <div className="col-md-12">
                                    <div className="form-group" style={{textAlign:"right"}}>
                                        <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
                                        <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>

                    </form>

            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        location:state.locationReducer.data
        // group:state.groupProductReducer.data
    }
}
export default connect(mapStateToProps)(FormProduct);