import {
  TableCell as TableCellMUI,
  TableRow as TableRowMUI,
} from '@mui/material'
import { CSSProperties, memo, useEffect, useMemo } from 'react'

import { DataItem, useData } from '../context/data-provider'
import { useInView } from '../hooks/use-in-view'

interface Props {
  index: number
  style: CSSProperties
  data: DataItem[]
}

export const TableRow = memo(({ index, style, data }: Props) => {
  const values = useMemo(() => Object.values(data[index] ?? {}), [data, index])

  const isLast = index === data.length - 1

  const { ref, inView } = useInView<HTMLTableRowElement>({
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  })
  const { generateNextDataPage } = useData()

  useEffect(() => {
    if (isLast && inView) {
      generateNextDataPage()
    }
  }, [isLast, inView, generateNextDataPage])

  return (
    <TableRowMUI component="div" key={index} ref={ref} style={style}>
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
