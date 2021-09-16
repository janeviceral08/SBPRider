import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text } from 'native-base';
import Processing from './orders/Processing';
import Delivered from './orders/Delivered';

export default class TabsAdvancedExample extends Component {
  render() {
    return (
      <Container>
        <Tabs>
          <Tab heading="Processing" tabStyle={{backgroundColor: '#FFFFFF'}} textStyle={{color: 'tomato'}} activeTabStyle={{backgroundColor: 'tomato'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Processing navigation={this.props.navigation}/>
          </Tab>
          <Tab heading="Delivered" tabStyle={{backgroundColor: '#FFFFFF'}} textStyle={{color: 'tomato'}} activeTabStyle={{backgroundColor: 'tomato'}} activeTextStyle={{color: '#fff', fontWeight: 'normal'}}>
            <Delivered navigation={this.props.navigation}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}