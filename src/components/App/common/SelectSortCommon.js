import React, { Component } from "react";
import Select from "react-select";

/* ############# list props #############  */
/* isAll                        : boolean  */
/* callback                     : void     */

class SelectSortCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [
        { value: "desc", label: "Terbawah" },
        { value: "asc", label: "Teratas" },
      ],
      dataObject: "desc",
    };
    this.onChange = this.onChange.bind(this);
  }

  getProps(props) {
    if (props.dataEdit !== undefined) {
      if (props.dataEdit !== "") {
        const state = this.state.dataArray.filter((res) => res.value === props.dataEdit);
        this.setState({ dataObject: state[0] });
      } else {
        this.onChange(this.state.dataArray[0]);
      }
    }
  }
  // componentDidMount() {
  //   this.getProps(this.props);
  // }
  componentWillMount() {
    this.getProps(this.props);
  }
  // componentWillReceiveProps(nextProps) {
  //   this.getProps(nextProps);
  // }

  onChange(value) {
    this.setState({ dataObject: value });
    this.props.callback(value);
  }

  render() {
    return (
      <div className="form-group">
        <label>Urutan</label>
        <Select options={this.state.dataArray} placeholder={`Pilih`} onChange={(value, actionMeta) => this.onChange(value)} value={this.state.dataObject} />
      </div>
    );
  }
}

export default SelectSortCommon;
