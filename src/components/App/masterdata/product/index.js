import React, { Component } from "react";
import Layout from "../../Layout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import connect from "react-redux/es/connect/connect";
import Preloader from "Preloader";
import { FetchProduct } from "redux/actions/masterdata/product/product.action";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import ListGroupProduct from "./src/master_group_product/list";
import ListPriceProduct from "./src/master_price_product/list";
import ListProduct from "./src/master_product/list";
import { Link } from "react-router-dom";
import moment from "moment";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      activeTab: 0,
      selectedIndex: 0,
      any: localStorage.getItem("any_product"),
      by: localStorage.getItem("by_product"),
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[10]["label"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  };
  componentWillMount() {
    this.props.dispatch(FetchProduct());
    this.props.dispatch(FetchPriceProduct("page=1"));
    this.props.dispatch(FetchGroupProduct("page=1"));
  }

  //Use arrow functions to avoid binding
  handleSelect = (index) => {
    this.setState({ selectedIndex: index }, () => {});
  };

  render() {
    return (
      <Layout page="Product">
        <Tabs>
          <div className="card-header d-flex align-items-center justify-content-between">
            <TabList>
              <Tab label="Core Courses" onClick={() => this.handleSelect(0)}>
                Barang
              </Tab>
              <Tab label="Core Courses" onClick={() => this.handleSelect(1)}>
                Harga Barang
              </Tab>
              <Tab label="Core Courses" onClick={() => this.handleSelect(2)}>
                Kelompok Barang
              </Tab>
            </TabList>
            <div className={`${this.state.selectedIndex !== 0 && "none"}`}>
              <Link to="upload" className="btn btn-outline-info">
                <i className="fa fa-upload"></i>&nbsp;IMPORT FROM CSV
              </Link>
            </div>
          </div>

          <div className="card-body">
            <TabPanel>
              <ListProduct
                token={this.state.token}
                data={this.props.product}
                group={this.props.groupProduct}
              />
            </TabPanel>
            <TabPanel>
              <ListPriceProduct
                token={this.state.token}
                data={this.props.priceProduct}
              />
            </TabPanel>
            <TabPanel>
              <ListGroupProduct
                token={this.state.token}
                data={this.props.groupProduct}
              />
            </TabPanel>
          </div>
        </Tabs>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.productReducer.data,
    priceProduct: state.priceProductReducer.data,
    groupProduct: state.groupProductReducer.data,
    isLoading: state.productReducer.isLoading,
    isLoading1: state.priceProductReducer.isLoading,
    isLoading2: state.groupProductReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Product);
