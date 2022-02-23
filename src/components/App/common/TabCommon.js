import React, { Component } from "react";
import Layout from "../Layout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { connect } from "react-redux";
import { getStorage, isEmptyOrUndefined, setStorage } from "../../../helper";
// import { getStorage, isEmptyOrUndefined, setStorage } from "../../../../helper";

class TabCommon extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      selectedIndex: 0,
    };
  }
  getProps(props) {
    // if (props.isActive) {
    //   this.setState({ selectedIndex: props.isActive });
    // }
  }
  componentWillReceiveProps(nextProps) {
    let active = getStorage(`${nextProps.path}-active`);
    // this.getProps(nextProps);
    // let active = getStorage(`${nextProps.path}-active`);
    // if (isEmptyOrUndefined(active)) {
    //   this.handleSelect(parseInt(active, 10));
    // }
  }
  componentWillMount() {
    this.getProps(this.props);
    let active = getStorage(`${this.props.path}-active`);
    if (isEmptyOrUndefined(active)) {
      this.handleSelect(parseInt(active, 10));
    }
  }

  componentDidMount() {
    this.getProps(this.props);
    let active = getStorage(`${this.props.path}-active`);
    if (isEmptyOrUndefined(active)) {
      this.handleSelect(parseInt(active, 10));
    }
  }

  handleSelect = (index) => {
    setStorage(`${this.props.path}-active`, index);
    if (this.props.callbackActive !== undefined) {
      this.props.callbackActive(index);
    }
    this.setState({ selectedIndex: index });
  };

  render() {
    return (
      <Layout page={this.props.path}>
        <Tabs selectedIndex={this.state.selectedIndex} onSelect={(selectedIndex) => this.handleSelect(selectedIndex)}>
          <div className="card-header d-flex align-items-center justify-content-between">
            <TabList>
              {this.props.tabHead.map((val, key) => {
                if(this.props.callbackPage!==undefined){
                    return <Tab key={key} onClick={()=>this.props.callbackPage(this.state.selectedIndex)}>{val}</Tab>;
                }else{
                    return <Tab key={key}>{val}</Tab>;
                }
              })}
            </TabList>
            {this.props.otherWidget !== undefined && this.props.otherWidget}
          </div>

          <div className="card-body">
            {this.props.tabHead.map((val, key) => {
              return <TabPanel key={key}>{this.props.tabBody[key]}</TabPanel>;
            })}
          </div>
        </Tabs>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(TabCommon);
