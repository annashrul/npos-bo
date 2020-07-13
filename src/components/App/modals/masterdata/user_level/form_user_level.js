import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createUserLevel,
    FetchUserLevel,
    updateUserLevel
} from "redux/actions/masterdata/user_level/user_level.action";
import {FetchUserList, updateUserList} from "redux/actions/masterdata/user_list/user_list.action";
import {ModalToggle} from "redux/actions/modal.action";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class FormUserLevel extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            setting: [
                {id: 0, value: "0", isChecked: false,label:'company'},
                {id: 1, value: "0", isChecked: false,label:'device'},
                {id: 2, value: "0", isChecked: false,label:''},
                {id: 3, value: "0", isChecked: false,label:''},
                {id: 4, value: "0", isChecked: false,label:''},
                {id: 5, value: "0", isChecked: false,label:''},
                {id: 6, value: "0", isChecked: false,label:''},
                {id: 7, value: "0", isChecked: false,label:''},
                {id: 8, value: "0", isChecked: false,label:''},
                {id: 9, value: "0", isChecked: false,label:''},
            ],
            masterdata: [
                {id: 10, value: "0", isChecked: false,label:'product'},
                {id: 11, value: "0", isChecked: false,label:'user'},
                {id: 12, value: "0", isChecked: false,label:'subdept'},
                {id: 13, value: "0", isChecked: false,label:'supplier'},
                {id: 14, value: "0", isChecked: false,label:'location'},
                {id: 15, value: "0", isChecked: false,label:'customer'},
                {id: 16, value: "0", isChecked: false,label:'cash'},
                {id: 17, value: "0", isChecked: false,label:''},
                {id: 18, value: "0", isChecked: false,label:''},
                {id: 19, value: "0", isChecked: false,label:''},
            ],
            lvl : "",
            access : [],

        }
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({lvl:""});
        this.setState({})
    };
    handleLoopAccess(moduls=[],nextProps=[]){
        if(nextProps!==null)
            moduls.forEach(modul=>{
                for(let i=0;i<nextProps.length;i++){
                    if(modul.id === nextProps[i].id){
                        if(nextProps[i].label==="1"){
                            modul.isChecked = true;
                        }
                        let cek = modul.value;
                        this.setState({cek:nextProps[i].label})
                        modul.value = nextProps[i].label;
                    }
                }
            });
            return moduls;

    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (nextProps.detail !== undefined && nextProps.detail !== []) {
            let akses = [];
            this.handleLoopAccess(this.state.setting.concat(this.state.masterdata),nextProps.detail.access);
            this.setState({lvl:nextProps.detail.lvl});
        }
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        let akses = [];

        this.state.setting.forEach(valSetting=>{
            akses.push({"id":valSetting.id,"label":valSetting.value});
        });
        this.state.masterdata.forEach(valMasterdata=>{
            akses.push({"id":valMasterdata.id,"label":valMasterdata.value});
        });
        parseData['lvl'] = this.state.lvl;
        parseData['access'] = akses;
        console.log(parseData);
        if(this.props.detail !==undefined){
            this.props.dispatch(updateUserLevel(this.props.detail.id,parseData));
            this.props.dispatch(ModalToggle(false));
        }else{
            this.props.dispatch(createUserLevel(parseData));
            this.props.dispatch(ModalToggle(false));
        }

    }
    handleAllChecked = (event,param) => {
        let moduls = this.state[param];
        moduls.forEach(modul => {
            modul.isChecked = event.target.checked;
            modul.value = modul.label!==''?modul.isChecked === false ? "0":"1":"0";
        });
        this.setState({param: moduls});
    };
    handleCheckChieldElement = (event,param) => {
        let moduls = this.state[param];
        console.log(event.target.getAttribute("id"));
        moduls.forEach(modul => {
            if (modul.label === event.target.getAttribute("id")){
                modul.isChecked =  event.target.checked;
                modul.value = modul.label!==''? modul.isChecked === false ? "0":"1":"0";
            }
        });
        this.setState({param: moduls});
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add User Level":"Update User Level"}</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" name="lvl" value={this.state.lvl}  onChange={(e)=>this.handleChange(e)} />
                                </div>
                                {/*START SECTION SETTING*/}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'setting')}  value="checkedall" /> <b style={{color:'red'}}>Setting</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.setting.map((modul, index) => {
                                            return (
                                                modul.label!==''?
                                                    <div className="col-md-2" key={index} >
                                                        <div className="form-group" style={{marginLeft:"10px"}}>
                                                            <input onChange={(e)=>this.handleCheckChieldElement(e,'setting')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                        </div>
                                                    </div>:''
                                            )
                                        })
                                    }
                                </div>
                                {/* END SECTION SETTING */}
                                {/* START SECTION MASTERDATA */}
                                <div className="form-group">
                                    <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,'masterdata')}  value="checkedall" /> <b style={{color:'red'}}>Masterdata</b>
                                </div>
                                <div className="row">
                                    {
                                        this.state.masterdata.map((modul, index) => {
                                            return (
                                                modul.label!==''?<div className="col-md-2" key={index}>
                                                    <div className="form-group" style={{marginLeft:"10px"}}>
                                                        <input onChange={(e)=>this.handleCheckChieldElement(e,'masterdata')} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                    </div>
                                                </div>:''
                                            )
                                        })
                                    }
                                </div>
                                {/* END SECTION MASTERDATA */}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-danger mb-2 mr-2"><i className="ti-close" /> Close</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Save</button>
                        </div>
                    </ModalFooter>
                </form>
            </WrapperModal>
        );
    }
}
//
// export const CheckBox = props => {
//     return (
//         <div>
//             <input key={props.id} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.value} /> {props.label}
//         </div>
//     )
// }
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(FormUserLevel);
