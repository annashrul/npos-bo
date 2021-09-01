import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";

class CompareLocationCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt: "",
    };
  }

  getProps(props) {
    // console.log("lokasi", props.lokasi);
    if (props.auth.user) {
      let lokasi = props.auth.user.lokasi;
      if (lokasi !== undefined) {
        const check = lokasi.filter((res) => props.lokasi === res.kode);
        if (check[0] !== undefined) {
          this.setState({ txt: check[0].nama });
        }
      }
    }
  }

  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  render() {
    return this.state.txt;
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    // lokasi: state.locationReducer.allData,
  };
};

export default connect(mapStateToProps)(CompareLocationCommon);
