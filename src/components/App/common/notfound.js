import React, { Component } from 'react';
import BgAuth from "../../../assets/ic_logo.png"
// const mainStyle = {
//     height: '100%',
//     display: 'grid'
// };
// const childStyle={
//     margin: 'auto'
// }
export default class Footer extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            link: BgAuth
        }
    }
    componentWillMount() {
        document.title = `Page Not Found - N-POS`;
    }
    render() {
        return (
            <div className="error-page-area">
            {/* Error Content */}
            <div className="error-content text-center">
                {/* Error Thumb */}
                <div className="error-thumb">
                <img src={this.state.link} width="150px" alt="" />
                </div>
                <h2>Halaman ini tidak tersedia!</h2>
                <p>Silahkan kembali ke halaman awal untuk melanjutan.</p>
                <a className="btn btn-rounded btn-primary mt-30" href="/">Kembali ke dashboard</a>
            </div>
            </div>

        )
    }
};
