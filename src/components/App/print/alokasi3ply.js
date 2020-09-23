import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            logo:'',
            user:'',
            lokasi_asal:'',
            lokasi_tujuan:'',
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
              lokasi_asal: getData.lokasi_asal,
              lokasi_tujuan: getData.lokasi_tujuan,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota,logo,user,lokasi_asal,lokasi_tujuan}=this.state;
        if(this.state.newLogo === ''){
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // console.log(reader.result);
                    // logoBase64 = reader.result;
                    this.setState({newLogo : reader.result});
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', logo);
            xhr.responseType = 'blob';
            xhr.send();

            console.log(this.state.newLogo);
        }
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}>Alokasi Barang ({nota})</td>
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
                        <tr>
                            <td />
                            <td>Tanggal</td>
                            <td>:</td>
                            <td>{data.tgl_mutasi}</td>
                            <td />
                            <td>EDP</td>
                            <td>:</td>
                            <td>{user}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Asal</td>
                            <td>:</td>
                            <td>{lokasi_asal}</td>
                            <td />
                            <td>Jenis Transaksi</td>
                            <td>:</td>
                            <td>{data.jenis_trx}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Tujuan</td>
                            <td>:</td>
                            <td>{lokasi_tujuan}</td>
                            <td />
                            <td>No Delivery Note</td>
                            <td>:</td>
                            <td>{data.kode_delivery_note}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="99%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Barcode</td>
                            <td style={{width: '40%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Harga beli</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Qty</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item,index)=>{
                                return (
                                    <tr key={index} >
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.nm_brg}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.barcode}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-left">{item.satuan}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-right">{toRp(item.harga_beli)}</td>
                                        <td style={{border: 'solid', borderWidth: '', paddingLeft: '5pt'}} className="text-right">{item.qty}</td>
                                    </tr>
                                )
                            })

                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={4} style={{borderTop: '', borderWidth: '',paddingLeft: '25pt'}}>TOTAL</td>
                            <td className="text-right" style={{borderTop: '', borderWidth: '', paddingLeft: '5pt'}}>{toRp(data.subtotal)}</td>
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