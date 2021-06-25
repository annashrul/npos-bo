import React, { Component } from "react";
import Select from "react-select";
import { handleDataSelect } from "../../../helper";

/* ############# list props #############  */
/* isAll                        : boolean  */
/* callback                     : void     */

class IsActiveCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [
        { value: "1", label: "Aktif" },
        { value: "0", label: "Tidak aktif" },
      ],
      dataObject: "",
    };
  }

  getProps(props) {
    let datas = handleDataSelect(this.state.dataArray, "value", "label");
    // jika kondisi edit
    if (props.dataEdit !== undefined) {
      let data = datas.filter((item) => item.value === props.dataEdit);
      this.setState({ dataObject: data });
    }
    // if (props.dataEdit !== undefined) {
    //   let data = this.state.dataArray.filter(
    //     (item) => item.value === props.dataEdit
    //   );
    //   this.setState({ dataObject: data });
    // }
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

  render() {
    return (
      <div className="form-group">
        <label>
          {this.props.label === undefined ? "Status" : this.props.label}{" "}
          <span className="text-danger">{this.props.isRequired && "*"}</span>
        </label>
        <Select
          options={this.state.dataArray}
          placeholder={`Pilih ${
            this.props.label === undefined ? "Status" : this.props.label
          }`}
          onChange={(value, actionMeta) => this.onChange(value)}
          value={this.state.dataObject}
        />
      </div>
    );
  }
}

export default IsActiveCommon;
