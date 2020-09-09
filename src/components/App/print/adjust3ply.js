import React, {Component} from 'react'
import Layout from './layout';

export default class Adjust3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            user:'',
            tgl:'',
            logo:'',
            lokasi_val:'',
            keterangan:'',
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          
          this.setState({
              data: getData.detail,
              master: getData.master,
              nota: getData.nota,
              user: getData.user,
              logo: getData.logo,
              tgl: getData.tgl,
              keterangan: getData.keterangan,
              lokasi_val: getData.lokasi_val,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,nota,user,tgl,lokasi_val,keterangan,logo}=this.state;
        
        
        
        return (
            <Layout>
                <div  id="print_3ply">
                        <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: '20pt'}}>
                            <thead>
                            <tr>
                                <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={logo} /></td>
                                <td colSpan={5} style={{textAlign: 'center'}}>Adjustment Stock ({nota})</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td width="2%" />
                                <td width="20%" />
                                <td width="2%" />
                                <td width="28%" />
                                <td width="10%" />
                                <td width="2%" />
                                <td width="20%" />
                            </tr>
                            <tr>
                                <td />
                                <td>Tanggal</td>
                                <td>:</td>
                                <td>{tgl}</td>
                                <td>Operator</td>
                                <td>:</td>
                                <td>{user}</td>
                            </tr>
                            <tr>
                                <th />
                                <td>Lokasi</td>
                                <td>:</td>
                                <td>{lokasi_val}</td>
                                <td>Keterangan</td>
                                <td>:</td>
                                <td>{keterangan}</td>
                            </tr>
                            </tbody>
                        </table>
                        <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                            <thead>
                            <tr>
                                <td style={{width: '3%', paddingLeft: '5pt'}} className="text-center">No</td>
                                {/* <td style={{width: '15%', paddingLeft: '5pt'}} className="text-center">Kode</td> */}
                                <td style={{width: '15%', paddingLeft: '5pt'}} className="text-center">Barcode</td>
                                <td style={{width: '30%', paddingLeft: '5pt'}} className="text-center">Nama</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Satuan</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Harga Beli</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Stock Sistem</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Jenis</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Stock Adjust</td>
                                <td style={{width: '10%', paddingLeft: '5pt'}} className="text-center">Saldo Stock</td>
                                <td style={{paddingLeft: '15pt'}} className="text-center"/>
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
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                            {/* <td style={{paddingLeft: '5pt'}} className="text-center">{item.kd_brg}</td> */}
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
 
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.harga_beli}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.stock}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.status}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{item.qty_adjust}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center">{saldo_stock}</td>
                                            <td style={{paddingLeft: '5pt'}} className="text-center" />
                                        </tr>
                                    )
                                })
                            }
                            <tbody>
                            </tbody>
                        </table>
                        <table width="100%" style={{letterSpacing: 5, fontFamily: '"Courier New"', fontSize: '20pt'}}>
                            <thead>
                            <tr>
                                <th style={{borderTop: 'solid', borderWidth: '0'}} width="50%" />
                                <th style={{borderTop: 'solid', borderWidth: '0'}} width="50%" />
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