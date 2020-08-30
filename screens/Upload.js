import React, { Component } from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      fileName: "",
    };
  }

  handleCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    this.setPhoto(pickerResult);
  };

  handleChoosePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    this.setPhoto(pickerResult);
  };

  handleUploadPhoto = () => {
    fetch(this.props.uploadEndpoint, {
      method: "POST",
      body: this.createFormData(this.state.photo, {}),
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    })
      .then((response) => response.text())
      .then((response) => {
        console.log(response);
        alert(response);
      })
      .catch((error) => {
        console.log("Upload Error", error);
        alert("Upload failed!");
      });
  };

  setPhoto = async (photo) => {
    let fileName = photo.fileName ? photo.fileName : this.uuidv4() + ".jpg";
    this.setState({fileName, photo});
  }

  // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
  uuidv4() {
    return 'xxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  createFormData = (photo, body) => {
    const data = new FormData();
    var photoBody = {
      name: this.state.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android"
          ? photo.uri
          : photo.uri.replace("file://", ""),
    };
    data.append("file", photoBody);
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  render() {
    const { photo } = this.state;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            marginBottom: "5%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            label="File Name"
            value={this.state.fileName}
            mode="outlined"
            onChangeText={(text) => this.setState({ fileName: text })}
            style={{ width: "40%", height: 30 }}
          ></TextInput>
        </View>
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
        <Button title="Take Picture" onPress={this.handleCamera} />
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

function mapStateToProps(state) {
  return {
    uploadEndpoint: state.uploadEndpoint,
  };
}

export default connect(mapStateToProps)(Upload);
