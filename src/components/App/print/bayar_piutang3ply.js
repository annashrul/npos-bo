import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';
import connect from "react-redux/es/connect/connect";
import {FetchPiutangReport} from "redux/actions/piutang/piutang.action";
import moment from 'moment'
import Barcode from 'react-barcode';

class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            newLogo:''
        };

        // let any = 'BH-2010020001-1';
        let any = this.props.match.params.id;
        let where='';
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchPiutangReport(1,where))
      }
      UNSAFE_componentWillReceiveProps(nextProps){
          let getData = nextProps.piutangReport.length!==0?nextProps.piutangReport.data[0]:0
          if(getData!==0 && nextProps.auth.user.logo!==undefined){
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
          }
          this.setState({
              data: getData,
          })
          console.log(nextProps.auth.user.logo)
          console.log(getData)
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {
            nm_bank,
            cara_byr,
            jumlah,
            ket,
            nogiro,
            fak_jual,
            pembulatan,
            tgl_byr,
            tgl_cair_giro,
            tgl_jatuh_tempo,
            kasir,
            nama
        }=this.state.data;
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
                            <td rowSpan={3} colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} className="text-center">Nota Bayar Piutang ({this.props.match.params.id})</td>
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
                            <td style={{fontSize: '10pt !important'}}>Nama Customer</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nama}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Pembayaran</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{toRp(jumlah)}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Nota Pembelian</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{fak_jual}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Bank</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nm_bank}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_byr).format("YYYY-MM-DD")}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Operator</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{kasir}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>No. Giro</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nogiro}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jenis Pemb.</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{cara_byr}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Jatuh Tempo</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_jatuh_tempo).format("YYYY-MM-DD")}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Pembulatan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{toRp(pembulatan)}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Cair Giro</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_cair_giro).format("YYYY-MM-DD")}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Keterangan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{ket}</td>
                        </tr>
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
            piutangReport:state.piutangReducer.data_report,
            auth:state.auth,
            isLoading: state.piutangReducer.isLoading,
        }
    }
    export default connect(mapStateToProps)(Print3ply);