import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Layout from '../Layout';
import Chart from "react-apexcharts";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.handleSelect3 = this.handleSelect3.bind(this);

        this.state = {
            grossSales:"123,456,789",
            netSales:"123,456,789",
            trxNum:"123,456,789",
            avgTrx:"123,456,789",
            // chart1
            options: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: ["TOKO KOPO","TOKO GARUT","TOKO RANCAEKEK","HO"]
              }
            },
            series: [
              {
                name: "Bulan Lalu",
                data: [30,34,67,89,54]
              },
              {
                name: "Bulan Sekarang",
                data: [20,64,37,69,94]
              }
            ],
            // chart2
            options2: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: ["TOKO KOPO","TOKO GARUT","TOKO RANCAEKEK","HO"]
              }
            },
            series2: [
              {
                name: "Bulan Lalu",
                data: [70,54,27,69,94]
              },
              {
                name: "Bulan Sekarang",
                data: [80,74,37,59,34]
              }
            ],
            // chart3
            options3: {
              chart: {
                id: "basic-bar"
              },
              xaxis: {
                categories: ["Monday","Thuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
              },
              colors:['#F44336', '#E91E63', '#9C27B0','#F44336', '#E91E63', '#9C27B0', '#9C27B0'],
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
            series3: [
              {
                // name: "Bulan Lalu",
                data: [15000,13000,27000,69000,94000,45000,12000]
              }
            ],
            // chart4
            options4: {
                chart: {
                    type: 'area'
                },
                xaxis: {
                    categories: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
            },
            series4: [
              {
                // name: "Bulan Lalu",
                data: [0,0,0,0,0,0,0,0,0,70,54,27,69,94,0,0,0,0,0,0,0,0,0,0]
              }
            ],
            // chart5a
            options5a: {
                colors:['#F44336', '#E91E63', '#9C27B0','#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                  'United States', 'China', 'Germany'],
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
            series5a: [
              {
                // name: "Bulan Lalu",
                data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
              }
            ],
            // chart5b
            options5b: {
                colors:['#F44336', '#E91E63', '#9C27B0','#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                  'United States', 'China', 'Germany'],
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
            series5b: [
              {
                // name: "Bulan Lalu",
                data: [700, 330, 548, 170, 840, 280, 590, 7100, 4200, 9380]
              }
            ],
            // chart6a
            options6a: {
                colors:['#F44336', '#E91E63', '#9C27B0','#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                  'United States', 'China', 'Germany'],
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
            series6a: [
              {
                // name: "Bulan Lalu",
                data: [700, 330, 548, 170, 840, 280, 590, 7100, 4200, 9380]
              }
            ],
            // chart6b
            options6b: {
                colors:['#F44336', '#E91E63', '#9C27B0','#F44336', '#E91E63', '#9C27B0', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                  'United States', 'China', 'Germany'],
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
            series6b: [
              {
                // name: "Bulan Lalu",
                data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
              }
            ],
            // chart7a
            options7a: {
                colors:['#E91E63', '#9C27B0', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy'],
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
            series7a: [
              {
                // name: "Bulan Lalu",
                data: [280, 590, 7100, 4200, 9380]
              }
            ],
            // chart7b
            options7b: {
                colors:['#F44336', '#E91E63', '#9C27B0', '#9C27B0','#F44336'],
                xaxis: {
                    categories: ['France', 'Japan', 'United States', 'China', 'Germany'],
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
            series7b: [
              {
                // name: "Bulan Lalu",
                data: [400, 430, 448, 470, 540]
              }
            ],
          };
    }

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


    render() {
        const {isAuthenticated, user} = this.props.auth;

        return (
            <Layout page="Dashboard">

                <div className="row">
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card text-white bg-primary">
                            <div className="card-header border-bottom-0">GROSS SALES</div>
                            <div className="card-body">
                                <h2 className="text-white float-right">{this.state.grossSales}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card text-white bg-secondary">
                            <div className="card-header border-bottom-0">NET SALES</div>
                            <div className="card-body">
                                <h2 className="text-white float-right">{this.state.netSales}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card text-white bg-success">
                            <div className="card-header border-bottom-0">NUMBER OF TRANSACTION</div>
                            <div className="card-body">
                                <h2 className="text-white float-right">{this.state.trxNum}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3 box-margin">
                        <div className="card text-white bg-danger">
                            <div className="card-header border-bottom-0">AVG. SALES PER TRANSACTION</div>
                            <div className="card-body">
                                <h2 className="text-white float-right">{this.state.avgTrx}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-4 box-margin">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title">Special title treatment</h4>
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 box-margin">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title">MONTHLY SALES AMOUNT</h4>
                                <Chart
                                    options={this.state.options}
                                    series={this.state.series}
                                    type="bar"
                                    height="300"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12 box-margin">
                        <div class="card text-center">
                            <div class="card-body">
                                <h4 class="card-title">MONTHLY TRANSACTIONS</h4>
                                <Chart
                                    options={this.state.options2}
                                    series={this.state.series2}
                                    type="bar"
                                    height="300"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12 box-margin">
                        <div className="card">
                            <div className="row">
                                <div class="col-md-4">
                                    <div class="text-center">
                                        <div class="card-body">
                                            <h4 class="card-title">SALES THIS WEEK</h4>
                                            <Chart
                                                options={this.state.options3}
                                                series={this.state.series3}
                                                type="bar"
                                                height="300"
                                                />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="text-center">
                                        <div class="card-body">
                                            <h4 class="card-title">HOURLY GROSS SALES AMOUNT</h4>
                                            <Chart
                                                options={this.state.options4}
                                                series={this.state.series4}
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
                    <div class="col-md-12 box-margin">
                        <div className="card">
                            <div className="row">
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <Tabs>
                                            <TabList>
                                                <Tab onClick={(e) =>this.handleSelect(e,1)} >Volume</Tab>
                                                <Tab onClick={(e) =>this.handleSelect(e,2)} >Sales</Tab>
                                            </TabList>
                                            <TabPanel>
                                                {/* <div class="card-body"> */}
                                                    <h4 class="card-title">TOP 8 ITEMS VOLUME</h4>
                                                    <Chart
                                                        options={this.state.options5a}
                                                        series={this.state.series5a}
                                                        type="bar"
                                                        height="300"
                                                        />
                                                {/* </div> */}
                                            </TabPanel>
                                            <TabPanel>
                                                <h4 class="card-title">TOP 8 ITEMS SALES</h4>
                                                <Chart
                                                    options={this.state.options5b}
                                                    series={this.state.series5b}
                                                    type="bar"
                                                    height="300"
                                                    />
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <Tabs>
                                            <TabList>
                                                <Tab onClick={(e) =>this.handleSelect2(e,1)} >Volume</Tab>
                                                <Tab onClick={(e) =>this.handleSelect2(e,2)} >Sales</Tab>
                                            </TabList>
                                            <TabPanel>
                                                {/* <div class="card-body"> */}
                                                    <h4 class="card-title">TOP 8 ITEMS VOLUME</h4>
                                                    <Chart
                                                        options={this.state.options6a}
                                                        series={this.state.series6a}
                                                        type="bar"
                                                        height="300"
                                                        />
                                                {/* </div> */}
                                            </TabPanel>
                                            <TabPanel>
                                                <h4 class="card-title">TOP 8 ITEMS SALES</h4>
                                                <Chart
                                                    options={this.state.options6b}
                                                    series={this.state.series6b}
                                                    type="bar"
                                                    height="300"
                                                    />
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-md-12 box-margin">
                        <div className="card">
                            <div className="row">
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <h4 class="card-title">TOP 5 SUPPLIER VOLUME</h4>
                                        <Chart
                                            options={this.state.options7a}
                                            series={this.state.series7a}
                                            type="bar"
                                            height="300"
                                            />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <h4 class="card-title">TOP 5 SUPPLIER SALES</h4>
                                        <Chart
                                            options={this.state.options7b}
                                            series={this.state.series7b}
                                            type="bar"
                                            height="300"
                                            />
                                    </div>
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