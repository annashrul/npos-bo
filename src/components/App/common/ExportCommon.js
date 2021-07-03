import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import imgExcel from "assets/xlsx.png";
import imgCsv from "assets/csv.png";
import imgPdf from "assets/pdf.png";

class ExportCommon extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
    this.state = {
      view: false,
    };
  }
  handleView = (e) => {
    e.preventDefault();
    this.setState({
      view: !this.state.view,
    });
  };
  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  /**
   * list props
   * @returns modalType
   * @returns callbackExcel
   * @returns callbackCsv
   */
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === this.props.modalType}
        size={this.state.view === false ? "md" : "xl"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard
      >
        <ModalHeader toggle={this.toggle}>Manage Export</ModalHeader>
        <ModalBody>
          <div className="row mb-4">
            {this.props.isPdf !== undefined && (
              <div className="col-6">
                <div className="single-gallery--item">
                  <div className="gallery-thumb">
                    <img src={imgPdf} alt=""></img>
                  </div>
                  <div className="gallery-text-area">
                    <div className="gallery-icon">
                      <button
                        type="button"
                        className="btn btn-circle btn-lg btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.callbackPdf();
                        }}
                      >
                        <i className="fa fa-print"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.props.isExcel !== undefined && (
              <div className="col-6">
                <div className="single-gallery--item">
                  <div className="gallery-thumb">
                    <img src={imgExcel} alt=""></img>
                  </div>
                  <div className="gallery-text-area">
                    <div className="gallery-icon">
                      <button
                        type="button"
                        className="btn btn-circle btn-lg btn-success"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.callbackExcel();
                        }}
                      >
                        <i className="fa fa-print"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.props.isCsv !== undefined && (
              <div className="col-6">
                <div className="single-gallery--item">
                  <div className="gallery-thumb">
                    <img src={imgCsv} alt=""></img>
                  </div>
                  <div className="gallery-text-area">
                    <div className="gallery-icon">
                      <button
                        type="button"
                        className="btn btn-circle btn-lg btn-success"
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.callbackCsv();
                        }}
                      >
                        <i className="fa fa-print"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
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
export default connect(mapStateToProps)(ExportCommon);
