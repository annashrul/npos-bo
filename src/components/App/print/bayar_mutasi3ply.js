import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';
import connect from "react-redux/es/connect/connect";
// import {FetchHutangReport} from "redux/actions/hutang/hutang.action";
import moment from 'moment'
import Barcode from 'react-barcode';

class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            jenis_pembayaran:'',
            jumlah_bayar:'',
            jumlah_hutang:'',
            keterangan:'',
            lokasi:'',
            no_faktur_mutasi:'',
            tanggal:'',
            nota:'',
            bank:'',
            newLogo:''
        };
    }
    componentWillReceiveProps(nextProps){
        if(this.state.newLogo === ''){
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // 
                    // logoBase64 = reader.result;
                    this.setState({newLogo : reader.result});
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', nextProps.auth.user.logo!==undefined?nextProps.auth.user.logo:'');
            xhr.responseType = 'blob';
            xhr.send();
        }
        const getData = nextProps.location.state.data;
        const getNota = nextProps.location.state.nota;
        
        this.setState({
            jenis_pembayaran: getData.jenis_pembayaran,
            jumlah_bayar:getData.jumlah_bayar,
            jumlah_hutang: getData.jumlah_hutang,
            keterangan:getData.keterangan,
            lokasi: getData.lokasi,
            no_faktur_mutasi: getData.no_faktur_mutasi,
            tanggal: getData.tanggal,
            bank: getData.bank,
            nota: getNota,
        })
    }
    componentWillMount(){
        // const getData = this.props.location.state.data;
        // const getNota = this.props.location.state.nota;
        
        // this.setState({
        //     jenis_pembayaran: getData.jenis_pembayaran,
        //     jumlah_bayar:getData.jumlah_bayar,
        //     jumlah_hutang: getData.jumlah_hutang,
        //     keterangan:getData.keterangan,
        //     lokasi: getData.lokasi,
        //     no_faktur_mutasi: getData.no_faktur_mutasi,
        //     tanggal: getData.tanggal,
        //     bank: getData.bank,
        //     nota: getNota,
        // })
    }
      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {
            jenis_pembayaran,
            jumlah_bayar,
            jumlah_hutang,
            keterangan,
            lokasi,
            no_faktur_mutasi,
            tanggal,
            nota,
            bank,
        }=this.state;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}></td>
                            <td colSpan={5} style={{textAlign: 'right'}}><Barcode width={2} height={25} format={'CODE128'} displayValue={false} value={nota}/> </td>
                        </tr>
                        <tr>
                            <td rowSpan={3} colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} className="text-center">Nota Bayar Mutasi ({nota})</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td width="2%" />
                            <td width="20%" />
                            <td width="2%" />
                            <td width="20%" />
                            <td width="14%" />
                            <td width="20%" />
                            <td width="2%" />
                            <td width="20%" />
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>No Faktur Mutasi</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{no_faktur_mutasi}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Telah dibayar</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{toRp(jumlah_bayar)}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jenis Pembayaran</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{jenis_pembayaran}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jumlah Hutang</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{toRp(jumlah_hutang)}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Bank</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{bank}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tgl. Bayar</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tanggal).format('YYYY-MM-DD')}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Lokasi</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{lokasi}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Keterangan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{keterangan}</td>
                        </tr>
                        {/* <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tgl Cair Giro</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_cair_giro).format('YYYY-MM-DD')}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Ket</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{ket}</td>
                        </tr> */}
                        </tbody>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderTop: 'solid', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: 'solid', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: 'solid', borderWidth: 'thin'}} width="33%" />
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{textAlign: 'center'}}>
                            </td>
                            <td style={{textAlign: 'center'}}>
                            </td>
                            <td style={{textAlign: 'center'}}>
                            <b><br /><br /><br /><br />_____________</b>
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
            hutangReport:state.hutangReducer.data_report,
            auth:state.auth,
            isLoading: state.hutangReducer.isLoading,
        }
    }
    export default connect(mapStateToProps)(Print3ply);