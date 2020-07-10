// import React, { Component } from 'react'
// import {Line} from 'react-chartjs-2';
// import moment from 'moment'
// export default class Dashboard extends Component {
//     render() {
//         const data = {
//             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "November","December"],
//             datasets: [
//                     {
//                         label: 'Meeting',
//                         fill: false,
//                         lineTension: 0.1,
//                         backgroundColor: 'rgba(75,192,192,0.4)',
//                         borderColor: 'rgba(75,192,192,1)',
//                         borderCapStyle: 'butt',
//                         borderDash: [],
//                         borderDashOffset: 0.0,
//                         borderJoinStyle: 'miter',
//                         pointBorderColor: 'rgba(75,192,192,1)',
//                         pointBackgroundColor: '#fff',
//                         pointBorderWidth: 1,
//                         pointHoverRadius: 5,
//                         pointHoverBackgroundColor: 'rgba(75,192,192,1)',
//                         pointHoverBorderColor: 'rgba(220,220,220,1)',
//                         pointHoverBorderWidth: 2,
//                         pointRadius: 1,
//                         pointHitRadius: 10,
//                         data: this.props.meeting !== undefined? JSON.parse(this.props.meeting):[]
//                     },
//                     {
//                         label: 'Event',
//                         fill: false,
//                         lineTension: 0.1,
//                         backgroundColor: 'rgba(156,39,176,0.4)',
//                         borderColor: 'rgba(156,39,176,1)',
//                         borderCapStyle: 'butt',
//                         borderDash: [],
//                         borderDashOffset: 0.0,
//                         borderJoinStyle: 'miter',
//                         pointBorderColor: 'rgba(156,39,176,1)',
//                         pointBackgroundColor: '#fff',
//                         pointBorderWidth: 1,
//                         pointHoverRadius: 5,
//                         pointHoverBackgroundColor: 'rgba(156,39,176,1)',
//                         pointHoverBorderColor: 'rgba(220,220,220,1)',
//                         pointHoverBorderWidth: 2,
//                         pointRadius: 1,
//                         pointHitRadius: 10,
//                         data: this.props.event !== undefined ? JSON.parse(this.props.event) : []
//                     }
//                 ]
//             };
//         return (
//             <div>
//                 {/* Dashboard Header Section    */}
//                 <section className="dashboard-header">
//                     <div className="container-fluid">
//                         <div className="row">
//                             {/* Line Chart            */}
//                             <div className="chart col-lg-8 col-12">
//                                 <div className="line-chart bg-white d-flex align-items-center justify-content-center has-shadow">
//                                     <Line data={data} />
//                                 </div>
//                             </div>
//                             <div className="chart col-lg-4 col-12">
//                                     <div className="articles card">
//                                         <div className="card-close">
//                                             <div className="dropdown">
//                                                 <button type="button" id="closeCard4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="dropdown-toggle"><i className="fa fa-ellipsis-v" /></button>
//                                                 <div aria-labelledby="closeCard4" className="dropdown-menu dropdown-menu-right has-shadow"><a href="" className="dropdown-item remove"> <i className="fa fa-times" />Close</a><a href="" className="dropdown-item edit"> <i className="fa fa-gear" />Edit</a></div>
//                                             </div>
//                                         </div>
//                                         <div className="card-header d-flex align-items-center">
//                                             <h2 className="h3">Booking </h2>
//                                             <div className="badge badge-rounded bg-green">{this.props.newest} New</div>
//                                         </div>
//                                         <div className="card-body no-padding">
//                                         {
//                                             this.props.book.map(function(item,i){
//                                                 return(
//                                                     <div className="item d-flex align-items-center">
//                                                         <div className="text"><a href="">
//                                                             <h3 className="h5">{item.booking_code}</h3></a><small>Created at {moment(item.created_at).format("ddd, D MMM Y")}. </small>
//                                                         </div>
//                                                     </div>
//                                                 )
//                                             })
//                                         }
//                                         </div>
//                                     </div>
//
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//
//             </div>
//         )
//     }
// }
