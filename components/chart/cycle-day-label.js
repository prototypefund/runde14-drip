import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { DateTime } from 'luxon'

import AppText from '../common/app-text'

import cycleModule from '../../lib/cycle'
import { getOrdinalSuffix } from '../helpers/format-date'
import { Typography, Sizes } from '../../styles'

const CycleDayLabel = ({ height, date }) => {
  const cycleDayNumber = cycleModule().getCycleDayNumber(date)
  const cycleDayLabel = cycleDayNumber ? cycleDayNumber : ' '

  const d = new DateTime(date)
  const dayOfMonth = d.day
  const isFirstDayOfMonth = dayOfMonth === 1

  return (
    <View style={[styles.container, { height }]}>
      <AppText style={styles.textBold}>{cycleDayLabel}</AppText>
      <View style={styles.dateLabel}>
        <AppText style={styles.text}>
          {isFirstDayOfMonth ? d.toFormat('MMM') : dayOfMonth}
        </AppText>
        {!isFirstDayOfMonth && (
          <AppText style={styles.textLight}>
            {getOrdinalSuffix(dayOfMonth)}
          </AppText>
        )}
      </View>
    </View>
  )
}

CycleDayLabel.propTypes = {
  height: PropTypes.number,
  date: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    left: 4,
  },
  text: {
    ...Typography.label,
    fontSize: Sizes.small,
  },
  textBold: {
    ...Typography.labelBold,
  },
  textLight: {
    ...Typography.labelLight,
  },
  dateLabel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})

export default CycleDayLabel
