import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
/**
 * callbackGet => void
 * callbackAdd => void
 */
class HeaderGeneralCommon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      any: "",
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
    this.props.callbackGet(this.state.any);
  }

  render() {
    return (
      <form onSubmit={this.handleSearch} noValidate>
        <div className="row mb-10">
          <div className="col-10 col-xs-10 col-md-3">
            <div className="input-group input-group-sm">
              <input
                type="search"
                name="any"
                className="form-control form-control-sm"
                placeholder="tulis sesuatu disini"
                value={this.state.any}
                onChange={(e) => {
                  if (e.target.value === "") {
                    this.setState({ any: "" });
                    this.props.callbackGet("");
                  } else {
                    this.setState({ any: e.target.value });
                  }
                }}
              />
              <span className="input-group-append">
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-search" />
                </button>
              </span>
            </div>
          </div>
          {this.props.callbackAdd !== undefined && (
            <div className="col-2 col-xs-2 col-md-9">
              <div className="form-group text-right">
                <button
                  style={{ height: "38px" }}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.callbackAdd();
                  }}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus" />
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(HeaderGeneralCommon);
