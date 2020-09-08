import React, {Component} from 'react'
import Layout from './layout';

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:''
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          
          this.setState({
              data: getData,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        // bank: "-"
        // cara_byr: "Tunai"
        // jumlah_bayar: "1000"
        // jumlah_hutang: 8000
        // ket: "-"
        // lokasi: "LK/0001"
        // nogiro: 0
        // nota_beli: "BL-2008130001-1"
        // pembulatan: 0
        // tanggal: "2020-09-07"
        // tanggal_cair: "2020-09-07"
        // tgl_jatuh_tempo: "2020-08-13"
        // userid: "1"
        const {
            bank,
            cara_byr,
            jumlah_bayar,
            jumlah_hutang,
            ket,
            nogiro,
            nota_beli,
            pembulatan,
            tanggal,
            tanggal_cair,
            tgl_jatuh_tempo,
            userid,
        }=this.state.data;
        
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={8} className="text-center">Nota Bayar Hutang</td>
                        </tr>
                        </thead>
                        <tbody>
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
                            <td style={{fontSize: '10pt !important'}}>Tanggal</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{tanggal}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Operator</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{userid}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>No. Giro</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nogiro}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jenis Pembayaran</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{cara_byr}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Jatuh Tempo</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{tgl_jatuh_tempo}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Pembulatan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{pembulatan}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Cair Giro</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{tanggal_cair}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Pembayaran</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{jumlah_bayar}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Nota Pembelian</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nota_beli}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jumlah Hutang</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{jumlah_hutang}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Bank</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{bank}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Keterangan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{ket}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '9pt'}}>
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