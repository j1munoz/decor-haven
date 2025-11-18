import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface TableProps<T> {
  headers: string[];
  data: T[];
  row: (item: T) => React.ReactNode;
}

const DataTable = <T,>({ headers, data, row }: TableProps<T>) => {
  return (
    <div className="w-[80vw] flex flex-col overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="font-bold text-decor-olive-600 text-2xl"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((dataRow, index) => (
              <TableRow key={index} className="text-decor-olive-400 text-xl">
                {row(dataRow)}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="px-6 py-4 text-center text-4xl text-black"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
