import React, { useRef, useState } from "react";
import Sheet, { SheetRef } from "../lib";
import packageConf from "../../package.json";
import { importFromXlsx, exportToXlsx } from "./xlsxUtils";
import { MOCK_DATA } from './matrix';
import "./demo.css";

function App() {
  const [state] = useState<any[][]>(MOCK_DATA);
  const childRef = useRef<SheetRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChange = (i: number, j: number, value: string) => {
    //Do not try to update state with this action, it will slow down your application
    console.log(`Value Updated at ${i}, ${j}`, value);
  };

  //Read data from excel sheet
  const getData = () => {
    console.log("Updated Data", childRef?.current?.getData()); //Data will be printed in console
  };

  //generate CSV
  const exportCSV = () => {
    childRef?.current?.exportCsv("myCsvFile", false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromXlsx(file, (data) => {
        childRef?.current?.setData(data);
      });
    }
  };

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", padding: "10px" }}>
      <div style={{ paddingBottom: "10px" }}>
        <a href="https://www.npmjs.com/package/react-spread-sheet-excel">
          React excel sheet: V{packageConf.version}
        </a>{" "}
        <button data-testid="get-updated-data" onClick={getData}>
          Get Updated data
        </button>{" "}
        <button data-testid="csv-export" onClick={exportCSV}>
          Export CSV data
        </button>{" "}
        <button onClick={() => exportToXlsx(childRef?.current?.getData() ?? [])}>
          Export XLSX
        </button>{" "}
        <label>
          <input ref={fileInputRef} type="file" accept=".xlsx" hidden onChange={handleFileChange} />
          <button onClick={handleImportClick}>Import XLSX</button>
        </label>
      </div>
      <div style={{ height: "10px", flex: "1 1 10px" }}>
        {/* Data is optional, if data is empty it will render empty input boxes */}
        <Sheet
          autoAddAdditionalRows={false}
          onChange={onChange}
          ref={childRef}
          resize
          // injectedCellComponent={(value) => {
          //   console.log(value);
          //   return value.selectable && (
          //     <div style={{position: 'absolute', top: 0, right: 0, zIndex: 2}}>
          //       {value.value}
          //     </div>
          //   )
          // }}
          // contextMenuCustomActions={[
          //   {
          //     id: 'markAsValues',
          //     text: 'Пометить как область значений',              
          //     onClick: () => {
          //       if (childRef.current) {
          //         const { getSelected, packUpdate, getOneCell } = childRef.current;
          //         const selected = getSelected();
                  
          //         if (selected) {
          //           packUpdate(
          //             selected.map(item => {
          //               const [ row, col ] = item;
          //               const cellData = getOneCell(row, col);

          //               return {
          //                 index: item,
          //                 data: { ...cellData, selectable: true }
          //               }
          //             })
          //           )
          //         }
          //       }
          //     }
          //   },
          //   {
          //     id: 'setValue',
          //     text: 'Задать значение',
          //     visibilityCondition: (state): boolean => {
          //       if (childRef.current) {
          //         const { getOneCell } = childRef.current;
          //         let isAllSelectedCellsSelectable = true;

          //         for (const selected of state.selected) {
          //           const [ row, col ] = selected;
          //           const { selectable } = getOneCell(row, col);

          //           if (!selectable) {
          //             isAllSelectedCellsSelectable = false;

          //             break;
          //           }
          //         }

          //         return isAllSelectedCellsSelectable;
          //       }

          //       return false;
          //     },
          //     onClick: () => {
          //       console.log('custom action click')
          //     }
          //   }
          // ]}
        />
      </div>
    </div>
  );
}

export default App;
