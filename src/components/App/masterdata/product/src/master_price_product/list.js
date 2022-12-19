import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormPriceProduct from "../../../../modals/masterdata/price_product/form_price_product";
import HeaderGeneralCommon from "../../../../common/HeaderGeneralCommon";
import TableCommon from "../../../../common/TableCommon";

class ListPriceProduct extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            detail: {},
            any: "",
            where: "",
        };
    }

    handleGet(any, page) {
        let where = `page=${page}`;
        if (any !== "") where += `&q=${any}`;
        this.setState({ where: where });
        this.props.dispatch(FetchPriceProduct(where));
    }

    handlePageChange(pageNumber) {
        this.handleGet(this.state.any, pageNumber);
    }

    toggleModal(index) {
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPriceProduct"));
        Object.assign(this.props.data.data[index], { where: this.state.where });
        this.setState({
            detail: this.props.data.data[index],
        });
    }

    render() {
        const { total, per_page, current_page, data } = this.props.data;
        let setHarga=this.props.auth.user.set_harga;

        const head = [
            { width: "1%", rowSpan: "2", label: "No", className: "text-center" },
            { width: "1%", rowSpan: "2", label: "#", className: "text-center", },
            { width: "1%", rowSpan: "2", label: "Kode"},
            { width: "1%", rowSpan: "2", label: "Barcode"},
            { rowSpan: "2", label: "Nama"},
            { width: "1%", rowSpan: "2", label: "Variasi"},
            { width: "1%", rowSpan: "2", label: "Lokasi"},
            { width: "1%", rowSpan: "2", label: "Harga beli"},
        ];
        const colSpan=[];
        const result=[
            { label: "kd_brg" },
            { label: "barcode" },
            { label: "nm_brg" },
            { label: "ukuran" },
            { label: "nama_toko" },
            { label: "harga_beli", className: "text-right", isCurrency: true },
        ];
        head.push({colSpan: setHarga, label: "Harga jual"});
        if(typeof this.props.auth.user.nama_harga==="object"){
            let x=2;
            for(let i=0;i<setHarga;i++){
                colSpan.push({label: this.props.auth.user.nama_harga[i][`harga${i+1}`]});
                if(i===0){
                    result.push({ label: "harga", className: "text-right", isCurrency: true })
                }
                else{
                    x++;
                    result.push({ label: `harga${x-1}`, className: "text-right", isCurrency: true })
                }
            }
        }

        console.log(result)


        head.push({ width: "1%", rowSpan: "2", label: "Ppn (%)"})
        head.push({ width: "1%", rowSpan: "2", label: "Servis (%)"});
        result.push( { label: "ppn", className: "text-right", isCurrency: true })
        result.push( { label: "service", className: "text-right", isCurrency: true })
        return (
            <div>
                <label>
                    Cari berdasarkan Variasi :
                </label>
                <HeaderGeneralCommon
                    callbackGet={(res) => {
                        this.setState({ any: res });
                        this.handleGet(res, 1);
                    }}
                />
                <TableCommon
                    meta={{
                        total: total,
                        current_page: current_page,
                        per_page: per_page,
                    }}
                    head={head}
                    rowSpan={colSpan}
                    body={typeof data === "object" && data}
                    label={result}
                    current_page={current_page}
                    action={[{ label: "Edit" }]}
                    callback={(e, index) => {
                        if (e === 0) this.toggleModal(index);
                    }}
                    callbackPage={this.handlePageChange.bind(this)}
                />
                {this.props.isOpen && (
                    <FormPriceProduct
                        callback={(id) => {
                            this.setState({ isActive: id });
                        }}
                        detail={this.state.detail}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        auth: state.auth,

    };
};
export default connect(mapStateToProps)(ListPriceProduct);
