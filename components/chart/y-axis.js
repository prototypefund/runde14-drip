import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'

import { getTickPositions } from '../helpers/chart'

import SymptomIcon from './symptom-icon'
import TickList from './tick-list'
import ChartLegend from './chart-legend'

import styles from './styles'

export function makeHorizontalGrid(columnHeight, symptomRowHeight) {
  return getTickPositions(columnHeight).map(tick => {
    return (
      <View
        top={tick + symptomRowHeight}
        {...styles.horizontalGrid}
        key={tick}
      />
    )
  })
}

const YAxis = ({ height, symptomsToDisplay, symptomsSectionHeight }) => {
  const symptomIconHeight = symptomsSectionHeight / symptomsToDisplay.length
  return (
    <View>
      <View style={[styles.yAxis, {height: symptomsSectionHeight}]}>
        {symptomsToDisplay.map(symptom => {
          return (
            <SymptomIcon
              key={symptom}
              symptom={symptom}
              height={symptomIconHeight}
            />
          )
        })}
      </View>
      <TickList height={height} />
      <ChartLegend />
    </View>
  )
}

YAxis.propTypes = {
  height: PropTypes.number,
  symptomsToDisplay: PropTypes.array,
  symptomsSectionHeight: PropTypes.number,
}

export default YAxis
