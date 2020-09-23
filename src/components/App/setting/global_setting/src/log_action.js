import React, { Component } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import moment from "moment";
// import * as Swal from "sweetalert2";
// import {deleteFiles, FetchTables} from "redux/actions/site.action";
// import {ModalToggle, ModalType} from "redux/actions/modal.action";

class LogAction extends Component{
    constructor(props){
        super(props);
        this.handleEvent = this.handleEvent.bind(this);
        this.state = {
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
        }
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_log_clear_report",`${awal}`);
        localStorage.setItem("date_to_log_clear_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };

    // toggle(e){
    //     e.preventDefault();
    //     const bool = !this.props.isOpen;
    //     this.props.dispatch(ModalToggle(bool));
    //     this.props.dispatch(ModalType("formBackup"));
    //     this.props.dispatch(FetchTables());
    // };

    // handleDelete(e,i){
    //     e.preventDefault();
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.value) {
    //             let body = {}
    //             body['path'] = i;
    //             this.props.dispatch(deleteFiles(body,i));
    //         }
    //     })

    // }

    render(){
        return (
            <div>
                <div className="card-body">
                    <div className="bg-transparent d-flex align-items-center justify-content-between mb-20">
                        <div className="widgets-card-title">
                            <h5 className="card-title mb-0">Clear Log</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="" className="control-label"> Periode Log Activity </label>
                                <DateRangePicker
                                    style={{display:'unset'}}
                                    ranges={rangeDate}
                                    alwaysShowCalendars={true}
                                    onEvent={this.handleEvent}
                                >
                                    <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',fontWeight:'bolder'}}/>
                                </DateRangePicker>
                            </div>
                            <br/>
                            <button className="btn btn-primary btn-lg btn-block">CLEAR</button>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-primary btn-lg btn-block">CLEAR</button>
                        </div>
                    </div>
                    {/* <FormBackup/> */}
                </div>
            </div>
        );
    }
}

export default (LogAction);