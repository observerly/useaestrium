import {
  ref,
  watch
} from 'vue'

import {
  parseDDToDMSHumanised,
  parseDDToHMSHumanised
} from '@observerly/celestia'

export interface UseDegreeFormatOptions {
  format: 'dms' | 'hms'
}

export const useDegreeFormat = (
  deg: number,
  options: UseDegreeFormatOptions
) => {
  const { format = 'dms' } = options

  const degree = ref(Infinity)

  const degreeFormat = ref('')

  const applyFormat = (degree: number) => {
    if (format === 'dms') {
      degreeFormat.value = parseDDToDMSHumanised(degree)
    }

    if (format === 'hms') {
      degreeFormat.value = parseDDToHMSHumanised(degree)
    }
  }

  watch(degree, () => {
    applyFormat(deg)
  }, {
    immediate: true
  })

  return {
    degreeFormat
  }
}