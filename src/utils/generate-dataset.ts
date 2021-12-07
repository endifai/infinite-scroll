import { DataItem, DataSet } from '../context/data-provider'

/**
 * generates dataset with random data
 * @param rows - length of dataset
 * @param columns - count of columns in data item (keys will look like A, B, C and etc)
 * @param startIndex
 */
export const generateDataset = (
  rows: number,
  columns: number,
  startIndex: number,
): Promise<DataSet> =>
  new Promise((resolve) => {
    if (columns === 0 || rows === 0) {
      resolve({})
    }

    const data: DataSet = {}

    for (let i = startIndex; i < rows + startIndex; i++) {
      const item: DataItem = {}

      for (let j = 0; j < columns; j++) {
        // get alphabet letter
        const char = String.fromCharCode(65 + j)

        item[char] = Math.round(Math.random() * 1000)
      }

      data[i] = item
    }

    resolve(data)
  })
