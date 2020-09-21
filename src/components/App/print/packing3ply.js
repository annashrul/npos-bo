import React, {Component} from 'react'
import Layout from './layout';

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            logo:'',
            user:'',
            nota:''
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
        let subtotal = 0;
        return (
            <Layout>
                <div  id="print_3ply">
                <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                    <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={logo} /></td>
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
                        {/* <tr>
                        <th />
                        <td>Lokasi Dari-Ke</td>
                        <td>:</td>
                        <td>{data.lokasi_asal +' - '+data.lokasi_tujuan}</td>
                        <td />
                        <td>Status</td>
                        <td>:</td>
                        <td>{data.status}</td>
                        </tr> */}
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

                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Kode</td>
                            <td style={{width: '15%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">barcode</td>
                            <td style={{width: '40%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga Beli</td>
                            {/* <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock Sistem</td> */}
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
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.kode_barang}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{parseInt(item.harga_beli,10)}</td>
                                        {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.stock}</td> */}
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_alokasi}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_packing}</td>
                                        {/* <td style={columnStyle}>{item.qty_alokasi}</td> */}

                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={5} style={{borderTop: '', borderWidth: 'thin', paddingLeft: '25pt'}}>TOTAL</td>
                            <td className="text-right" style={{borderTop: '', borderWidth: 'thin', paddingLeft: '5pt'}}>{subtotal}</td>
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