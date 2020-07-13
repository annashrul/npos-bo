import React, {Component} from 'react'

class WrapperModal extends Component{
    render() {
        return (
            <div className={this.props.isOpen?'modal fade show':"modal fade"} tabIndex="-1" role="dialog"  aria-labelledby="exampleModalLabel" aria-hidden="true" style={this.props.isOpen?{'display':'block'}:{'display':'none'}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        {this.props.children}

                    </div>
                </div>
            </div>
        );
    }
}

export default WrapperModal;