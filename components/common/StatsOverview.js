import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppText from './app-text'

import { Sizes, Spacing, Typography } from '../../styles'

const StatsOverview = ({ data }) => {
  return data.map((rowContent, i) => <Row key={i} rowContent={rowContent} />)
}

StatsOverview.propTypes = {
  data: PropTypes.array.isRequired,
}

const Row = ({ rowContent }) => {
  const showHelp = rowContent[1].includes('deviation') ? true : false

  return (
    <View style={styles.row}>
      <Cell content={rowContent[0]} isLeft />
      <Cell content={rowContent[1]} showHelp={showHelp} />
    </View>
  )
}

Row.propTypes = {
  rowContent: PropTypes.array.isRequired,
}

const Cell = ({ content, isLeft, showHelp }) => {
  const styleContainer = isLeft ? styles.cellLeft : styles.cellRight
  const styleText = isLeft ? styles.accentPurpleBig : styles.accentOrange
  const numberOfLines = isLeft ? 1 : 2
  const ellipsizeMode = isLeft ? 'clip' : 'tail'

  return (
    <View style={styleContainer}>
      <AppText
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={styleText}
      >
        {content}
      </AppText>
      {showHelp && <AppText style={styles.accentPurpleBig}>*</AppText>}
    </View>
  )
}

Cell.propTypes = {
  content: PropTypes.node.isRequired,
  isLeft: PropTypes.bool,
  showHelp: PropTypes.bool,
}

const styles = StyleSheet.create({
  accentOrange: {
    ...Typography.accentOrange,
    fontSize: Sizes.small,
    margin: Sizes.tiny,
  },
  accentPurpleBig: {
    ...Typography.accentPurpleBig,
    marginRight: Spacing.tiny,
  },
  cellLeft: {
    alignItems: 'flex-end',
    flex: 3,
    justifyContent: 'center',
  },
  cellRight: {
    flex: 5,
    flexDirection: 'row',
  },
  row: { flexDirection: 'row' },
})

export default StatsOverview
