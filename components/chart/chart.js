import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Dimensions,
  FlatList,
  PixelRatio,
  StyleSheet,
  View,
} from 'react-native'

import AppLoadingView from '../common/app-loading'
import AppPage from '../common/app-page'
import AppText from '../common/app-text'

import DayColumn from './day-column'
import HorizontalGrid from './horizontal-grid'
import LoadingMoreView from './loading-more'
import NoData from './no-data'
import Tutorial from './tutorial'
import YAxis from './y-axis'

import { getCycleDaysSortedByDate } from '../../db'
import { getChartFlag, setChartFlag } from '../../local-storage'
import { makeColumnInfo, nfpLines } from '../helpers/chart'

import {
  CHART_COLUMN_WIDTH,
  CHART_GRID_LINE_HORIZONTAL_WIDTH,
  CHART_SYMPTOM_HEIGHT_RATIO,
  CHART_XAXIS_HEIGHT_RATIO,
  SYMPTOMS,
} from '../../config'
import { shared } from '../../i18n/en/labels'
import { Spacing } from '../../styles'

class CycleChart extends Component {
  static propTypes = {
    navigate: PropTypes.func,
    end: PropTypes.bool,
    setDate: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {}
    this.cycleDaysSortedByDate = getCycleDaysSortedByDate()
    this.getFhmAndLtlInfo = nfpLines()
    this.shouldShowTemperatureColumn = false

    this.checkShouldShowHint()
    this.prepareSymptomData()
  }

  checkShouldShowHint = async () => {
    const flag = await getChartFlag()
    const shouldShowHint = flag === 'true' ? true : false
    this.setState({ shouldShowHint })
  }

  setShouldShowHint = async () => {
    await setChartFlag()
    this.setState({ shouldShowHint: false })
  }

  onLayout = () => {
    if (this.state.chartHeight) return false

    this.reCalculateChartInfo()
  }

  prepareSymptomData = () => {
    this.symptomRowSymptoms = SYMPTOMS.filter((symptomName) => {
      return this.cycleDaysSortedByDate.some((cycleDay) => {
        return symptomName !== 'temperature' && cycleDay[symptomName]
      })
    })
    this.chartSymptoms = [...this.symptomRowSymptoms]
    if (this.cycleDaysSortedByDate.some((day) => day.temperature)) {
      this.chartSymptoms.push('temperature')
      this.shouldShowTemperatureColumn = true
    }
  }

  renderColumn = ({ item, index }) => {
    return (
      <DayColumn
        setDate={this.props.setDate}
        dateString={item}
        index={index}
        navigate={this.props.navigate}
        symptomHeight={this.symptomHeight}
        columnHeight={this.columnHeight}
        symptomRowSymptoms={this.symptomRowSymptoms}
        chartSymptoms={this.chartSymptoms}
        shouldShowTemperatureColumn={this.shouldShowTemperatureColumn}
        getFhmAndLtlInfo={this.getFhmAndLtlInfo}
        xAxisHeight={this.xAxisHeight}
      />
    )
  }

  reCalculateChartInfo = () => {
    const { width, height } = Dimensions.get('window')

    this.xAxisHeight = height * 0.7 * CHART_XAXIS_HEIGHT_RATIO
    const remainingHeight = height * 0.7 - this.xAxisHeight
    this.symptomHeight = PixelRatio.roundToNearestPixel(
      remainingHeight * CHART_SYMPTOM_HEIGHT_RATIO
    )
    this.symptomRowHeight =
      PixelRatio.roundToNearestPixel(
        this.symptomRowSymptoms.length * this.symptomHeight
      ) + CHART_GRID_LINE_HORIZONTAL_WIDTH
    this.columnHeight = remainingHeight - this.symptomRowHeight
    const chartHeight = this.shouldShowTemperatureColumn
      ? height * 0.7
      : this.symptomRowHeight + this.xAxisHeight
    const numberOfColumnsToRender = Math.round(width / CHART_COLUMN_WIDTH)
    const columns = makeColumnInfo()

    this.setState({ columns, chartHeight, numberOfColumnsToRender })
  }

  render() {
    const {
      chartHeight,
      chartLoaded,
      shouldShowHint,
      numberOfColumnsToRender,
    } = this.state
    const hasDataToDisplay = this.chartSymptoms.length > 0

    return (
      <AppPage
        contentContainerStyle={styles.pageContainer}
        onLayout={this.onLayout}
        scrollViewStyle={styles.page}
      >
        {!hasDataToDisplay && <NoData navigate={this.props.navigate} />}
        {hasDataToDisplay && !chartHeight && !chartLoaded && <AppLoadingView />}
        <View style={styles.chartContainer}>
          {shouldShowHint && chartLoaded && (
            <Tutorial onClose={this.setShouldShowHint} />
          )}
          {hasDataToDisplay &&
            chartLoaded &&
            !this.shouldShowTemperatureColumn && (
              <View style={styles.centerItem}>
                <AppText style={styles.warning}>
                  {shared.noTemperatureWarning}
                </AppText>
              </View>
            )}
          {hasDataToDisplay && (
            <View style={styles.chartArea}>
              {chartHeight && chartLoaded && (
                <YAxis
                  height={this.columnHeight}
                  symptomsToDisplay={this.symptomRowSymptoms}
                  symptomsSectionHeight={this.symptomRowHeight}
                  shouldShowTemperatureColumn={this.shouldShowTemperatureColumn}
                  xAxisHeight={this.xAxisHeight}
                />
              )}

              {chartHeight && (
                <FlatList
                  horizontal={true}
                  inverted={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.columns}
                  renderItem={this.renderColumn}
                  keyExtractor={(item) => item}
                  initialNumToRender={numberOfColumnsToRender}
                  windowSize={30}
                  onLayout={() => this.setState({ chartLoaded: true })}
                  onEndReached={() => this.setState({ end: true })}
                  ListFooterComponent={<LoadingMoreView end={this.state.end} />}
                  updateCellsBatchingPeriod={800}
                  contentContainerStyle={{ height: chartHeight }}
                />
              )}
              {chartHeight && chartLoaded && (
                <React.Fragment>
                  {this.shouldShowTemperatureColumn && (
                    <HorizontalGrid height={this.columnHeight} />
                  )}
                </React.Fragment>
              )}
            </View>
          )}
        </View>
      </AppPage>
    )
  }
}

const styles = StyleSheet.create({
  chartArea: {
    flexDirection: 'row',
  },
  chartContainer: {
    flexDirection: 'column',
  },
  page: {
    marginVertical: Spacing.small,
  },
  pageContainer: {
    paddingHorizontal: Spacing.base,
  },
  warning: {
    padding: Spacing.large,
  },
})

export default CycleChart
