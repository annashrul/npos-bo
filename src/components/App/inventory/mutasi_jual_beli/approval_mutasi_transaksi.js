import React,{Component} from 'react'
import Layout from "../../Layout";

class ApprovalMutasiTransaksi extends Component{
    constructor(props) {
        super(props);

    }
    render(){
        return (
            <Layout page="Approval Mutasi Transaksi">
                <div className="card">
                    <div className="card-header"><h4>Approval Mutasi Jual Beli</h4></div>
                    <div className="card-body"></div>
                </div>
            </Layout>
        );
    }

}

export default ApprovalMutasiTransaksi;