import { type Data }             from '../reducer';
import React, {
  type ReactNode
}                                from "react";
import { useInView }             from "react-intersection-observer";
import Input                     from "./input";
import { store, useAppSelector } from "../store";

interface Prop {
  i: number;
  j: number;
  headerValues?: string[];
  onChange?(i: number, j: number, value: string): void;
  injectedCellComponent?: (value: Data) => ReactNode;
}

const Cell = (props: Prop) => {
  const { injectedCellComponent } = props;
  const { ref, inView } = useInView({
    root: document.getElementsByClassName("sheet-table")[0],
    rootMargin: "100px",
  });
  const data = useAppSelector(store, (state) => {
    return state.data[props.i][props.j];
  });

  const colSpan = useAppSelector(store, (state) => {
    let val = state.data[props.i][props.j];
    if (val.colSpan && val.rowSpan) {
      return val.colSpan;
    }
    return 1;
  });

  const rowSpan = useAppSelector(store, (state) => {
    let val = state.data[props.i][props.j];
    if (val.colSpan && val.rowSpan) {
      return val.rowSpan;
    }
    return 1;
  });

  const skip = useAppSelector(store, (state) => {
    return state.data[props.i][props.j].skip;
  });

  return (
    !skip
      ? (
        <td
          ref={ref}
          className={`${!inView ? "pv-4 sheet-not-in-view-table" : ""}`}
          colSpan={colSpan}
          rowSpan={rowSpan}
        >
          {
            inView
              ? (
                <>
                  <Input key={`${props.i}-${props.j}`} {...props} />
                  {injectedCellComponent instanceof Function && injectedCellComponent(data)}
                </>
              )
              : " "
          }
        </td>
      )
      : (
        <></>
      )
  );
};

export default Cell;
