import React,{Component} from 'react'
import Layout from "../../Layout";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "../../../../helper";
import connect from "react-redux/es/connect/connect";
import {FetchCompany, storeCompany} from "../../../../redux/actions/setting/company/company.action";
import Preloader from "../../../../Preloader";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

class Company extends Component{
    constructor(props) {
        super(props);
        this.state={
            title:"-",
            logo:"-",
            fav_icon:"-",
            splash:"-",
            meta_key:"",
            meta_deskripsi:"-",
            web:"-",
            set_harga:1,
            nm_hrg1:"",
            nm_hrg2:"",
            nm_hrg3:"",
            nm_hrg4:"",
            selectedIndex : 0

        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        if(event.target.name==='set_harga'){
            this.setState({

            })
        }
    }
    getLogo(files) {
        this.setState({
            logo: files.base64
        })
    };
    getFavIcon(files) {
        this.setState({
            fav_icon: files.base64
        })
    };
    getSplash(files) {
        console.log(files);
        this.setState({
            splash: files.base64
        })
    };
    componentWillMount(){
        this.props.dispatch(FetchCompany());
        this.state.title=this.props.company.title;
    }
    componentWillReceiveProps(nextprops){
        this.state.title=nextprops.company.title;
        this.state.meta_key=nextprops.company.meta_key!==null?nextprops.company.meta_key:'-';
        this.state.meta_deskripsi=nextprops.company.meta_descr;
        this.state.web=nextprops.company.web;
        this.state.logo=nextprops.company.logo;
        this.state.fav_icon=nextprops.company.fav_icon;
        this.state.splash=nextprops.company.splash;
        this.state.set_harga=nextprops.company.set_harga;
        this.state.nm_hrg1=nextprops.company.nm_hrg1;
        this.state.nm_hrg2=nextprops.company.nm_hrg2;
        this.state.nm_hrg3=nextprops.company.nm_hrg3;
        this.state.nm_hrg4=nextprops.company.nm_hrg4;
    }
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData['title']=this.state.title;
        parseData['meta_descr']=this.state.meta_deskripsi;
        parseData['meta_key']=this.state.meta_key;
        parseData['web']=this.state.web;
        parseData['logo']=this.state.logo.substring(0,4)!=='http'?this.state.logo:'-';
        parseData['fav_icon']=this.state.fav_icon.substring(0,4)!=='http'?this.state.fav_icon:'-';
        parseData['splash']=this.state.splash.substring(0,4)!=='http'?this.state.splash:'-';
        parseData['set_harga'] = this.state.set_harga;
        parseData['nm_hrg1'] = this.state.nm_hrg1;
        parseData['nm_hrg2'] = this.state.nm_hrg2;
        parseData['nm_hrg3'] = this.state.nm_hrg3;
        parseData['nm_hrg4'] = this.state.nm_hrg4;
        this.props.dispatch(storeCompany(parseData));
    }
    handleSelect = (e,index) => {
        // console.log(e.target.value);
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <Layout page="Company">
                <div className="card">
                    <form onSubmit={this.handleSubmit}>

                    <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                        <h4 className="card-title mt-3">PENGATURAN PERUSAHAAN</h4>
                        <button className="btn btn-primary">SIMPAN</button>
                    </div>
                        {
                            !this.props.isLoadingGet?(
                                <div className="card-body">
                                    <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>
                                        <table className="table table-hover table-bordered">
                                            <thead className="bg-light">
                                            <tr>
                                                <th style={columnStyle}>TITLE</th>
                                                <th style={columnStyle}>META KEY</th>
                                                <th style={columnStyle}>META DESKRIPSI</th>
                                                <th style={columnStyle}>LINK WEBSITE</th>
                                                <th style={columnStyle}>SET HARGA</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td style={columnStyle}><input type="text" name="title" className="form-control" value={this.state.title} onChange={this.handleChange}/></td>
                                                <td style={columnStyle}>
                                                    <input type="text" name="meta_key" className="form-control" value={this.state.meta_key} onChange={this.handleChange}/>
                                                </td>
                                                <td style={columnStyle}>
                                                    <input type="text" name="meta_deskripsi" className="form-control" value={this.state.meta_deskripsi} onChange={this.handleChange}/>
                                                </td>
                                                <td style={columnStyle}>
                                                    <input type="text" name="web" className="form-control" value={this.state.web} onChange={this.handleChange}/>
                                                </td>
                                                <td style={columnStyle}>
                                                    <select name="set_harga" className="form-control" value={this.state.set_harga} defaultValue={this.state.set_harga} onChange={this.handleChange}>
                                                        <option value={1}>1</option>
                                                        <option value={2}>2</option>
                                                        <option value={3}>3</option>
                                                        <option value={4}>4</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>
                                        <table className="table table-hover table-bordered">
                                            <thead className="bg-light">
                                            <tr>
                                                {(()=>{
                                                    let container =[];
                                                    for(let x=0; x<this.state.set_harga; x++){
                                                        container.push(
                                                            <td style={columnStyle}>NAMA HARGA {x+1}</td>
                                                        )
                                                    }
                                                    return container;
                                                })()}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                {(()=>{
                                                    let container =[];
                                                    for(let x=0; x<this.state.set_harga; x++){
                                                        let nama = `nm_hrg${x+1}`;
                                                        container.push(
                                                            <td style={columnStyle}><input type="text" name={nama} className="form-control" value={`${this.state[nama]}`} onChange={this.handleChange}/></td>
                                                        )
                                                    }
                                                    return container;
                                                })()}
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>
                                        <table className="table table-hover table-bordered">
                                            <thead className="bg-light">
                                            <tr>
                                                <th style={columnStyle}>LOGO</th>
                                                <th style={columnStyle}>FAV ICON</th>
                                                <th style={columnStyle}>SPLASH</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td style={columnStyle}>
                                                    <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getLogo.bind(this) } />
                                                </td>
                                                <td style={columnStyle}>
                                                    <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getFavIcon.bind(this) } />
                                                </td>
                                                <td style={columnStyle}>
                                                    <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getSplash.bind(this) } />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={columnStyle}>
                                                    {
                                                        this.state.logo !=="-"?(<img src={this.state.logo} style={{height:"200px",width:"300px",objectFit:"scale-down"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                                    }
                                                </td>
                                                <td style={columnStyle}>
                                                    {
                                                        this.state.fav_icon !=="-"?(<img src={this.state.fav_icon} style={{height:"200px",width:"300px",objectFit:"scale-down"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                                    }
                                                </td>
                                                <td style={columnStyle}>
                                                    {
                                                        this.state.splash !=="-"?(<img src={this.state.splash} style={{height:"200px",width:"300px",objectFit:"scale-down"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                                    }
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            ):<Preloader/>
                        }
                    </form>

                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        company:state.companyReducer.dataGet,
        isLoadingGet: state.companyReducer.isLoadingGet,
        isLoadingPost: state.companyReducer.isLoadingPost,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Company)