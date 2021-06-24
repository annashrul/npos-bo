import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";

/* ############# list props #############  */
/* isAll                        : boolean  */
/* callback                     : void     */

class LokasiCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      dataObject: "",
      isChecked:false,
    };
    this.toggleChange = this.toggleChange.bind(this)
  }

  getProps(props) {
    let state = {};
    if (props.auth.user) {
      let arrLokasi = [];
      if (props.isAll !== undefined && props.isAll) {
        arrLokasi.push({ value: "", label: "Semua lokasi" });
      }
      let propsLokasi = props.auth.user.lokasi;
      if (propsLokasi !== undefined) {
        propsLokasi.map((i) => {
          arrLokasi.push({
            value: i.kode,
            label: i.nama,
          });
        });

        if(propsLokasi.length===1){
          Object.assign(state, { dataObject: arrLokasi[0] });
          localStorage.setItem("location_tr",arrLokasi[0].value)

        }
      }
      Object.assign(state, { dataArray: arrLokasi });
    }
    

    // jika kondisi edit
    if (props.dataEdit !== undefined || props.dataEdit !== "") {
     
      if (props.isMulti && props.dataEdit.length > 0) {
        Object.assign(state, { dataObject: props.dataEdit,isChecked:true })
      }
      else {
        if (props.dataEdit === "-") {
        Object.assign(state, { dataObject: "" });
        } else {
          const stateLokasi = this.state.dataArray.filter(
            (item) => item.value === props.dataEdit
          );
          if (stateLokasi[0] !== undefined) {
            Object.assign(state, { dataObject: stateLokasi[0] });
          }
        }
      }
      
    }
    this.setState(state);
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
  onChange(value) {
    this.setState({ dataObject: value });
    this.props.callback(value);
  }
  toggleChange(e) {
    let state = {isChecked:e.target.checked};
    if (e.target.checked) {
      this.onChange(this.state.dataArray)
    } else {
      this.onChange("")
    }
    this.setState(state);
    

    
  }

  render() {
    return (
      this.props.isMulti === undefined ? (
        <div className="form-group">
        <label
          style={{
            display:
              this.props.isRequired || this.props.isLable === undefined
                ? "block"
                : "none",
          }}
        >
          Lokasi{" "}
          <span className="text-danger">{this.props.isRequired && "*"}</span>
        </label>
        <Select
          options={this.state.dataArray}
          placeholder={`Pilih lokasi`}
          onChange={(value, actionMeta) => this.onChange(value)}
          value={this.state.dataObject}
        />
      </div>
      ) : <div className="form-group">
          <label htmlFor="inputState" className="col-form-label">Lokasi&nbsp;<input type="checkbox" name="checked_lokasi" checked={this.state.isChecked} onChange={this.toggleChange}/> Pilih Semua </label>
           <Select
            isMulti={true}
            options={this.state.dataArray}
            placeholder={`Pilih lokasi`}
            onChange={(value, actionMeta) => this.onChange(value)}
            value={this.state.dataObject}
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(LokasiCommon);
