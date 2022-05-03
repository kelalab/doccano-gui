import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    appendData: (state, action) => {
      state.value.push(...action.payload);
    },
    updateItem: (state, action) => {
      const { item, v_uid, id, labels, id_fetched } = action.payload;
      console.log(item, id, labels);
      let vuid = v_uid ? v_uid : item.v_uid;
      const arr_to_update = state.value.find((arr) => arr[0].v_uid === vuid);
      let snapshot = current(arr_to_update);
      //const item_to_update = snapshot.indexOf(item);
      const _item_to_update = snapshot.find(
        (i) => i.v_uid === item.v_uid && i.S === item.S && i.V === item.V,
      );
      const item_to_update = snapshot.indexOf(_item_to_update);
      const idx_arr_to_update = state.value.indexOf(arr_to_update);
      console.log(
        'arr_to_update',
        current(arr_to_update),
        'indextoupd',
        idx_arr_to_update,
        'itemtoupd',
        item_to_update,
      );
      //console.log('item_to_update', item_to_update);
      if (idx_arr_to_update !== -1 && item_to_update !== -1) {
        if (id) {
          state.value[idx_arr_to_update][item_to_update].id = id;
        } else if (id_fetched) {
          state.value[idx_arr_to_update][item_to_update].id_fetched =
            id_fetched;
        } else if (labels) {
          state.value[idx_arr_to_update][item_to_update].labels = labels;
        }
      }
    },
  },
});

export const { appendData, updateItem } = dataSlice.actions;

export default dataSlice.reducer;
