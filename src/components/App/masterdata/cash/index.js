import React, { Component } from "react";
import Layout from "../../Layout";
import ListCash from "./src/list";
import connect from "react-redux/es/connect/connect";
import {
    deleteCash,
    FetchCash,
} from "redux/actions/masterdata/cash/cash.action";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

class Cash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "masuk",
            where: "",
            any: "",
            page: 1,
        };
        this.handlePagin = this.handlePagin.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if (access !== undefined && access !== null) {
                if (nextProps.auth.user.access[16]["label"] === "0") {
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
        this.handleGet(this.state.any, this.state.page, this.state.type);
    }

    handlePagin(param) {
        let type = this.state.type;
        let any = this.state.any;
        this.setState({ page: param });
        this.handleGet(any, param, type);
    }

    handleDelete(id) {
        let detail = {
            where: this.state.where,
            total: this.props.cash.total,
            type: this.state.type,
        };
        this.props.dispatch(deleteCash(id, detail));
    }
    handleSelect(index) {
        let type = index === 0 ? "masuk" : "keluar";
        this.setState({ type: type });
        this.handleGet(this.state.any, 1, type);
    }
    handleSearch(res) {
        this.setState({ any: res });
        this.handleGet(res, 1, this.state.type);
    }

    handleGet(any, page, type) {
        let url = `page=${page}&type=${type}`;
        if (any !== "") url += `&q=${any}`;
        this.setState({ where: url });
        this.props.dispatch(FetchCash(url));
    }

    render() {
        return (
            <Layout page="Customer">
              <div className="col-12 box-margin">
                <Tabs>
                  <TabList>
                    <Tab onClick={() => this.handleSelect(0)}>Kas masuk</Tab>
                    <Tab onClick={() => this.handleSelect(1)}>Kas keluar</Tab>
                  </TabList>
                  <TabPanel>
                    <ListCash
                        data={this.props.cash}
                        pagin={(res) => this.handlePagin(res)}
                        delete={(res) => this.handleDelete(res)}
                        search={(res) => this.handleSearch(res)}
                        type={this.state.type}
                        where={this.state.where}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ListCash
                        data={this.props.cash}
                        pagin={(res) => this.handlePagin(res)}
                        delete={(res) => this.handleDelete(res)}
                        search={(res) => this.handleSearch(res)}
                        type={this.state.type}
                        where={this.state.where}
                    />
                  </TabPanel>
                </Tabs>
              </div>
            </Layout>
            // <Layout page="Cash">
            // <ListCash
            //   pagin={this.handlePagin}
            //   data={this.props.cash}
            //   type={this.state.type}
            //   deletes={this.handleDelete}
            // />
            // </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.auth,
        cash: state.cashReducer.data,
        currentPage: state.cashReducer.currentPage,
        per_page: state.cashReducer.per_page,
        total: state.cashReducer.total,
        auth: state.auth,
    };
};

export default connect(mapStateToProps)(Cash);
