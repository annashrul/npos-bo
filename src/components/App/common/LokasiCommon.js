import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";

/* ############# list props #############  */
/* isAll                        : boolean  */
/* callback                     : void     */

class LokasiCommon extends Component {
  constructor(props) {
    super(props);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.state = {
      location_data: [],
      location: "",
    };
  }

  getProps(props) {
    if (props.auth.user) {
      let lk = [];
      if (this.props.isAll !== undefined && this.props.isAll) {
        lk.push({ value: "", label: "Semua lokasi" });
      }
      let loc = props.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }

    // jika kondisi edit
    if (props.dataEdit !== undefined) {
      if (props.dataEdit.value !== undefined) {
        let data = this.state.location_data.filter(
          (item) => item.value === props.dataEdit.value
        );
        this.setState({ location: data });
      }
    }
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  HandleChangeLokasi(val) {
    this.setState({
      location: val,
    });
    this.props.callback(val);
  }

  render() {
    return (
      <Select
        options={this.state.location_data}
        placeholder="Pilih Lokasi"
        onChange={this.HandleChangeLokasi}
        value={this.state.location}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(LokasiCommon);
