import React, { Component } from "react";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import "./print.css";
import { withRouter } from "react-router-dom";
import html2pdf from "fw-simple-html2pdf";

class Print3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.goBack = this.goBack.bind(this);
  }
  componentWillMount() {
    document.title = `Print 3ply`;
  }

  goBack() {
    this.props.history.goBack();
    setTimeout(function () {
      //             this.setState({ render : !this.state.render })
      window.location.reload();
    }, 500);
  }

  print() {
    document.getElementById("non-printable").style.display = "none";
    window.print();
    document.getElementById("non-printable").style.display = "flex";
  }

  toPdf(e) {
    e.preventDefault();
    html2pdf(
      document.getElementById("print_3ply"),
      {
        filename: "file.pdf", // default 'file.pdf'
        margin: 40, // default 40, page margin
        save: true, // default true: Save as file
        output: "", // default '', jsPDF output type
        smart: true, // default true: Smartly adjust content width
      },
      (output) => {
        console.log("finish!", output);
      }
    );
  }
  render() {
    return (
      <div>
        <PrintProvider>
          <NoPrint>
            <div id="non-printable">
              <div className="block-left">
                <button
                  className="btn btn-blank"
                  onClick={() => {
                    window.location.href='http://morph-apparel.ptnetindo.com/'
                  }}
                >
                  ← Back
                </button>
                {/* <button
                  className="btn btn-primary"
                  onClick={() => {
                    this.props("feby");
                  }}
                >
                  
                  Home
                </button> */}
              </div>
              <div className="block-right">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    this.print();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="#fff" viewBox="0 0 485.212 485.212">
                    <path d="M151.636 363.906h151.618v30.33H151.636zm-30.324-333.58h242.595v60.65h30.32v-60.65C394.23 13.596 380.667 0 363.907 0H121.313c-16.748 0-30.327 13.595-30.327 30.327v60.65h30.327v-60.65zm30.324 272.93h181.94v30.328h-181.94z" />
                    <path d="M454.882 121.304H30.334c-16.748 0-30.327 13.59-30.327 30.324v181.956c0 16.76 13.58 30.32 30.327 30.32h60.65v90.98c0 16.765 13.58 30.327 30.328 30.327h242.595c16.76 0 30.32-13.56 30.32-30.323v-90.98h60.654c16.76 0 30.325-13.562 30.325-30.32v-181.96c0-16.732-13.56-30.323-30.32-30.323zm-90.975 333.582H121.312V272.93h242.595v181.956zm60.644-242.604c-16.76 0-30.32-13.564-30.32-30.327 0-16.73 13.56-30.327 30.32-30.327 16.768 0 30.334 13.595 30.334 30.327 0 16.762-13.567 30.327-30.33 30.327z" />
                  </svg>{" "}
                  Print
                </button>
                {/* <button className="btn btn-info ml-3" onClick={()=>print('pdf_3ply', 'print_3ply')}> PDF</button> */}
                <button className="btn btn-info ml-3" onClick={(e) => this.toPdf(e)}>
                  <object
                    aria-label=""
                    style={{ width: "13px", filter: "invert(1)" }}
                    type="image/svg+xml"
                    data="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTEyNy43NDEgMjA5aC0zMS43NDFjLTMuOTg2IDAtNy44MDkgMS41ODctMTAuNjI0IDQuNDFzLTQuMzg5IDYuNjUxLTQuMzc2IDEwLjYzOGwuMjIxIDExMy45NDVjMCA4LjI4NCA2LjcxNiAxNSAxNSAxNXMxNS02LjcxNiAxNS0xNXYtMzQuNTk3YzYuMTMzLS4wMzEgMTIuNjg1LS4wNTggMTYuNTItLjA1OCAyNi4zNTYgMCA0Ny43OTktMjEuMTYgNDcuNzk5LTQ3LjE2OXMtMjEuNDQzLTQ3LjE2OS00Ny43OTktNDcuMTY5em0wIDY0LjMzOGMtMy44NjkgMC0xMC40NDUuMDI3LTE2LjYwMi4wNTktLjAzMi02LjM4Ni0uMDYtMTMuMjYzLS4wNi0xNy4yMjggMC0zLjM5My0uMDE3LTEwLjQ5NC0uMDM1LTE3LjE2OWgxNi42OTZjOS42NDggMCAxNy43OTkgNy44NjIgMTcuNzk5IDE3LjE2OXMtOC4xNSAxNy4xNjktMTcuNzk4IDE3LjE2OXoiLz48cGF0aCBkPSJtMjU1LjMzIDIwOWgtMzEuMzNjLTMuOTgzIDAtNy44MDMgMS41ODQtMTAuNjE3IDQuNDAzcy00LjM5MSA2LjY0Mi00LjM4MyAxMC42MjVjMCAuMDAxLjIyMyAxMTAuMjQ2LjIyNCAxMTAuNjQ2LjAxNSAzLjk3OSAxLjYwOSA3Ljc4OSA0LjQzMyAxMC41OTIgMi44MTEgMi43OSA2LjYwOSA0LjM1NCAxMC41NjcgNC4zNTRoLjA1N2MuOTQ3LS4wMDQgMjMuMjk0LS4wODkgMzIuMjI4LS4yNDUgMzMuODk0LS41OTIgNTguNDk0LTMwLjA1OSA1OC40OTQtNzAuMDY1LS4wMDEtNDIuMDU0LTIzLjk4MS03MC4zMS01OS42NzMtNzAuMzF6bS42NTUgMTEwLjM4Yy0zLjg4NS4wNjgtMTAuNTY5LjEyMy0xNi44MTEuMTYzLS4wNDItMTMuMDI5LS4xMjQtNjcuMDAzLS4xNDctODAuNTQzaDE2LjMwM2MyNy41MzMgMCAyOS42NzIgMzAuODU0IDI5LjY3MiA0MC4zMTEgMCAxOS42OTItOC45NzIgMzkuNzE5LTI5LjAxNyA0MC4wNjl6Ii8+PHBhdGggZD0ibTQxMy44NjMgMjM3Ljg0MmM4LjI4NCAwIDE1LTYuNzE2IDE1LTE1cy02LjcxNi0xNS0xNS0xNWgtNDUuODYzYy04LjI4NCAwLTE1IDYuNzE2LTE1IDE1djExMy4xNThjMCA4LjI4NCA2LjcxNiAxNSAxNSAxNXMxNS02LjcxNiAxNS0xNXYtNDIuNjVoMjcuMjJjOC4yODQgMCAxNS02LjcxNiAxNS0xNXMtNi43MTYtMTUtMTUtMTVoLTI3LjIydi0yNS41MDh6Ii8+PHBhdGggZD0ibTQ1OCAxNDVoLTExdi00LjI3OWMwLTE5LjI4Mi03LjMwNi0zNy42MDctMjAuNTcyLTUxLjYwMWwtNjIuMzA1LTY1LjcyMWMtMTQuMDk4LTE0Ljg3LTMzLjkzNi0yMy4zOTktNTQuNDI4LTIzLjM5OWgtMTk5LjY5NWMtMjQuODEzIDAtNDUgMjAuMTg3LTQ1IDQ1djEwMGgtMTFjLTI0LjgxMyAwLTQ1IDIwLjE4Ny00NSA0NXYxODBjMCAyNC44MTMgMjAuMTg3IDQ1IDQ1IDQ1aDExdjUyYzAgMjQuODEzIDIwLjE4NyA0NSA0NSA0NWgyOTJjMjQuODEzIDAgNDUtMjAuMTg3IDQ1LTQ1di01MmgxMWMyNC44MTMgMCA0NS0yMC4xODcgNDUtNDV2LTE4MGMwLTI0LjgxMy0yMC4xODctNDUtNDUtNDV6bS0zNjMtMTAwYzAtOC4yNzEgNi43MjktMTUgMTUtMTVoMTk5LjY5NWMxMi4yOTUgMCAyNC4xOTggNS4xMTcgMzIuNjU3IDE0LjA0bDYyLjMwNSA2NS43MjFjNy45NiA4LjM5NiAxMi4zNDMgMTkuMzkxIDEyLjM0MyAzMC45NnY0LjI3OWgtMzIyem0zMjIgNDIyYzAgOC4yNzEtNi43MjkgMTUtMTUgMTVoLTI5MmMtOC4yNzEgMC0xNS02LjcyOS0xNS0xNXYtNTJoMzIyem01Ni05N2MwIDguMjcxLTYuNzI5IDE1LTE1IDE1aC00MDRjLTguMjcxIDAtMTUtNi43MjktMTUtMTV2LTE4MGMwLTguMjcxIDYuNzI5LTE1IDE1LTE1aDQwNGM4LjI3MSAwIDE1IDYuNzI5IDE1IDE1eiIvPjwvZz48L3N2Zz4="
                  ></object>{" "}
                  PDF
                </button>
              </div>
            </div>

            <Print single name="printable" id="printable">
              {this.props.children}
            </Print>
          </NoPrint>
        </PrintProvider>
      </div>
    );
  }
}
export default withRouter(Print3ply);
