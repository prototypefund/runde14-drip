import React, { Component } from 'react'
import { View, BackHandler } from 'react-native'
import Header from './header'
import Menu from './menu'
import Home from './home'
import Calendar from './calendar'
import CycleDay from './cycle-day/cycle-day-overview'
import symptomViews from './cycle-day/symptoms'
import Chart from './chart/chart'
import SettingsMenu from './settings/settings-menu'
import settingsViews from './settings'
import Stats from './stats'
import {headerTitles, menuTitles} from '../i18n/en/labels'
import InfoSymptom from './cycle-day/symptoms/info-symptom'
import setupNotifications from '../lib/notifications'

// design wants everyhting lowercased, but we don't
// have CSS pseudo properties
const headerTitlesLowerCase = Object.keys(headerTitles).reduce((acc, curr) => {
  acc[curr] = headerTitles[curr].toLowerCase()
  return acc
}, {})
const menuTitlesLowerCase = Object.keys(menuTitles).reduce((acc, curr) => {
  acc[curr] = menuTitles[curr].toLowerCase()
  return acc
}, {})

const isSymptomView = name => Object.keys(symptomViews).includes(name)
const isSettingsView = name => Object.keys(settingsViews).includes(name)
const isMenuItem = name => Object.keys(menuTitles).includes(name)

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 'Home'
    }
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress)
    setupNotifications(this.navigate)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  navigate = (pageName, props) => {
    // for the back button to work properly, we want to
    // remember two origins: which menu item we came from
    // and from where we navigated to the symptom view (day
    // view or home page)
    if (isMenuItem(this.state.currentPage)) {
      this.menuOrigin = this.state.currentPage
    }
    if (this.state.currentPage !== 'InfoSymptom') {
      this.originForSymptomView = this.state.currentPage
    }
    this.setState({currentPage: pageName, currentProps: props})
  }

  handleBackButtonPress = () => {
    if (this.state.currentPage === 'Home') return false
    if (isSymptomView(this.state.currentPage)) {
      this.navigate(
        this.originForSymptomView, { date: this.state.currentProps.date }
      )
    } else if (isSettingsView(this.state.currentPage)) {
      this.navigate('SettingsMenu')
    } else if (this.state.currentPage === 'CycleDay') {
      this.navigate(this.menuOrigin)
    } else if (this.state.currentPage === 'InfoSymptom') {
      this.navigate(
        this.originForSymptomView, { date: this.state.currentProps.date }
      )
    } else {
      this.navigate('Home')
    }
    return true
  }

  isDefaultView() {
    return this.state.currentPage !== 'CycleDay' &&
      !isSymptomView(this.state.currentPage) &&
      this.state.currentPage !== 'InfoSymptom'
  }

  render() {
    const page = {
      Home, Calendar, CycleDay, Chart, InfoSymptom,
      SettingsMenu, ...settingsViews, Stats, ...symptomViews
    }[this.state.currentPage]
    return (
      <View style={{flex: 1}}>
        {this.isDefaultView() &&
          <Header
            title={headerTitlesLowerCase[this.state.currentPage]}
          />
        }
        {this.state.currentPage === 'InfoSymptom' &&
          <Header
            title={headerTitlesLowerCase[this.state.currentPage]}
            goBack={this.handleBackButtonPress}
          />
        }
        {isSymptomView(this.state.currentPage) &&
          <Header
            title={headerTitlesLowerCase[this.state.currentPage]}
            isSymptomView={true}
            goBack={this.handleBackButtonPress}
            date={this.state.currentProps.date}
            goToSymptomInfo={() => this.navigate('InfoSymptom', {
              date: this.state.currentProps.date,
              symptomView: this.state.currentPage,
              cycleDay: this.state.currentProps.cycleDay
            })}
          />}


        {React.createElement(page, {
          navigate: this.navigate,
          ...this.state.currentProps
        })}

        {!isSymptomView(this.state.currentPage) &&
          <Menu
            navigate={this.navigate}
            titles={menuTitlesLowerCase}
            currentPage={this.state.currentPage}
          />
        }
      </View>
    )
  }
}
