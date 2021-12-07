import {
  TableCell as TableCellMUI,
  TableRow as TableRowMUI,
} from '@mui/material'
import { CSSProperties, memo, useMemo } from 'react'

import { useData } from '../context/data-provider'

interface Props {
  index: number
  style: CSSProperties
}

export const TableRow = memo(({ index, style }: Props) => {
  const { data } = useData()

  const values = useMemo(() => Object.values(data[index] ?? {}), [data, index])

  return (
    <TableRowMUI component="div" key={index} style={style}>
      <TableCellMUI component="div" scope="row">
        {index}
      </TableCellMUI>

      {values.map((value, cellIndex) => (
        <TableCellMUI component="div" key={`${value}-${cellIndex}`} scope="row">
          {value}
        </TableCellMUI>
      ))}
    </TableRowMUI>
  )
})

TableRow.displayName = 'TableRow'
