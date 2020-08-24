import React, { Component } from 'react';

const mainStyle = {
    height: '100%',
    display: 'grid'
};
const childStyle={
    margin: 'auto'
}
export default class Footer extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            link: atob(document.getElementById("hellyeah").value)+"images/logo.png"
        }
    }
    componentWillMount() {
        document.title = `Page Not Found - ${atob(document.getElementById("coolyeah").value)}`;
    }
    render() {
        return (
            <div className="error-page-area">
            {/* Error Content */}
            <div className="error-content text-center">
                {/* Error Thumb */}
                <div className="error-thumb">
                <img src={this.state.link} alt="" />
                </div>
                <h2>Opps! This page Could Not Be Found!</h2>
                <p>Sorry bit the page you are looking for does not exist, have been removed or name changed</p>
                <a className="btn btn-rounded btn-primary mt-30" href="/">Back To Home</a>
            </div>
            </div>

        )
    }
};
