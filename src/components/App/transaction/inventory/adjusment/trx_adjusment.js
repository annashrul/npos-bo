import React,{Component} from 'react';
import {MCrud} from "../../../../model/m_crud";
import { ItemsActions } from '../../../../reducers/item_reducer'
import connect from "react-redux/es/connect/connect";

class TrxAdjustment extends Component{

    constructor(props) {
        super(props);

        this.state = {
            addingItemName: ''
        };
        this.create = this.create.bind(this);
        this.onChangeAddValue = this.onChangeAddValue.bind(this);
        this.createItem = this.createItem.bind(this);
    }

    onChangeAddValue(newValue) {
        this.setState(() => ({
            addingItemName: newValue
        }));
    }

    create() {
        const item = {
            Id: this.props.Index + 1,
            Name: this.state.addingItemName,
            Comments: []
        };
        MCrud.Create(item, (data) => { this.props.GetItems(data); });
        this.setState({
            addingItemName: ''
        });
        console.log("New item added: " + item.Name);
    }

    createItem(event) {
        event.preventDefault();
        (this.state.addingItemName.length > 50 || this.state.addingItemName.length === 0)
            ? alert("Check number of symbols, it must be in range (1-50)!")
            : this.create();
    }

    render() {
        return (
            <div className="main">
                <div className="header-title">
                    <div className="title">

                        <div className="header-text">Create new item</div>
                    </div>
                </div>
                <div className="items-area">
                    <div className="input-row">
                        <form onSubmit={this.createItem}>
                            <input
                                className="input-create"
                                type="text"
                                value={this.state.addingItemName}
                                placeholder="New item title .."
                                onChange={e => this.onChangeAddValue(e.target.value)}
                            />
                        </form>
                        <div className="button" onClick={this.createItem}>></div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    Items: state.get('Items'),
    Index: state.get('Index')
});

const mapDispatchToPropsCreateItem = (dispatch) => ({
    GetItems: (items) => { dispatch(ItemsActions.SetItems(items)); },
});

export default connect(mapStateToPropsCreateItem, mapDispatchToPropsCreateItem)(TrxAdjustment);