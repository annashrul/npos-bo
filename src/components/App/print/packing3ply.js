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
          console.log("11111111111111111111111",getData);
          this.setState({
              data: getData.detail,
              master: getData.master,
              nota: getData.nota,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota}=this.state;
        console.log("22222222222222222222",this.state)
        return (
            <Layout>
                <div  id="print_3ply">
                <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '9pt'}}>
                    <thead>
                        <tr>
                        <td colSpan={8} style={{textAlign: 'center'}}>Packing Alokasi ({nota})</td>
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
                        <td>{data.userid}</td>
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

                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td style={{width: '5%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">No</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Kode</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">barcode</td>
                            <td style={{width: '40%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Nama</td>
                            <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                            <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga Beli</td>
                            <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock Sistem</td>
                            <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Qty Alokasi</td>
                            <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Qty Packing</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item, index) => {

                                return (
                                    <tr key={index}>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.kode_barang}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{parseInt(item.harga_beli,10)}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.stock}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_alokasi}</td>
                                        <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_packing}</td>
                                        {/* <td style={columnStyle}>{item.qty_alokasi}</td> */}

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