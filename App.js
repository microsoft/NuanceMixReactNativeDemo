
/*****
  This is a React Native app that utilizes the NuanceMix API for speech-to-text and text-to-speech conversion. 
  The app has three dialog boxes with different styling options, including a custom footer input, footer listener, and progress bar. 
  The app also includes static text spoken by different voices and languages supported by the NuanceMix API. 
  The app requests user permissions for recording audio and accessing location data. 
  The chat bubbles can be customized for the left and right side of the screen, and one option includes rendering HTML text within the bubble.
*****/
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.


import React, {Node, useRef} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  Modal,
  NativeModules,
  SafeAreaView,
} from 'react-native';
import ProgressBar from 'react-native-animated-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import RenderHtml from 'react-native-render-html';

import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import { NuanceMixInput, NuanceMixText, NuanceMixChat } from 'nuance-mix';

function CustomFooterInput({ value, onSubmitEditing, onChangeText }) {
  return (
    <View style={{marginTop:8}}>
    <View style={{backgroundColor: "black", height:1, width:"90%", alignSelf:"center"}} />
        <TextInput
            style={styles.chatInputStyle}
            value={value}
            onSubmitEditing={onSubmitEditing}
            onChangeText={(text) => onChangeText(text)}
        />
    <View style={{backgroundColor: "black", height:1, width:"90%", alignSelf:"center"}} />  
    </View>
  );
}

function CustomFooterInputTextOnly({ value, onSubmitEditing, onChangeText }) {
  const inputRef = useRef();
  
  return (
    <View style={{marginTop:8}}>
    <View style={{backgroundColor: "black", height:1, width:"90%", alignSelf:"center"}} />
        <TextInput
            style={styles.chatInputStyle}
            value={value}
            onSubmitEditing={onSubmitEditing}
            onChangeText={(text) => onChangeText(text)}
            ref={inputRef}
            onLayout={() => inputRef.current.focus()}
        />
    <View style={{backgroundColor: "black", height:1, width:"90%", alignSelf:"center"}} />  
    </View>
  );
}

function CustomFooterListener({ onPress }) {
  return (
      <Pressable 
        style={styles.button}
        onPress={onPress}>
          <Text style={styles.buttontext}>Listen</Text>
      </Pressable>
  );
}

function CustomFooterProgress({ isAnimating }) {
  return (
    <View style={{marginTop:3}}>
      <ProgressBar height={7} animated={false} indeterminate={isAnimating} trackColor='white' backgroundColor="#44AA00"/>
    </View>
  );
}

function CustomLeftBubble( { key, text } ) {
  return (
    <View style={styles.chatLeft} key={key}>
      <Text style={{ fontWeight: 'bold', fontSize: 12, color: "#000",justifyContent:"center" }} key={key}>{text}</Text>
    </View>

  );
}

function CustomLeftBubbleHtml( { key, text } ) {
  return (
    <View style={styles.chatLeftHtmlView}>
      <RenderHtml key={key} 
        contentWidth={200}
        style={styles.chatLeftHtml}
        source={{html: text}}
        startInLoadingState={true}
      />
    </View>
  );
}

function CustomRightBubble( { key, text } ) {
  return (
    <View style={styles.chatRight} key={key}>
      <Text style={{ fontWeight: 'bold',  fontSize: 12, color: "#fff",justifyContent:"center" }} key={key}>{text}</Text>
    </View>

  );
}

function CustomTTS({ playTts }) {
  return (
    <View style={{marginTop: 20}}>
      <Pressable style={{height:130}}
        onPress={ playTts }>
        <RenderHtml 
          contentWidth={200}
          onPress={ playTts } 
          style={{width: '100%', height: 100}}
          source={{html: '<img style="display: block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="https://audioxpress.com/assets/upload/images/1/20210412175632_Microsoft-Acquisition-NuanceWeb.jpg" width="150" height="112">'}}
          startInLoadingState={true}
        />
      </Pressable>
    </View>
  );
};


const App: () => Node = () => {
  const [modalOneVisible, setModalOneVisible] = React.useState(false);
  const [modalTwoVisible, setModalTwoVisible] = React.useState(false);
  const [modalThreeVisible, setModalThreeVisible] = React.useState(false);
  const NuanceMix = NativeModules.NuanceMix;

  request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((result) => {
    // …
  });
  request(PERMISSIONS.IOS.MICROPHONE).then((result) => {
    // …
  });

  return (
    <SafeAreaView style={{marginTop:30}}>             
      <NuanceMixText
        style={styles.staticText}
        viewStyle={styles.staticContainer}
        voice="Evan"
      >
        Here is some static text using Evan speaking in english.
      </NuanceMixText>   
      <NuanceMixText
        style={styles.staticText}
        viewStyle={styles.staticContainer}
        voice="Paulina-Ml"
        language="es-MX"
        ssml="<speak>Aquí está Paulina hablando español.</speak>"
      >
        Here is Paulina speaking Spanish.
      </NuanceMixText>   
      <NuanceMixText
        TTS={CustomTTS}
        viewStyle={styles.staticCustomContainer}
        ssml='<speak><prosody volume="50">This is so very awesome what</prosody> <prosody volume="90">Microsoft and Nuance</prosody> are doing together!</speak>'
      />
      <NuanceMixInput
        viewStyle={styles.inputContainer}
        style={styles.inputStyle}
        multiline={true}
        Listener={<Icon
                      style={styles.micon}
                      name="microphone"
                      size={20}
                      color="#440044"
                    />
                  }
      />
      <NuanceMixInput
        viewStyle={styles.inputContainer}
        style={styles.inputStyle}
        multiline={true}
        language="fra-CAN"
        Listener={<Pressable 
                      style={styles.button}
                    >
                      <Text style={styles.buttontext}>En français</Text>
                    </Pressable>
                  }
      />
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOneVisible}
        presentationStyle='overFullScreen'
        onRequestClose={() => {
          setModalOneVisible(!modalOneVisible);
          NuanceMix.stopDialog();
        }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Icon
                style={styles.xicon}
                name="close"
                size={20}
                color="#440044"
                onPress={() => {
                  setModalOneVisible(!modalOneVisible);
                  NuanceMix.stopDialog();
                }}
              />
              <NuanceMixChat 
                  viewStyle={styles.chatContainer}
                  footerStyle={styles.chatInputStyle}
              />
            </View>
          </View>
      </Modal>
    </View>
    <Pressable
        style={styles.button}
        onPress={() => setModalOneVisible(true)}>
        <Text style={styles.buttontext}>Dialog Styling Default</Text>
      </Pressable>

      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTwoVisible}
        presentationStyle='overFullScreen'
        onRequestClose={() => {
          setModalTwoVisible(!modalTwoVisible);
          NuanceMix.stopDialog();
        }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Icon
                style={styles.xicon}
                name="close"
                size={20}
                color="#440044"
                onPress={() => {
                  setModalTwoVisible(!modalTwoVisible);
                  NuanceMix.stopDialog();
                }}
              />
              <NuanceMixChat 
                  viewStyle={styles.chatContainer}
                  contextTag="OmniChris"
                  footerStyle={styles.chatInputStyle}
                  FooterListener={CustomFooterListener}
                  FooterProgress={CustomFooterProgress}
                  LeftBubble={CustomLeftBubbleHtml}
                  RightBubble={CustomRightBubble}
                  FooterInput={CustomFooterInput}
              />
            </View>
          </View>
      </Modal>
    </View>
    <Pressable
        style={styles.button}
        onPress={() => setModalTwoVisible(true)}>
        <Text style={styles.buttontext}>Dialog Styling Custom</Text>
      </Pressable>

      <View  style={styles.centeredView}>
      <Modal
        avoidKeyboard
        animationType="slide"
        transparent={true}
        visible={modalThreeVisible}
        presentationStyle='overFullScreen'
        onRequestClose={() => {
          setModalThreeVisible(!modalThreeVisible);
          NuanceMix.stopDialog();
        }}>
          <KeyboardAvoidingView behavior='height' style={styles.keyboardView}>
            <View style={styles.modalView}>
              <Icon
                style={styles.xicon}
                name="close"
                size={20}
                color="#440044"
                onPress={() => {
                  setModalThreeVisible(!modalThreeVisible);
                  NuanceMix.stopDialog();
                }}
              />
              <NuanceMixChat 
                  viewStyle={styles.chatContainer}
                  contextTag="TravelChris"
                  footerStyle={styles.chatInputStyle}
                  FooterInput={CustomFooterInputTextOnly}
                  FooterListener={() => {return(<View/>)}}
                  LeftBubble={CustomLeftBubble}
                  RightBubble={CustomRightBubble}
              />
            </View>
          </KeyboardAvoidingView>
      </Modal>
    </View>
    <Pressable
        style={styles.button}
        onPress={() => setModalThreeVisible(true)}>
        <Text style={styles.buttontext}>Dialog Styling Text Only</Text>
      </Pressable>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  chatLeftHtmlView: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    padding:10,
    marginTop: 5,
    marginLeft: "5%",
    maxWidth: '70%',
    width: '70%',
    height: '100%',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
chatLeftHtml: {
  padding:10,
  alignSelf: 'flex-start',
  borderRadius: 6,
},
chatLeft: {
  backgroundColor: "#aaaaaa",
  padding:10,
  marginTop: 5,
  marginLeft: "5%",
  maxWidth: '70%',
  alignSelf: 'flex-start',
  borderRadius: 6,
},
chatRight: {
    backgroundColor: "#222222",
    padding:10,
    marginTop: 5,
    marginRight: "5%",
    maxWidth: '70%',
    alignSelf: 'flex-end',
    borderRadius: 6,
},
centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'90%',
    height:'90%'
  },
  modalViewTextOnly: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'90%',
    height:'90%'
  },
  chatButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  chatButtonOpen: {
    backgroundColor: '#336600',
  },
  chatButtonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },  
  chatIcon: {
    marginTop:2,
    marginBottom:2,
    marginLeft: "50%",
  },
  micon: {
    position: "absolute",
    top: '50%',
    right: 8,
  },
  xicon: {
    position: "absolute",
    top: '1%',
    right: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#336600',
    alignSelf: 'center',
  },
  buttontext: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  chatContainer: {
    marginTop: 20,
    height: "95%",
    width: '90%',
    marginLeft: 5,
    marginRight: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  staticCustomContainer: {
    height: 130,
  },
  staticContainer: {
    marginTop: 30,
    paddingHorizontal: 24,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#003300",
  },
  staticText: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: "white",
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 34,
    fontSize: 14,
    fontWeight: '600',
  },
  inputStyle: {
    marginTop: 20,
    paddingHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  chatInputStyle: {
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 24,
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    color:"black"
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#0078fe",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },
  
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20
  
  },
  
  /*Arrow head for recevied messages*/
  leftArrow: {
      position: "absolute",
      backgroundColor: "#dedede",
      //backgroundColor:"red",
      width: 20,
      height: 25,
      bottom: 0,
      borderBottomRightRadius: 25,
      left: -10
  },
  
  leftArrowOverlap: {
      position: "absolute",
      backgroundColor: "#eeeeee",
      //backgroundColor:"green",
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomRightRadius: 18,
      left: -20
  
  },});

export default App;
