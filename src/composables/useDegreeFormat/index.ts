import {
  ref,
  watch
} from 'vue'

import {
  parseDegreeToDMSHumanised,
  parseDegreeToHMSHumanised
} from '@observerly/polaris'

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
      degreeFormat.value = parseDegreeToDMSHumanised(degree)
    }

    if (format === 'hms') {
      degreeFormat.value = parseDegreeToHMSHumanised(degree)
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

export type UseDegreeFormatReturn = ReturnType<typeof useDegreeFormat>

export interface UseDegreeFormatProps extends Partial<UseDegreeFormatReturn> {}