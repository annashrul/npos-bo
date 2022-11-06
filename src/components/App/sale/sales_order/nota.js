import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";

import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import MyDocument from "./nota";
import { ModalToggle } from "../../../../redux/actions/modal.action";
import moment from "moment";
import TempNota from "./temp_nota";
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
});
class DownloadNotaPdfSo extends Component {
  render() {
    console.log("master", this.props.master);
    console.log("detail", this.props.detail);
    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "downloadNotaPdfSo"}
          size="md"
        >
          <ModalHeader
            toggle={(e) => {
              this.props.dispatch(ModalToggle(false));
              this.props.callbackDownload();
            }}
          >
            Transaksi berhasil dilakukan
          </ModalHeader>

          <ModalBody>
            <p>
              Silahkan download nota sales order dengan mengklik tombol dibawah
            </p>
            <PDFViewer style={{ width: "100%", height: "400px" }}>
              <TempNota master={this.props.master} detail={this.props.detail} />
            </PDFViewer>
            <PDFDownloadLink
              document={
                <TempNota
                  master={this.props.master}
                  detail={this.props.detail}
                />
              }
              fileName={`SO${moment().format("YYYYMMDDhhmmss")}.pdf`}
            >
              {({ blob, url, loading, error }) => {
                console.log("loading", loading);
                return (
                  <p
                    onClick={(e) => {
                      setTimeout(() => {
                        this.props.dispatch(ModalToggle(false));
                        this.props.callbackDownload();
                      }, 500);
                    }}
                  >
                    Download nota
                  </p>
                );
              }}
            </PDFDownloadLink>
          </ModalBody>
        </WrapperModal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DownloadNotaPdfSo);

// export default withRouter(connect(mapStateToProps)(DownloadNotaPdf));

// export default DownloadNotaPdf;
