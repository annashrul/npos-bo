import React, { Component } from 'react';
import moment from 'moment'
export default class Clock extends Component {
      constructor(props) {
        super(props);
        this.state = {
          time: moment(new Date())
        };
      }
      componentDidMount() {
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
      }
      componentWillUnmount() {
        clearInterval(this.intervalID);
      }
      tick() {
        this.setState({
          time: moment(new Date())
        });
      }
      render() {
        return (
            <ul className="d-flex align-items-center justify-content-end">
                <li id="hours">{this.state.time.format("HH")}</li>
                <li>:</li>
                <li id="min">{this.state.time.format("mm")}</li>
                <li>:</li>
                <li id="sec">{this.state.time.format("ss")}</li>
            </ul>
        );
      }
    }