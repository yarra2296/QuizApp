import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Image,
    Dimensions,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';

const {width, height} = Dimensions.get('window')

export default class QuizExam extends React.Component{

    static navigationOptions = {
        title: '                                        E-Quiz     '
    };

    constructor(props){
        super(props);
        this.state={
            apiData: '',
            isDataRetrieved: false,
        }
    }

    componentWillMount(){
        this.getQuizData();
    }

    getQuizData(){
        console.log("i am in this screen");
        fetch('https://script.googleusercontent.com/macros/echo?user_content_key=PLPrfDxaL-aYZC' +
            'HLCY9pGUWZJf_EoP7DkOgxRgdJ_hchO2vvsuGQtHaZ6mJ8_Ta-5YPRr5nWXcZov4HfG7HbIsi59s2rkp' +
            'R1m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOK_1-56GvUQH1kNBX-uOmg4GK' +
            '9GhjIGAcG_YHCGMGvqabrcVDpi3Jn3tvN1Y0rqGKOIp7sEUsJ2&lib=MpODT7Xv4IZJ_QpO_kTvrjwpx' +
            'QwZcV9pX',)
            .then((response) => response.json())
            .then((response) => {this.setState({apiData: response, isDataRetrieved: true})})
            .catch((error) => {
            console.log(error);
            alert(error)
        })
    }

    ProFun(){
        alert(" You Quitted the Exam, Please Restart the Exam")
    }

    onSubmit(value){
        console.log(' value in parent: ', value);
        this.selection = value
        console.log('values sending to next page:',this.selection)
        AsyncStorage.setItem('selection', JSON.stringify(this.selection))
            .then(json => console.log("Success!"))
            .catch(error => console.log(error))
    };

    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff',}}>
                <Image source={{uri: "http://backgroundcheckall.com/wp-content/uploads/2017/12/quiz-background-images-12.jpg"}} style={{resizeMode: 'center', width: width, height: height}}/>
                {!this.state.isDataRetrieved ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>
                            Loading...
                        </Text>
                    </View> :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', bottom: height-50}}>
                        <Text style={{color: 'green', fontSize: 25, marginTop: 10, marginBottom: 10}}>ALL THE BEST</Text>
                        <Text style={{color: 'blue', fontSize: 15}}>Exam is only for {this.state.apiData.duration}minutes, Please complete it Quick</Text>
                        <Text style={{color: 'blue', fontSize: 15}}>Read the Instructions Carefully</Text>
                        <View style={{marginLeft: 15, flex: 1}}>
                        <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>Instructions:</Text>
                        <Text style={{color: 'blue', fontSize: 15, marginRight: 10, marginBottom: 5}}>1) If you answer the question, it will displayed in GREEN, if Skipped it will be displayed in RED</Text>
                        <Text style={{color: 'blue', fontSize: 15, marginBottom: 5}}>2) No.of Questions: {this.state.apiData.questions.length}</Text>
                        <Text style={{color: 'blue', fontSize: 15, marginBottom: 5}}>3) Marks for each correct answer: 1</Text>
                        <Text style={{color: 'blue', fontSize: 15, marginBottom: 5}}>4) Marks for each negative answer: {this.state.apiData.negativemarks}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center',top: 400 }}>
                        <TouchableHighlight onPress={()=> navigate('Questions', {data: this.state.apiData, callQuizExam: this.ProFun.bind(this), onSubmit: this.onSubmit})} style={{backgroundColor: 'green', marginTop: 20, padding: 20, paddingLeft: 100, paddingRight: 100, borderRadius: 5}}>
                            <Text style={{color: 'white', bottom : 8}}>START EXAM</Text>
                        </TouchableHighlight>
                           {/* <TouchableOpacity onPress={()=> navigate('Resume', {data: this.state.apiData, value: this.state.asyncValues})} style={{backgroundColor: 'blue', marginTop: 20, padding: 20, paddingLeft: 100, paddingRight: 100, borderRadius: 5}}>
                                <Text style={{color: 'white', bottom : 8}}>RESUME EXAM</Text>
                            </TouchableOpacity>*/}
                    </View>
                    </View>}
            </View>
        )
    }
}