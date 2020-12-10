import React,{Component} from 'react';
import WrapperModal from "components/App/modals/_wrapper.modal";
import * as Swal from "sweetalert2";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {storeBackup} from "redux/actions/site.action";
import Select from 'react-select'
import {
    withRouter
} from 'react-router-dom';
class FormBackup extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.HandleChangeList = this.HandleChangeList.bind(this);
        this.state = {
            gt:0,
            backup:'',
            backup_data:[],
        };
    }

    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
    };
    handleSubmit(e){
        e.preventDefault();
        let timerInterval;
        let data = this.state.backup;
        let parsedata = {};
        parsedata['table'] = data;
        Swal.fire({allowOutsideClick: false,
            title: 'Tunggu Sebentar',
            html: 'data \''+data+'\' sedang dicadangkan ke server',
            timer: 1000,
            timerProgressBar: true,
            onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                const bool = !this.props.isOpen;
                this.props.dispatch(ModalToggle(bool));
                this.props.dispatch(storeBackup(parsedata));
            }
        })
    }
    HandleChangeList(tb) {
        this.setState({
            backup: tb.value
        })
    }
    componentWillReceiveProps = (nextProps)=> {
        
        if (nextProps.tables) {
            let bc = [];
            let bck = nextProps.tables;
            if(bck!==undefined){
                bck.map((i) => {
                    bc.push({
                        value: i.table_name,
                        label: i.table_name
                    });
                    return null;
                })
                this.setState({
                    backup_data: bc,
                })
            }
        }
    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBackup"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Backup":""}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label className="control-label font-12">
                                    List Tables
                                </label>
                                <Select
                                    options={this.state.backup_data}
                                    // placeholder="Pilih Tipe Kas"
                                    onChange={this.HandleChangeList}
                                    value={
                                        this.state.backup_data.find(op => {
                                            return op.value === this.state.backup
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-4" style={{textAlign:"right"}}>
                            <div className="form-group">
                                <label className="control-label font-12">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </label>
                                <button className="btn btn-primary btn-block" onClick={(e) => this.handleSubmit(e)}>Backup</button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        tables:state.siteReducer.data_tables,
        isLoading: state.siteReducer.isLoading,
    }
}
export default withRouter(connect(mapStateToProps)(FormBackup));