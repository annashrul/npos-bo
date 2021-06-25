import React, { Component } from "react";
import Select from "react-select";

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
    // jika kondisi edit
    if (props.dataEdit !== undefined) {
      let data = this.state.dataArray.filter(
        (item) => item.value === props.dataEdit
      );
      this.setState({ dataObject: data });
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
  onChange(value) {
    this.setState({ dataObject: value });
    this.props.callback(value);
  }

  render() {
    return (
      <div className="form-group">
        <label>
          Status{" "}
          <span className="text-danger">{this.props.isRequired && "*"}</span>
        </label>
        <Select
          autoFocus={true}
          options={this.state.dataArray}
          placeholder={`Pilih status`}
          onChange={(value, actionMeta) => this.onChange(value)}
          value={this.state.dataObject}
        />
      </div>
    );
  }
}

export default IsActiveCommon;