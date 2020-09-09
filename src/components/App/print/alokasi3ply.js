import React, {Component} from 'react'
import Layout from './layout';

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
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={logo} /></td>
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
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Barcode</td>
                            <td style={{width: '40%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Harga beli</td>
                            {/* <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Harga jual1</td> */}
                            {/* <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Stock</td> */}
                            <td style={{width: '10%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">Qty</td>
                            {/* <td style={{width: '15%', borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-right">Subtotal</td> */}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item,index)=>{
                                // subtotal+=this.state.jenis_trx.toLowerCase()!=='transaksi'?parseInt(item.harga_beli,10)*parseFloat(item.qty):parseInt(item.hrg_jual,10)*parseFloat(item.qty);
                                return (
                                    <tr key={index} >
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.harga_beli}</td>
                                        {/* <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.hrg_jual}</td> */}
                                        {/* <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.stock}</td> */}
                                        <td style={{borderBottom: '', borderWidth: '', paddingLeft: '5pt'}} className="text-center">{item.qty}</td>
                                        {/* <td style={columnStyle}>{this.state.jenis_trx.toLowerCase()!=='transaksi'?parseInt(item.harga_beli,10)*parseFloat(item.qty):parseInt(item.hrg_jual,10)*parseFloat(item.qty)}</td> */}
                                    </tr>
                                )
                            })

                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={4} style={{borderTop: '', borderWidth: '',paddingLeft: '25pt'}}>TOTAL</td>
                            <td className="text-center" style={{borderTop: '', borderWidth: ''}}>{data.subtotal}</td>
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