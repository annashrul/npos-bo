import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Layout from '../Layout';
import Chart from "react-apexcharts";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import moment from 'moment';
import Select from 'react-select';
import { Line } from 'peity-react';
import {toRp} from "helper";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import socketIOClient from "socket.io-client";
import {HEADERS} from 'redux/actions/_constants'

const range = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
        moment()
            .subtract(1, "month")
            .startOf("month"),
        moment()
            .subtract(1, "month")
            .endOf("month")
    ],
    "Last Year": [
        moment()
            .subtract(1, "year")
            .startOf("year"),
        moment()
            .subtract(1, "year")
            .endOf("year")
    ]
};
const socket = socketIOClient(HEADERS.URL);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            startDate:localStorage.getItem("startDateProduct")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateProduct"),
            endDate:localStorage.getItem("endDateProduct")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateProduct"),

            grossSales:"0",
            wGrossSales:110,
            netSales:"0",
            wNetSales:110,
            trxNum:"0",
            wTrxNum:110,
            avgTrx:"0",
            wAvgTrx:110,

            dataA: [5,3,9,6,5,9,7,3,5,2],
            dataB: [9,7,3,5,2,5,3,9,6,5],
            dataC: [5,3,9,3,5,2,6,5,9,7],
            dataD: [7,3,5,2,5,3,9,6,5,9],

            location_data:[],
            location:"-",

           lokasi_sales: {
                   options: {
                       chart: {
                           id: "basic-bar"
                       },
                       xaxis: {
                           categories: []
                       }
                   },
                   series: [{
                           name: "Bulan Lalu",
                           data: []
                       },
                       {
                           name: "Bulan Sekarang",
                           data: []
                       }
                   ],
            },
           lokasi_tr: {
                   options: {
                       chart: {
                           id: "basic-bar"
                       },
                       xaxis: {
                           categories: []
                       }
                   },
                   series: [{
                           name: "Bulan Lalu",
                           data: []
                       },
                       {
                           name: "Bulan Sekarang",
                           data: []
                       }
                   ],
            },
           daily: {
                   options: {
                       chart: {
                           id: "basic-bar"
                       },
                       xaxis: {
                           categories: ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                       },
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0'],
                       dataLabels: {
                           enabled: false
                       },
                       plotOptions: {
                           bar: {
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: [0,0,0,0,0,0,0]
                   }],
            },
           hourly: {
                   options: {
                       chart: {
                           type: 'area'
                       },
                       xaxis: {
                           categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                       },
                       dataLabels: {
                           enabled: false
                       },
                       stroke: {
                           curve: 'smooth'
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                   }],
            },
           top_item_qty: {
                   options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: []
                   }],
            },
           top_item_sale:{ options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: []
                   }],},
           top_cat_qty:{ options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: []
                   }],},
           top_cat_sale:{ options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: []
                   }],},
           top_sp_qty:{ options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       // name: "Bulan Lalu",
                       data: []
                   }],},
           top_sp_sale:{ 
               options: {
                       colors: ['#F44336', '#E91E63', '#9C27B0', '#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0', '#F44336'],
                       xaxis: {
                           categories: [],
                       },
                       plotOptions: {
                           bar: {
                               horizontal: true,
                               columnWidth: '45%',
                               distributed: true
                           }
                       },
                       legend: {
                           show: false
                       },
                       dataLabels: {
                           enabled: false
                       },
                   },
                   series: [{
                       data: []
                   }],
                }
        };

        socket.on('refresh_dashboard',(data)=>{
            // this.refreshData();
        })
        
        socket.on("set_dashboard", (data) => {
            console.log("SET_DASHBOARD", data);
            this.setState({
                grossSales:toRp(parseInt(data.header.penjualan)),
                netSales:toRp(parseInt(data.header.net_sales)),
                trxNum:data.header.transaksi,
                avgTrx:toRp(parseInt(data.header.avg)),
                lokasi_sales: data.lokasi_sales,
                lokasi_tr: data.lokasi_tr,
                hourly: data.hourly,
                daily: data.daily,
                top_item_qty: data.top_item_qty,
                top_item_sale: data.top_item_sale,
                top_cat_qty: data.top_cat_qty,
                top_cat_sale: data.top_cat_sale,
                top_sp_qty: data.top_sp_qty,
                top_sp_sale: data.top_sp_sale,
            });
            // if(String(toRp(data.header.penjualan)).length <= 1){
            //     this.setState({wGrossSales:280})
            // } else if (String(toRp(data.header.penjualan)).length <= 3) {
            //     this.setState({wGrossSales:220})
            // } else if (String(toRp(data.header.penjualan)).length <= 5) {
            //     this.setState({wGrossSales:200})
            // } else if (String(toRp(data.header.penjualan)).length <= 7) {
            //     this.setState({wGrossSales:160})
            // } else if (String(toRp(data.header.penjualan)).length <= 9) {
            //     this.setState({wGrossSales:120})
            // } else if (String(toRp(data.header.penjualan)).length > 9) {
            //     this.setState({wGrossSales:80})
            // }
            // if(String(toRp(data.header.net_sales)).length <= 1){
            //     this.setState({wNetSales:280})
            // } else if (String(toRp(data.header.net_sales)).length <= 3) {
            //     this.setState({wNetSales:220})
            // } else if (String(toRp(data.header.net_sales)).length <= 5) {
            //     this.setState({wNetSales:200})
            // } else if (String(toRp(data.header.net_sales)).length <= 7) {
            //     this.setState({wNetSales:160})
            // } else if (String(toRp(data.header.net_sales)).length <= 9) {
            //     this.setState({wNetSales:120})
            // } else if (String(toRp(data.header.net_sales)).length > 9) {
            //     this.setState({wNetSales:80})
            // }
            // if(String(data.header.transaksi).length <= 1){
            //     this.setState({wTrxNum:280})
            // } else if (String(data.header.transaksi).length <= 3) {
            //     this.setState({wTrxNum:220})
            // } else if (String(data.header.transaksi).length <= 5) {
            //     this.setState({wTrxNum:200})
            // } else if (String(data.header.transaksi).length <= 7) {
            //     this.setState({wTrxNum:160})
            // } else if (String(data.header.transaksi).length <= 9) {
            //     this.setState({wTrxNum:120})
            // } else if (String(data.header.transaksi).length > 9) {
            //     this.setState({wTrxNum:80})
            // }
            // if(String(toRp(data.header.avg)).length <= 1){
            //     this.setState({wAvgTrx:280})
            // } else if (String(toRp(data.header.avg)).length <= 3) {
            //     this.setState({wAvgTrx:220})
            // } else if (String(toRp(data.header.avg)).length <= 5) {
            //     this.setState({wAvgTrx:220})
            // } else if (String(toRp(data.header.avg)).length <= 7) {
            //     this.setState({wAvgTrx:180})
            // } else if (String(toRp(data.header.avg)).length <= 9) {
            //     this.setState({wAvgTrx:140})
            // } else if (String(toRp(data.header.avg)).length > 9) {
            //     this.setState({wAvgTrx:80})
            // }
            // console.log("data", data.header.penjualan);
            // console.log("length", String(data.header.penjualan).length);
        });
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.handleSelect3 = this.handleSelect3.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
          let lk = []
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
              lk.push({
                  value: "-",
                  label: "Semua Lokasi"
              });
              loc.map((i) => {
                lk.push({
                  value: i.kode,
                  label: i.nama
                });
              })
              
              this.setState({
                location_data: lk,
                userid: nextProps.auth.user.id
              })
          }
        }
      }

    refreshData(){
        socket.emit('get_dashboard', {
            datefrom: this.state.startDate,
            dateto: this.state.endDate,
            location: this.state.location
        })
    }

    componentWillMount(){
        this.refreshData();
        
    }

    refreshData(){
        socket.emit('get_dashboard', {
            datefrom: this.state.startDate,
            dateto: this.state.endDate,
            location: this.state.location
        });
    }

    // componentDidMount() {
    //     this.interval = setInterval(
    //         () => this.tick(),
    //         2000
    //       );
    // }

    // componentWillUnmount() {
    // clearInterval(this.interval);
    // }

    // tick() {
    // // var array = [];
    // var arrayA = [5,3,9,6,5,9,7,3,5,2];
    // var arrayB = [5,3,9,6,5,9,7,3,5,2];
    // var arrayC = [5,3,9,6,5,9,7,3,5,2];
    // var arrayD = [5,3,9,6,5,9,7,3,5,2];

    // arrayA.sort(() => 0.5 - Math.random());
    // arrayB.sort(() => 0.7 - Math.random());
    // arrayC.sort(() => 0.9 - Math.random());
    // arrayD.sort(() => 0.3 - Math.random());
    // // as we need at least players to form a pair
    // while (arrayA.length) { 
    // const randA = [arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop(), arrayA.pop()];
    // const randB = [arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop(), arrayB.pop()];
    // const randC = [arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop(), arrayC.pop()];
    // const randD = [arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop(), arrayD.pop()];

    // this.setState({
    //     dataA: randA,
    //     dataB: randB,
    //     dataC: randC,
    //     dataD: randD
    //     });
    // }
    // }

    onChange = date => this.setState({ date })

    handleSelect = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };
    handleSelect2 = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };
    handleSelect3 = (e,index) => {
        this.setState({selectedIndex: index}, () => {
            // console.log('Selected tab: ' + this.state.selectedIndex);
        });
    };

    handleEvent = (event, picker) => {
        console.log("start: ", picker.startDate);
        console.log("end: ", picker.endDate._d.toISOString());
        // end:  2020-07-02T16:59:59.999Z
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("startDateProduct",`${awal}`);
        localStorage.setItem("endDateProduct",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        this.refreshData();
    };

    handleSubmit = (event) => {
        event.preventDefault()
        console.log("tes","klik");
        
        var loc = this.state.location;
        var dateFrom = this.state.startDate;
        var dateTo = this.state.endDate;
        if(this.state.location == '' || this.state.location == undefined){
            loc = "-";
        }
        // socket.emit('get_dashboard', {
        //     datefrom: dateFrom,
        //     dateto: dateTo,
        //     location: loc
        // });
        this.refreshData();
        console.log("dateFrom", dateFrom);
        console.log("dateTo", dateTo);
        console.log("loc", loc);
    }

    HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        console.log(err);
        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        this.refreshData();
    }
    


    render() {

        return (
            <Layout page="Dashboard">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                        <h5 className="mb-0 font-weight-bold">Dashboard</h5>
                        <p className="mb-0 font-weight-bold">Welcome to Motrila Dashboard.</p>
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                            <div className="dashboard-clock">
                                <div id="dashboardDate">Friday, 24 July</div>
                                <ul className="d-flex align-items-center justify-content-end">
                                <li id="hours">12</li>
                                <li>:</li>
                                <li id="min">31</li>
                                <li>:</li>
                                <li id="sec">46</li>
                                </ul>
                            </div>
                            <div className="dashboard-btn-group d-flex align-items-center">
                                <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary ml-1 float-right"><i className="fa fa-refresh"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-6">
                        {/* <div className="dashboard-header-title mb-3">
                        <h5 className="mb-0 font-weight-bold">Dashboard</h5>
                        <p className="mb-0 font-weight-bold">Welcome to Motrila Dashboard.</p>
                        </div> */}
                    </div>
                    {/* Dashboard Info Area */}
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                                <div className="col-8 text-right">
                                    <div className="form-group">
                                        {/* <label className="control-label font-12">Periode </label> */}
                                        <DateRangePicker
                                            className='float-right'
                                            ranges={range}
                                            alwaysShowCalendars={true}
                                            onEvent={this.handleEvent}
                                        >
                                            <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',width: '185px',fontWeight:'bolder'}}/>
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div className="col-4 text-right" style={{paddingRight:'unset'}}>
                                    <div className="form-group">
                                        {/* <label className="control-label font-12">
                                        Lokasi
                                        </label> */}
                                        <Select 
                                            options={this.state.location_data} 
                                            placeholder = "Pilih Lokasi"
                                            defaultValue={{ label: "Select Location", value: "-" }}
                                            onChange={this.HandleChangeLokasi}
                                            value = {
                                                this.state.location_data.find(op => {
                                                return op.value === this.state.location
                                                })
                                            }
                                            />
                                        {/* <div class="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                            {this.state.error.location}
                                        </div> */}
                                    </div>
                                </div>
                                {/* <div className="col-2">
                                    <div className="form-group">
                                        <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary">REFRESH DATA</button>
                                    </div>
                                </div> */}

                        </div>
                    </div>
                </div>

                <div className="row" style={{display:'none'}}>
                    <div className="col-12 box-margin">
                        <div className="card bg-boxshadow"  style={{height: '58px'}}>
                            <div className="card-body px-3 py-2">
                                {/* <div className="user-important-data-info d-sm-flex align-items-center justify-content-between"> */}
                                    <div className="row">
                                        <div className="col-2">
                                        <div className="form-group">
                                            {/* <label className="control-label font-12">Periode </label> */}
                                            <DateRangePicker
                                                ranges={range}
                                                alwaysShowCalendars={true}
                                                onEvent={this.handleEvent}
                                            >
                                                <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                                {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
                                            </DateRangePicker>
                                        </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                {/* <label className="control-label font-12">
                                                Lokasi
                                                </label> */}
                                                <Select 
                                                    options={this.state.location_data} 
                                                    placeholder = "Pilih Lokasi"
                                                    defaultValue={{ label: "Select Location", value: "-" }}
                                                    onChange={this.HandleChangeLokasi}
                                                    value = {
                                                        this.state.location_data.find(op => {
                                                        return op.value === this.state.location
                                                        })
                                                    }
                                                    />
                                                {/* <div className="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                                    {this.state.error.location}
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                {/* <label className="control-label font-12">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                </label> */}
                                                <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary">REFRESH DATA</button>
                                            </div>
                                        </div>
                                    </div>

                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom-0">GROSS SALES</div>
                            <div className="card-body">
                                <div className="row justify-content-between" style={{paddingLeft:12,paddingRight:12}}>
                                    <h2><i className="fa fa-area-chart text-primary"></i></h2>
                                    <h2 style={{paddingLeft:5}}>{this.state.grossSales}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom-0">NET SALES</div>
                            <div className="card-body">
                                <div className="row justify-content-between" style={{paddingLeft:12,paddingRight:12}}>
                                    <h2><i className="fa fa-bar-chart text-secondary"></i></h2>
                                    <h2 style={{paddingLeft:5}}>{this.state.netSales}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom-0">NUMBER OF TRANSACTION</div>
                            <div className="card-body">
                                <div className="row justify-content-between" style={{paddingLeft:12,paddingRight:12}}>
                                    <h2><i className="fa fa-line-chart text-success"></i></h2>
                                    <h2 style={{paddingLeft:5}}>{this.state.trxNum}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card">
                            <div className="card-header bg-transparent border-bottom-0">AVG. SALES PER TRANSACTION</div>
                            <div className="card-body">
                                <div className="row justify-content-between" style={{paddingLeft:12,paddingRight:12}}>
                                    <h2><i className="fa fa-pie-chart text-danger"></i></h2>
                                    <h2 style={{paddingLeft:5}}>{this.state.avgTrx}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 box-margin">
                        <div className="card text-center">
                            <div className="card-body">
                                <h4 className="card-title">MONTHLY SALES AMOUNT</h4>
                                <Chart
                                    options={this.state.lokasi_sales.options}
                                    series={this.state.lokasi_sales.series}
                                    type="bar"
                                    height="300"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 box-margin">
                        <div className="card text-center">
                            <div className="card-body">
                                <h4 className="card-title">MONTHLY TRANSACTIONS</h4>
                                <Chart
                                    options={this.state.lokasi_tr.options}
                                    series={this.state.lokasi_tr.series}
                                    type="bar"
                                    height="300"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 box-margin">
                        <div className="card">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="text-center">
                                        <div className="card-body">
                                            <h4 className="card-title">SALES THIS WEEK</h4>
                                            <Chart
                                                options={this.state.daily.options}
                                                series={this.state.daily.series}
                                                type="bar"
                                                height="300"
                                                />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="text-center">
                                        <div className="card-body">
                                            <h4 className="card-title">HOURLY GROSS SALES AMOUNT</h4>
                                            <Chart
                                                options={this.state.hourly.options}
                                                series={this.state.hourly.series}
                                                height="300"
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 box-margin">
                        <div className="card">
                            {/* <div className="card-body"> */}
                                <Tabs>
                                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                                    <h4 className="card-title mt-3">TOP 8 ITEMS</h4>
                                    <TabList>
                                        <Tab onClick={(e) =>this.handleSelect(e,1)} >Volume</Tab>
                                        <Tab onClick={(e) =>this.handleSelect(e,2)} >Sales</Tab>
                                    </TabList>
                                </div>
                                <div className="card-body">
                                    <TabPanel>
                                        {/* <div className="card-body"> */}
                                            <Chart
                                                options={this.state.top_item_qty.options}
                                                series={this.state.top_item_qty.series}
                                                type="bar"
                                                height="300"
                                                />
                                        {/* </div> */}
                                    </TabPanel>
                                    <TabPanel>
                                        <Chart
                                            options={this.state.top_item_sale.options}
                                            series={this.state.top_item_sale.series}
                                            type="bar"
                                            height="300"
                                            />
                                    </TabPanel>
                                </div>
                                </Tabs>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="col-md-6 box-margin">
                        <div className="card">
                                <Tabs>
                                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                                    <h4 className="card-title mt-3">TOP 8 CATEGORY</h4>
                                    <TabList>
                                        <Tab onClick={(e) =>this.handleSelect2(e,1)} >Volume</Tab>
                                        <Tab onClick={(e) =>this.handleSelect2(e,2)} >Sales</Tab>
                                    </TabList>
                                </div>
                                <div className="card-body">
                                    <TabPanel>
                                            <Chart
                                                options={this.state.top_cat_qty.options}
                                                series={this.state.top_cat_qty.series}
                                                type="bar"
                                                height="300"
                                                />
                                        {/* </div> */}
                                    </TabPanel>
                                    <TabPanel>
                                        <Chart
                                            options={this.state.top_cat_sale.options}
                                            series={this.state.top_cat_sale.series}
                                            type="bar"
                                            height="300"
                                            />
                                    </TabPanel>
                                </div>
                                </Tabs>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 box-margin">
                        <div className="card">
                            {/* <div className="card-body"> */}
                                <Tabs>
                                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                                    <h4 className="card-title mt-3">TOP 5 SUPPLIER</h4>
                                    <TabList>
                                        <Tab onClick={(e) =>this.handleSelect3(e,1)} >Volume</Tab>
                                        <Tab onClick={(e) =>this.handleSelect3(e,2)} >Sales</Tab>
                                    </TabList>
                                </div>
                                <div className="card-body">
                                    <TabPanel>
                                        <Chart
                                            options={this.state.top_sp_qty.options}
                                            series={this.state.top_sp_qty.series}
                                            type="bar"
                                            height="300"
                                            />
                                    </TabPanel>
                                    <TabPanel>
                                        <Chart
                                            options={this.state.top_sp_sale.options}
                                            series={this.state.top_sp_sale.series}
                                            type="bar"
                                            height="300"
                                            />
                                    </TabPanel>
                                </div>
                                </Tabs>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="col-md-6 box-margin">
                        <div className="card">
                                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                                    <h4 className="card-title mt-3">STOCK</h4>
                                </div>
                                <div className="card-body">
                                    <div className="widget-download-file d-flex align-items-center justify-content-between mb-4">
                                        <div className="d-flex align-items-center mr-3">
                                            <div className="download-file-icon mr-3">
                                                <img src="img/filemanager-img/1.png" alt=""></img>
                                            </div>
                                            <div className="user-text-table">
                                                <h6 className="d-inline-block font-15 mb-0">Bala - bala</h6>
                                                <p className="mb-0">20 siki</p>
                                            </div>
                                        </div>
                                        <a href="#" className="download-link badge badge-primary badge-pill">Stok aya keneh</a>
                                    </div>
                                    <div className="widget-download-file d-flex align-items-center justify-content-between mb-4">
                                        <div className="d-flex align-items-center mr-3">
                                            <div className="download-file-icon mr-3">
                                                <img src="img/filemanager-img/1.png" alt=""></img>
                                            </div>
                                            <div className="user-text-table">
                                                <h6 className="d-inline-block font-15 mb-0">Gehu</h6>
                                                <p className="mb-0">0 siki</p>
                                            </div>
                                        </div>
                                        <a href="#" className="download-link badge badge-danger badge-pill">Stok beak</a>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </Layout>
       
        );
    }
}
Dashboard.propTypes = {
    auth: PropTypes.object
}

const mapStateToProps = ({auth}) =>{
     return{
       auth: auth
     }
}
export default connect(mapStateToProps)(Dashboard);