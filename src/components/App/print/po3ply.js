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
            lokasi_beli:'',
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
              lokasi_beli: getData.lokasi_beli,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota,logo,user,lokasi_beli}=this.state;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={logo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}>Laporan Arsip Purchase Order ({nota})</td>
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
                            <td style={{fontSize: '10pt !important'}}>Tanggal Kirim</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.tgl_kirim}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Operator</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{user}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Tanggal Order</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.tgl_order}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Jenis Trx</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.jenis_transaksi}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Lokasi</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{lokasi_beli}</td>
                            <td />
                            <td style={{fontSize: '10pt !important'}}>Keterangan</td>
                            <td style={{fontSize: '10pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.catatan}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">No</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Nama barang</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Barcode</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Satuan</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Harga Beli</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Diskon</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">PPN %</td>
                            {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Stock %</td> */}
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">QTY</td>
                            {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Bonus</td> */}
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Subtotal</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item, index) => {
                                let disc1=0;
                                let disc2=0;
                                let ppn=0;
                                if(item.diskon!==0){
                                    disc1 = parseInt(item.harga_beli,10) * (parseFloat(item.diskon) / 100);
                                    disc2=disc1;
                                    if(item.diskon2!==0){
                                        disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                                    }
                                }
                          

                                if(item.ppn!==0){
                                    ppn = parseInt(item.harga_beli,10) * (parseFloat(item.ppn) / 100);
                                }
                                return (
                                    <tr key={index}>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.harga_beli}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.diskon}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.ppn}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty}</td>
                                        {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_bonus}</td> */}
                                        <td style={{borderBottom: '', borderWidth: 'thin'}} className="text-center">{((parseInt(item.harga_beli,10)-disc2)+ppn)*parseFloat(item.qty)}</td>

                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td style={{borderTop: '', borderWidth: 'thin', paddingLeft: '15pt'}} colSpan={7}>TOTAL</td>
                            <td style={{borderTop: '', borderWidth: 'thin'}} />
                            <td style={{borderTop: '', borderWidth: 'thin'}} className="text-center">{data.sub_total}</td>
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