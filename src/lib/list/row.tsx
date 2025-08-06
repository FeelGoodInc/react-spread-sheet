import React, {
  type ReactNode,
  memo
}                                from "react";
import { store, useAppSelector } from "../store";
import Cell                      from "./cell";
import ReadOnlyCell              from "./readonlycell";
import {
  type Data,
  selectHorizontalCells
}                                from "../reducer";
interface Prop {
  i: number;
  onChange?(i: number, j: number, value: string): void;
  hideYAxisHeader?: boolean;
  readonly?: boolean;
  headerValues?: string[];
  injectedCellComponent?: (value: Data) => ReactNode;
}

const Row = (props: Prop) => {
  const { i, injectedCellComponent } = props;
  const itemLength = useAppSelector(store, (state) => state.data[i]?.length || 0);
  const items = [];
  for (let j = 0; j < itemLength; j++) {
    items.push(
      props.readonly ? (
        <ReadOnlyCell key={`${i}-${j}-ReadOnly`} i={i} j={j} headerValues={props.headerValues} />
      ) : (
        <Cell
          key={`${i}-${j}`}
          i={i}
          j={j}
          onChange={props.onChange}
          headerValues={props.headerValues}
          injectedCellComponent={injectedCellComponent}
        />
      ),
    );
  }
  return (
    <tr data-testid="sheet-table-tr">
      {!props.hideYAxisHeader ? (
        <td
          className="sheet-axis"
          data-testid={`${i}-sheet-y-axis`}
          tabIndex={1}
          onMouseDown={(e) => {
            !props.readonly &&
              store.dispatch(selectHorizontalCells, {
                payload: { i: i, ctrlPressed: e.metaKey || e.ctrlKey },
              });
          }}
        >
          {i + 1}
        </td>
      ) : (
        ""
      )}
      {items}
    </tr>
  );
};

export default memo(Row);
