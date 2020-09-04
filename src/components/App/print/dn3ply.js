import React, {Component} from 'react'
import Layout from './layout';

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
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          console.log(getData);
          this.setState({
              data: getData.detail,
              master: getData.master,
              nota: getData.nota,
              kd_kasir: getData.kd_kasir,
              tgl: getData.tgl,
              lokasi: getData.lokasi,
              keterangan: getData.keterangan,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota,kd_kasir,tgl,lokasi,keterangan}=this.state;
        console.log("eeeeeeeeeeeee",master)
        console.log("qqqqqqqqqqqqq",data)
        console.log("iiiiiiiiiiiii",nota)
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={8} style={{textAlign: 'center'}}>Delivery Note ({nota})</td>
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
                            <td>{data.userid}</td>
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Asal</td>
                            <td>:</td>
                            <td>{data.lokasi_asal}</td>
                            <td />
                            <td />
                            <td />
                            <td />
                        </tr>
                        <tr>
                            <th />
                            <td>Lokasi Tujuan</td>
                            <td>:</td>
                            <td>{data.lokasi_tujuan}</td>
                            <td />
                            <td>Kode Pembelian</td>
                            <td>:</td>
                            <td>{data.kode_pembelian}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Nama</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Barcode</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga beli</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga jual1</td>
                            <td style={{width: '40%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock</td>
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
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} >{item.nm_brg}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} >{item.barcode}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.harga_beli}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.hrg_jual}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.stock}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{saldo_stock}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={4} style={{borderTop: 'solid', borderWidth: 'thin'}}>TOTAL</td>
                            <td className="text-center" style={{borderTop: 'solid', borderWidth: 'thin'}}>{data.subtotal}</td>
                            <td style={{borderTop: 'solid', borderWidth: 'thin'}} />
                        </tr>
                        </tfoot>
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