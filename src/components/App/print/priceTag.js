import React, {Component} from 'react'
import QRCode from 'react-qr-code';
import "components/App/print/pricetag.css"
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
      }

      getLogo(){
          const simg = document.getElementsByClassName('selected__img');
          const src = simg[0].src;
          return src
      }

      render() {
        
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
            xhr.open('GET', logo);
            xhr.responseType = 'blob';
            xhr.send();

            
        }
        
        
        return (
            <div id="priceTag" style={{margin:'20px'}}>
                <table>
                {
                    (()=>{
                                                                                                                                const pricetags=[];
                    for(let i=0;i<20;i++){

                        pricetags.push(
                            <div style={{position: 'relative', float: 'left', width: '5cm', height: '3.5cm', margin: '0mm 10mm 6mm 2mm', border: '0px solid', borderColor: '#0000ff #0000ff #0000ff #0000ff'}}>
                            {/*#0000ff #ff9900 #ff9900 #0000ff*/}
                            <div className="label_colom" draggable="true" id="dragme" style={{width: '63mm', marginTop: '1mm', fontSize: '16px', color: 'black'}}>
                                <b>INDOMILK SUSU KENTAL MANIS COKLAT 370G</b>
                            </div>
                            <div className="label_colom" draggable="true" id="dragme" style={{marginLeft: '1mm', marginTop: '15mm', color: 'black'}}>
                            <QRCode value="hey" size={60}/>
                            </div>
                            <div className="label_colom" draggable="true" id="dragme" style={{width: '56mm', marginLeft: '2mm', marginTop: '18mm', fontSize: '8pt', color: 'black'}}>
                                <b style={{float: 'right'}}>8992702000063</b>
                            </div>
                                <div className="label_colom" draggable="true" id="dragme" style={{width: '28mm', marginTop: '20mm', fontSize: '14pt', color: 'black'}}>
                                <b style={{float: 'right'}}>Rp.</b>
                            </div>
                                <div className="label_colom" draggable="true" id="dragme" style={{width: '59mm', marginTop: '20mm', fontSize: '25pt', color: 'black'}}>
                                <b style={{float: 'right'}}>100.000</b>
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