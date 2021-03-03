import React, { Component } from 'react';
import {Link} from "react-router-dom"

class MenuTreeviewSubTemp extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[]
        };
        this.changeMenu = this.changeMenu.bind(this)
        this.changeSubMenu = this.changeSubMenu.bind(this)
    }
    changeMenu(e,parent,child){
        e.preventDefault();
        this.props.changeMenu({parent:parent,child:child});
    }
    changeSubMenu(e,parent,child){
        e.preventDefault();
        this.props.changeSubMenu({parent:parent,child:child});
    }

    render(){
        return(
            <li className={`treeview ${this.props.isActive?" active menu-open":""}`}  style={{display:this.props.isDisplay?'block':'none'}}>
                <a href="about:blank" onClick={(e) => this.changeMenu(e,this.props.arg1,this.props.arg2)}><i className="zmdi zmdi-book" /> <span>Laporan</span> <i className="fa fa-angle-right" /></a>
                <ul className={"treeview-menu animate__animated" + (this.props.isActive ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:"block"}}>
                    {
                        this.props.data.map((v,i)=>{
                            return v.data!==undefined?(
                                <li key={i} className={`treeview ${v.isActive?'active menu-open':''}`} style={{display:v.isDisplay?'block':'none'}}>
                                    <a href="about:blank" onClick={(e) => this.changeSubMenu(e,this.props.arg1,v.arg1)}>{v.label} <i className="fa fa-angle-right"/></a>
                                    <ul className={"treeview-menu animate__animated" + (v.isActive ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:v.isActive?"block":"none"}}>
                                        {
                                            v.data!==undefined?v.data.map((val,key)=>{
                                                return(
                                                    <li style={{display:val.isDisplay?'block':'none'}} key={key} className={this.props.path===val.path?"active":''}>
                                                        <Link to={val.path} style={{width:'fit-content'}}>{val.label}</Link>
                                                    </li>
                                                );
                                            }):""
                                        }
                                    </ul>
                                </li>
                            ):(
                                <li key={i} className={this.props.path===v.path?"active":''} style={{display:v.isDisplay?'block':'none'}}>
                                    <Link to={v.path} style={{width:'fit-content'}}>{v.label}</Link>
                                </li>
                            )

                        })
                    }
                </ul>
            </li>
        );
    }
}

export  default MenuTreeviewSubTemp;