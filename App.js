// import SvgUri from 'react-native-svg-uri';
import logo from './assets/logo.svg';
import aicloy from './assets/aicloy.svg';
import male_normal from './assets/male_normal.svg';
import male_active from './assets/male_active.svg';
import female_normal from './assets/female_normal.svg';
import female_active from './assets/female_active.svg';
import love from './assets/love.svg';
import money from './assets/money.svg';
import study from './assets/study.svg';
import total from './assets/total.svg';
import work from './assets/work.svg';
import setting from './assets/setting.svg';
import button_save from './assets/button_save.png';
import logo_width from './assets/logo_width.png';
import background from './assets/background.png';
import React, { Component } from 'react';
import { StyleSheet, ImageBackground , AsyncStorage, TextInput, Text } from 'react-native';
import { Asset, AppLoading } from 'expo';
import { Saju, Setting } from './Fortune';


let originalGetDefaultPropsText = Text.defaultProps;
Text.defaultProps = function() {
    return {
        ...originalGetDefaultPropsText,
        allowFontScaling: false,
    };
};

let originalGetDefaultPropsTextInput = TextInput.defaultProps;
TextInput.defaultProps = function() {
    return {
        ...originalGetDefaultPropsTextInput,
        allowFontScaling: false,
    };
};

export default class App extends Component {
  state = {
    isLoaded: false,
    isLogin: false,
    userInfo: '',
    fortuneData: undefined
  }

  componentDidMount =() => {
    this.loadInfo()
  }

  loadInfo = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo)
      if(parsedUserInfo !== null && parsedUserInfo  !== undefined){
        this.setState({
          isLogin: true,
          userInfo: parsedUserInfo
        })
        this.getData();
      }else{
        this.setState({
          isLogin: false,
          isLoaded: true,
          userInfo: ''
        })
      }
    } catch(err) {
      this.setState({
        isLogin: false,
      })
      console.log(err)
    } 
  }

  changeUserInfo = () => {
    this.setState({
      isLogin: false
    })
  }

  getData = () => {
    const userInfo = this.state.userInfo;
    fetch(`https://m.search.naver.com/p/csearch/dcontent/external_api/json_todayunse_v2.naver?_callback=window.__jindo2_callback._fortune_my_0&gender=${userInfo.gender}&birth=${userInfo.birth}&solarCal=${userInfo.solarCal}&time=${userInfo.time}`)
    .then((response)=>{
      let data = JSON.stringify(response._bodyInit)
      let temp = data.replace('window.__jindo2_callback._fortune_my_0(','');
      let temp1 = temp.replace(');','');
      let temp2 = temp1.replace('  ','');
      let unse = JSON.parse(temp2)
      let unse1 = eval("("+unse+")")
      this.setState({
        fortuneData: unse1.result,
        // isLoaded: true
      })
    })
  }

  async loadResources() {
    const images = [
      background,
      logo_width,
      button_save
      // logo,
      // love,
      // money,
      // study,
      // total,
      // work,
      // setting,
      // male_normal,
      // male_active,
      // female_normal,
      // female_active,
    ];

    const cacheImages = images.map((image) => {
      console.log('cached')
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages)
  }

  saveInfo = (data)=>{
    const stringData = JSON.stringify(data)
    AsyncStorage.setItem('userInfo', stringData)
    this.loadInfo()
  }

  render() {
    const { isLoaded, isLogin, userInfo } = this.state;
    if(isLoaded){
      return (
        <ImageBackground source={background} style={styles.wrap}>
          { isLogin ? 
          <Saju
           changeUserInfo={this.changeUserInfo}
           fortuneData={this.state.fortuneData}
           love={love}
           money={money}
           study={study}
           total={total}
           work={work}
           setting={setting}
           logo_width={logo_width}
          /> : 
          <Setting
            saveInfo={this.saveInfo}
            userInfo={this.state.userInfo}
            male_normal={male_normal}
            male_active={male_active}
            female_normal={female_normal}
            female_active={female_active}
            button_save={button_save}
          />}
        </ImageBackground >
      );
    }else{
      return (
        <AppLoading
          startAsync={this.loadResources}
          onFinish={() => this.setState({isLoaded: true})}
          onError={console.warn}
        />
        // <View style={styles.wrap}>
        //   <View style={styles.container}>
        //     <View style={styles.logo}>
        //       <SvgUri
        //         width="114"
        //         height="130"
        //         source={logo}
        //       />
        //     </View>
        //     <View style={styles.bottomlogo}>
        //       <SvgUri
        //         width="100"
        //         height="26"
        //         source={aicloy}
        //       />
        //     </View>
        //   </View>
        // </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#ea838d',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
