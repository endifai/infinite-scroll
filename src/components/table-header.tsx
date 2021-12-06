import { TableCell, TableHead, TableRow as TableRowMUI } from '@mui/material'
import { memo } from 'react'

interface Props {
  columns: string[]
}

export const TableHeader = memo(({ columns }: Props) => (
  <TableHead component="div">
    <TableRowMUI component="div">
      <TableCell component="div">Индекс</TableCell>
      {columns.map((column) => (
        <TableCell key={column} component="div">
          {column}
        </TableCell>
      ))}
    </TableRowMUI>
  </TableHead>
))

TableHeader.displayName = 'TableHeader'
