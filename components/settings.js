import React, { Component } from 'react'
import {
  View,
  Button,
  ScrollView,
  Alert
} from 'react-native'

import Share from 'react-native-share'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import rnfs from 'react-native-fs'
import styles from '../styles/index'
import { settings as labels } from './labels'
import getDataAsCsvDataUri from '../lib/import-export/export-to-csv'
import importCsv from '../lib/import-export/import-from-csv'

export default class Settings extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.homeButtons}>
          <View style={styles.homeButton}>
            <Button
              onPress={ openShareDialogAndExport }
              title={labels.exportLabel}>
            </Button>
          </View>
          <View style={styles.homeButton}>
            <Button
              onPress={ getFileContentAndImport }
              title={labels.importLabel}>
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }
}

async function openShareDialogAndExport() {
  let data
  try {
    data = getDataAsCsvDataUri()
    if (!data) {
      return alertError(labels.errors.noData)
    }
  } catch (err) {
    console.error(err)
    return alertError(labels.errors.couldNotConvert)
  }

  try {
    await Share.open({
      title: labels.exportTitle,
      url: data,
      subject: labels.exportSubject,
      type: 'text/csv',
      showAppsToView: true
    })
  } catch (err) {
    console.error(err)
    return alertError(labels.errors.problemSharing)
  }
}

async function getFileContentAndImport() {
  let fileInfo
  try {
    fileInfo = await new Promise((resolve, reject) => {
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  } catch (err) {
    // because cancelling also triggers an error, we do nothing here
    return
  }

  let fileContent
  try {
    fileContent = await rnfs.readFile(fileInfo.uri, 'utf8')
  } catch (err) {
    return alertError('Could not open file')
  }

  try {
    await importCsv(fileContent, false)
    Alert.alert('Success', 'Data successfully imported')
  } catch(err) {
    alertError(err.message)
  }
}

function alertError(msg) {
  Alert.alert('Error', msg)
}