import React, {Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {FetchPackingDetail} from "redux/actions/inventory/packing.action";
import moment from 'moment'
import Layout from './layout';
// import {toRp} from 'helper';
// import Barcode from 'react-barcode';

class Print3ply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            newLogo:''
        };
        this.props.dispatch(FetchPackingDetail(this.props.match.params.id));
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        let getData = nextProps.packingDetail.length!==0?nextProps.packingDetail:0
        if(getData!==0 && nextProps.auth.user.logo!==undefined){
            if(this.state.newLogo === ''){
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.setState({newLogo : reader.result});
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', nextProps.auth.user.logo!==undefined?nextProps.auth.user.logo:'');
                xhr.responseType = 'blob';
                xhr.send();
            }
        }
        this.setState({
            data: getData,
        })
    }
      render() {
        return (
            <Layout>
                <div  id="print_3ply">
                <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                    <thead>
                        {/* <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}></td>
                            <td colSpan={5} style={{textAlign: 'right'}}><Barcode width={2} height={25} format={'CODE128'} displayValue={false} value={nota}/> </td>
                        </tr> */}
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}>Packing Alokasi</td>
                        </tr>
                    </thead>
                    {/* <tbody>
                        <tr>
                        <td width="2%" />
                        <td width="20%" />
                        <td width="2%" />
                        <td width="28%" />
                        <td width="10%" />
                        <td width="12%" />
                        <td width="2%" />
                        <td width="25%" />
                        </tr>
                        <tr>
                        <td />
                        <td>Tanggal Packing</td>
                        <td>:</td>
                        <td>{data.tanggal}</td>
                        <td />
                        <td>Operator</td>
                        <td>:</td>
                        <td>{user}</td>
                        </tr>
                        <tr>
                        <td />
                        <td>No Faktur</td>
                        <td>:</td>
                        <td>{data.no_faktur_mutasi}</td>
                        <td />
                        <td>Pengirim</td>
                        <td>:</td>
                        <td>{data.pengirim}</td>
                        </tr>
                    </tbody> */}
                </table>

                    <table width="99%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Kode DN</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No Faktur Beli</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Tanggal Packing</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Kode Packing</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Pengirim</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Penerima</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Operator</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No Faktur Mutasi</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Lokasi Asal</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Lokasi Tujuan</td>
                            <td style={{width: '7%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Expedisi</td>
                        </tr>
                        </thead>
                        <tbody>
                        {

    //   "totalrecords": "1",
    //   "delivery_note": "",
    //   "no_faktur_beli": "-",
    //   "tgl_packing": "2020-10-01T10:34:21.000Z",
    //   "kd_packing": "PK-2010011234-8",
    //   "status": "0",
    //   "pengirim": "test",
    //   "penerima": "-",
    //   "operator": "1",
    //   "no_faktur_mutasi": "MC-2010010002-3",
    //   "kd_lokasi_1": "LK/0002",
    //   "kd_lokasi_2": "LK/0003",
    //   "expedisi": "0"
                            this.state.data.length>0?this.state.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.delivery_note}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.no_faktur_beli}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{moment(item.tgl_packing).format('YYYY-MM-DD')}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.kd_packing}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.pengirim}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.penerima}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.operator}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.no_faktur_mutasi}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.kd_lokasi_1}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{item.kd_lokasi_2}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{item.expedisi}</td>

                                    </tr>
                                )
                            }):"no data"
                        }
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
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
            packingDetail:state.packingReducer.packing_detail
        }
    }
    
    export default connect(mapStateToProps)(Print3ply)