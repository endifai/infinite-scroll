import { DataSet } from '../context/data-provider'
import { DATASET_KEY } from './constants'

export const saveDatasetToLS = (dataset: DataSet): void => {
  const json = JSON.stringify(dataset)

  window.localStorage.setItem(DATASET_KEY, json)
}

export const getDatasetFromLS = (): DataSet =>
  JSON.parse(window.localStorage.getItem(DATASET_KEY) ?? '{}')
