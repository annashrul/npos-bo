export const DBConfig = {
    name: 'npos',
    version: 1,
    objectStoresMeta: [
        {
            store: 'sess',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'id',keypath:'id',options:{unique:false}},
                { name: 'username',keypath:'username',options:{unique:false}},
                { name: 'lokasi',keypath:'lokasi',options:{unique:false}},
                { name: 'lvl',keypath:'lvl',options:{unique:false}},
                { name: 'access',keypath:'access',options:{unique:false}},
                { name: 'password_otorisasi',keypath:'password_otorisasi',options:{unique:false}},
                { name: 'nama',keypath:'nama',options:{unique:false}},
                { name: 'alamat',keypath:'alamat',options:{unique:false}},
                { name: 'foto',keypath:'foto',options:{unique:false}},
                { name: 'token',keypath:'token',options:{unique:false}},
                { name: 'logo',keypath:'logo',options:{unique:false}},
                { name: 'fav_icon',keypath:'fav_icon',options:{unique:false}},
                { name: 'harga1',keypath:'harga1',options:{unique:false}},
                { name: 'harga2',keypath:'harga2',options:{unique:false}},
                { name: 'harga3',keypath:'harga3',options:{unique:false}},
                { name: 'harga4',keypath:'harga4',options:{unique:false}},
                { name: 'set_harga',keypath:'set_harga',options:{unique:false}},
            ]
        },
        {
            store: 'purchase_order',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg',keypath:'kd_brg',options:{unique:false}},
                { name: 'nm_brg',keypath:'nm_brg',options:{unique:false}},
                { name: 'barcode',keypath:'barcode',options:{unique:false}},
                { name: 'satuan',keypath:'satuan',options:{unique:false}},
                { name: 'diskon',keypath:'diskon',options:{unique:false}},
                { name: 'diskon2',keypath:'diskon2',options:{unique:false}},
                { name: 'diskon3',keypath:'diskon3',options:{unique:false}},
                { name: 'diskon4',keypath:'diskon4',options:{unique:false}},
                { name: 'stock',keypath:'stock',options:{unique:false}},
                { name: 'ppn',keypath:'ppn',options:{unique:false}},
                { name: 'harga_beli',keypath:'harga_beli',options:{unique:false}},
                { name: 'qty',keypath:'qty',options:{unique:false}},
                { name: 'tambahan',keypath:'tambahan',options:{unique:false}}
            ]
        },

        {
            store: 'receive',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'diskon', keypath: 'diskon', options: { unique: false } },
                { name: 'diskon2', keypath: 'diskon2', options: { unique: false } },
                { name: 'diskon3', keypath: 'diskon3', options: { unique: false } },
                { name: 'diskon4', keypath: 'diskon4', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'ppn', keypath: 'ppn', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'qty', keypath: 'qty', options: { unique: false } },
                { name: 'qty_bonus', keypath: 'qty_bonus', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },

        {
            store: 'delivery_note',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'hrg_jual', keypath: 'hrg_jual', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty', keypath: 'qty', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },

        {
            store: 'alokasi',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'hrg_jual', keypath: 'hrg_jual', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty', keypath: 'qty', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },
        {
            store: 'sale',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'harga_old', keypath: 'harga_old', options: { unique: false } },
                { name: 'harga', keypath: 'harga', options: { unique: false } },
                { name: 'harga2', keypath: 'harga2', options: { unique: false } },
                { name: 'harga3', keypath: 'harga3', options: { unique: false } },
                { name: 'harga4', keypath: 'harga4', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty', keypath: 'qty', options: { unique: false } },
                { name: 'diskon_persen', keypath: 'diskon_persen', options: { unique: false } },
                { name: 'diskon_nominal', keypath: 'diskon_nominal', options: { unique: false } },
                { name: 'ppn', keypath: 'ppn', options: { unique: false } },
                { name: 'hrg_beli', keypath: 'hrg_beli', options: { unique: false } },
                { name: 'kategori', keypath: 'kategori', options: { unique: false } },
                { name: 'services', keypath: 'services', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }

            ]
        },
        {
            store: 'adjusment',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'hrg_jual', keypath: 'hrg_jual', options: { unique: false } },
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'kel_brg', keypath: 'kel_brg', options: { unique: false } },
                { name: 'kategori', keypath: 'kategori', options: { unique: false } },
                { name: 'stock_min', keypath: 'stock_min', options: { unique: false } },
                { name: 'supplier', keypath: 'supplier', options: { unique: false } },
                { name: 'subdept', keypath: 'subdept', options: { unique: false } },
                { name: 'deskripsi', keypath: 'deskripsi', options: { unique: false } },
                { name: 'jenis', keypath: 'jenis', options: { unique: false } },
                { name: 'kcp', keypath: 'kcp', options: { unique: false } },
                { name: 'poin', keypath: 'poin', options: { unique: false } },
                { name: 'group1', keypath: 'group1', options: { unique: false } },
                { name: 'group2', keypath: 'group2', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty_adjust', keypath: 'qty_adjust', options: { unique: false } },
                { name: 'status', keypath: 'status', options: { unique: false } },
                { name: 'saldo_stock', keypath: 'saldo_stock', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }

            ]
        },
        {
            store: 'opname',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'hrg_jual', keypath: 'hrg_jual', options: { unique: false } },
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'kel_brg', keypath: 'kel_brg', options: { unique: false } },
                { name: 'kategori', keypath: 'kategori', options: { unique: false } },
                { name: 'stock_min', keypath: 'stock_min', options: { unique: false } },
                { name: 'supplier', keypath: 'supplier', options: { unique: false } },
                { name: 'subdept', keypath: 'subdept', options: { unique: false } },
                { name: 'deskripsi', keypath: 'deskripsi', options: { unique: false } },
                { name: 'jenis', keypath: 'jenis', options: { unique: false } },
                { name: 'kcp', keypath: 'kcp', options: { unique: false } },
                { name: 'poin', keypath: 'poin', options: { unique: false } },
                { name: 'group1', keypath: 'group1', options: { unique: false } },
                { name: 'group2', keypath: 'group2', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty_fisik', keypath: 'qty_fisik', options: { unique: false } },
            ]
        },
        {
            store: 'retur_tanpa_nota',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'deskripsi', keypath: 'deskripsi', options: { unique: false } },
                { name: 'kondisi', keypath: 'kondisi', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'ppn', keypath: 'ppn', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'ket', keypath: 'ket', options: { unique: false } },
                { name: 'qty_retur', keypath: 'qty_retur', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },
        {
            store: 'cetak_barcode',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'title', keypath: 'title', options: { unique: false } },
                { name: 'harga_jual', keypath: 'harga_jual', options: { unique: false } },
                { name: 'qty', keypath: 'qty', options: { unique: false } },
            ]
        },
        {
            store: 'production',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'hrg_jual', keypath: 'hrg_jual', options: { unique: false } },
                { name: 'kd_brg', keypath: 'kd_brg', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'kel_brg', keypath: 'kel_brg', options: { unique: false } },
                { name: 'kategori', keypath: 'kategori', options: { unique: false } },
                { name: 'stock_min', keypath: 'stock_min', options: { unique: false } },
                { name: 'supplier', keypath: 'supplier', options: { unique: false } },
                { name: 'subdept', keypath: 'subdept', options: { unique: false } },
                { name: 'deskripsi', keypath: 'deskripsi', options: { unique: false } },
                { name: 'jenis', keypath: 'jenis', options: { unique: false } },
                { name: 'kcp', keypath: 'kcp', options: { unique: false } },
                { name: 'poin', keypath: 'poin', options: { unique: false } },
                { name: 'group1', keypath: 'group1', options: { unique: false } },
                { name: 'group2', keypath: 'group2', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'qty_adjust', keypath: 'qty_adjust', options: { unique: false } },
                { name: 'status', keypath: 'status', options: { unique: false } },
                { name: 'saldo_stock', keypath: 'saldo_stock', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },

        {
            store: 'packing',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'kode_barang', keypath: 'kode_barang', options: { unique: false } },
                { name: 'harga_beli', keypath: 'harga_beli', options: { unique: false } },
                { name: 'harga_jual', keypath: 'harga_jual', options: { unique: false } },
                { name: 'barcode', keypath: 'barcode', options: { unique: false } },
                { name: 'satuan', keypath: 'satuan', options: { unique: false } },
                { name: 'stock', keypath: 'stock', options: { unique: false } },
                { name: 'nm_brg', keypath: 'nm_brg', options: { unique: false } },
                { name: 'qty_alokasi', keypath: 'qty_alokasi', options: { unique: false } },
                { name: 'qty_packing', keypath: 'qty_packing', options: { unique: false } },
                { name: 'tambahan', keypath: 'tambahan', options: { unique: false } }
            ]
        },

    ]
};