import React, { Component } from 'react'

export default class Counter extends Component {
    render() {
        return (
            <div>
                {/* Dashboard Counts Section*/}
                <section className="dashboard-counts no-padding-bottom">
                    <div className="container-fluid">
                        <div className="row bg-white has-shadow">
                            {/* Item */}
                            <div className="col-xl-4 col-sm-6">
                                <div className="item d-flex align-items-center">
                                <div className="icon bg-violet"><i className="icon-user" /></div>
                                <div className="title"><span>Member</span>
                                    <div className="progress">
                                    <div role="progressbar" style={{width: '100%', height: '4px'}} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} className="progress-bar bg-violet" />
                                    </div>
                                </div>
                                <div className="number"><strong>{this.props.member}</strong></div>
                                </div>
                            </div>
                            {/* Item */}
                            <div className="col-xl-4 col-sm-6">
                                <div className="item d-flex align-items-center">
                                <div className="icon bg-red"><i className="icon-padnote" /></div>
                                <div className="title"><span>Vendor</span>
                                    <div className="progress">
                                    <div role="progressbar" style={{width: '100%', height: '4px'}} aria-valuenow={70} aria-valuemin={0} aria-valuemax={100} className="progress-bar bg-red" />
                                    </div>
                                </div>
                                <div className="number"><strong>{this.props.product}</strong></div>
                                </div>
                            </div>
                            {/* Item */}
                            <div className="col-xl-4 col-sm-6">
                                <div className="item d-flex align-items-center">
                                <div className="icon bg-green"><i className="icon-bill" /></div>
                                <div className="title"><span>Booking</span>
                                    <div className="progress">
                                    <div role="progressbar" style={{width: '100%', height: '4px'}} aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} className="progress-bar bg-green" />
                                    </div>
                                </div>
                                <div className="number"><strong>{this.props.booking}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        )
    }
}
