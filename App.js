import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {View, Text, Image, Button, StyleSheet} from 'react-native';
import * as ImagePicker from "expo-image-picker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      urlEndpoint: "",
    };
  }

  handleChoosePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    this.setState({photo: pickerResult})
    console.log(pickerResult);
  };

  handleUploadPhoto = () => {
    fetch('http://192.168.1.178:5000/digits', {
      method: 'POST',
      body: this.createFormData(this.state.photo, {}),
      headers: {
        'Content-Type': 'multipart/form-data;',
      },
    })
      .then(response => response.text())
      .then(response => {
        console.log(response);
        alert(response);
      })
      .catch(error => {
        console.log('Upload Error', error);
        alert('Upload failed!');
      });
  };

  createFormData = (photo, body) => {
    const data = new FormData();
    var photoBody = {
      name: photo.fileName == null ? 'guava' : photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    };
    data.append('file', photoBody);
    console.log(photoBody)
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  render() {
    const { photo } = this.state;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {photo && (
          <React.Fragment>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 300, height: 300 }}
            />
            <Button title="Upload" onPress={this.handleUploadPhoto} />
          </React.Fragment>
        )}
        <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
