import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { createGroupProduct, updateGroupProduct, FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import FileBase64 from "react-file-base64";
import { isEmptyOrUndefined, setFocus, stringifyFormData } from "../../../../../helper";
import SelectCommon from "../../../common/SelectCommon";

const kel_brg = "kel_brg";
const nm_kel_brg = "nm_kel_brg";
const status = "status";
const group2 = "group2";
const gambar = "gambar";

class FormGroupProduct extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.state = {
      [kel_brg]: "",
      [nm_kel_brg]: "",
      [status]: "",
      [group2]: "",
      [gambar]: "",
      group2_data: [],
      status_data: [
        { value: "0", label: "Tidak aktif" },
        { value: "1", label: "Aktif" },
      ],
    };
  }
  getProps(param) {
    let detail = param.detail;
    let stateGroup = [];
    let propsGroup = param.group2;
    let nama = "";
    let status = "";
    let group2 = "";
    let gambar = "-";

    if (propsGroup.data !== undefined) {
      if (typeof propsGroup.data === "object") {
        propsGroup.data.map((v, i) =>
          stateGroup.push({
            value: v.kode,
            label: v.nama,
          })
        );
      }
    }

    if (detail !== undefined && Object.keys(this.props.detail).length > 0 && detail[nm_kel_brg] !== "") {
      nama = detail.nm_kel_brg;
      status = detail.status;
      group2 = detail.group2;
      gambar = detail.gambar;
    } else {
      this.clearForm();
    }
    this.setState({
      group2_data: stateGroup,
      nm_kel_brg: nama,
      status: status,
      group2: group2,
      gambar: gambar,
    });
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  toggle(e) {
    e.preventDefault();
    if (this.props.fastAdd === undefined) {
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
    }
    if (this.props.fastAdd === true) {
      this.props.dispatch(ModalType("formProduct"));
      this.props.dispatch(FetchGroupProduct("page=1&perpage=1000"));
    }
  }

  clearForm() {
    this.setState({
      [kel_brg]: "",
      [nm_kel_brg]: "",
      [status]: "",
      [group2]: "",
      [gambar]: "",
      group2_data: [],
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nm_kel_brg"] = this.state["nm_kel_brg"];
    parseData["status"] = this.state.status;
    parseData["group2"] = this.state.group2;
    parseData["gambar"] = this.state.gambar;

    if (parseData["gambar"] === undefined || parseData["gambar"] === "-") {
      parseData["gambar"] = "-";
    } else {
      parseData["gambar"] = parseData["gambar"].base64;
    }

    if (!isEmptyOrUndefined(parseData["nm_kel_brg"], "nama kelompok barang")) {
      setFocus(this, "nm_kel_brg");
      return;
    }
    if (!isEmptyOrUndefined(parseData["group2"], "sub departemen")) {
      return;
    }
    if (!isEmptyOrUndefined(parseData["status"], "status")) {
      return;
    }

    if (this.props.detail !== undefined && Object.keys(this.props.detail).length > 0 && this.props.detail[nm_kel_brg] !== "") {
      this.props.dispatch(updateGroupProduct(this.props.detail.kel_brg, parseData, this.props.detail.where));
    } else {
      this.props.dispatch(createGroupProduct(parseData, this.props.fastAdd !== undefined));
    }

    if (this.props.fastAdd === undefined) {
      this.props.dispatch(ModalToggle(false));
    }
    if (this.props.fastAdd === true) {
      this.props.dispatch(ModalType("formProduct"));
    }
    this.clearForm();
  }
  handleChangeImage(files) {
    this.setState({
      gambar: files,
    });
  }
  render() {
    console.log("this.props.detail", this.props.detail);
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formGroupProduct"} size="md">
        <ModalHeader toggle={this.toggle}>{this.props.detail ? (this.props.detail.kel_brg === undefined ? "Tambah kelompok barang" : "Ubah kelompok barang") : "Tambah kelompok barang"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>
                Nama <span className="text-danger">*</span>
              </label>
              <input
                ref={(input) => (this["nm_kel_brg"] = input)}
                placeholder="Masukan nama kelompok barang"
                type="text"
                className="form-control"
                name={"nm_kel_brg"}
                value={this.state.nm_kel_brg}
                onChange={this.handleChange}
              />
            </div>
            <SelectCommon
              label="Sub departemen"
              options={this.state.group2_data}
              callback={(res) => {
                this.setState({ group2: res.value });
              }}
              isRequired={true}
              dataEdit={this.state.group2}
            />
            <SelectCommon
              label="Status"
              options={this.state.status_data}
              callback={(res) => {
                this.setState({ status: res.value });
              }}
              isRequired={true}
              dataEdit={this.state.status}
            />

            <div className="form-group">
              <label htmlFor="inputState" className="col-form-label">
                Foto {this.props.detail !== undefined && this.props.detail.kel_brg !== "" ? <small className="text-right text-danger">kosongkan apabila tidak akan diubah</small> : ""}
              </label>
              <br />
              <FileBase64 multiple={false} className="mr-3 form-control-file" onDone={this.handleChangeImage} />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Batal
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="ti-save" /> Simpan
              </button>
            </div>
          </ModalFooter>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormGroupProduct);
