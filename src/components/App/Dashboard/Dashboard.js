import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Layout from '../Layout';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }


    render() {
        const {isAuthenticated, user} = this.props.auth;

        return (
            <Layout page="Dashboard">
                <div className="row">
                    <div className="col-6 col-md-6">
                     
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