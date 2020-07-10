import { createAction, handleActions } from 'redux-actions';
import { List, fromJS, Record } from 'immutable';

const ItemsActionTypes = {
    SetItems: 'SET_ITEMS'
};

const SetItems = createAction(
    ItemsActionTypes.SetItems,
    (items) => fromJS(items.map(item => fromJS(item))),
    (items) => (items[items.length - 1] ? items[items.length - 1].Id : 0)
);

export const ItemsActions = { SetItems };

// State
export class ItemsReducerState extends Record({ Items: List(), Index: {} }) { }

// Reducer
const ItemsReducer = handleActions(
    {
        [ItemsActionTypes.SetItems]: (state, action) => {
            return state.set('Index', action.meta).set('Items', action.payload);
        },
    },
    new ItemsReducerState()
);

export default ItemsReducer;

export const getSelectedItem = (state, itemId) => {
    return state.get('Items').find((item) => item.get('Id') === itemId);
}