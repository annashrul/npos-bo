import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';
import connect from "react-redux/es/connect/connect";
import {FetchPiutangReportDetail} from "redux/actions/piutang/piutang.action";
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
        let get = String(this.props.match.params.id).split('|');
        let any = get[0];
        let kode = get[1];
        let where='';
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`
        }
        this.props.dispatch(FetchPiutangReportDetail(1,where,kode))
      }
      UNSAFE_componentWillReceiveProps(nextProps){
          let getData = nextProps.piutangReportDetail.length!==0?nextProps.piutangReportDetail.data[0]:0
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
          
          
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {
            no_nota,
            fak_jual,
            nama,
            bulat,
            cara_byr,
            jumlah,
            operator,
            tgl_byr,
            tgl_jatuh_tempo,
            ket
        }=this.state.data;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}></td>
                            <td colSpan={5} style={{textAlign: 'right'}}><Barcode width={2} height={25} format={'CODE128'} displayValue={false} value={String(this.props.match.params.id).split('|')[0]}/> </td>
                        </tr>
                        <tr>
                            <td rowSpan={3} colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} className="text-center">Nota Bayar Piutang ({String(this.props.match.params.id).split('|')[0]})</td>
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
                            <td style={{fontSize: '10pt !important'}}>No Nota</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{no_nota}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Faktur Jual</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{fak_jual}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Nama</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{nama}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Bulat</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{bulat}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Cara Bayar</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{cara_byr}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jumlah</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{toRp(parseInt(jumlah,10))}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Operator</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{operator}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Bayar</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_byr).format("YYYY-MM-DD")}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Jatuh Tempo</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{moment(tgl_jatuh_tempo).format("YYYY-MM-DD")}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Ket</td>
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
            piutangReportDetail:state.piutangReducer.data_report_detail,
            auth:state.auth,
            isLoading: state.piutangReducer.isLoading,
        }
    }
    export default connect(mapStateToProps)(Print3ply);