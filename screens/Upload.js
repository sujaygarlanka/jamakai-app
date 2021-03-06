import React, { Component } from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator } from "expo-image-crop";
import { Video } from "expo-av";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: null,
      fileName: "",
      isEditorVisible: false,
    };
  }

  handleCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({mediaTypes: ImagePicker.MediaTypeOptions.All});
    if (pickerResult.cancelled === true) {
      return;
    }
    this.setMedia(pickerResult);
  };

  handleChooseMedia = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.All});
    if (pickerResult.cancelled === true) {
      return;
    }
    console.log(pickerResult)
    this.setMedia(pickerResult);
  };

  handleUploadMedia = () => {
    fetch(this.props.uploadEndpoint, {
      method: "POST",
      body: this.createFormData(this.state.media, {}),
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

  setMedia = async (media) => {
    let extension = '.jpg';
    if (media.type == 'video') {
      extension = '.mov'
    }
    let fileName = media.fileName ? media.fileName : this.uuidv4() + extension;
    this.setState({fileName, media})
  };

  // https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
  uuidv4() {
    return "xxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  createFormData = (media, body) => {
    const data = new FormData();
    var mediaBody = {
      name: this.state.fileName,
      type: media.type,
      uri:
        Platform.OS === "android"
          ? media.uri
          : media.uri.replace("file://", ""),
    };
    data.append("file", mediaBody);
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  onToggleEdit = () => {
    const { isEditorVisible } = this.state;
    this.setState({ isEditorVisible: !isEditorVisible });
  };

  render() {
    const { media } = this.state;
    const { width, height } = Dimensions.get("window");
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
        {media && media.type == 'image' && !this.state.isEditorVisible && (
          <React.Fragment>
            <Button title="Edit" onPress={()=> this.setState({isEditorVisible: true})} />
            <Image
              source={{ uri: media.uri }}
              style={{ width: 300, height: 300 }}
            />
            <Button title="Upload" onPress={this.handleUploadMedia} />
          </React.Fragment>
        )}
        {media && media.type == 'video' && !this.state.isEditorVisible && (
          <React.Fragment>
            <Video
              source={{
                uri: media.uri,
              }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={{ width: 300, height: 300 }}
            />
            <Button title="Upload" onPress={this.handleUploadMedia} />
          </React.Fragment>
        )}
        {media && this.state.isEditorVisible && (
          <ImageBackground
            resizeMode="contain"
            style={{
              justifyContent: "center",
              padding: 20,
              alignItems: "center",
              height,
              width,
              backgroundColor: "black",
            }}
            source={media}
          >
            <ImageManipulator
              photo={media}
              isVisible={this.state.isEditorVisible}
              onPictureChoosed={({ uri: uriM }) => {
                let media = { ...this.state.media };
                media.uri = uriM;
                this.setState({ media });
              }}
              onToggleModal={this.onToggleEdit}
            />
          </ImageBackground>
        )}
        <Button title="Choose Media" onPress={this.handleChooseMedia} />
        <Button title="Capture Media" onPress={this.handleCamera} />
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
