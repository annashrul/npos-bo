import React,{Component} from 'react'
import Layout from "../../Layout";
import FileBase64 from "react-file-base64";
import {stringifyFormData} from "../../../../helper";
import connect from "react-redux/es/connect/connect";
import {FetchCompany} from "../../../../redux/actions/setting/company/company.action";

class Company extends Component{
    constructor(props) {
        super(props);
        this.state={
            title:"-",
            logo:"",
            fav_icon:"",
            splash:"",
            meta_key:"",
            meta_deskripsi:"-",
            web:"-",
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    getLogo(files) {
        this.setState({
            logo: files
        })
    };
    getFavIcon(files) {
        this.setState({
            fav_icon: files
        })
    };
    getSplash(files) {
        this.setState({
            splash: files
        })
    };
    componentWillMount(){
        this.props.dispatch(FetchCompany());
        console.log("component will mount",this.props.company);
    }
    componentWillReceiveProps(nextprops){
        console.log("component will receive props",nextprops);
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
        parseData['logo']=this.state.logo.base64;
        parseData['fav_icon']=this.state.fav_icon.base64;
        parseData['splash']=this.state.splash.base64;
        console.log("SUBMITTED",parseData);
    }
    render(){
        console.log("PROPS",this.props.company);
        return (
            <Layout page="Company">
                <div className="card">
                    <div className="card-header">
                        <h5>Perusahaan</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="">Title</label>
                                        <input type="text" name="title" className="form-control" value={this.state.title} onChange={this.handleChange}/>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="">Meta Key</label>
                                        <input type="text" name="meta_key" className="form-control" value={this.state.meta_key} onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Meta Deskripsi</label>
                                        <input type="text" name="meta_deskripsi" className="form-control" value={this.state.meta_deskripsi} onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Link Website</label>
                                        <input type="text" name="web" className="form-control" value={this.state.web} onChange={this.handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Logo</label><br/>
                                        <FileBase64
                                            multiple={ false }
                                            className="mr-3 form-control-file"
                                            onDone={ this.getLogo.bind(this) } />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Fav Icon</label><br/>
                                        <FileBase64
                                            multiple={ false }
                                            className="mr-3 form-control-file"
                                            onDone={ this.getFavIcon.bind(this) } />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Splash</label><br/>
                                        <FileBase64
                                            multiple={ false }
                                            className="mr-3 form-control-file"
                                            onDone={ this.getSplash.bind(this) } />
                                    </div>
                                    <button className="btn btn-primary" type="submit" style={{width:"100%"}}>Simpan</button>
                                </form>
                            </div>
                            <div className="col-md-4">
                                {
                                    this.state.logo !==""?(<img src={this.state.logo.base64} style={{height:"200px",width:"100%"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                }
                                <hr/>
                                {
                                    this.state.fav_icon !==""?(<img src={this.state.fav_icon.base64} style={{height:"200px",width:"100%"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                }
                                <hr/>
                                {
                                    this.state.splash !==""?(<img src={this.state.splash.base64} style={{height:"200px",width:"100%"}}/>):<img src="https://satriabahana.co.id/asset/img/noimage.png" style={{height:"150px",width:"100%"}}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        company:state.companyReducer.dataGet,
        isLoadingGet: state.companyReducer.isLoadingGet,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Company)