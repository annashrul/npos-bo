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
            lokasi:'',
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
              lokasi: getData.lokasi,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,logo,user,lokasi}=this.state;

        let total_stock = 0;
        let qty_retur = 0;
        let grand_total = 0;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table width="100%" cellSpacing={0} cellPadding={1} style={{letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', marginBottom: 10, fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={logo} /></td>
                            <td style={{height: '1.5cm', textAlign: 'center'}} colSpan={5}>Nota Retur Pembelian</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td width="2%" />
                            <td width="23%" />
                            <td width="2%" />
                            <td width="25%" />
                            <td width="3%" />
                            <td width="19%" />
                            <td width="2%" />
                            <td width="25%" />
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '8pt !important'}}>Tanggal</td>
                            <td style={{fontSize: '8pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.tanggal}</td>
                            <td />
                            <td style={{fontSize: '8pt !important'}}>Retur Ke</td>
                            <td style={{fontSize: '8pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{data.supplier}</td>
                        </tr>
                        <tr>
                            <td />
                            <td style={{fontSize: '8pt !important'}}>Operator</td>
                            <td style={{fontSize: '8pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{user}</td>
                            <td />
                            <td style={{fontSize: '8pt !important'}}>Lokasi Cabang</td>
                            <td style={{fontSize: '8pt !important'}}>:</td>
                            <td style={{fontSize: '10pt !important'}}>{lokasi}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">No</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Nama barang</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Barcode</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Satuan</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Harga Beli</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Kondisi</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Ket</td>
                            {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}}>Stock</td> */}
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Qty Retur</td>
                            <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt', fontSize: '10pt !important'}} className="text-center">Nilai Retur</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            master.map((item, index) => {
                                let total_retur=parseInt(item.qty_retur,10)*parseInt(item.harga_beli,10);
                                grand_total = grand_total + total_retur;
                                localStorage.setItem("grand_total",grand_total);
                                qty_retur = qty_retur+parseInt(item.qty_retur,10);
                                total_stock = total_stock+parseInt(item.stock,10);
                                return (
                                    <tr key={index}>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{index+1}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.nm_brg}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.barcode}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.satuan}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.harga_beli}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.kondisi}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.ket}</td>
                                        {/* <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.stock}</td> */}
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{item.qty_retur}</td>
                                        <td style={{borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">{total_retur}</td>

                                    </tr>
                                )
                            })
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td style={{borderTop: '', borderWidth: 'thin'}} colSpan={4}>TOTAL</td>
                            <td style={{borderTop: '', borderWidth: 'thin'}}>{/*?=$tqty?*/}</td>
                            <td style={{borderTop: '', borderWidth: 'thin'}} colSpan={3} />
                            <td style={{borderTop: '', borderWidth: 'thin'}} className="text-center">{data.subtotal}</td>
                        </tr>
                        </tfoot>
                    </table>
                    <table width="100%" style={{letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: '9pt'}}>
                        <thead>
                        <tr>
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
                            <td style={{borderTop: '', borderWidth: 'thin'}} width="33%" />
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{textAlign: 'left'}} colSpan={2}>
                            <u>{/*?=number_to_words($total)?*/}</u>
                            </td>
                        </tr>
                        <tr>
                            <td style={{textAlign: 'center'}}>
                            Penerima
                            </td>
                            <td style={{textAlign: 'center'}}>
                            Pengirim
                            </td>
                            <td style={{textAlign: 'center'}}>
                            Admin
                            </td>
                        </tr>
                        <tr>
                            <td style={{textAlign: 'center'}}>
                            <b><br /><br /><br /><br />_____________</b>
                            </td>
                            <td style={{textAlign: 'center'}}>
                            <b><br /><br /><br /><br />_____________</b>
                            </td>
                            <td style={{textAlign: 'center'}}>
                            <b><br /><br /><br /><br />_____________</b>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%" border={0} style={{marginTop: '5mm', letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: '9pt'}}>
                        <tbody><tr>
                            <td colSpan={3}>Ket : {data.keterangan}</td>
                        </tr>
                        </tbody>
                    </table>

                </div>

            </Layout>
        );
      }
    }