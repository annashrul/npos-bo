import React, {Component} from 'react'
import QRCode from 'react-qr-code';
import "components/App/print/pricetag.css"
import { toCurrency } from '../../../helper';
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
            alamat:'',
            site_title:'',
            newLogo:''
        };
      }
      componentWillMount(){
        const getData = this.props.location.state.data;
        this.setState({
            data: getData,
        })
    }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        
        // if(this.state.newLogo === ''){
        //     const xhr = new XMLHttpRequest();
        //     xhr.onload = () => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => {
        //             // 
        //             // logoBase64 = reader.result;
        //             this.setState({newLogo : reader.result});
        //         };
        //         reader.readAsDataURL(xhr.response);
        //     };
        //     xhr.open('GET', logo);
        //     xhr.responseType = 'blob';
        //     xhr.send();

            
        // }
        
        
        return (
            <div id="priceTag" style={{margin:'20px'}}>
                <table>
                {
                    (()=>{
                        const pricetags=[];
                        for(let i=0;i<this.state.data.length;i++){

                        pricetags.push(
                            <div style={{position: 'relative', float: 'left', width: '6.25cm', height: '3.3cm', padding: '0mm 10mm 6mm 2mm', border: '2px solid', borderColor: '#00000'}}>
                            {/*#0000ff #ff9900 #ff9900 #0000ff*/}
                            <div className="label_colom" draggable="true" id="dragme" style={{width: '60mm', marginTop: '1mm', marginLeft:'2mm', fontSize: '16px', color: 'black'}}>
                                <b>{this.state.data[i].title}</b>
                            </div>
                            <div className="label_colom" draggable="true" id="dragme" style={{marginLeft: '2mm', marginTop: '14mm', color: 'black'}}>
                            <QRCode value={this.state.data[i].barcode} size={60}/>
                            </div>
                            <div className="label_colom" draggable="true" id="dragme" style={{width: '56mm', marginLeft: '2mm', marginTop: '16mm', fontSize: '8pt', color: 'black'}}>
                                <b style={{float: 'right'}}>{this.state.data[i].barcode}</b>
                            </div>
                                <div className="label_colom" draggable="true" id="dragme" style={{width: '28mm', marginTop: '19mm', fontSize: '14pt', color: 'black'}}>
                                <b style={{float: 'right'}}>Rp.</b>
                            </div>
                                <div className="label_colom" draggable="true" id="dragme" style={{width: '59mm', marginTop: '19mm', fontSize: '25pt', color: 'black'}}>
                                <b style={{float: 'right'}}>{toCurrency(this.state.data[i].harga_jual)}</b>
                            </div>
                            {/* <div className="label_colom" draggable="true" id="dragme" style={{width: '72mm', marginTop: '9mm', fontSize: '0px', fontWeight: 'bold', color: 'black'}}>
                                <div style={{float: 'right'}}><img width="30px" height="30px" src="http://192.168.100.10:3000/images/site/site_2009305695iDlW.png" /></div>
                            </div> */}
                            </div>
                        )
                    }
                    return pricetags;
                    })()
                }
            </table>
            </div>
        );
      }
    }