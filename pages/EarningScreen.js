import React,{ Component} from 'react';
import { Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Alert,
ActivityIndicator,
FlatList} from 'react-native';
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container, Card, Thumbnail, Body, Right, Left, CardItem,Button, Icon, Header,Title} from 'native-base';

var {height, width} = Dimensions.get('window');
var dateFormat = require('dateformat');
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class riderDetails extends Component{
  _listeners = [];
  constructor(props) {
    super(props);
    this.ref = firestore();
    this.unsubscribe = null;
    this.state = {
      user: null,
      email: "",
      password: "",
      formValid: true,
      error: "",
      loading: false,
      dataSource: [],
      uid:'',
      store_path: '',
      currentDate: new Date(),
      printModal: false,
      devices: null,
      pairedDs:[],
      foundDs: [],
      bleOpend: false,
      open: false,
      loading: false,
      boundAddress: '',
      debugMsg: '',
      visibleModal: false,
      store_key:'',
      name:'',
      store_name:'',
      address:'',
      city:'',
 
    };
     }
         
  onCollectionUpdate = (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
     orders.push ({
            datas : doc.data(),
            key : doc.id
            });
    })
console.log('orders: ', orders)
    this.setState({
      dataSource : orders,
      loading: false,
   })

  }

  TotalAmount(){
    let total = 0
  this.state.dataSource.forEach((item) => {
    total += this.OverallTotal(item.datas.Products) + item.datas.delivery_charge + item.datas.extraKmCharge
  
})
return total;
  }

  
  OverallTotal(items){
    let total = 0
  items.forEach((item) => {
    if(item.sale_price){
      total += item.sale_price * item.qty
  }else{
      total += item.price * item.qty
  }    
})
return total;
}


  onRiderClear(){
    Alert.alert(
      'Confirmation',
      'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({visibleModal2: false}),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => this.saveRiderReport() }
      ],
      { cancelable: false }
    );
  }

  saveRiderReport(){
    const today = this.state.currentDate;
    const date_ordered = moment().format('MMMM Do YYYY, h:mm:ss a');
    const week_no = moment().format('MMDDYYYY').isoWeek();
    const time =  moment().format('h:mm:ss a');
    const date = moment().format('MMMM D, YYYY');
    const newDocumentID = firestore().collection('rider_report').doc().id;
    const userId = auth().currentUser.uid;
    this.ref.collection('rider_report').doc(newDocumentID).set({
        Date: date,
        Rider_Id: this.state.id,
        Orders: this.state.dataSource,
        Total_Delivery: this.state.dataSource.length,
        Total_Amount: this.TotalAmount(),
        id: newDocumentID
    })
  }

  _bootstrapAsync = (id) =>{
    const today = this.state.currentDate;
  
    const date_ordered = moment(today).format('MMMM Do YYYY, h:mm:ss a');
    const week_no = moment(today , "MMDDYYYY").isoWeek();
    const time =  moment(today).format('h:mm:ss a');
    const date = moment().format('MMMM D, YYYY');
    let Name = 'id';
    let Date = 'Date';
    let path = 'DeliveredBy.'+'id';
    let paths = 'OrderDetails.'+'Date';
      this.unsubscribe = this.ref.collection('orders').where('DeliveredBy.id', '==', id)
      .where('OrderDetails.Date','==', date).onSnapshot(this.onCollectionUpdate) ;
    };


   async componentDidMount() {
    const uid= await AsyncStorage.getItem('usertoken');
    this.setState({loading: true})
    console.log(uid)
    this._bootstrapAsync(uid);
  }
  


  render(){
    console.log('earnings: ', this.state.dataSource)
    return (
      <Container>
  
        <Header androidStatusBarColor="#2c3e50" style={{display:'none'}} style={{backgroundColor: 'white'}}>
          <Left style={{flex:1}}>      
              
          </Left>
          <Body style={{flex: 3}}>
            <Title style={{color:'tomato'}}>Rider Delivery Details</Title>
          </Body>
          <Right style={{flex:1}}>
              <Button transparent  onPress={()=> this.setState({printModal: true})}>
                    <Icon style={{color:'tomato'}} name='md-print' />
                 </Button> 
          </Right>
        </Header>

        <ScrollView style={{ backgroundColor: "white" }}>
        
        <View>
        <Card transparent> 
            <CardItem style={{backgroundColor:'lightblue'}}>
              <Left>
                <Text >Order #</Text>
              </Left>
              <Body>
                <Text> Status</Text>
              </Body>
              <Body>
                <Text> Date</Text>
              </Body>
              <Right>
                <Text>Total</Text>
              </Right>
            </CardItem>
        </Card>
        <FlatList
               data={this.state.dataSource}
               renderItem={({ item }) => (            
            <Card transparent>
              <CardItem button onPress={() => this.props.navigation.navigate('OrderDetails',{ 'orders' : item.datas, 'path' : this.state.store_path })} >
                <Left style={{flex:1}}>
                <Text style={{fontSize: 10, fontWeight: 'bold', marginBottom: 10}}>
                    #00{item.datas.OrderNo}
                  </Text>
                </Left>
                <Body style={{paddingLeft: 5,flex:1,}}>
                  
                  <Text note style={{fontSize: 10, fontWeight: 'bold'}}>{item.datas.OrderStatus}</Text>
   
                </Body>
                <Body style={{paddingLeft: 5, flex: 1}}>
                  
                  <Text note style={{fontSize: 10, fontWeight: 'bold'}}>{item.datas.OrderDetails.Date}</Text>
   
                </Body>
                <Right style={{textAlign: 'right'}}>
                  <Text style={{fontSize: 10, fontWeight: 'bold', marginBottom: 10}}>₱{Math.round((this.OverallTotal(item.datas.Products) + item.datas.delivery_charge + item.datas.extraKmCharge)*10)/10}</Text>
                </Right>
                </CardItem>
            </Card>
           )}
           keyExtractor={item => item.key}
       />
        
          <View style={{borderTopColor: 'black', borderTopWidth: 2,borderStyle: 'dashed',  borderRadius: 1}}/>
          <CardItem>
            <Left>
              <Text style={{ color: 'tomato'}}>Total</Text>
            </Left>
            <Right>
              <Text style={{ color:'tomato'}}>
              ₱{Math.round(this.TotalAmount()*10)/10}
              </Text>
            </Right>
          </CardItem>
     </View>  
     <View style={{borderTopColor: 'black', borderTopWidth: 2,borderStyle: 'dashed',  borderRadius: 1}}/>
     <View>
          <CardItem>
            <Left>

            </Left>
            <Body>
              <Text style={{ color: 'tomato'}}>Summary</Text>
            </Body>
            <Right>
             
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={{ color: 'tomato'}}>Total No. of Orders Delivered:</Text>
            </Left>
            <Right>
              <Text style={{ color:'tomato'}}>
             {this.state.dataSource.length}
              </Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
               <Text style={{color:'limegreen'}}>Total </Text>
            </Left>
            <Right>
               <Text style={{color:'limegreen'}}>₱{Math.round(this.TotalAmount()*10)/10}</Text>          
            </Right>
          </CardItem>
     </View>  
       
        </ScrollView>
      </Container>
    );
}
}

export default riderDetails;

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7',
    marginBottom: 10,
    marginTop: 10
  },
  invoice: {
      padding: 20,
      backgroundColor:"#FFFFFF",
      borderWidth: 0.2,
      borderBottomColor: '#ffffff',
      borderTopColor: '#ffffff',

    },
    centerElement: {justifyContent: 'center', alignItems: 'center'},
    content: {
      backgroundColor: 'white',
      padding: 22,
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
     container: {
        backgroundColor: '#F5FCFF',
        paddingVertical: 20
    },

    title:{
        width:width,
        backgroundColor:"#eee",
        color:"#232323",
        paddingLeft:8,
        textAlign:"left"
    },
    wtf:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal: 10
    },
    name:{
        flex:1,
        textAlign:"left"
    },
    address:{
        flex:1,
        textAlign:"right"
    }
});
