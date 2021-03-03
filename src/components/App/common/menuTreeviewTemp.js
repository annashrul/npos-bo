import React, { Component } from 'react';
import {Link} from "react-router-dom"

class MenuTreeviewTemp extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[]
        };
        this.changeMenu = this.changeMenu.bind(this)
    }
    changeMenu(e,parent,child){
        e.preventDefault();
        this.props.changeMenu({parent:parent,child:child});
        // this.props.path='';
    }



    render(){
        // return props
        // 1. this.props.changeMenu :: Function
        // 2. this.props.isActive   :: String
        // 3. this.props.isDisplay  :: String
        // 4. this.props.state      :: String
        // 5. this.props.child      :: String
        // 6. this.props.icon       :: String
        // 7. this.props.label      :: String
        // 8. this.props.data       :: [{path:'',display:'',icon:'',label:''}]

        return(
            <li className={`treeview ${this.props.isActive?" active menu-open":""}`}  style={{display:this.props.isDisplay?'block':'none'}}>
                <a href="about:blank" onClick={(e) => this.changeMenu(e,this.props.arg1,this.props.arg2)}><i className={`${this.props.icon}`}/> <span>{this.props.label}</span> <i className="fa fa-angle-right" /></a>
                <ul className={"treeview-menu animate__animated" + (this.props.isActive ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.props.isActive?"block" : "none"}}>
                    {
                        this.props.data!==undefined?this.props.data.map((v,i)=>{
                            return(
                                <li key={i} className={`${this.props.path===`/${v.path}`?"active":''}`} style={v.display==="0"?{"display":"none"}:{"display":"block"}}>
                                    <Link to={'/'+v.path} style={{width:'fit-content'}}>{v.label}</Link>
                                </li>
                            );

                        }):""
                    }
                </ul>
            </li>
        );
    }
}

export  default MenuTreeviewTemp;