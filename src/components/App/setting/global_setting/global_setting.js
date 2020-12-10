import React,{Component} from 'react'
import * as Swal from "sweetalert2";
import {FetchSite, FetchFiles, FetchFolder, mergeStock} from "redux/actions/site.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import connect from "react-redux/es/connect/connect";
import {LOC_VERIF} from "redux/actions/_constants";
import Billing from "../../setting/global_setting/src/billing"
import FileManager from "../../setting/global_setting/src/file_manager"
import BackupList from "../../setting/global_setting/src/backup_list"
import LogAction from "../../setting/global_setting/src/log_action"
class GlobalSetting extends Component{
    constructor(props){
        super(props);
        this.state={
            isShow:false,
        }
    }

    componentWillMount(){
        document.title = `Site Config`;
        let count=1;
        Swal.fire({allowOutsideClick: false,
            title: 'Verify Access',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Akses',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                if(LOC_VERIF.password === btoa(login)){
                    this.props.dispatch(FetchSite());
                    this.props.dispatch(FetchFiles());
                    this.setState({
                        isShow:true,
                    })
                }else{
                    if(count===3){
                        alert("Access Denied.")
                        window.location = "http://www.google.com";
                    }
                    count++;
                    Swal.showValidationMessage(
                        `Password Salah`
                    )
                    this.setState({
                        isShow:false,
                    })
                }
            },

        }).then((result) => {

        })
    }

    handleMerge(e){
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Anda Yakin?',
            text: "Lakukan Backup Data Sebelum Melakukan Merging",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(mergeStock());
            }
        })
    }


    handleSelect = (index) => {
        if(index === 1){
            this.props.dispatch(FetchFiles());
        } else if(index === 0) {
            this.props.dispatch(FetchSite());
        } else if(index === 3){
            this.props.dispatch(FetchFolder());
        }
        this.setState({selectedIndex: index}, () => {
            
        })
    };

    render(){
        const {isShow} = this.state;
        return (
            <div className="container mt-5">
                {
                    isShow===true?(
                            <Tabs>
                        <div className="card">
                            <div className="card-header bg-transparent d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>Global Setting</h4>
                                    <TabList>
                                        <Tab onClick={() =>this.handleSelect(0)}>Billing</Tab>
                                        <Tab onClick={() =>this.handleSelect(1)}>Backup</Tab>
                                        <Tab onClick={() =>this.handleSelect(3)}>File Manager</Tab>
                                        <Tab onClick={() =>this.handleSelect(4)}>Log Cleaner</Tab>
                                    </TabList>
                                </div>
                                <div>
                                    <button className="btn btn-outline-warning" onClick={(e)=>this.handleMerge(e)}><i className="fa fa-info-circle"></i>&nbsp;Merge Stock</button>
                                </div>
                            </div>
                                <TabPanel>
                                    <Billing/>
                                </TabPanel>
                                <TabPanel>
                                    <BackupList files={this.props.files}/>
                                </TabPanel>
                                <TabPanel>
                                    <FileManager/>
                                </TabPanel>
                                <TabPanel>
                                    <LogAction/>
                                </TabPanel>
                        </div>
                            </Tabs>
                    ):""
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        site: state.siteReducer.data,
        files: state.siteReducer.data_list,
        isLoading: state.siteReducer.isLoading,
    }
}
export default connect(mapStateToProps)(GlobalSetting);