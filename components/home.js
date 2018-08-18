import React, { Component } from 'react'
import {
  View,
  Button,
  Text,
  ScrollView
} from 'react-native'
import { LocalDate } from 'js-joda'
import Header from './header'
import styles from '../styles/index'
import cycleModule from '../lib/cycle'
import { getOrCreateCycleDay, bleedingDaysSortedByDate, fillWithDummyData, deleteAll } from '../db'

const getCycleDayNumber = cycleModule().getCycleDayNumber

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.todayDateString = LocalDate.now().toString()
    const cycleDayNumber = getCycleDayNumber(this.todayDateString)

    this.state = {
      welcomeText: determineWelcomeText(cycleDayNumber)
    }

    this.setStateWithCurrentWelcomeText = (function (HomeComponent) {
      return function () {
        const cycleDayNumber = getCycleDayNumber(HomeComponent.todayDateString)
        HomeComponent.setState({
          welcomeText: determineWelcomeText(cycleDayNumber)
        })
      }
    })(this)

    bleedingDaysSortedByDate.addListener(this.setStateWithCurrentWelcomeText)
  }

  componentWillUnmount() {
    bleedingDaysSortedByDate.removeListener(this.setStateWithCurrentWelcomeText)
  }

  passTodayToDayView() {
    const todayDateString = LocalDate.now().toString()
    const cycleDay = getOrCreateCycleDay(todayDateString)
    const navigate = this.props.navigation.navigate
    navigate('CycleDay', { cycleDay })
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>{this.state.welcomeText}</Text>
        <View style={styles.homeButtons}>
          <View style={styles.homeButton}>
            <Button
              onPress={() => this.passTodayToDayView()}
              title="Edit symptoms for today">
            </Button>
          </View>
          <View style={styles.homeButton}>
            <Button
              onPress={() => fillWithDummyData()}
              title="fill with example data">
            </Button>
          </View>
          <View style={styles.homeButton}>
            <Button
              onPress={() => deleteAll()}
              title="delete everything">
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
}

function determineWelcomeText(cycleDayNumber) {
  const welcomeTextWithCycleDay = `Welcome! Today is day ${cycleDayNumber} of your current cycle`
  const welcomeText = `Welcome! We don't have enough information to know what your current cycle day is`
  return cycleDayNumber ? welcomeTextWithCycleDay : welcomeText
}

