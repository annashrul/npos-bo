import { store, get, update, cekData } from "components/model/app.model";
import { ToastQ } from "helper";
import { rmComma } from "../../../helper";

export const fieldDataCommon = (item) => {
  const finaldt = {
    barcode: item.barcode,
    harga_beli: item.harga_beli,
    satuan: item.satuan,
    ukuran:item.ukuran,
    hrg_jual: item.hrg_jual,
    kd_brg: item.kd_brg,
    nm_brg: item.nm_brg,
    kel_brg: item.kel_brg,
    kategori: item.kategori,
    stock_min: item.stock_min,
    supplier: item.supplier,
    subdept: item.subdept,
    deskripsi: item.deskripsi,
    jenis: item.jenis,
    kcp: item.kcp,
    poin: item.poin,
    group1: item.group1,
    group2: item.group2,
    stock: item.stock,
    qty: parseInt(item.qty, 10) + 1,
    status: item.status,
    saldo_stock: item.stock,
    tambahan: item.tambahan,
  };
  return finaldt;
};

export const getDataCommon = (table, callback) => {
  const data = get(table);
  data.then((res) => {
    let brg = [];
    res.map((i) => brg.push(i));
    callback(res, brg);
  });
};

export const actionDataCommon = (table, item, callback) => {
  let field = fieldDataCommon(item);
  cekData("kd_brg", item.kd_brg, table).then((res) => {
    if (res === undefined) {
      store(table, field);
    }
    callback(res);
  });
};

export const handleInputOnBlurCommon = (e, data, callback) => {
  const column = e.target.name;
  const val = e.target.value;
  const cek = cekData(data.where, data.id, data.table);
  cek.then((res) => {
    if (res === undefined) {
      ToastQ.fire({
        icon: "error",
        title: `not found.`,
      });
    } else {
      let final = {};
      Object.keys(res).forEach((k, i) => {
        if (k !== column) {
          final[k] = res[k];
        } else {
          final[column] = val;
        }
      });

      update(data.table, final);
      // ToastQ.fire({
      //   icon: "success",
      //   title: `${column} has been changed.`,
      // });
    }
    callback();
  });
};
