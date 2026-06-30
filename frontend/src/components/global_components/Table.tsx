import { useTable, Column } from 'react-table';

interface TableProps {
  columns: readonly Column<any>[];
  data: any[];
  handleClick?: (row: any) => void;
}

const Table = ({ columns, data, handleClick }: TableProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <table {...getTableProps()} className='font-baz1 w-full'>
      <thead>
        {headerGroups.map((headerGroup) => {
          return (
            <tr
              className='border border-solid border-[rgb(192,192,192)]'
              {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className='text-center p-3 font-baz1 text-[14px] target:text-[16px] text-[#2a2a2a]'
                  {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              className=' hover:bg-[rgba(0,0,0,0.05)] cursor-pointer'
              {...row.getRowProps()}
              onClick={() => {
                if (handleClick) handleClick(row);
              }}>
              {row.cells.map((cell) => {
                return (
                  <td
                    className='text-[12px] tablet:text-[18px] max-md:text-sm font-baz1 px-2 py-6 text-center'
                    {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
