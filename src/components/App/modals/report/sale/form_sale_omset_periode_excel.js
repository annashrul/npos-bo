import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import {toRp, to_pdf} from 'helper'
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import moment from "moment";
import XLSX from 'xlsx'
class SaleOmsetPeriodeReportExcel extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleView = this.handleView.bind(this);
        this.printDocument = this.printDocument.bind(this);
        this.state = {
            title:'',
            jenis: '',
            type:'',
            view:false,
            error:{
                title:'',
                jenis: '',
                type:'',
            }
        };

    }
    handleView = (e) => {
        e.preventDefault();
        this.setState({
            view:!this.state.view
        })
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    printDocument = (e) => {
        e.preventDefault();
        let stringHtml = '';
        stringHtml+=
        '<div style="text-align:center>'+
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN OMSET PERIODE</center></h3>'+
        '</div>';
        
        const headers = [[
            "Omset Bulan Lalu",
            "Transaksi Bulan Lalu",
            "Rata - Rata Transaksi Bulan Lalu Sale",
            "Omset Bulan Sekarang Sale",
            "Transaksi Bulan Sekarang Total",
            "Rata - Rata Transaksi Bulan Sekarang Item",
            "Pertumbuhan Trx",
            "Persentase",
        ]];
        let data = typeof this.props.saleOmsetPeriodeReportExcel.data === 'object'?this.props.saleOmsetPeriodeReportExcel.data.map(v=> [
           toRp(parseInt(v.omset_sebelum,10)),
           toRp(parseInt(v.transaksi_sebelum,10)),
           toRp(parseInt(v.omset_sebelum / v.transaksi_sebelum,10)),
           toRp(parseInt(v.omset_sekarang,10)),
           toRp(parseInt(v.transaksi_sekarang,10)),
           toRp(parseInt(v.omset_sekarang / v.transaksi_sekarang,10)),
           toRp(parseInt(v.omset_sekarang - v.omset_sebelum,10)),
           parseInt((v.omset_sekarang - v.omset_sebelum)/v.omset_sebelum * 100, 10),
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "saleOmsetPeriode_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    printDocumentXLsx = (e, param) => {
        e.preventDefault();

        // let header = [
        //     ['LAPORAN OMSET PERIODE'],
        //     ['PERIODE : ' + this.props.startDate + ' - ' + this.props.endDate + ''],
        //     [''],
        //     [
        //         'Omset Bulan Lalu',
        //         'Transaksi Bulan Lalu',
        //         'Rata - Rata Transaksi Bulan Lalu Sale',
        //         'Omset Bulan Sekarang Sale',
        //         'Transaksi Bulan Sekarang Total',
        //         'Rata - Rata Transaksi Bulan Sekarang Item',
        //         'Pertumbuhan Trx',
        //         'Persentase']
        // ]
        // // let footer = [
        // //     [
        // //         'TOTAL'
        // //         , ''
        // //         , ''
        // //         , ''
        // //         , '', toRp(this.props.totalPenjualanExcel.omset), toRp(this.props.totalPenjualanExcel.dis_item), toRp(this.props.totalPenjualanExcel.dis_rp), this.props.totalPenjualanExcel.dis_persen
        // //         , ''
        // //         , ''
        // //         , ''
        // //         , '', toRp(this.props.totalPenjualanExcel.kas_lain)
        // //         , '', toRp(this.props.totalPenjualanExcel.gt), toRp(this.props.totalPenjualanExcel.rounding), toRp(this.props.totalPenjualanExcel.bayar), toRp(this.props.totalPenjualanExcel.change), toRp(this.props.totalPenjualanExcel.jml_kartu), toRp(this.props.totalPenjualanExcel.charge)
        // //         , ''
        // //         , ''
        // //         , ''
        // //         , ''
        // //     ]
        // // ]
        // // Kd Trx	Tanggal	Jam	Customer	Kasir	Omset	Diskon			HPP	Hrg Jual	Profit	Reg.Member	Trx Lain	Keterangan	Grand Total	Rounding	Tunai	Change	Transfer	Charge	Nama Kartu	Status	Lokasi	Jenis Trx
        // // Peritem(%)	Total(rp)	Total(%)																

        // let raw = typeof this.props.saleOmsetPeriodeReportExcel.data === 'object' ? this.props.saleOmsetPeriodeReportExcel.data.map(v => [
        //     toRp(parseInt(v.omset_sebelum,10)),
        //     toRp(parseInt(v.transaksi_sebelum,10)),
        //     toRp(parseInt(v.omset_sebelum / v.transaksi_sebelum,10)),
        //     toRp(parseInt(v.omset_sekarang,10)),
        //     toRp(parseInt(v.transaksi_sekarang,10)),
        //     toRp(parseInt(v.omset_sekarang / v.transaksi_sekarang,10)),
        //     toRp(parseInt(v.omset_sekarang - v.omset_sebelum,10)),
        //     toRp(parseInt((v.omset_sekarang - v.omset_sebelum)/v.omset_sebelum * 100, 10)),
        // ]) : '';

        // let body = header.concat(raw);

        // let data = body;
        // let data = body.concat(footer);

        // let data = this.props.saleOmsetPeriodeReportExcel.data;

        // let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
        // // let ws = XLSX.utils.json_to_sheet(data, {header:header,skipHeader:true});
        // let merge = [
        //     { s: { r: 0, c: 0 }, e: { r: 0, c: 24 } },
        //     { s: { r: 1, c: 0 }, e: { r: 1, c: 24 } },
        //     { s: { r: data.length - 1, c: 0 }, e: { r: data.length - 1, c: 4 } },
        //     { s: { r: data.length - 1, c: 9 }, e: { r: data.length - 1, c: 12 } },
        //     { s: { r: data.length - 1, c: 21 }, e: { r: data.length - 1, c: 24 } },
        // ];
        // if (!ws['!merges']) ws['!merges'] = [];
        // ws['!merges'] = merge;
        // ws['!ref'] = XLSX.utils.encode_range({
        //     s: { c: 0, r: 0 },
        //     e: { c: 24, r: 1 + data.length + 1 }
        // });
        // ws["A1"].s = {
        //     alignment: {
        //         vertical: 'center',
        //     }
        // };
        let ws = XLSX.utils.table_to_sheet(document.getElementById('laporan_sale_retur'));
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        // XLSX.writeFile(wb, 'SheetJS.xlsx');

        // let wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let exportFileName = `Laporan__Omset_Periode_${moment(new Date()).format('YYYYMMDDHHMMss')}.${param === 'csv' ? `csv` : `xlsx`}`;
        XLSX.writeFile(wb, exportFileName, { type: 'file', bookType: param === 'csv' ? "csv" : "xlsx" });

        this.toggle(e);
    }
    render(){

        const columnStyle = { verticalAlign: "middle", textAlign: "center", };
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleOmsetPeriodeExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row mb-4">
                            <div className="col-6">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgPdf} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-danger" onClick={(e => this.printDocument(e))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e, 'xlsx'))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="table table-bordered" id="laporan_sale_retur">
                            <thead>
                                <tr>
                                <th colSpan={4} className="text-center">Top 100 Items By Qty</th>
                                </tr>
                                <tr>
                                <th>No</th>
                                <th>Kode Barang</th>
                                <th>Nama</th>
                                <th>Qty</th>
                                </tr>
                            </thead>
                            <tbody id="list_brg_qty_l">
                                <tr>
                                <td>1</td>
                                <td>BSM</td>
                                <td>MAWAR BASO SAPI MINI</td>
                                <td>10534</td>
                                </tr>
                                <tr>
                                <td>2</td>
                                <td>SMKS</td>
                                <td>MAWAR SOSIS SAPI ISI 4</td>
                                <td>9424</td>
                                </tr>
                                <tr>
                                <td>3</td>
                                <td>KHEYLAKECIL</td>
                                <td>BATAGOR KERING KHEYLA KECIL</td>
                                <td>7957</td>
                                </tr>
                                <tr>
                                <td>4</td>
                                <td>8993207569567</td>
                                <td>CHAMP NAGET AYAM 250GR</td>
                                <td>6592</td>
                                </tr>
                                <tr>
                                <td>5</td>
                                <td>KWETIAW</td>
                                <td>KWETIAW MANIA</td>
                                <td>3993</td>
                                </tr>
                                <tr>
                                <td>6</td>
                                <td>BMM</td>
                                <td>BASIS MAWAR MERAH 500GR</td>
                                <td>3284</td>
                                </tr>
                                <tr>
                                <td>7</td>
                                <td>8998080261065</td>
                                <td>HEMATO NAGET AYAM 250 GR</td>
                                <td>3021</td>
                                </tr>
                                <tr>
                                <td>8</td>
                                <td>8993207730011</td>
                                <td>CHAMP SOSIS AYAM ISI 3</td>
                                <td>2768</td>
                                </tr>
                                <tr>
                                <td>9</td>
                                <td>CILOKSPESIAL</td>
                                <td>CILOK SAPI SPESIAL</td>
                                <td>2677</td>
                                </tr>
                                <tr>
                                <td>10</td>
                                <td>LUMPIADD</td>
                                <td>KULIT LUMPIA DD</td>
                                <td>2671</td>
                                </tr>
                                <tr>
                                <td>11</td>
                                <td>PMKKEVIN</td>
                                <td>PEMPEK KEVIN</td>
                                <td>2243</td>
                                </tr>
                                <tr>
                                <td>12</td>
                                <td>MAWAR15</td>
                                <td>BASO MAWAR ISI 15</td>
                                <td>1866</td>
                                </tr>
                                <tr>
                                <td>13</td>
                                <td>ELMIRZAABON</td>
                                <td>ABON AYAM ELMIRZA</td>
                                <td>1700</td>
                                </tr>
                                <tr>
                                <td>14</td>
                                <td>8997002710025</td>
                                <td>ROLADE KING 225GR</td>
                                <td>1687</td>
                                </tr>
                                <tr>
                                <td>15</td>
                                <td>8995077000492</td>
                                <td>FIVA ROLADE 250 GR	</td>
                                <td>1623</td>
                                </tr>
                                <tr>
                                <td>16</td>
                                <td>CIPUK</td>
                                <td>CIPUK</td>
                                <td>1582</td>
                                </tr>
                                <tr>
                                <td>17</td>
                                <td>OTAK3PUTRA</td>
                                <td>OTAK-OTAK TIGA PUTRA</td>
                                <td>1580</td>
                                </tr>
                                <tr>
                                <td>18</td>
                                <td>8997009741411</td>
                                <td>HARMONI JAWARA MINI 500GR</td>
                                <td>1512</td>
                                </tr>
                                <tr>
                                <td>19</td>
                                <td>DOROKDOK</td>
                                <td>DOROKDOK</td>
                                <td>1432</td>
                                </tr>
                                <tr>
                                <td>20</td>
                                <td>8993207730110</td>
                                <td>CHAMP SOSIS AYAM 150GR</td>
                                <td>1300</td>
                                </tr>
                                <tr>
                                <td>21</td>
                                <td>8993207905198</td>
                                <td>CHAMP AYAM NAGET COIN 200GR</td>
                                <td>1297</td>
                                </tr>
                                <tr>
                                <td>22</td>
                                <td>TOFU</td>
                                <td>TOFU ISI 5</td>
                                <td>1261</td>
                                </tr>
                                <tr>
                                <td>23</td>
                                <td>BATAGORKHEYLA</td>
                                <td>BATAGOR KERING KHEYLA ISI 45</td>
                                <td>1217</td>
                                </tr>
                                <tr>
                                <td>24</td>
                                <td>SKT</td>
                                <td>BASO KIRANA BIRU ISI 50</td>
                                <td>1212</td>
                                </tr>
                                <tr>
                                <td>25</td>
                                <td>8993207730035</td>
                                <td>CHAMP SOSIS AYAM 375GR</td>
                                <td>1152</td>
                                </tr>
                                <tr>
                                <td>26</td>
                                <td>KNaga</td>
                                <td>KAKI NAGA ELSA</td>
                                <td>1142</td>
                                </tr>
                                <tr>
                                <td>27</td>
                                <td>BTK</td>
                                <td>BATAGOR KERING KECIL 88</td>
                                <td>957</td>
                                </tr>
                                <tr>
                                <td>28</td>
                                <td>RB</td>
                                <td>ROTI BURGER</td>
                                <td>930</td>
                                </tr>
                                <tr>
                                <td>29</td>
                                <td>SS</td>
                                <td>BASO KIRANA KUNING</td>
                                <td>922</td>
                                </tr>
                                <tr>
                                <td>30</td>
                                <td>LUMPIARADIT</td>
                                <td>KULIT LUMPIA RADIT</td>
                                <td>887</td>
                                </tr>
                                <tr>
                                <td>31</td>
                                <td>TB</td>
                                <td>TAHU BULAT</td>
                                <td>882</td>
                                </tr>
                                <tr>
                                <td>32</td>
                                <td>TARUNAURAT</td>
                                <td>BASO TARUNA URAT ISI 25</td>
                                <td>871</td>
                                </tr>
                                <tr>
                                <td>33</td>
                                <td>NAFKAHIABONTOPLES</td>
                                <td>NAFKAHI ABON TOPLES </td>
                                <td>862</td>
                                </tr>
                                <tr>
                                <td>34</td>
                                <td>8997026280047</td>
                                <td>BUMAMI MERAH 40GR</td>
                                <td>793</td>
                                </tr>
                                <tr>
                                <td>35</td>
                                <td>8998080260648</td>
                                <td>HEMATO NAGET AYAM 500 GR	</td>
                                <td>782</td>
                                </tr>
                                <tr>
                                <td>36</td>
                                <td>8993110000652</td>
                                <td>SO NICE NAGET AYAM 250GR</td>
                                <td>774</td>
                                </tr>
                                <tr>
                                <td>37</td>
                                <td>KNPELANGI</td>
                                <td>KAKI NAGA PELANGI</td>
                                <td>766</td>
                                </tr>
                                <tr>
                                <td>38</td>
                                <td>TBMENDOAN</td>
                                <td>TEPUNG MENDOAN </td>
                                <td>739</td>
                                </tr>
                                <tr>
                                <td>39</td>
                                <td>SPB</td>
                                <td>BASO MAWAR ISI 10</td>
                                <td>712</td>
                                </tr>
                                <tr>
                                <td>40</td>
                                <td>DENDENGPRESSBR</td>
                                <td>DENDENG PRESS SUMBER REZEKI</td>
                                <td>700</td>
                                </tr>
                                <tr>
                                <td>41</td>
                                <td>BADARAKSA</td>
                                <td>CIRENG BADARAKSA</td>
                                <td>695</td>
                                </tr>
                                <tr>
                                <td>42</td>
                                <td>8993207900049</td>
                                <td>CHAMP AYAM NAGET ABC 250GR</td>
                                <td>645</td>
                                </tr>
                                <tr>
                                <td>43</td>
                                <td>8995555184249</td>
                                <td>KIMBO BRATWURST ORI ISI 10</td>
                                <td>616</td>
                                </tr>
                                <tr>
                                <td>44</td>
                                <td>SMB</td>
                                <td>MAWAR SOSIS SAPI ISI 7</td>
                                <td>613</td>
                                </tr>
                                <tr>
                                <td>45</td>
                                <td>SMKA</td>
                                <td>MAWAR SOSIS AYAM ISI 4</td>
                                <td>582</td>
                                </tr>
                                <tr>
                                <td>46</td>
                                <td>8997029640046</td>
                                <td>SWAN SAMBAL BAWANG 500ML</td>
                                <td>559</td>
                                </tr>
                                <tr>
                                <td>47</td>
                                <td>8992510094445</td>
                                <td>JELLY PELANGI 500GR</td>
                                <td>538</td>
                                </tr>
                                <tr>
                                <td>48</td>
                                <td>BKB</td>
                                <td>BASO KIRANA BESAR HIJAU</td>
                                <td>538</td>
                                </tr>
                                <tr>
                                <td>49</td>
                                <td>8993207730111</td>
                                <td>CHAMP SOSIS SAPI 150GR</td>
                                <td>536</td>
                                </tr>
                                <tr>
                                <td>50</td>
                                <td>8997014350004</td>
                                <td>TEMAN LAUT BASO IKAN 200GR</td>
                                <td>474</td>
                                </tr>
                                <tr>
                                <td>51</td>
                                <td>TARUNASUPER50</td>
                                <td>BASO TARUNA SUPER ISI 50</td>
                                <td>466</td>
                                </tr>
                                <tr>
                                <td>52</td>
                                <td>8998080260662</td>
                                <td>HEMATO BURGER ISI 20 280G</td>
                                <td>459</td>
                                </tr>
                                <tr>
                                <td>53</td>
                                <td>CIRSNUG</td>
                                <td>CIRENG ANUGRAH</td>
                                <td>410</td>
                                </tr>
                                <tr>
                                <td>54</td>
                                <td>KULITNS</td>
                                <td>KULIT PANGSIT NS</td>
                                <td>394</td>
                                </tr>
                                <tr>
                                <td>55</td>
                                <td>8997225710413</td>
                                <td>MUANTAP FRANKFURTER MINI 500GR</td>
                                <td>370</td>
                                </tr>
                                <tr>
                                <td>56</td>
                                <td>NAFKAHIDENDENG</td>
                                <td>NAFKAHUM DENDENG DAGING</td>
                                <td>364</td>
                                </tr>
                                <tr>
                                <td>57</td>
                                <td>SIOMAYKRIKIL250</td>
                                <td>SIOMAY KRIKIL BRR 250GR</td>
                                <td>362</td>
                                </tr>
                                <tr>
                                <td>58</td>
                                <td>KURMAAYAMBWG</td>
                                <td>BUMBU TABUR KURMA RASA AYAM BAWANG</td>
                                <td>322</td>
                                </tr>
                                <tr>
                                <td>59</td>
                                <td>8990303090582</td>
                                <td>BUMBU TABUR KURMA RASA KEJU</td>
                                <td>318</td>
                                </tr>
                                <tr>
                                <td>60</td>
                                <td>BULENG</td>
                                <td>BUMBU BULENG</td>
                                <td>278</td>
                                </tr>
                                <tr>
                                <td>61</td>
                                <td>8997018181710</td>
                                <td>MABEL NAGET 250GR</td>
                                <td>258</td>
                                </tr>
                                <tr>
                                <td>62</td>
                                <td>UGELSA</td>
                                <td>UDANG GULUNG ELSA</td>
                                <td>246</td>
                                </tr>
                                <tr>
                                <td>63</td>
                                <td>8997005552936</td>
                                <td>BOSS SOSIS BAKAR MINI ISI 12</td>
                                <td>243</td>
                                </tr>
                                <tr>
                                <td>64</td>
                                <td>8998080263878</td>
                                <td>YONA SOSIS SAPI BAKAR MINI 500G</td>
                                <td>227</td>
                                </tr>
                                <tr>
                                <td>65</td>
                                <td>CIRENGISI</td>
                                <td>CIRENG AW ISI KACANG PEDAS</td>
                                <td>224</td>
                                </tr>
                                <tr>
                                <td>66</td>
                                <td>CIRENGAW</td>
                                <td>CIRENG AW RASA AYAM KAMPUNG</td>
                                <td>220</td>
                                </tr>
                                <tr>
                                <td>67</td>
                                <td>8998080260655</td>
                                <td>HEMATO BURGER ISI 10 250GR</td>
                                <td>209</td>
                                </tr>
                                <tr>
                                <td>68</td>
                                <td>SKL</td>
                                <td>BASO KIRANA HIJAU ISI 50</td>
                                <td>199</td>
                                </tr>
                                <tr>
                                <td>69</td>
                                <td>8995555188261</td>
                                <td>VIGO SOSIS BAKAR AYAM  MINI 500G</td>
                                <td>197</td>
                                </tr>
                                <tr>
                                <td>70</td>
                                <td>8992990520854</td>
                                <td>VIDA SOSIS GORENG ISI 6</td>
                                <td>193</td>
                                </tr>
                                <tr>
                                <td>71</td>
                                <td>8995555218210</td>
                                <td>VIGO SOSIS BAKAR SAPI MINI 500GR</td>
                                <td>185</td>
                                </tr>
                                <tr>
                                <td>72</td>
                                <td>KHEYLA10</td>
                                <td>BATAGOR KERING KHEYLA ISI 10</td>
                                <td>184</td>
                                </tr>
                                <tr>
                                <td>73</td>
                                <td>8997225710796</td>
                                <td>BARTOZ KORNET KOIN 450GR</td>
                                <td>176</td>
                                </tr>
                                <tr>
                                <td>74</td>
                                <td>TELORASIN</td>
                                <td>TELOR ASIN</td>
                                <td>164</td>
                                </tr>
                                <tr>
                                <td>75</td>
                                <td>8997005550963</td>
                                <td>BOSS SOSIS BAKAR MINI ISI 10</td>
                                <td>160</td>
                                </tr>
                                <tr>
                                <td>76</td>
                                <td>BASRENGBOYB</td>
                                <td>BASRENG BOY BESAR</td>
                                <td>158</td>
                                </tr>
                                <tr>
                                <td>77</td>
                                <td>BMC</td>
                                <td>BASIS MAWAR COKLAT 500GR</td>
                                <td>157</td>
                                </tr>
                                <tr>
                                <td>78</td>
                                <td>8997225710345</td>
                                <td>MUANTAP SOSIS SAPI 450GR</td>
                                <td>157</td>
                                </tr>
                                <tr>
                                <td>79</td>
                                <td>8997017561544</td>
                                <td>MAX CHOICE SOSIS MINI 500GR</td>
                                <td>156</td>
                                </tr>
                                <tr>
                                <td>80</td>
                                <td>GEBOOOYKUNAGET</td>
                                <td>GEBOOOYKU NAGET 250GR</td>
                                <td>156</td>
                                </tr>
                                <tr>
                                <td>81</td>
                                <td>ALAMB10</td>
                                <td>BASO ALAM BESAR ISI 10</td>
                                <td>154</td>
                                </tr>
                                <tr>
                                <td>82</td>
                                <td>MIEMBDARA</td>
                                <td>MIE MB DARA </td>
                                <td>154</td>
                                </tr>
                                <tr>
                                <td>83</td>
                                <td>RASDANB</td>
                                <td>BASRENG RASDAN BESAR</td>
                                <td>141</td>
                                </tr>
                                <tr>
                                <td>84</td>
                                <td>BASOSPB</td>
                                <td>BASO SPB SUPER POLOS GIRI MALANG ISI 50</td>
                                <td>139</td>
                                </tr>
                                <tr>
                                <td>85</td>
                                <td>HRMLEZAT</td>
                                <td>JELLY HARUM LEZAT 500GR</td>
                                <td>139</td>
                                </tr>
                                <tr>
                                <td>86</td>
                                <td>8998080260631</td>
                                <td>HEMATO NUGGET STIK 400 GR</td>
                                <td>135</td>
                                </tr>
                                <tr>
                                <td>87</td>
                                <td>DAUNK</td>
                                <td>BASRENG CAP DAUN KECIL</td>
                                <td>134</td>
                                </tr>
                                <tr>
                                <td>88</td>
                                <td>8993111112507</td>
                                <td>GARAM KAPAL</td>
                                <td>127</td>
                                </tr>
                                <tr>
                                <td>89</td>
                                <td>8993207730127</td>
                                <td>CHAMP SOSIS SAPI 375GR</td>
                                <td>125</td>
                                </tr>
                                <tr>
                                <td>90</td>
                                <td>BOSTHON10</td>
                                <td>BOSTHON BEEF FRANK 10 500GR</td>
                                <td>116</td>
                                </tr>
                                <tr>
                                <td>91</td>
                                <td>BATAGORELSA</td>
                                <td>BATAGOR KERING ELSA</td>
                                <td>114</td>
                                </tr>
                                <tr>
                                <td>92</td>
                                <td>AN500</td>
                                <td>KULIT PANGSIT AN 500GR</td>
                                <td>111</td>
                                </tr>
                                <tr>
                                <td>93</td>
                                <td>8997017560059</td>
                                <td>TASTY MAX KORNET SAPI 400G	</td>
                                <td>110</td>
                                </tr>
                                <tr>
                                <td>94</td>
                                <td>TBB</td>
                                <td>BASO TARUNA BIRU ISI 50</td>
                                <td>110</td>
                                </tr>
                                <tr>
                                <td>95</td>
                                <td>DAUNB</td>
                                <td>BASRENG CAP DAUN BESAR</td>
                                <td>109</td>
                                </tr>
                                <tr>
                                <td>96</td>
                                <td>BASRENGBAWANGB</td>
                                <td>BASRENG POLOS BESAR</td>
                                <td>108</td>
                                </tr>
                                <tr>
                                <td>97</td>
                                <td>RASDANK</td>
                                <td>BASRENG RASDAN KECIL</td>
                                <td>107</td>
                                </tr>
                                <tr>
                                <td>98</td>
                                <td>SPB25</td>
                                <td>GIRI MALANG SPB ISI 25</td>
                                <td>106</td>
                                </tr>
                                <tr>
                                <td>99</td>
                                <td>MAWARKILO</td>
                                <td>MAWAR SOSIS SAPI 800GR</td>
                                <td>105</td>
                                </tr>
                                <tr>
                                <td>100</td>
                                <td>8997015180921</td>
                                <td>CIKI WIKI NAGET DINO 250GR</td>
                                <td>104</td>
                                </tr>
                            </tbody>
                            </table>

                    </ModalBody>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        saleOmsetPeriodeReportExcel:state.saleOmsetPeriodeReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleOmsetPeriodeReportExcel);