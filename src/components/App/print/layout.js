import React, {Component} from 'react'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import './print.css'
import { withRouter } from 'react-router-dom';

class Print3ply extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.goBack = this.goBack.bind(this)
    }
    componentWillMount(){
        document.title = `Print 3ply`;
    }
  
    goBack() {
        this.props.history.goBack();
    }

    print(){
        document.getElementById("non-printable").style.display = "none";
        window.print()
        document.getElementById("non-printable").style.display = "flex";

    }
      render() {
          return (
              <div>
               <PrintProvider> 
                <NoPrint> 
                    <div id="non-printable">
                        <div className="block-left">
                            <button className="btn btn-blank" onClick={(event)=>{event.preventDefault();this.goBack()}}>← Back</button>
                        </div>
                        <div className="block-right">
                            <button className="btn btn-primary" onClick={()=>{

                                this.print()
                            }}><svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="#fff" viewBox="0 0 485.212 485.212"><path d="M151.636 363.906h151.618v30.33H151.636zm-30.324-333.58h242.595v60.65h30.32v-60.65C394.23 13.596 380.667 0 363.907 0H121.313c-16.748 0-30.327 13.595-30.327 30.327v60.65h30.327v-60.65zm30.324 272.93h181.94v30.328h-181.94z" /><path d="M454.882 121.304H30.334c-16.748 0-30.327 13.59-30.327 30.324v181.956c0 16.76 13.58 30.32 30.327 30.32h60.65v90.98c0 16.765 13.58 30.327 30.328 30.327h242.595c16.76 0 30.32-13.56 30.32-30.323v-90.98h60.654c16.76 0 30.325-13.562 30.325-30.32v-181.96c0-16.732-13.56-30.323-30.32-30.323zm-90.975 333.582H121.312V272.93h242.595v181.956zm60.644-242.604c-16.76 0-30.32-13.564-30.32-30.327 0-16.73 13.56-30.327 30.32-30.327 16.768 0 30.334 13.595 30.334 30.327 0 16.762-13.567 30.327-30.33 30.327z" /></svg> Print</button>
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
export default withRouter(Print3ply)