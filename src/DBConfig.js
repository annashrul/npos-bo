export const DBConfig = {
  name: 'npos',
  version: 1,
  objectStoresMeta: [
    {
      store: 'purchase_order',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'kd_brg',keypath:'kd_brg',options:{unique:false}},
        { name: 'barcode',keypath:'barcode',options:{unique:false}},
        { name: 'satuan',keypath:'satuan',options:{unique:false}},
        { name: 'diskon',keypath:'diskon',options:{unique:false}},
        { name: 'diskon2',keypath:'diskon2',options:{unique:false}},
        { name: 'diskon3',keypath:'diskon3',options:{unique:false}},
        { name: 'diskon4',keypath:'diskon4',options:{unique:false}},
        { name: 'stock',keypath:'stock',options:{unique:false}},
        { name: 'ppn',keypath:'ppn',options:{unique:false}},
        { name: 'harga_beli',keypath:'harga_beli',options:{unique:false}},
        { name: 'qty',keypath:'qty',options:{unique:false}}
      ]
    }
  ]
};