import React, { Component } from "react";
import { toDate } from "../../../helper";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import StickyBox from "react-sticky-box";
import SelectCommon from "./SelectCommon";
import moment from "moment";

class TransaksiWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tgl_order: moment(new Date()).format("yyyy-MM-DD"),
      catatan: "-",
      toggleSide: false,
      nota: "",
      search: "",
      searchby: { value: "deskripsi", label: "Nama Barang" },
      perpage: 5,
      isScroll: false,
      isAdd: true,
      scrollPage: 0,
      searchby_data: [
        { value: "kd_brg", label: "Kode barang" },
        { value: "ukuran", label: "Variasi" },
        { value: "deskripsi", label: "Nama Barang" },
      ],
    };
    this.HandleCommonInputChange = this.HandleCommonInputChange.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }

  getProps(props) {
    if (props.nota !== undefined) {
      this.setState({ nota: props.nota });
    }
  }

  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== undefined) {
      if (nextProps.isLoading) {
        this.setState({
          isScroll: nextProps.isLoading,
          scrollPage: nextProps.data.length,
          perpage: (this.state.perpage += 5),
        });
      }
    }
    this.getProps(nextProps);
  }

  HandleCommonInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.callbackInput({ name: e.target.name, value: e.target.value });
  }
  handleClickToggle(e) {
    e.preventDefault();
    this.setState({ toggleSide: !this.state.toggleSide });
    this.props.callbackToggle(this.state.toggleSide);
  }
  HandleSearch(state, res) {
    if (state === "searchby") {
      this.setState({ searchby: res, isScroll: false });
      this.props.callbackFetch({ label: state, value: res.value });
    } else if (state === "loadmore") {
      this.setState({ isScroll: true });
      this.props.callbackFetch({
        label: state,
        value: (this.state.perpage += 5),
      });
    } else {
      res.preventDefault();
      this.props.callbackFetch({ label: state, value: this.state.search });
    }
  }
  handleScroll() {
    let id = `item${this.state.scrollPage - 1}`;
    let divToScrollTo = document.getElementById(id);
    if (divToScrollTo) {
      divToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }

  render() {
    if (this.state.isScroll || this.props.isLoading) this.handleScroll();
    const {
      tgl_order,
      catatan,
      toggleSide,
      searchby,
      searchby_data,
      search,
      nota,
    } = this.state;
    const { pathName, data, renderRow, callbackAdd } = this.props;
    return (
      <Layout page={pathName}>
        <div className="card">
          <div className="card-header  d-flex justify-content-between">
            <h4 style={{ float: "left" }}>
              <button
                onClick={this.handleClickToggle}
                className={
                  toggleSide
                    ? "btn btn-danger mr-3"
                    : "btn btn-outline-dark text-dark mr-3"
                }
              >
                <i className={toggleSide ? "fa fa-remove" : "fa fa-bars"} />
              </button>
              {pathName} #{nota}
            </h4>
            <h4
              className="text-right   d-flex justify-content-between"
              style={{ width: "50%" }}
            >
              <input
                type="date"
                name="tgl_order"
                className={"form-control  nbt nbr nbl bt"}
                value={tgl_order}
                onChange={(e) => this.HandleCommonInputChange(e)}
              />
              <input
                placeholder="Tambahkan catatan disini ...."
                type="text"
                style={{ height: "39px" }}
                className="form-control nbt nbr nbl bt"
                value={catatan}
                onChange={(e) => this.HandleCommonInputChange(e)}
                name="catatan"
              />
            </h4>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <StickyBox
              offsetTop={100}
              offsetBottom={20}
              style={
                toggleSide
                  ? { display: "none", width: "30%", marginRight: "10px" }
                  : { display: "block", width: "30%", marginRight: "10px" }
              }
            >
              <div className="card">
                <div className="card-body">
                  <SelectCommon
                    label={`Cari berdasarkan ${searchby.label.toLowerCase()}`}
                    options={searchby_data}
                    callback={(res) => {
                      this.HandleSearch("searchby", res);
                      console.log("search by", res);
                    }}
                    dataEdit={searchby.value}
                  />
                  <div className="form-group">
                    <div className="input-group input-group-sm">
                      <input
                        autoFocus={true}
                        type="search"
                        name="search"
                        className="form-control form-control-sm"
                        placeholder={`Tulis sesuatu disini ...`}
                        value={search}
                        onChange={(e) => this.HandleCommonInputChange(e)}
                        onKeyPress={(event) => {
                          if (event.key === "Enter")
                            this.HandleSearch("search", event);
                        }}
                      />
                      <span className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={(event) =>
                            this.HandleSearch("search", event)
                          }
                        >
                          <i className="fa fa-search" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div
                    className="people-list"
                    style={{
                      scrollBehavior: "smooth",
                      overflowY: "scroll",
                      height: "300px",
                      maxHeight: "100%",
                    }}
                  >
                    <div id="chat_user_2">
                      <ul className="chat-list list-unstyled">
                        {data.length !== 0 ? (
                          data.map((i, inx) => {
                            return (
                              <li
                                id={`item${inx}`}
                                className="clearfix"
                                key={inx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    isScroll: false,
                                  });
                                  callbackAdd(i);
                                }}
                              >
                                <div className="about">
                                  <div className="status titles">
                                    {i.nm_brg}
                                  </div>
                                  <div className="status titles">
                                    ({i.ukuran})
                                  </div>
                                </div>
                              </li>
                            );
                          })
                        ) : (
                          <div className="text-center middle">
                            Data tidak tersedia
                          </div>
                        )}
                      </ul>
                    </div>
                  </div>
                  <hr />
                  <div className="form-group">
                    <button
                      className={`btn btn-primary ${
                        this.props.isLoading ? "disabled" : ""
                      }`}
                      style={{ width: "100%" }}
                      onClick={(e) => {
                        this.setState({ isAdd: false });
                        !this.props.isLoading &&
                          this.HandleSearch("loadmore", "");
                      }}
                    >
                      {this.props.isLoading
                        ? "loading"
                        : "Tampilkan lebih banyak"}
                    </button>
                  </div>
                </div>
              </div>
            </StickyBox>
            {renderRow}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  isOpen: state.modalReducer,
  auth: state.auth,
  isLoading: state.productReducer.isLoadingTrx,
});

export default connect(mapStateToPropsCreateItem)(TransaksiWrapper);
