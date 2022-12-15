import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  TouchableHighlight,
  Image,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useState,useEffect } from 'react';
import auth from '@react-native-firebase/auth';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


const App=()=> {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:'928576003568-b0uhfil3sp4tps0oivlkadg8ajpgift7.apps.googleusercontent.com',
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  
  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (user) setLoading(true);
  }
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState([]);
  const[user,setUser]=useState([]);
  
 
  const googleSignIn = async () => {
    setLoading(true)
    const { idToken } = await GoogleSignin.signIn().catch((e) => {
      Alert.alert(e.message)
      setLoading(false)
    });
    // Create a Google credential with the token
    const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    await auth().signInWithCredential(googleCredential)
      .then((res) => {
        setUserInfo(res);
        console.log(res);
        //Alert.alert('UserData', JSON.stringify(res))
      }).catch((e) => {
        Alert.alert(e.message)
      });
    const accessToken = await (await GoogleSignin.getTokens()).accessToken;
    // console.log(res);
    console.log(accessToken);
    setLoading(false)
  }
  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      setLoading(false);
      //setuserInfo([]);
    } catch (error) {
      Alert.alert('Your are not signed in!',error.message);
    }
  };
  
  return (
    <>
    <StatusBar barStyle="dark-content" />

    <View style={styles.container}>
      <View style={styles.middle}>
      <Text style={styles.signup}>Login Using Google</Text>
      </View>
      {user &&<View style={styles.dp}>
    <TouchableHighlight
          style={[styles.profileImgContainer, { borderColor: 'blue', borderWidth:2 }]}>
    <Image source={{ uri: user.photoURL }} style={styles.profileImgContainer} />
  </TouchableHighlight>
  </View>}
      <View style={styles.button}>
      <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={googleSignIn}/>
      
      <View style={styles.logout}>
      {!user && <Text style={styles.logouttxt}>You are currently logged out</Text>}
    {user && (
    <View style={styles.textlog}> 
    <Text style={styles.logouttxt}>Welcome {user.displayName}</Text>
    <Button
      loading={loading}
      onPress={googleSignOut}
      title="LogOut"
      color="red"></Button>
  </View>
)}
      </View>
    </View>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#b8b8e0',
},
signup:
{
  marginTop:'20%',
  fontSize:30,
  marginLeft:'10%',
  fontWeight:'bold',
},
middle:{
  alignItems:'baseline',
  justifyContent:'center',
},
button:
{
  flex:1,
  alignItems:'center',
  justifyContent:'center'
},
logout:
{
  alignItems:'center',
  justifyContent:'center',
  marginTop:'3%',
},
profileImgContainer: {
  height: 100,
  width: 100,
  borderRadius: 80,
},
dp:{
  alignItems:'center',
  justifyContent:'center',
  marginTop:'15%'
},
textlog:
{
  alignItems:'center',
  justifyContent:'center',
},
logouttxt:
{
  marginTop:'2%',
  fontSize:20,
  fontWeight:'bold',
},
logbtn:
{
  width: 192, 
  height: 48,
  marginTop:'3%',
},
});
export default App;