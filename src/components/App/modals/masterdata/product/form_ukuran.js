import React, { Component } from "react";
import SelectCommon from "../../../common/SelectCommon";

class FormUkuran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      dataUkuran: [{ id: Math.random(100000), nama: "S" }],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentWillMount() {
    console.log("componentWillMount.defaultValue", this.props.defaultValue);
  }
  componentDidMount() {
    console.log("componentDidMount.defaultValue", this.props.defaultValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== undefined && this.state.isAdd) {
      this.setState({ dataUkuran: nextProps.defaultValue }, () => {
        this.setState({ isAdd: false });
      });
      console.log("nextProps.defaultValue", nextProps.defaultValue);
    }
  }

  componentDidUpdate(prevProps) {
    console.group("componentDidUpdate");
    console.log("prevProps", prevProps.defaultValue);
    console.log("this.props", this.props.defaultValue);
    console.groupEnd();
  }

  handleChange(e, i) {
    let dataUkuran = this.state.dataUkuran;
    dataUkuran[i].nama = e.target.value;
    setTimeout(() => {
      this.setState({ dataUkuran }, () => this.handlePropp());
    }, 300);
  }
  handleAdd(e) {
    let dataUkuran = this.state.dataUkuran;
    dataUkuran.push(e);
    setTimeout(() => {
      this.setState({ dataUkuran }, () => this.handlePropp());
    }, 300);
  }

  handleDelete(e) {
    console.log(e);
    let dataUkuran = this.state.dataUkuran;
    const newDatas = dataUkuran.filter((res) => res.id !== e);
    setTimeout(() => {
      console.log(newDatas);
      this.setState({ dataUkuran: newDatas }, () => this.handlePropp());
    }, 300);
  }

  handlePropp() {
    let newDatas = [];
    this.state.dataUkuran.map((res, i) => {
      newDatas.push(res.nama);
    });
    this.props.callback(newDatas);
  }

  render() {
    const { dataUkuran } = this.state;
    const varian = ["S", "M", "L", "XL"];
    return dataUkuran.map((res, i) => {
      return (
        <div key={i} className="row">
          <div className="col-md-12">
            <label>Ukuran ke-{i + 1}</label>
            <div class="input-group mb-3">
              <select
                onChange={(e) => this.handleChange(e, i)}
                className="form-control"
                name={`ukuran_${res.id}`}
              >
                {varian.map((row, x) => {
                  return (
                    <option value={row} selected={row === res.nama}>
                      {row}
                    </option>
                  );
                })}
              </select>
              {dataUkuran.length - 1 === i ? (
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleAdd({ id: Math.random(100000), nama: "S" });
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
              ) : (
                <div className="input-group-append">
                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleDelete(res.id);
                    }}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>
              )}
            </div>

            {/* <div className="form-group">
              <label>ukuran</label>
              <input
                type="text"
                name={`ukuran_${res.key}`}
                className="form-control"
              />
            </div> */}
          </div>
        </div>
      );
    });
  }
}

export default FormUkuran;
