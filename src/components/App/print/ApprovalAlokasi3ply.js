import React, {Component} from 'react'
// import {FetchAlokasiDetail} from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import Layout from './layout';
// import {toRp} from 'helper';
import Barcode from 'react-barcode';
// import moment from 'moment'
class Print3ply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            newLogo:''
        };
    }
    
    // UNSAFE_componentWillReceiveProps(nextProps){
    //     let getData = nextProps.parse.length!==0?nextProps.parse:0
    //     if(getData!==0 && nextProps.auth.user.logo!==undefined){
    //         if(this.state.newLogo === ''){
    //             const xhr = new XMLHttpRequest();
    //             xhr.onload = () => {
    //                 const reader = new FileReader();
    //                 reader.onloadend = () => {
    //                     this.setState({newLogo : reader.result});
    //                 };
    //                 reader.readAsDataURL(xhr.response);
    //             };
    //             xhr.open('GET', nextProps.auth.user.logo!==undefined?nextProps.auth.user.logo:'');
    //             xhr.responseType = 'blob';
    //             xhr.send();
    //         }
    //     }
    //     this.setState({
    //         data: getData,
    //     })
    // }
    componentWillMount(){
        const getData = this.props.location.state.data;
        // this.setState({
        //     data: getData.detail,
        //     master: getData.master,
        //     nota: getData.nota,
        //     logo: getData.logo,
        //     user: getData.user,
        //     lokasi: getData.lokasi,
        // })
    }

    getLogo(){
        const simg = document.getElementsByClassName('selected__img');
        const src = simg[0].src;
        return src
    }
    render() {
        // const {detail,total,operator,keterangan,lokasi_asal,lokasi_tujuan,tgl_mutasi,no_faktur_beli}=this.state.data;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}></td>
                            <td colSpan={5} style={{textAlign: 'right'}}><Barcode width={2} height={25} format={'CODE128'} displayValue={false} value={this.props.match.params.id}/> </td>
                        </tr>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}>Alokasi Barang ({this.props.match.params.id})</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td width="2%" />
                            <td width="20%" />
                            <td width="2%" />
                            <td width="28%" />
                            <td width="6%" />
                            <td width="12%" />
                            <td width="2%" />
                            <td width="29%" />
                        </tr>
                        {/* <tr>
                            <td />
                            <td>Tanggal</td>
                            <td>:</td>
                            <td>{moment(tgl_mutasi).format('YYYY-MM-DD')}</td>
                            <td />
                            <td>Operator</td>
                            <td>:</td>
                            <td>{operator}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Asal</td>
                            <td>:</td>
                            <td>{lokasi_asal}</td>
                            <td />
                            <td>No Faktur Beli</td>
                            <td>:</td>
                            <td>{no_faktur_beli}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Tujuan</td>
                            <td>:</td>
                            <td>{lokasi_tujuan}</td>
                            <td />
                            <td>Keterangan</td>
                            <td>:</td>
                            <td>{keterangan}</td>
                        </tr> */}
                        </tbody>
                    </table>
                    <table width="99%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '25%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Barcode</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Qty</td>
                            <td style={{width: '20%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Harga jual</td>
                            <td style={{width: '20%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Amount</td>
                        </tr>
                        </thead>
                        <tbody>
                        {/* {
                            detail!==undefined?detail.data.map((item,index)=>{
                                return (
                                    <tr key={index} >
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.nm_brg}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.barcode}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.satuan}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-right">{item.qty}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-right">{toRp(item.hrg_jual)}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-right">{toRp(item.hrg_jual*item.qty)}</td>
                                    </tr>
                                )
                            }):"no data"

                        } */}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={6} style={{borderTop: '', borderWidth: '',paddingLeft: '25pt'}}>TOTAL</td>
                            {/* <td className="text-right" style={{borderTop: '', borderWidth: '', paddingLeft: '5pt'}}>{toRp(total)}</td> */}
                            <td style={{borderTop: '', borderWidth: ''}} />
                        </tr>
                        </tfoot>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderTop: '', borderWidth: ''}} width="33%" />
                            <td style={{borderTop: '', borderWidth: ''}} width="33%" />
                            <td style={{borderTop: '', borderWidth: ''}} width="33%" />
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{textAlign: 'center'}}>
                            <br />Pengirim<br /><br /><br />_____________
                            </td>
                            <td style={{textAlign: 'center'}}>
                            <br />Penerima<br /><br /><br />_____________
                            </td>
                            <td style={{textAlign: 'center'}}>
                            <br />Mengetahui<br /><br /><br />_____________
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    </div>

            </Layout>
        );
      }
    }

const mapStateToProps = (state) => {
    return {
        auth:state.auth,
        alokasiDetail:state.alokasiReducer.alokasi_data,
    }
}
export default connect(mapStateToProps)(Print3ply);