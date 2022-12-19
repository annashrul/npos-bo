import React, { Component } from "react";
// import SelectCommon from "../../../common/SelectCommon";
import {
  rmComma,
} from "../../../../../helper";

class FormUkuran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      dataUkuran: [{ id: Math.random(100000), nama: "" }],
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleAdd = this.handleAdd.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
  }
  componentWillMount() {
    console.log("componentWillMount.defaultValue", this.props.defaultValue);
  }
  componentDidMount() {
    console.log("componentDidMount.defaultValue", this.props.defaultValue);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.defaultValue !== undefined &&
      nextProps.defaultValue.length > 0 &&
      this.state.isAdd
    ) {
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
//   handleChange(e, i) {
//     const col = e.target.name;
//     let val = e.target.value;
//     if (i !== null) {
//         let data = this.state.data;
//         if (col === "variasi") {
//             val = rmComma(val);
//         }
//         data[i][col] = val;
//         this.setState({ data });
//     } else {
//         this.setState({ [col]: val });
//     }
// }

  handleChange(e, i) {
    let name = e.target.name;
    if (name === "ukuran"){
      let dataUkuran = this.state.dataUkuran;
    dataUkuran[i].nama = e.target.value;
    this.setState({ dataUkuran }, () => this.handlePropp());
    }
    
  }
  // handleAdd(e) {
  //   let dataUkuran = this.state.dataUkuran;
  //   dataUkuran.push(e);
  //   setTimeout(() => {
  //     this.setState({ dataUkuran }, () => this.handlePropp());
  //   }, 300);
  // }

  // handleDelete(e) {
  //   console.log(e);
  //   let dataUkuran = this.state.dataUkuran;
  //   const newDatas = dataUkuran.filter((res) => res.id !== e);
  //   setTimeout(() => {
  //     console.log(newDatas);
  //     this.setState({ dataUkuran: newDatas }, () => this.handlePropp());
  //   }, 300);
  // }

  handlePropp() {
    let newDatas = [];
    this.state.dataUkuran.map((res, i) => {
      newDatas.push(res.nama);
    });
    this.props.callback(newDatas);
  }

  render() {
    const { dataUkuran } = this.state;
    // const varian = [];
    return dataUkuran.map((res, i) => {
      return (
        <div key={i} className="row">
          <div className="col-md-12">
            <div class="input-group">
              <input
                placeholder="Variasi"
                type="text"
                className="form-control"
                value={res.nama}
                onChange={(e) => this.handleChange(e, i)}
                name="ukuran"
              />            
            </div>
          </div>
        </div>
      );
    });
  }
}

export default FormUkuran;
