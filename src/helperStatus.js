import { statusQ } from "./helper";

export const STATUS_GENERAL = [
  { value: "", label: "Semua" },
  { value: "1", label: "Aktif", color: "primary" },
  { value: "0", label: "Tidak aktif", color: "info" },
];

export const STATUS_ARSIP_PENJUALAN = [
  { value: "", label: "Semua" },
  { value: "0", label: "Belum lunas", color: "info" },
  { value: "1", label: "Lunas", color: "primary" },
];

export const STATUS_ALOKASI = [
  { value: "", label: "Semua" },
  { value: "0", label: "Proses", color: "danger" },
  { value: "1", label: "Packing", color: "warning" },
  { value: "2", label: "Dikirim", color: "info" },
  { value: "3", label: "Diterima", color: "primary" },
];
export const STATUS_DELIVERY_NOTE = [
  { value: "", label: "Semua" },
  { value: "0", label: "Proses", color: "danger" },
  { value: "1", label: "Packing", color: "warning" },
  { value: "2", label: "Dikirim", color: "info" },
  { value: "3", label: "Diterima", color: "primary" },
];
export const STATUS_MUTASI = [
  { value: "", label: "Semua" },
  { value: "0", label: "Dikirim", color: "info" },
  { value: "1", label: "Diterima", color: "primary" },
];

const handleLoop = (res, data, isButton) => {
  let val = "";
  for (let i = 0; i < data.length; i++) {
    if (res === data[i].value) {
      val = isButton ? statusQ(data[i].color, data[i].label) : data[i].label;
      return val;
    }
  }
};

export const statusGeneral = (res, isButton = false) => {
  return handleLoop(res, STATUS_GENERAL, isButton);
};
export const statusArsipPenjualan = (res, isButton = false) => {
  return handleLoop(res, STATUS_ARSIP_PENJUALAN, isButton);
};
export const statusAlokasi = (res, isButton = false) => {
  return handleLoop(res, STATUS_ALOKASI, isButton);
};
export const statusDeliveryNote = (res, isButton = false) => {
  return handleLoop(res, STATUS_DELIVERY_NOTE, isButton);
};
export const statusMutasi = (res, isButton = false) => {
  return handleLoop(res, STATUS_MUTASI, isButton);
};
