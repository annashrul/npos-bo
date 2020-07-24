import jsPDF from "jspdf";
import React,{Component} from "react";
import Pagination from "react-js-pagination";
import connect from "react-redux/es/connect/connect";


export const stringifyFormData = (fd) => {
    const data = {};
    for (let key of fd.keys()) {
        data[key] = fd.get(key);
    }
    return data;
}
export const to_pdf = (filename,title='',header=[],body=[],footer=[])=>{
    const doc = jsPDF('portrait', 'pt', 'A4');
    const marginLeft = 40;
    doc.setFontSize(15);
    let content = {
        headStyles:{backgroundColor:[0,0,0,0]},
        footStyles:{},
        bodyStyles:{lineWidth: 1, lineColor: [33, 33, 33], marginBottom:20},
        theme:'grid',
        startY: 100,
        head: header,
        body: body,
        foot:footer,
        margin: {bottom: 60, top: 40}
    };
    doc.fromHTML(title, marginLeft, 40, {'align':'center' });
    // doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    addFooters(doc);
    return doc.save(filename+"report.pdf");

}

export const addFooters = doc => {
    var width   = doc.internal.pageSize.getWidth();
    var height  = doc.internal.pageSize.getHeight();
    doc.page=1;
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(7);
    doc.text(width-40, height - 30, 'Page - ' + doc.page);
    doc.page ++;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    return doc;
    // for (var i = 1; i <= pageCount; i++) {
    //     doc.setPage(i)
    //     doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
    //         align: 'center'
    //     });
    //
    // }
}

export const toRp = (angka) => {
    // return Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(txt);
    // var number_string = angka.toString().replace(/[^,\d]/g, ''),
    var number_string = (angka==''||angka==undefined)? String(0.0) : angka.toString(),
        split = number_string.split('.'),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        var separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return 'Rp. ' + rupiah;
};

export const statusQ = (lbl,txt) => {
    if(lbl === 'success'){
        return <button className="btn btn-success btn-sm btn-status" style={{fontSize:'8px'}}>{txt}</button>
    }else if(lbl==='danger'){
        return <button className="btn btn-danger btn-sm btn-status" style={{fontSize:'8px'}}>{txt}</button>
    }else if(lbl==='warning'){
        return <button className="btn btn-warning btn-sm btn-status" style={{fontSize:'8px'}}>{txt}</button>
    }else if(lbl==='info'){
        return <button className="btn btn-info btn-sm btn-status" style={{fontSize:'8px'}}>{txt}</button>
    }

};

export const getMargin = (hrg_jual,hrg_beli) => {
    return ((parseInt(hrg_jual)-parseInt(hrg_beli))/parseInt(hrg_beli))*100;
};

class Paginationq extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Pagination
                activePage={parseInt(this.props.current_page)}
                itemsCountPerPage={this.props.per_page}
                totalItemsCount={this.props.total}
                pageRangeDisplayed={10}
                onChange={this.props.callback}
                itemClass="page-item"
                linkClass="page-link"
                activeClass="page-item active"
                disabledClass="page-item disabled"
                prevPageText='prev'
                nextPageText='next'
                firstPageText='first'
                lastPageText='last'
            />
        )
    }
}


export default connect()(Paginationq)