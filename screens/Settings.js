import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Title, Headline, TextInput } from "react-native-paper";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envCheck: "live",
      IP: {
        live: "jamakai.herokuapp.com",
        debug: "192.168.4.25:5000",
      },
      pathCheck: "digits",
      path: {
        digits: "/digits",
        images: "/images",
        custom: "/",
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      let domain = this.state.IP[this.state.envCheck];
      let path = this.state.path[this.state.pathCheck];
      let fullEndpoint = "http://" + domain + path;
      this.props.set({uploadEndpoint: fullEndpoint})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Headline style={{ fontSize: 30, marginBottom: "10%" }}>
          Settings
        </Headline>
        <View style={{ marginBottom: "10%" }}>
          <Title>Environment</Title>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="live"
              status={this.state.envCheck === "live" ? "checked" : "unchecked"}
              onPress={() => this.setState({ envCheck: "live" })}
            />
            <Text>Live - </Text>
            <Text style={{ color: "gray" }}>{this.state.IP.live}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="debug"
              status={this.state.envCheck === "debug" ? "checked" : "unchecked"}
              onPress={() => this.setState({ envCheck: "debug" })}
            />
            <Text>Debug - </Text>
            <TextInput
              label="IP Address"
              value={this.state.IP.debug}
              mode="outlined"
              onChangeText={(text) => {
                let IP = { ...this.state.IP };
                IP.debug = text;
                this.setState({ IP });
              }}
              style={{ flex: 1, height: 30 }}
            />
          </View>
        </View>
        <View>
          <Title>Path</Title>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="digits"
              status={
                this.state.pathCheck === "digits" ? "checked" : "unchecked"
              }
              onPress={() => this.setState({ pathCheck: "digits" })}
            />
            <Text>Recognize Digits - </Text>
            <Text style={{ color: "gray" }}>{this.state.path.digits}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="images"
              status={
                this.state.pathCheck === "images" ? "checked" : "unchecked"
              }
              onPress={() => this.setState({ pathCheck: "images" })}
            />
            <Text>Upload Image - </Text>
            <Text style={{ color: "gray" }}>{this.state.path.images}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="custom"
              status={
                this.state.pathCheck === "custom" ? "checked" : "unchecked"
              }
              onPress={() => this.setState({ pathCheck: "custom" })}
            />
            <Text>Custom - </Text>
            <TextInput
              label="Custom"
              value={this.state.path.custom}
              mode="outlined"
              onChangeText={(text) => {
                let path = { ...this.state.path };
                path.custom = text;
                this.setState({ path });
              }}
              style={{ flex: 1, height: 30 }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "5%",
  },
});

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    set: (data) => dispatch({ type: "SET", data: data }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
