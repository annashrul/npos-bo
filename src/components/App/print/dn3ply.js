import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';

export default class Adjust3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            kd_kasir:'',
            tgl:'',
            lokasi:'',
            keterangan:'',
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
              kd_kasir: getData.kd_kasir,
              tgl: getData.tgl,
              lokasi: getData.lokasi,
              keterangan: getData.keterangan,
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
                            <td colSpan={5} style={{textAlign: 'center'}}>Delivery Note ({nota})</td>
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
                            <td>{data.tanggal}</td>
                            <td />
                            <td>Operator</td>
                            <td>:</td>
                            <td>{user}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Asal</td>
                            <td>:</td>
                            <td>{lokasi_asal}</td>
                            <td />
                            <td>Kode Pembelian</td>
                            <td>:</td>
                            <td>{data.kode_pembelian}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Tujuan</td>
                            <td>:</td>
                            <td>{lokasi_tujuan}</td>
                            <td />
                            <td>Keterangan</td>
                            <td>:</td>
                            <td>{data.catatan}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="99%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '35%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Barcode</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga beli</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock</td>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                master.map((item, index) => {
                                    let saldo_stock = item.saldo_stock;
                                    if(item.status === 'kurang'){
                                        saldo_stock=parseInt(item.stock,10)-parseInt(item.qty_adjust,10);
                                    }
                                    if(item.status === 'tambah' || item.status===''){
                                        saldo_stock=parseInt(item.stock,10)+parseInt(item.qty_adjust,10)
                                    }
                                    return (
                                        <tr key={index}>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.nm_brg}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.barcode}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.satuan}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{toRp(item.harga_beli)}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{item.stock}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={4} style={{borderTop: '', borderWidth: 'thin',  paddingLeft: '25pt'}}>TOTAL</td>
                            <td className="text-right" style={{borderTop: '', borderWidth: 'thin', paddingLeft: '5pt'}}>{toRp(data.subtotal)}</td>
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