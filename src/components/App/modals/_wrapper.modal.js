import React, {Component} from 'react'

import {Modal} from 'reactstrap'

class WrapperModal extends Component{
    render() {
        return (
            <Modal {...this.props}>
                {this.props.children}
            </Modal>
        );

    }
}

export default WrapperModal;