import React, { Component } from "react";
import Layout from "../../Layout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import connect from "react-redux/es/connect/connect";
import { FetchProduct } from "redux/actions/masterdata/product/product.action";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import ListGroupProduct from "./src/master_group_product/list";
import ListPriceProduct from "./src/master_price_product/list";
import ListProduct from "./src/master_product/list";
import { Link } from "react-router-dom";
import { getStorage, isEmptyOrUndefined, setStorage } from "../../../../helper";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
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
  handleService() {
    let getIsPeriodeBarang = getStorage("isPeriodeBarang");
    if (getIsPeriodeBarang === "null" || getIsPeriodeBarang === "true") {
      this.props.dispatch(FetchProduct());
    }
  }
  componentWillMount() {
    // let getIsPeriodeBarang = getStorage("isPeriodeBarang");
    this.handleService();
    this.props.dispatch(FetchPriceProduct("page=1"));
    this.props.dispatch(FetchGroupProduct("page=1"));
  }

  componentDidMount() {
    this.handleService();
    let index = getStorage("activeTabProduct");
    if (isEmptyOrUndefined(index)) {
      this.setState({ selectedIndex: parseInt(index, 10) });
    }
  }
  handleSelect = (index) => {
    setStorage("activeTabProduct", `${index}`);
    this.setState({ selectedIndex: index });
  };

  render() {
    console.log("this.props.product", this.props.product);
    return (
      <Layout page="Product">
        <Tabs
          style={{ zoom: "90%" }}
          selectedIndex={this.state.selectedIndex}
          onSelect={(selectedIndex) => this.handleSelect(selectedIndex)}
        >
          <div className="card-header d-flex align-items-center justify-content-between">
            <TabList>
              <Tab>Barang</Tab>
              <Tab>Harga Barang</Tab>
              <Tab>Kelompok Barang</Tab>
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
                data={this.props.product}
                group={this.props.groupProduct}
              />
            </TabPanel>
            <TabPanel>
              <ListPriceProduct data={this.props.priceProduct} />
            </TabPanel>
            <TabPanel>
              <ListGroupProduct data={this.props.groupProduct} />
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
