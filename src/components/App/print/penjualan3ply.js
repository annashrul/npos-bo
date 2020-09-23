import React, {Component} from 'react'
import Layout from './layout';
import {toRp} from 'helper';

export default class Print3ply extends Component {
      constructor(props) {
        super(props);
        this.state = {
            data:[],
            master:[],
            nota:'',
            newLogo:''
        };
      }
      componentWillMount(){
          const getData = this.props.location.state.data;
          this.setState({
              data: getData.detail,
              master: getData.master,
              nota: this.props.location.state.nota,
          })
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        const {master,data,nota}=this.state;
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
            xhr.open('GET', localStorage.getItem('logos'));
            xhr.responseType = 'blob';
            xhr.send();

            console.log(this.state.newLogo);
        }
        let gt=0;
        return (
            <Layout>
                <div  id="print_3ply">
                    <table style={{height: '10cm', position: 'relative'}} width="100%" cellSpacing={0} cellPadding={1}>
                        <thead>
                        <tr>
                            <th colSpan={4} rowSpan={3} className="h1"><img className="img_head" alt="LOGO" src={this.state.newLogo} /></th>
                            <th rowSpan={3} className="judul">NOTA PENJUALAN</th>
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
                        </tr>
                        </thead>
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