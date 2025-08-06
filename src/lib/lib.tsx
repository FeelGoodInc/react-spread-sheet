import React, { forwardRef, useImperativeHandle } from "react";
import List, { type Props }                       from "./list";
import { store }                                  from "./store";
import {
  type Selected,
  type Data,
  addData,
  changeData,
  bulkUpdate,
  ListReducer
}                                                 from "./reducer";
import { exportToCsv }                            from "./list/utils";
import                                                 "./sheet.css";

type PackUpdatePayload = {
  index: Selected;
  data: Data;
}[]

export type SheetRef = {
  getData: () => Data[][];
  setData: (data: Data[][]) => void;
  exportCsv: (fileName: string, includeHeaders?: boolean) => void;
  updateOneCell: (row: number, col: number, value: any) => void;
  getOneCell: (row: number, col: number) => Data;
  getSelected: () => Selected[];
  getState: () => ListReducer;
  packUpdate: (payload: PackUpdatePayload) => void;
};

const Sheet = forwardRef((props: Props, ref) => {
  const getData = (): Data[][] => {
    return store.getState().data;
  };

  const setData = (data: Data[][]): void => {
    store.dispatch(addData, { payload: data });
  };

  const updateOneCell = (row: number, col: number, value: any) => {
    store.dispatch(changeData, { payload: { row, col, value } });
  };

  const getOneCell = (row: number, col: number): Data => {
    return store.getState().data[row][col];
  };

  const exportCsv = (fileName: string, includeHeaders: boolean = false) => {
    let results = store.getState().data;
    exportToCsv(results, fileName, props.headerValues, includeHeaders);
  };

  const getSelected = (): Selected[] => {
    return store.getState().selected;
  }

  const getState = (): ListReducer => {
    return store.getState();
  }

  const packUpdate = (payload: PackUpdatePayload) => {
    store.dispatch(bulkUpdate, { payload });
  };

  useImperativeHandle(ref, () => ({
    getData,
    setData,
    updateOneCell,
    getOneCell,
    exportCsv,
    getSelected,
    getState,
    packUpdate,
  }));

  return <List {...props} />;
});

export default Sheet;
