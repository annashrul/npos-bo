import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import moment from "moment";
import Select from 'react-select';
import {clearLogTrx} from "redux/actions/report/log/log.action";
import {clearLogAct} from "redux/actions/report/log/log_act.action";
import Swal from 'sweetalert2';

class LogAction extends Component{
    constructor(props){
        super(props);
        this.handleEvent = this.handleEvent.bind(this);
        this.HandleChangeLog = this.HandleChangeLog.bind(this);
        this.state = {
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            logging:"",
            logging_data:[],
        }
        this.options = [
            {value:"trx",label: "Log Transaction"},
            {value:"act",label: "Log Activity"},
        ];
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_logging_clear_report",`${awal}`);
        localStorage.setItem("date_to_logging_clear_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    }

    HandleChangeLog(fl) {
        this.setState({
            logging: fl.value,
        });
    }

    handleClear(e){
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear log!'
        }).then((result) => {
            if (result.value) {
                let dateFrom=localStorage.date_from_logging_clear_report;
                let dateTo=localStorage.date_to_logging_clear_report;
                let body = {}
                body['datefrom'] = dateFrom;
                body['dateto'] = dateTo;
                let param = this.state.logging;
                if(param === 'trx'){
                    this.props.dispatch(clearLogTrx(body));
                } else {
                    this.props.dispatch(clearLogAct(body));
                }
            }
        })

    }

    render(){
        return (
            <div>
                <div className="card-body">
                    <div className="bg-transparent">
                        <div className="row">
                            <div className="col-6 offset-3">
                                <div className="widgets-card-title">
                                    <h5 className="card-title mb-0">Clear Log</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-3">
                            <div className="form-group">
                                <label htmlFor="" className="control-label"> Log Periode </label>
                                <DateRangePicker
                                    style={{display:'unset'}}
                                    ranges={rangeDate}
                                    alwaysShowCalendars={true}
                                    onEvent={this.handleEvent}
                                >
                                    <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',fontWeight:'bolder'}}/>
                                </DateRangePicker>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-12">
                                    Log You Want to Clear
                                </label>
                                <Select
                                    options={this.options}
                                    // placeholder="Pilih Tipe Kas"
                                    onChange={this.HandleChangeLog}
                                    value={this.options.filter(({value}) => value === this.state.logging)}
                                />
                            </div>
                            <button className="btn btn-primary btn-block" onClick={(e)=>this.handleClear(e)}>CLEAR</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.siteReducer.isLoading,
    }
}
export default connect(mapStateToProps) (LogAction);