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
        const {master,nota,kd_kasir,tgl,lokasi,keterangan}=this.state;
        
        
        
        return (
            <Layout>
                <div  id="print_3ply">
                        <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                            <thead>
                            <tr>
                                <td colSpan={8} style={{textAlign: 'center'}}>Adjustment Stock ({nota})</td>
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
                                <td>Tanggal</td>
                                <td>:</td>
                                <td>{tgl}</td>
                                <td>Operator</td>
                                <td>:</td>
                                <td>{kd_kasir}</td>
                            </tr>
                            <tr>
                                <th />
                                <td>Lokasi</td>
                                <td>:</td>
                                <td>{lokasi}</td>
                                <td>Keterangan</td>
                                <td>:</td>
                                <td>{keterangan}</td>
                            </tr>
                            </tbody>
                        </table>
                        <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                            <thead>
                            <tr>
                                <td style={{width: '5%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>No</td>
                                <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Kode</td>
                                <td style={{width: '15%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Barcode</td>
                                <td style={{width: '30%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Nama</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>Harga Beli</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock Sistem</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Jenis</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Stock Adjust</td>
                                <td style={{width: '10%', borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Saldo Stock</td>
                            </tr>
                            </thead>
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
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{index+1}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.kd_brg}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.barcode}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.nm_brg}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.satuan}</td>
 
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.harga_beli}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.stock}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.status}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{item.qty_adjust}</td>
                                            <td style={{borderBottom: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}}>{saldo_stock}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tbody>
                            </tbody>
                        </table>
                        <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '9pt'}}>
                            <thead>
                            <tr>
                                <th style={{borderTop: 'solid', borderWidth: 'thin'}} width="50%" />
                                <th style={{borderTop: 'solid', borderWidth: 'thin'}} width="50%" />
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{textAlign: 'center'}}>
                                <br />Operator<br /><br /><br />_____________
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