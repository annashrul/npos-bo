import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody } from "reactstrap";
import { to_pdf } from "helper";
import imgExcel from "assets/xls.png";
import imgPdf from "assets/pdf.png";
import moment from "moment";
import XLSX from "xlsx";
import Select from "react-select";
import { FetchBrgAll, setProductbrgAll } from "../../../../../redux/actions/masterdata/product/product.action";
import Spinner from "../../../../../Spinner";
// import MyProgressbar from '../../../../../myProgressbar';
import { RESET_PROPS_ARR } from "../../../../../redux/actions/_constants";
import MyPdfL from "../../../../../myPdfL";
import { pdf } from "@react-pdf/renderer";
import LokasiCommon from "../../../common/LokasiCommon";

// kategori 1 = Dijual, kategori 0 = TIdak Dijual
// jenis 0 = Karton, jenis 1 = Satuan, jenis 2 = Paket, jenis 3 = Servis, jenis 4 = Bahan
class FormProductExport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
    this.printDocument = this.printDocument.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      title: "",
      jenis: "",
      type: "",
      view: false,
      pdfToo: false,
      location_data: [],
      location: "",
      location_lbl: "",
      error: {
        title: "",
        jenis: "",
        type: "",
      },
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }
  };
  componentDidUpdate(prevState) {
    if (prevState.resBarangAll.length !== this.props.resBarangAll.length) {
      this.printDocumentXLsx(null, "xlsx");
    }
  }

  handleCb = (e, param) => {
    // e.preventDefault();
    this.setState({ [param]: !this.state[param] });
  };
  handleSelect(lk) {
    this.setState({
      location: lk.value,
      location_lbl: lk.label,
    });
    this.props.dispatch(setProductbrgAll(RESET_PROPS_ARR));
    this.props.dispatch(FetchBrgAll(encodeURIComponent(lk.value)));
  }

  handleView = (e) => {
    e.preventDefault();
    this.setState({
      view: !this.state.view,
    });
  };
  toggle = (e) => {
    // e.preventDefault();
    // const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(false));
    this.props.dispatch(setProductbrgAll(RESET_PROPS_ARR));
  };
  printDocument = (e) => {
    e.preventDefault();
    let stringHtml = "";
    stringHtml +=
      '<div style="text-align:center>' +
      // '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
      '<h3 align="center"><center>&nbsp;</center></h3>' +
      '<h3 style="text-align:center"><center>LAPORAN OMSET PENJUALAN</center></h3>' +
      "</div>";

    const headers = [
      [
        "No",
        "Kode Barang",
        "Nama Barang",
        // "Barcode",
        "Variasi",
        "Satuan",
        "Lokasi",
        "Harga Beli",
        "Harga",
        // "Harga 2",
        // "Harga 3",
        // "Harga 4",
        // "PPN",
        // "Service",
        // "TAG",
        // "Rak",
        "Kel. Barang",
        // "Kategori",
        // "Sub-Dept",
        "Supplier",
        // "Deskripsi Item",
        "Tanggal Input",
        "Tanggal Update",
      ],
    ];
    let data =
      typeof this.props.resBarangAll === "object"
        ? this.props.resBarangAll.map((v, i) => [
            i + 1,
            v.kd_brg,
            v.nm_brg,
            v.ukuran,
            v.satuan,
            v.nama_toko,
            v.hrg_beli,
            v.harga,
            // v.harga2,
            // v.harga3,
            // v.harga4,
            // v.ppn,
            // v.service,
            // v.tag,
            // v.rak,
            v.kel_brg,
            // parseInt(v.kategori, 10) === 0
            //   ? "Kartonan"
            //   : parseInt(v.kategori, 10) === 1
            //   ? "Satuan"
            //   : parseInt(v.kategori, 10) === 2
            //   ? "Paket"
            //   : parseInt(v.kategori, 10) === 3
            //   ? "Servis"
            //   : parseInt(v.kategori, 10) === 4
            //   ? "Bahan"
            //   : "Tidak diketahui!",
            // v.subdept,
            v.supplier,
            // v.deskripsi,
            v.tgl_input,
            v.tgl_update,
          ])
        : "";
    // data +=["TOTAL","","","","","","","","",tprice];
    to_pdf(
      "sale_omset_",
      stringHtml,
      headers,
      data
      // footer
    );
    this.toggle(e);
  };
  printDocumentXLsx = (e, param) => {
    // e.preventDefault();

    let header = [
      ["SEMUA DATA BARANG"],
      // ['PERIODE : ' + this.props.startDate + ' - ' + this.props.endDate + ''],
      ["LOKASI : " + this.state.location_lbl],
      [
        "No",
        "Kode Barang",
        "Nama Barang",
        // "Barcode",
        "Variasi",
        "Satuan",
        "Lokasi",
        "Harga Beli",
        "Harga",
        // "Harga 2",
        // "Harga 3",
        // "Harga 4",
        // "PPN",
        // "Service",
        // "TAG",
        // "Rak",
        "Kel. Barang",
        // "Kategori",
        // "Sub-Dept",
        "Supplier",
        // "Deskripsi Item",
        "Tanggal Input",
        "Tanggal Update",
      ],
    ];
    let raw =
      this.props.resBarangAll !== undefined && typeof this.props.resBarangAll === "object"
        ? this.props.resBarangAll.map((v, i) => [
            i + 1,
            v.kd_brg,
            v.nm_brg,
            v.ukuran,
            v.satuan,
            v.nama_toko,
            v.hrg_beli,
            v.harga,
            // v.harga2,
            // v.harga3,
            // v.harga4,
            // v.ppn,
            // v.service,
            // v.tag,
            // v.rak,
            v.kel_brg,
            // parseInt(v.kategori, 10) === 0
            //   ? "Kartonan"
            //   : parseInt(v.kategori, 10) === 1
            //   ? "Satuan"
            //   : parseInt(v.kategori, 10) === 2
            //   ? "Paket"
            //   : parseInt(v.kategori, 10) === 3
            //   ? "Servis"
            //   : parseInt(v.kategori, 10) === 4
            //   ? "Bahan"
            //   : "Tidak diketahui!",
            // v.subdept,
            v.supplier,
            // v.deskripsi,
            v.tgl_input,
            v.tgl_update,
          ])
        : "";

    if (this.props.resBarangAll.length > 0) {
      let body = header.concat(raw);

      let data = body;
      let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
      let exportFileName = `Semua_Data_Barang_${this.state.location_lbl}_${moment(new Date()).format("YYYYMMDDHHMMss")}.${param === "csv" ? `csv` : `xlsx`}`;
      XLSX.writeFile(wb, exportFileName, { type: "file", bookType: param === "csv" ? "csv" : "xlsx" });

      this.toggle(e);
      // if (this.state.pdfToo) {
      //     this.printDocumentPdf()
      // }
    }
  };
  printDocumentPdf = () => {
    let header = [
      [
        "No",
        "Kode Barang",
        "Nama Barang",
        // "Barcode",
        "Variasi",
        "Satuan",
        "Lokasi",
        "Harga Beli",
        "Harga",
        // "Harga 2",
        // "Harga 3",
        // "Harga 4",
        // "PPN",
        // "Service",
        // "TAG",
        // "Rak",
        "Kel. Barang",
        // "Kategori",
        // "Sub-Dept",
        "Supplier",
        // "Deskripsi Item",
        "Tanggal Input",
        "Tanggal Update",
      ],
    ];
    let raw =
      typeof this.props.resBarangAll === "object"
        ? this.props.resBarangAll.map((v, i) => [
            i + 1,
            v.kd_brg,
            v.nm_brg,
            v.ukuran,
            v.satuan,
            v.nama_toko,
            v.hrg_beli,
            v.harga,
            // v.harga2,
            // v.harga3,
            // v.harga4,
            // v.ppn,
            // v.service,
            // v.tag,
            // v.rak,
            v.kel_brg,
            // parseInt(v.kategori, 10) === 0
            //   ? "Kartonan"
            //   : parseInt(v.kategori, 10) === 1
            //   ? "Satuan"
            //   : parseInt(v.kategori, 10) === 2
            //   ? "Paket"
            //   : parseInt(v.kategori, 10) === 3
            //   ? "Servis"
            //   : parseInt(v.kategori, 10) === 4
            //   ? "Bahan"
            //   : "Tidak diketahui!",
            // v.subdept,
            v.supplier,
            // v.deskripsi,
            v.tgl_input,
            v.tgl_update,
          ])
        : "";

    if (this.props.resBarangAll.length > 0) {
      let body = header.concat(raw);

      const blob = pdf(<MyPdfL title={["Data Barang per Halaman", `${this.state.startDate} sampai ${this.state.endDate}`]} result={body} />).toBlob();

      console.log("asdasdasd", blob);
      // window.location.href = blob;
      blob.then(function (myBlob) {
        console.log("asdasdasd", myBlob);
        // do something with myBlob
      });
    }
  };
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formProductExcel"}
        size={this.state.view === false ? "md" : "xl"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard
      >
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <button type="button" className="close">
              <span className="text-dark" aria-hidden="true" onClick={(e) => this.toggle(e)}>
                ×
              </span>
              <span className="sr-only">Close</span>
            </button>
            <h3 className="text-center">Manage Export</h3>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <LokasiCommon callback={(res) => this.handleSelect(res)} dataEdit={this.state.location} />
                  {/* <label className="control-label font-12">Pilih Lokasi</label>
                  <Select
                    // menuPortalTarget={document.body}
                    // menuPosition={'fixed'}
                    styles={{
                      // Fixes the overlapping problem of the component
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                    options={this.state.location_data}
                    // placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeLokasi}
                    value={this.state.location_data.find((op) => {
                      return op.value === this.state.location;
                    })}
                  /> */}
                </div>
                <div class="new-checkbox d-none">
                  <p>Export Juga Untuk PDF</p>
                  <label class="switch">
                    <input
                      type="checkbox"
                      checked={this.state.pdfToo}
                      onChange={(e) => {
                        this.handleCb(e, "pdfToo");
                      }}
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            {this.props.isLoadingBrgAll ? (
              <div>
                <Spinner />
                <br />
                {/* <MyProgressbar myprogressbarLabel={`Sedang memuat data ${this.props.persenDl}%`} myprogressbarPersen={this.props.persenDl+'%'}/> */}
              </div>
            ) : (
              ""
            )}
            {this.props.resBarangAll.length > 0 ? (
              <div className="row mb-4">
                <div className="col-6 d-none">
                  <div className="single-gallery--item">
                    <div className="gallery-thumb">
                      <img src={imgPdf} alt=""></img>
                    </div>
                    <div className="gallery-text-area">
                      <div className="gallery-icon">
                        <button type="button" className="btn btn-circle btn-lg btn-danger" onClick={(e) => this.printDocument(e)}>
                          <i className="fa fa-print"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 offset-3">
                  <div className="single-gallery--item">
                    <div className="gallery-thumb">
                      <img src={imgExcel} alt=""></img>
                    </div>
                    <div className="gallery-text-area">
                      <div className="gallery-icon">
                        <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e) => this.printDocumentXLsx(e, "xlsx")}>
                          <i className="fa fa-print"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </ModalBody>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resBarangAll: state.productReducer.pagin_brg,
    isLoadingBrgAll: state.productReducer.isLoadingBrg,
    persenDl: state.productReducer.persenDl,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(FormProductExport);
