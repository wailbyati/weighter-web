export enum BMICategory {
  UNDERWEIGHT = 'UNDERWEIGHT',
  NORMAL_WEIGHT = 'NORMAL_WEIGHT',
  OVERWEIGHT = 'OVERWEIGHT',
  OBESE = 'OBESE'
}

export const categoryNames = new Map([
  [BMICategory.UNDERWEIGHT, 'Niedowaga'],
  [BMICategory.NORMAL_WEIGHT, 'Normalna waga'],
  [BMICategory.OVERWEIGHT, 'Nadwaga'],
  [BMICategory.OBESE, 'Otyłość']
])

export function interpretBMI(bmi: number) {
  if (bmi < 18.5) {
    return BMICategory.UNDERWEIGHT
  } else if (bmi < 25) {
    return BMICategory.NORMAL_WEIGHT
  } else if (bmi < 30) {
    return BMICategory.OVERWEIGHT
  } else {
    return BMICategory.OBESE
  }
}

export function calculateBMI(weight: number, height: number) {
  return weight / ((height / 100) ^ 2)
}
