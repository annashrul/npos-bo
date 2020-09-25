import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';
import Barcode from 'react-barcode';

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            logo:'',
            user:'',
            nota:'',
            newLogo:''
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          
          this.setState({
              data: getData.detail,
              master: getData.master,
              nota: getData.nota,
              logo: getData.logo,
              user: getData.user,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota,logo,user}=this.state;
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
            xhr.open('GET', logo);
            xhr.responseType = 'blob';
            xhr.send();

            
        }
        let subtotal = 0;
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
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}>Packing Alokasi ({nota})</td>
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
                    </tbody>
                </table>

                    <table width="99%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Kode</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">barcode</td>
                            <td style={{width: '40%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga Beli</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Qty Alokasi</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Qty Packing</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item, index) => {
                                subtotal = subtotal+parseInt(item.harga_beli,10);
                                return (
                                    <tr key={index}>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.kode_barang}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.barcode}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.nm_brg}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.satuan}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{toRp(parseInt(item.harga_beli,10))}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{item.qty_alokasi}</td>
                                        <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{item.qty_packing}</td>

                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={5} style={{borderTop: '', borderWidth: 'thin', paddingLeft: '25pt'}}>TOTAL</td>
                            <td className="text-right" style={{borderTop: '', borderWidth: 'thin', paddingLeft: '5pt'}}>{toRp(subtotal)}</td>
                            <td style={{borderTop: '', borderWidth: 'thin'}} />
                        </tr>
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