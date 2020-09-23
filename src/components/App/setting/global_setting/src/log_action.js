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
        this.handleEventTrx = this.handleEventTrx.bind(this);
        this.handleEventAct = this.handleEventAct.bind(this);
        this.state = {
            startDateTrx:moment(new Date()).format("yyyy-MM-DD"),
            endDateTrx:moment(new Date()).format("yyyy-MM-DD"),
            startDateAct:moment(new Date()).format("yyyy-MM-DD"),
            endDateAct:moment(new Date()).format("yyyy-MM-DD"),
        }
    }
    handleEventTrx = (event, picker) => {
        const awal = picker.startDateTrx.toISOString().substring(0,10);
        const akhir = picker.endDateTrx.toISOString().substring(0,10);
        this.setState({
            startDateTrx:awal,
            endDateTrx:akhir
        });
    };
    handleEventAct = (event, picker) => {
        const awal = picker.startDateAct.toISOString().substring(0,10);
        const akhir = picker.endDateAct.toISOString().substring(0,10);
        this.setState({
            startDateAct:awal,
            endDateAct:akhir
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
                                <label htmlFor="" className="control-label"> Periode Log Transaction </label>
                                <DateRangePicker
                                    style={{display:'unset'}}
                                    ranges={rangeDate}
                                    alwaysShowCalendars={true}
                                    onEvent={this.handleEventTrx}
                                >
                                    <input type="text" className="form-control" value={`${this.state.startDateTrx} to ${this.state.endDateTrx}`} style={{padding: '10px',fontWeight:'bolder', fontSize:'x-large', textAlignLast:'center'}}/>
                                </DateRangePicker>
                            </div>
                            <button className="btn btn-primary btn-block">CLEAR</button>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="" className="control-label"> Periode Log Activity </label>
                                <DateRangePicker
                                    style={{display:'unset'}}
                                    ranges={rangeDate}
                                    alwaysShowCalendars={true}
                                    onEvent={this.handleEventAct}
                                >
                                    <input type="text" className="form-control" value={`${this.state.startDateAct} to ${this.state.endDateAct}`} style={{padding: '10px',fontWeight:'bolder', fontSize:'x-large', textAlignLast:'center'}}/>
                                </DateRangePicker>
                            </div>
                            <button className="btn btn-primary btn-block">CLEAR</button>
                        </div>
                    </div>
                    {/* <FormBackup/> */}
                </div>
            </div>
        );
    }
}

export default (LogAction);