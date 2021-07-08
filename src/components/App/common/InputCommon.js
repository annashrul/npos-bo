import React, { Component } from "react";
import { toCurrency } from "../../../helper";

class InputCommon extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.state = {
      any: "",
    };
  }

  getProps(props) {
    if (props.value) {
      this.setState({ any: props.value });
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

  handleCallback(res) {
    this.props.callback && this.props.callback(res);
  }

  handleCore(e, type) {
    let col = e.target.name;
    let val = e.target.value;
    this.setState({ [col]: val });
    this.handleCallback({ input: { name: col, value: val }, type: type });
  }

  handleChange(e) {
    this.handleCore(e, "onChange");
  }
  handleBlur(e) {
    this.handleCore(e, "onBlur");
  }
  handleFocus(e) {
    this.handleCore(e, "onFocus");
  }
  render() {
    const { type, disabled, className, isCurrency, ref } = this.props;
    const { any } = this.state;
    return (
      <input
        ref={(input) => (this[`${ref ? ref : "any"}`] = input)}
        type={type ? type : "text"}
        disabled={disabled ? disabled : false}
        className={`form-control ${isCurrency && "text-right"} ${className ? className : ""}`}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        name="any"
        value={isCurrency ? toCurrency(any) : any}
      />
    );
  }
}

export default InputCommon;
