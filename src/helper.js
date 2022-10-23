import jsPDF from "jspdf";
import React, { Component } from "react";
import Pagination from "react-js-pagination";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Swal from "sweetalert2";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import XLSX from "xlsx";
import { EXTENSION, HEADERS } from "./redux/actions/_constants";
import Default from "assets/nodata.png";

export const CURRENT_DATE = moment(new Date()).format("yyyy-MM-DD");

export const DEFAULT_WHERE = `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`;

export const noDataImg = Default;

export const rmPage = (res) => {
  let whereProps = res.split("&");
  whereProps.shift();
  let where = whereProps.join("&");
  return `&${where}`;
};

export const getFetchWhere = (res, page = 1) => {
  let where = res;
  let toArray = where.split("&");
  toArray.shift();
  if (page && page !== 1) {
    where = `page=${page}&${toArray.join("&")}`;
  } else {
    where = `page=${1}&${toArray.join("&")}`;
  }
  return where;
};

export const getPeriode = (val) => {
  let newVal = [];
  let getPeriode = val.splice(1, 2);
  getPeriode.forEach((res) => {
    let anyinh = res.split("=");
    newVal.push(anyinh[1]);
  });
  return `${toDate(newVal[0])} - ${toDate(newVal[1])}`;
};

export const getWhere = (res) => {
  let resToArray = res.split("&");
  return `&${resToArray[1]}&${resToArray[2]}`;
};

export const parseToRp = (val) => {
  return toRp(floatToFix(val));
};
export const floatToFix = (val) => {
  return parseFloat(rmToZero(val)).toFixed(2);
};
export const float = (val) => {
  return parseFloat(rmToZero(val));
};

export const toDate = (val, type = "/", isTime = false) => {
  moment.locale("id");
  if (isTime) {
    return moment(val).format("hh:mm:ss");
  }
  return type === "/"
    ? moment(val).format("DD/MM/YYYY")
    : moment(val).format("YYYY-MM-DD");
};

export const isImage = (img = "", className = "img-in-table pointer") => {
  return (
    <img
      src={img}
      onClick={() => {
        Swal.fire({
          imageUrl: img,
          imageAlt: "gambar tidak tersedia",
          showClass: { popup: "animate__animated animate__fadeInDown" },
          hideClass: { popup: "animate__animated animate__fadeOutUp" },
        });
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `${Default}`;
      }}
      className={className}
      alt={img}
    />
  );
};

export const generateNo = (i, current_page, perpage = HEADERS.PERPAGE) => {
  return i + 1 + perpage * (parseInt(current_page, 10) - 1);
};

export const groupByArray = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

export const stringifyFormData = (fd) => {
  const data = {};
  for (let key of fd.keys()) {
    data[key] = fd.get(key);
  }
  return data;
};

export const headerExcel = (from, to) => {
  return `${toDate(from, "/")} - ${toDate(to, "/")}`;
};

export const toExcel = (
  title = "",
  periode = "",
  head = [],
  content = [],
  foot = [],
  ext = EXTENSION.XLSX
) => {
  let header = [[title.toUpperCase()], [`PERIODE : ${periode}`], [""], head];
  let footer = foot;
  let body = header.concat(content);
  let data = footer === undefined || footer === [] ? body : body.concat(footer);
  let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
  let merge = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: head.length } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: head.length } },
  ];
  if (!ws["!merges"]) ws["!merges"] = [];
  ws["!merges"] = merge;
  ws["!ref"] = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: head.length, r: data.length },
  });
  ws["A1"].s = {
    alignment: {
      vertical: "middle",
    },
  };

  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    title.length > 31 ? title.toUpperCase().substr(0, 31) : title.toUpperCase()
  );
  let exportFileName = `${title.replaceAll(" ", "_").toUpperCase()}_${moment(
    new Date()
  ).format("YYYYMMDDHHMMss")}.${ext}`;
  XLSX.writeFile(wb, exportFileName, { type: "file", bookType: ext });
  return;
};

export const headerPdf = (master) => {
  return `laporan ${master.title} periode ${master.dateFrom.replaceAll(
    " ",
    ""
  )} - ${master.dateTo.replaceAll(" ", "")}`;
  // let stringHtml = "";
  // stringHtml +=
  //   '<div style="text-align:center>' +
  //   '<h3 style="text-align:center"><center>LAPORAN ' +
  //   master.title +
  //   "</center></h3>" +
  //   '<h3 align="center"><center>PERIODE : ' +
  //   `${master.dateFrom}`.replaceAll("-", "/") +
  //   " - " +
  //   `${master.dateTo}`.replaceAll("-", "/") +
  //   "</center></h3>" +
  //   '<h3 align="center"><center>&nbsp;</center></h3>' +
  //   "</div>";
  // return stringHtml;
};

export const myPdf = (
  filename,
  title = "",
  header = [],
  body = [],
  footer = [],
  orientation = "portrait",
  unit = "in",
  format = [],
  fontSize = 10,
  ml = 10,
  mt = 10,
  mr = 10,
  mb = 10
) => {
  const doc = jsPDF(orientation, unit, format);
  doc.setFontSize(fontSize);
  let content = {
    headStyles: { backgroundColor: [0, 0, 0, 0] },
    footStyles: {},
    bodyStyles: { lineWidth: 0.2, lineColor: [33, 33, 33], marginBottom: mb },
    // theme:'grid',
    startY: 100,
    head: header,
    body: body,
    foot: footer,
    margin: { bottom: mb, top: mt },
  };
  doc.fromHTML(title, ml, mr, { align: "center" });
  // doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  addFooters(doc);
  return doc.save(filename + "report.pdf");
};

const addFooters = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "Page " + String(i) + " of " + String(pageCount),
      doc.internal.pageSize.width / 2,
      287,
      {
        align: "right",
      }
    );
  }
};

export const to_pdf = (
  filename,
  title = "",
  header = [],
  body = [],
  footer = []
) => {
  const doc = jsPDF("portrait", "pt", "A4");
  doc.setTextColor(40);
  doc.setFontSize(7);
  let content = {
    pageBreak: "auto",
    rowPageBreak: "avoid",
    headStyles: {
      backgroundColor: [0, 0, 0, 0.2],
      marginBottom: 10,
      fontSize: 7,
    },
    bodyStyles: {
      valign: "top",
      lineWidth: 1,
      marginBottom: 10,
      marginTop: 10,
      fontSize: 7,
    },
    showHead: "everyPage",
    theme: "striped",
    startY: doc.autoTableEndPosY() + 20,
    head: header,
    fontStyle: "normal",
    body: body,
    foot: footer,
    margin: { top: 10, bottom: 20, left: 10, right: 10 },
    autoSize: true,
    didDrawPage: function (data) {
      var str = `halaman ${doc.internal.getNumberOfPages()} ${title.toLowerCase()}`;
      doc.setFontSize(7);
      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    },
  };
  doc.autoTable(content);
  return doc.save(
    `LAPORAN ${filename}_${moment(new Date()).format("YYYYMMDDHHMMss")}.pdf`
  );
};

export const to_pdf_l = (
  filename,
  title = "",
  header = [],
  body = [],
  footer = []
) => {
  const doc = jsPDF("landscape", "pt", "A4");
  const marginLeft = 10;
  doc.setFontSize(10);
  let content = {
    headStyles: { backgroundColor: [0, 0, 0, 0] },
    footStyles: {},
    bodyStyles: { lineWidth: 1, lineColor: [33, 33, 33], marginBottom: 20 },
    theme: "grid",
    startY: 100,
    head: header,
    body: body,
    foot: footer,
    margin: { bottom: 60, top: 40 },
  };
  doc.fromHTML(title, marginLeft, 10, { align: "center" });
  // doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  addFooters(doc);
  return doc.save(filename + "report.pdf");
};

// export const addFooters = (doc) => {
//   var width = doc.internal.pageSize.getWidth();
//   var height = doc.internal.pageSize.getHeight();
//   doc.page = 1;
//   // const pageCount = doc.internal.getNumberOfPages();
//   doc.setFontSize(7);
//   doc.text(width - 40, height - 30, "Page - " + doc.page);
//   doc.page++;
//   doc.setFont("helvetica", "italic");
//   doc.setFontSize(8);
//   return doc;
// };
var date = new Date();
date.setDate(date.getDate());
export const rangeDate = {
  "Hari Ini": [date.setDate(date.getDate()), moment()],
  Kemarin: [date.setDate(date.getDate() - 1), date.setDate(date.getDate())],
  "7 Hari Terakhir": [moment().subtract(7, "days"), moment()],
  "30 Hari Terakhir": [moment().subtract(30, "days"), moment()],
  "Minggu Ini": [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
  "Minggu Lalu": [
    moment().subtract(1, "weeks").startOf("isoWeek"),
    moment().subtract(1, "weeks").endOf("isoWeek"),
  ],
  "Bulan Ini": [moment().startOf("month"), moment().endOf("month")],
  "Bulan Lalu": [
    moment().subtract(1, "month").startOf("month"),
    moment().subtract(1, "month").endOf("month"),
  ],
  "Tahun Ini": [moment().startOf("year"), moment().endOf("year")],
  "Tahun Lalu": [
    moment().subtract(1, "year").startOf("year"),
    moment().subtract(1, "year").endOf("year"),
  ],
};

export const toMoney = (angka) => {
  return angka.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};
export const toCurrency = (angka) => {
  let numbers = 0;
  if (parseFloat(angka) === 0) return 0;
  if (parseFloat(angka) < 0) {
    numbers = angka.toString().replace("-", "");
  } else {
    numbers = angka;
  }
  var number_string =
      numbers === "" || numbers === undefined
        ? String(0.0)
        : numbers.toString().replace(/,|\D/g, ""),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan koma jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    var separator = sisa ? "," : "";
    rupiah += separator + ribuan.join(",");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  rupiah =
    parseFloat(angka) < 0
      ? "-" + rupiah.replace(/^0+/, "")
      : rupiah.replace(/^0+/, "");
  return rupiah;
};
export const rmComma = (angka) => {
  let numbers = 0;
  if (parseFloat(angka) === 0) return 0;
  if (parseFloat(angka) < 0) {
    numbers = angka.toString().replace("-", "");
  } else {
    numbers = angka;
  }
  var number_string =
      numbers === "" || numbers === undefined
        ? String(0.0)
        : numbers.toString().replace(/,|\D/g, ""),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    rupiah += ribuan.join("");
  }

  rupiah = split[1] !== undefined ? rupiah + "" + split[1] : rupiah;
  rupiah =
    parseFloat(angka) < 0
      ? "-" + rupiah.replace(/^0+/, "")
      : rupiah.replace(/^0+/, "");
  return parseInt(rupiah, 10);
};
// export const rmComma = (angka) => {
//
//     return parseInt(isEmpty(angka)?0:angka.toString().replace(/,/g,''),10);
// }
export const toPersen = (val1, val2) => {
  let con = (parseFloat(val1) / parseInt(val2, 10)) * 100;
  return con.toFixed(2);
};
export const toNominal = (val1, val2) => {
  let con = parseFloat(val1) * (parseFloat(val2) / 100);
  return con.toFixed(2);
};

export const toRp = (angka) => {
  // return Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(txt);
  // var number_string = angka.toString().replace(/[^,\d]/g, ''),
  let numbers = 0;
  if (parseFloat(angka) < 0) {
    numbers = angka.toString().replace("-", "");
  } else {
    numbers = angka;
  }
  var number_string =
      numbers === "" || numbers === undefined || numbers === null
        ? String(0.0)
        : numbers.toString(),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    var separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  rupiah = parseFloat(angka) < 0 ? "-" + rupiah : rupiah;
  return rupiah;
};
export const ToastQ = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export const statusQ = (lbl, txt) => {
  if (lbl === "success") {
    return (
      <button className="btn btn-success btn-sm" style={{ width: "100%" }}>
        {txt}
      </button>
    );
  } else if (lbl === "danger") {
    return (
      <button className="btn btn-danger btn-sm" style={{ width: "100%" }}>
        {txt}
      </button>
    );
  } else if (lbl === "warning") {
    return (
      <button
        className="btn btn-warning btn-sm"
        style={{ color: "white", width: "100%" }}
      >
        {txt}
      </button>
    );
  } else if (lbl === "info") {
    return (
      <button className="btn btn-info btn-sm" style={{ width: "100%" }}>
        {txt}
      </button>
    );
  } else if (lbl === "primary") {
    return (
      <button className="btn btn-primary btn-sm" style={{ width: "100%" }}>
        {txt}
      </button>
    );
  }
};

export const getMargin = (input, field, name = "") => {
  input = parseInt(rmComma(input), 10);
  field = parseInt(rmComma(field), 10);
  console.log(field);
  if (name === "margin") {
    return ((input - field) / field) * 100;
  } else {
    return field * (input / 100) + field;
  }
};

export const kassa = (param = "") => {
  let data = [];
  if (param === "semua") {
    data.push({ value: "", label: "Semua" });
  }
  data.push(
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G" },
    { value: "H", label: "H" },
    { value: "I", label: "I" },
    { value: "J", label: "J" },
    { value: "K", label: "K" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
    { value: "N", label: "N" },
    { value: "O", label: "O" },
    { value: "P", label: "P" },
    { value: "Q", label: "Q" },
    { value: "R", label: "R" },
    { value: "S", label: "S" },
    { value: "T", label: "T" },
    { value: "U", label: "U" },
    { value: "V", label: "V" },
    { value: "W", label: "W" },
    { value: "X", label: "X" },
    { value: "Y", label: "Y" },
    { value: "Z", label: "Z" }
  );
  return data;
};

export const lengthBrg = (str) => {
  let txt = str.length > 20 ? `${str.substr(0, 20)} ...` : str;
  return txt;
};
export const CapitalizeEachWord = (str) => {
  let splitStr = str.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
};
export const convertBase64 = (file) => {
  console.log("convertBase64", file);
  return new Promise((resolve, reject) => {
    if (file !== undefined) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    }
  });
};

export const swallOption = (
  msg,
  callback,
  isCancel,
  confirmButtonText = "Oke",
  cancelButtonText = "Batal"
) => {
  if (confirmButtonText === "") confirmButtonText = "oke";
  if (cancelButtonText === "") cancelButtonText = "Batal";
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    showCancelButton: true,
    cancelButtonColor: "#d33",
  }).then(async (result) => {
    if (result.value) {
      callback();
    } else {
      if (isCancel) {
        isCancel();
      }
    }
  });
};

export const swalWithCallback = (msg, callback) => {
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: `Oke`,
  }).then(async (result) => {
    if (result.value) {
      callback();
    }
  });
};
export const swal = (msg) => {
  Swal.fire({
    title: "Informasi !!!",
    html: `${msg}`,
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonColor: "#3085d6",
    confirmButtonText: `Oke`,
  });
};

export const btnSave = (className = "", callback, title = "") => {
  return (
    <button
      onClick={(e) => callback(e)}
      className={`btn btn-save ${className}`}
    >
      <i className="fa fa-save"></i>
      {title}
    </button>
  );
};
export const btnSCancel = (className = "", callback, title = "") => {
  return (
    <button
      onClick={(e) => callback(e)}
      className={`btn btn-cancel ${className}`}
    >
      <i className="fa fa-close"></i>
      {title}
    </button>
  );
};

export const select2Group = (
  value,
  onChange,
  options,
  onClick,
  placeholder = "",
  icon = "fa-plus"
) => {
  return (
    <div className="d-flex align-items-center">
      <div style={{ width: "-webkit-fill-available" }}>
        <Select
          autoFocus={true}
          options={options}
          placeholder={`Pilih ${placeholder}`}
          onChange={(value, actionMeta) => onChange(value, actionMeta)}
          value={value}
        />
      </div>
      <div style={{ width: "auto", marginLeft: "-2px", zIndex: "99" }}>
        <button
          style={{
            height: "38px",
            borderRadius: "0px 4px 4px 0px",
          }}
          className="btn btn-primary btn-block"
          onClick={(e) => onClick(e)}
        >
          <i className={`fa ${icon}`}></i>
        </button>
      </div>
    </div>
  );
};

export const dateRange = (
  onApply,
  value,
  isActive = "",
  isShow = true,
  isLabel = true
) => {
  return (
    <div className={`form-group ${!isShow && "none"}`}>
      <label
        style={{ display: isLabel || isLabel === undefined ? "block" : "none" }}
      >
        {" "}
        Periode{" "}
      </label>
      <DateRangePicker
        ranges={rangeDate}
        alwaysShowCalendars={true}
        autoUpdateInput={true}
        onShow={(event, picker) => {
          if (isEmptyOrUndefined(isActive)) {
            let rmActiveDefault = document.querySelector(
              `.ranges>ul>li[data-range-key="Hari Ini"]`
            );
            rmActiveDefault.classList.remove("active");
            let setActive = document.querySelector(
              `.ranges>ul>li[data-range-key="` + isActive + `"]`
            );
            setActive.classList.add("active");
          }
        }}
        onApply={(event, picker) => {
          const firstDate = moment(picker.startDate._d).format("YYYY-MM-DD");
          const lastDate = moment(picker.endDate._d).format("YYYY-MM-DD");
          onApply(firstDate, lastDate, picker.chosenLabel || "");
        }}
      >
        <input
          readOnly={true}
          type="text"
          className={`form-control`}
          name="date"
          value={value}
        />
      </DateRangePicker>
    </div>
  );
};

export const handleError = (val, msg = "tidak boleh kosong") => {
  return ToastQ.fire({ icon: "error", title: `${val} ${msg}` });
};

export const rmUnderscore = (val) => {
  return val.replaceAll("_", " ");
};

export const rmSpaceToStrip = (val) => {
  return val === "" || val === null || val === undefined ? "-" : val;
};
export const rmToZero = (val) => {
  return val === "" ||
    val === "0" ||
    val === null ||
    val === undefined ||
    isNaN(val)
    ? "0"
    : val;
};

export const setFocus = (thist, column) => {
  if (thist[column]) {
    setTimeout(() => {
      thist[column].focus();
    }, 500);
  }
  // return setTimeout(
  //   () => (thist !== undefined ? thist && thist[column].focus() : ""),
  //   thist[column] !== undefined ? 100 : 300
  // );
};
export const onHandleKeyboard = function (key, callback) {
  window &&
    window.addEventListener("keydown", (e) => {
      // e.preventDefault();
      if (e.keyCode === key) {
        callback(e);
      }
    });
};
export const onHandleKeyboardChar = function (key, callback) {
  window &&
    window.addEventListener("keydown", (e) => {
      // e.preventDefault();
      if (e.ctrlKey && e.key === key) {
        callback(e);
      }
    });
};

export const isEmptyOrUndefined = (val, col, isShowError = true) => {
  if (
    val === "" ||
    val === undefined ||
    val === null ||
    val === "null" ||
    val === "undefined"
  ) {
    if (col !== undefined && isShowError === true) {
      handleError(col);
    }
    return false;
  }
  return true;
};

export const setStorage = (key, val) => {
  return localStorage.setItem(key, val);
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};
export const rmStorage = (key) => {
  return localStorage.removeItem(key);
};

export const noData = (colSpan, msg = "") => {
  return (
    <tr>
      <td colSpan={colSpan} className="middle text-center">
        <span
          className="badge badge-warning"
          style={{ fontSize: "18px", padding: "10px" }}
        >
          {msg === null || msg === "" || msg === undefined
            ? "Data tidak tersedia"
            : msg}
        </span>
      </td>
    </tr>
  );
};

export const handleDataSelect = (props, value, label) => {
  let data = [];

  if (value === "kd_cust") {
    data.push({
      value: "1000001",
      label: "UMUM",
    });
  }
  if (value === "kd_sales") {
    data.push({
      value: "1",
      label: "UMUM",
    });
  }

  props.map((val) => data.push({ value: val[value], label: val[label] }));

  return data;
};

export const dataStatus = (isAll = false) => {
  let data = [];
  if (isAll) {
    data.push({ value: "semua", label: "Semua status" });
  }
  data.push({ value: "1", label: "Aktif" });
  data.push({ value: "0", label: "Tidak aktif" });

  return data;
};

export const isProgress = (props, callback) => {
  let loading;
  let isDisabled = false;
  if (props === "loading") {
    isDisabled = true;
    loading = (
      <div>
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (props > 0 && props < 100) {
    isDisabled = true;
    loading = props + "%";
  } else {
    isDisabled = false;
    loading = <i className="fa fa-print"></i>;
  }

  if (callback === undefined) {
    return loading;
  } else {
    return (
      <button
        disabled={isDisabled}
        className="btn btn-primary ml-2"
        onClick={(e) => {
          e.preventDefault();
          callback();
        }}
      >
        {loading}
      </button>
    );
  }
};

class Paginationq extends Component {
  render() {
    return (
      <div style={{ marginBottom: "20px" }}>
        <Pagination
          activePage={parseInt(this.props.current_page, 10)}
          itemsCountPerPage={parseInt(this.props.per_page, 10)}
          totalItemsCount={parseInt(this.props.total, 10)}
          pageRangeDisplayed={5}
          onChange={this.props.callback}
          itemClass="page-item"
          linkClass="page-link"
          activeClass="page-item active"
          disabledClass="page-item disabled"
          // prevPageText="Kembali"
          // nextPageText="Lanjut"
          // firstPageText="Pertama"
          // lastPageText="Terakhir"
        />
      </div>
    );
  }
}

export default connect()(Paginationq);
