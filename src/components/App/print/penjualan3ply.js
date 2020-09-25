import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';
import Barcode from 'react-barcode'

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            alamat:'',
            site_title:'',
            newLogo:''
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          console.log(getData)
          this.setState({
              data: getData.parsedata.detail,
              master: getData.parsedata.master,
              nota: this.props.location.state.nota,
              site_title: getData.site_title,
              alamat: getData.alamat,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota,alamat,site_title}=this.state;
        if(this.state.newLogo === ''){
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // 
                    // logoBase64 = reader.result;
                    this.setState({newLogo : reader.result});
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', localStorage.getItem('logos'));
            xhr.responseType = 'blob';
            xhr.send();

            
        }
        let gt=0;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table style={{height: '5cm', position: 'relative'}} width="100%" cellSpacing={0} cellPadding={1}>
                        <thead>
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center'}}></td>
                            <td colSpan={5} style={{textAlign: 'right'}}><Barcode width={2} height={25} format={'CODE128'} displayValue={false} value={nota}/> </td>
                        </tr>
                        <tr>
                            <td rowSpan={3} colSpan={3} style={{textAlign: 'center'}}><img className="img_head" style={{padding:'10px'}} alt="LOGO" src={this.state.newLogo} /></td>
                            <td colSpan={5} style={{textAlign: 'center'}}><strong>{site_title}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center'}}>{alamat}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center', bordeColor: 'black',borderBottom: 'solid', borderWidth: 'thin'}}>NOTA PENJUALAN</td>
                        </tr>
                        {/* <tr>
                            <th className="h2" colSpan={3}>Tgl Jual</th>
                            <th className="h2">: {master.tgl}</th>
                        </tr>
                        <tr>
                            <th className="h2" colSpan={3}>Kode Trx.</th>
                            <th className="h2">: {nota}</th>
                        </tr>
                        <tr>
                            <th className="h2" colSpan={3}>Customer</th>
                            <th className="h2">: {master.kd_cust}</th>
                        </tr>
                        <tr>
                            <th colSpan={2} className="h3">Jenis Trx.</th>
                            <th className="h3" colSpan={3}>: {master.jenis_trx}</th>
                            <th rowSpan={2} colSpan={4} className="h3" />
                        </tr>
                        <tr>
                            <th colSpan={2} className="h3" style={{borderTopColor: 'transparent'}}>Keterangan</th>
                            <th className="h3" colSpan={4} style={{borderTopColor: 'transparent'}}>: {master.optional_note}</th>
                        </tr> */}
                        </thead>
                        <tbody className="mt-2">
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
                                <td>{master.tgl}</td>
                                <td>Kode Trx</td>
                                <td>:</td>
                                <td>{nota}</td>
                            </tr>
                            <tr>
                                <th />
                                <td>Customer</td>
                                <td>:</td>
                                <td>{master.kd_cust}</td>
                                <td>Keterangan</td>
                                <td>:</td>
                                <td>{master.optional_note}</td>
                            </tr>
                            <tr>
                                <th />
                                <td>Jenis Trx</td>
                                <td>:</td>
                                <td>{master.jenis_trx}</td>
                                <td/>
                                <td/>
                                <td/>
                            </tr>
                            </tbody>
                    </table>
                    <table width="99%">
                        <thead>
                        <tr>
                            <th className="tengah">Banyaknya</th>
                            <th className="tengah">KODE BARANG</th>
                            <th className="tengah">NAMA BARANG</th>
                            <th className="tengah">HARGA @ Rp</th>
                            <th className="tengah">Jumlah</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                data.length>0?
                                    data.map((item,key)=>{
                                        gt += item.subtotal;
                                        return(
                                        <tr>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.qty} {item.satuan}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.sku}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-left">{item.nm_brg}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt', paddingRight: '5pt'}} className="text-right">{toRp(item.price)}</td>
                                            <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt', paddingRight: '5pt'}} className="text-right">{toRp(item.subtotal)}</td>
                                        </tr>
                                        )
                                    })
                                :""
                            }
                        
                        </tbody>
                        <tbody><tr>
                            <th colSpan={3}> </th>
                            <th className="kanan">Total Rp</th>
                            <th style={{paddingRight: '5pt'}} className="text-right">{toRp(gt)}</th>
                        </tr>
                        </tbody></table>
                    <table width="100%" style={{marginTop: '0.5cm'}}>
                        <thead>
                        <tr>
                            <th className="isi atas tengah borderTB borderLR" style={{width: '3cm'}}>Tanda Terima,</th>
                            <th className="isi tengah" style={{width: '4cm'}}>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</th>
                            <th className="isi atas tengah borderTB borderLR" style={{width: '3cm'}}>Hormat kami,</th>
                        </tr>
                        <tr>
                            <td className="borderLR borderTB tengah" style={{height: '2cm'}}>(_____________)</td>
                            <td className="borderLR borderTB" />
                            <td className="borderLR borderTB tengah">(_____________)</td>
                        </tr>
                        </thead>
                    </table>
                    </div>

            </Layout>
        );
      }
    }