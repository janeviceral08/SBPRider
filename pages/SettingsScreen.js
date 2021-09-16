//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Alert,ScrollView } from 'react-native';
import {Card, CardItem, Left, Right, Body, Container,Thumbnail} from 'native-base';
import SwitchToggle from 'react-native-switch-toggle';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import all the basic component we have used
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);    
    this.ref = firestore();
    this.unsubscribe = null;
    this.state = {
      image:'',
      name:'',
      email:'',
      number:'',
      status: true,
      uid:''
    };
    
  }

  _bootstrapAsync =async () =>{
    const uid= await AsyncStorage.getItem('usertoken');
    this.unsubscribe = this.ref.collection('riders').where('userId', '==', uid ).onSnapshot(this.onCollectionUpdate);
    this.setState({ 'uid': uid })
    };


  onCollectionUpdate = (querySnapshot) => {
    const rider = [];
    querySnapshot.forEach((doc) => {
      this.setState({
        name:doc.data().Name,
        email: doc.data().Email,
        number:doc.data().Mobile,

     });
    });
  }
  componentDidMount() {  
    this._bootstrapAsync();
  }

 
  
  _updateAuthStatus = () =>{
    Alert.alert(
        'Notice',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.signOut()},
        ],
        {cancelable: false},
      );
  }

    signOut=async () =>{
        auth().signOut().then(user => {     
             AsyncStorage.setItem('usertoken','');      
            this.props.navigation.navigate('Auth')    
        });
      }
    
  //Setting Screen to show in Setting Option
  render() {
    return (
      <ScrollView>
      <Card>
        <CardItem>
        <Thumbnail small source={require('../assets/rider.png')}/>
              <Body style={{paddingLeft: 10}}>
              
                  <Text style={{fontSize: 13, fontWeight:'bold'}}>{this.state.name}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold'}}>Email :</Text>{this.state.email}</Text>
                  <Text note style={{fontSize: 10}}><Text style={{fontWeight: 'bold'}}>Mobile # :</Text> {this.state.number}</Text>
              </Body>
              <Right>
                
              </Right>
        </CardItem>
      
      </Card>
      <Card>
        <CardItem style={{marginVertical: 5, paddingRight: 0}} button onPress={() =>  this._updateAuthStatus()}>
         <Text>SIGN OUT</Text>
         
         <Right style={{paddingRight: 0}}>
            <AntDesign name="poweroff" size={20} color='red' />
         </Right>
       </CardItem>
      </Card>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});