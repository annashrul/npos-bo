import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import imgCsv from 'assets/csv.png';
import imgUpload from 'assets/upload.png';
import { HEADERS } from '../../../../redux/actions/_constants';
import Dropzone from 'react-dropzone'
import FileBase64 from "react-file-base64";
class Upload extends Component{
    constructor(props){
        super(props);
        this.state={
            isUpload:'',
            toUpload:'',
        }
    }

    handleUpload(e,param){
        e.preventDefault();
        this.setState({
            toUpload:param
        })
    }

    getUpload(data,param){
        console.log(data);
        var reader = new FileReader();
        reader.readAsDataURL(data[0]);
        reader.onload = function () {
            console.log("base64",reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        this.setState({
            isUpload:param==='close'?'':param
        })
    }

    render(){
        return (
            <Layout page="Product">
                <div className="col-12 box-margin">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4">
                                <div className="card animate__animated animate__fadeInUp" style={{display:this.state.toUpload==='uploadBarang'?'':'none'}}>
                                    <div className="card-body text-center">
                                        <button className="btn btn-circle btn-danger float-right" onClick={(e)=>this.handleUpload(e,'close')}><i className="fa fa-times"></i></button>
                                        <Dropzone onDrop={acceptedFiles => this.getUpload(acceptedFiles,'isBarang')}>
                                        {({getRootProps, getInputProps}) => (
                                            <div className="container text-center" style={{padding: '1rem',cursor: 'pointer'}}>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="Card image cap" style={{borderRadius: '30px',padding: '4rem', borderStyle: 'dashed'}} />
                                                    <p>Drag 'n' drop some files csv here, or click to select files</p>
                                                </div>
                                            </div>
                                        )}
                                        </Dropzone>
                                        <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload==='isBarang'?false:true}>UPLOAD</button>
                                    </div>
                                </div>
                                <div className="card animate__animated animate__fadeIn" style={{display:this.state.toUpload!=='uploadBarang'?'':'none'}}>
                                    <img className="card-img-top img-responsive" src={imgCsv} alt="Card image cap" />
                                    <div className="card-body">
                                        <h4 className="card-title mb-2">Template Barang</h4>
                                        <p className="card-text text-justify">Pada template barang, terdapat 14 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut. <span className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE BARANG</span></p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <a href={HEADERS.URL+"/templates/barang_template.csv"} target="_blank" class="btn btn-info">Download Template</a>
                                            <button onClick={(e)=>this.handleUpload(e,'uploadBarang')} class="btn btn-primary">Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card animate__animated animate__fadeInUp" style={{display:this.state.toUpload==='uploadBarcode'?'':'none'}}>
                                    <div className="card-body text-center">
                                        <button className="btn btn-circle btn-danger float-right" onClick={(e)=>this.handleUpload(e,'close')}><i className="fa fa-times"></i></button>
                                        <Dropzone onDrop={acceptedFiles => this.getUpload(acceptedFiles,'isBarcode')}>
                                        {({getRootProps, getInputProps}) => (
                                            <div className="container text-center" style={{padding: '1rem',cursor: 'pointer'}}>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="Card image cap" style={{borderRadius: '30px',padding: '4rem', borderStyle: 'dashed'}} />
                                                    <p>Drag 'n' drop some files csv here, or click to select files</p>
                                                </div>
                                            </div>
                                        )}
                                        </Dropzone>
                                        <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload==='isBarcode'?false:true}>UPLOAD</button>
                                    </div>
                                </div>
                                <div className="card animate__animated animate__fadeIn" style={{display:this.state.toUpload!=='uploadBarcode'?'':'none'}}>
                                    <img className="card-img-top img-responsive" src={imgCsv} alt="Card image cap" />
                                    <div className="card-body">
                                        <h4 className="card-title mb-2">Template Barcode</h4>
                                        <p className="card-text text-justify">Pada template barcode, terdapat 5 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut. <del className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE BARANG</del></p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <a href={HEADERS.URL+"/templates/template_barcode.csv"} target="_blank" class="btn btn-info">Download Template</a>
                                            <button onClick={(e)=>this.handleUpload(e,'uploadBarcode')} class="btn btn-primary">Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card animate__animated animate__fadeInUp" style={{display:this.state.toUpload==='uploadHarga'?'':'none'}}>
                                    <div className="card-body text-center">
                                        <button className="btn btn-circle btn-danger float-right" onClick={(e)=>this.handleUpload(e,'close')}><i className="fa fa-times"></i></button>
                                        <Dropzone onDrop={acceptedFiles => this.getUpload(acceptedFiles,'isHarga')}>
                                        {({getRootProps, getInputProps}) => (
                                            <div className="container text-center" style={{padding: '1rem',cursor: 'pointer'}}>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="Card image cap" style={{borderRadius: '30px',padding: '4rem', borderStyle: 'dashed'}} />
                                                    <p>Drag 'n' drop some files csv here, or click to select files</p>
                                                </div>
                                            </div>
                                        )}
                                        </Dropzone>
                                        <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload==='isHarga'?false:true}>UPLOAD</button>
                                    </div>
                                </div>
                                <div className="card animate__animated animate__fadeIn" style={{display:this.state.toUpload!=='uploadHarga'?'':'none'}}>
                                    <img className="card-img-top img-responsive" src={imgCsv} alt="Card image cap" />
                                    <div className="card-body">
                                        <h4 className="card-title mb-2">Template Harga</h4>
                                        <p className="card-text text-justify">Pada template harga, terdapat 10 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut. <del className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE BARANG</del></p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <a href={HEADERS.URL+"/templates/template_harga.csv"} target="_blank" class="btn btn-info">Download Template</a>
                                            <button onClick={(e)=>this.handleUpload(e,'uploadHarga')} class="btn btn-primary">Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h3 className="text-danger">NOTE:</h3>
                                        <code>#</code> Pengisian kolom <span className="text-danger">KATEGORI</span>
                                        <br/>
                                        <span className="border border-light">0: <code>kartonan</code>, 1: <code>satuan</code>, 2: <code>paket</code>, 3: <code>service</code>, 4: <code>bahan</code></span>
                                        <br/>
                                        <code>#</code> Pengisian kolom <span className="text-danger">JENIS</span>
                                        <br/>
                                        <span className="border border-light">0: <code>tidak dijual</code>, 1: <code>dijual</code></span>
                                        <br/>
                                        <code>#</code> Pengisian kolom <span className="text-danger">ONLINE</span>
                                        <br/>
                                        <span className="border border-light">0: <code>hanya offline</code>, 1: <code>online offline</code></span>
                                        <br/>
                                        <code>#</code> Pengisian kolom <span className="text-danger">GROUP1</span>
                                        <br/>
                                        <span className="border border-light">Disisi dari kode <code>SUPPLIER</code></span>
                                        <br/>
                                        <code>#</code> Pengisian kolom <span className="text-danger">GROUP2</span>
                                        <br/>
                                        <span className="border border-light">Disisi dari kode <code>SUB DEPT</code></span>
                                        <br/>
                                        <span className="border border-light"><code>KODE BARANG</code> dan <code>BARCODE</code> tidak boleh duplikat</span>
                                        
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

const mapStateToProps = (state) => {
    return {
        site: state.siteReducer.data,
        files: state.siteReducer.data_list,
        isLoading: state.siteReducer.isLoading,
    }
}
export default connect(mapStateToProps)(Upload);