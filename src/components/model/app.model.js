import { useIndexedDB } from 'react-indexed-db';

export  const get=(table)=>{
    const {getAll} = useIndexedDB(table);
    return getAll().then(result => {
        return result;
    });
}

export const getOne=(id,table)=> {
    const {getById} = useIndexedDB(table);

    return getById(id).then(result => {
        return result;
    });
}

export const cekData=(column,val,table)=> {
    const {getByIndex} = useIndexedDB(table);

    return getByIndex(column, val).then(result => {
        return result;
    });
}


export const store = (table,data) => {
    const { add } = useIndexedDB(table);
    
    return add(data)
    .then(event => {
            return true;
        },
        error => {
            return false;
    });
}

export const update = (table,data)=>{
    const { update } = useIndexedDB(table);
    // const [data, setData] = useState();
    
        return update(data).then(event => {
            return true;
        },
        error => {
            return false;
        });
}

export const del = (table,id)=>{
    const { deleteRecord } = useIndexedDB(table);
 
    return deleteRecord(id).then(event => {
        return true;
    },
    error => {
        return false;
    });
}

export const destroy = (table)=>{
    const { clear } = useIndexedDB(table);
 
    return clear().then(() => {
      return true
    });
}