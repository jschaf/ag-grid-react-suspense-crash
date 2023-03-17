import React, { Suspense, useEffect, useState } from 'react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AgGridReact } from '@ag-grid-community/react';
import ReactDOM from 'react-dom/client';

let didSuspend = false;
const InnerComponent = (props) => {
  const { rowData, setRowData } = props;
  console.log('!!! InnerComponent before suspense');
  if (!didSuspend) {
    didSuspend = true;
    throw Promise.resolve();
  }
  console.log('!!! InnerComponent after suspense');
  useEffect(() => {
    console.log('!!! InnerComponent fire useEffect');
    setRowData([...rowData, { item: 'bar' }]);
  }, []);
  return <div>inner component</div>;
};

const CrashAgGrid = () => {
  const [rowData, setRowData] = useState([{ item: 'foo' }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
      <>
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Crash Ag-Grid
        </button>
        <AgGridReact
            modules={[ClientSideRowModelModule]}
            containerStyle={{
              height: '600px',
            }}
            rowHeight={80}
            rowData={rowData}
            getRowId={(data) => data.data.item}
            columnDefs={[
              {
                headerName: 'Item',
                field: 'item',
              },
            ]}
        />
        {isModalOpen ? <InnerComponent rowData={rowData} setRowData={setRowData} /> : <></>}
      </>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback="hit suspense">
      <CrashAgGrid />
    </Suspense>,
);
