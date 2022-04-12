import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { FetchProduct } from "redux/actions/masterdata/product/product.action";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import ListGroupProduct from "./src/master_group_product/list";
import ListPriceProduct from "./src/master_price_product/list";
import ListProduct from "./src/master_product/list";
import { Link } from "react-router-dom";
import { getStorage } from "../../../../helper";
import TabCommon from "../../common/TabCommon";
import { FetchRak } from "../../../../redux/actions/masterdata/rak/rak.action";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
  }

  handleActive(res) {
    if (res === 0) {
      this.handleService();
      this.props.dispatch(FetchRak("page=1&perpage=99999"));
    } else if (res === 1) {
      this.props.dispatch(FetchPriceProduct("page=1"));
    } else {
      this.props.dispatch(FetchGroupProduct("page=1"));
    }
  }

  handleService() {
    let getIsPeriodeBarang = getStorage("isPeriodeBarang");
    if (getIsPeriodeBarang === null || getIsPeriodeBarang === "null" || getIsPeriodeBarang === "true") {
      this.props.dispatch(FetchProduct());
    }
  }
  componentWillMount() {
    this.handleActive(0);
    // this.handleService();
    // this.props.dispatch(FetchPriceProduct("page=1"));

    // this.props.dispatch(FetchRak("page=1&perpage=99999"));
  }

  componentDidMount() {
    this.handleActive(0);
  }

  render() {
    return (
      <TabCommon
        path="barang"
        tabHead={["Barang", "Harga barang", "Kelompok barang"]}
        tabBody={[<ListProduct data={this.props.product} group={this.props.groupProduct} />, <ListPriceProduct data={this.props.priceProduct} />, <ListGroupProduct data={this.props.groupProduct} />]}
        otherWidget={
          <div className={`${!this.state.isShow && "none"}`}>
            <Link to="/upload" className="btn btn-outline-info">
              <i className="fa fa-upload"></i>&nbsp;IMPORT FROM CSV
            </Link>
          </div>
        }
        callbackActive={(res) => {
          this.handleActive(res);
          this.setState({ isShow: res === 0 });
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    product: state.productReducer.data,
    priceProduct: state.priceProductReducer.data,
    groupProduct: state.groupProductReducer.data,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Product);
