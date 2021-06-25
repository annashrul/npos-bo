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
        { value: "desc", label: "DESCENDING" },
        { value: "asc", label: "ASCENDING" },
      ],
      dataObject: "",
    };
  }

  onChange(value) {
    this.setState({ dataObject: value });
    this.props.callback(value);
  }

  render() {
    return (
      <div className="form-group">
        <label>Sort</label>
        <Select
          options={this.state.dataArray}
          placeholder={`Pilih sort`}
          onChange={(value, actionMeta) => this.onChange(value)}
          value={this.state.dataObject}
        />
      </div>
    );
  }
}

export default SelectSortCommon;
