import React,{Component} from 'react';
import {store,get,destroy} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";

class TrxAdjustment extends Component{

    constructor(props) {
        super(props);

        this.state = {
            addingItemName: '',
            data:''
        };
        this.create = this.create.bind(this);
        this.onChangeAddValue = this.onChangeAddValue.bind(this);
        this.createItem = this.createItem.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    onChangeAddValue(newValue) {
        this.setState(() => ({
            addingItemName: newValue
        }));
    }

    refresh(e) {
        e.preventDefault()
        const data=destroy('purchase_order');
       
        data.then(res => {
        })

        const data2 = get('purchase_order');
        data2.then(res => {
            this.setState({
                data: JSON.stringify(res)
            })
        })
    }

    create() {
        const item = {
            kd_brg: this.state.addingItemName,
            barcode: this.state.addingItemName,
            satuan: this.state.addingItemName,
            diskon: this.state.addingItemName,
            diskon2: this.state.addingItemName,
            diskon3: this.state.addingItemName,
            diskon4: this.state.addingItemName,
            ppn: this.state.addingItemName,
            harga_beli: this.state.addingItemName,
            qty:0
        };
        store('purchase_order',item)
        this.setState({
            addingItemName: ''
        });
        const data = get('purchase_order');
        data.then(res => {
            this.setState({
                data: JSON.stringify(res)
            })
        })
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
                        <a href="#" onClick={(e)=>this.refresh(e)}>Clear</a>
                        <br/>
                        {
                            this.state.data
                        }
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
                        <div className="button" onClick={this.createItem}></div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
});

export default connect(mapStateToPropsCreateItem)(TrxAdjustment);