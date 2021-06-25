import React, { Component } from "react";
import Select from "react-select";

/**
 * props
 * label      : string    (required)
 * callback   : void    (required)
 * options    : array   (required)
 * isRequired : boolean (optional)
 */

class SelectCommon extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: "",
      value_data: [],
      label: "",
    };
  }

  getProps(props) {
    let propsGroup = props.options;
    let state = { value_data: propsGroup, label: props.label };

    if (props.dataEdit !== undefined || props.dataEdit !== "") {
      if (props.dataEdit === "-") {
        Object.assign(state, { value: "" });
      } else {
        const check = propsGroup.filter((val) => val.value === props.dataEdit);
        if (check[0] !== undefined) {
          Object.assign(state, { value: check[0] });
        }
      }
    }
    this.setState(state);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  onChange(value) {
    this.setState({ value: value });
    this.props.callback(value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          style={{
            display:
              !this.props.isLabel && this.props.isLabel !== undefined
                ? "none"
                : "block",
          }}
        >
          {this.state.label}{" "}
          <span className="text-danger">{this.props.isRequired && "*"}</span>
        </label>
        <Select
          // autoFocus={true}
          options={this.state.value_data}
          placeholder={`Pilih ${this.state.label}`}
          onChange={(value, actionMeta) => this.onChange(value)}
          value={this.state.value}
        />
      </div>
    );
  }
}

export default SelectCommon;
