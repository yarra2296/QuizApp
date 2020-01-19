import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    SectionList,
    ScrollView,
    BackHandler,
    AsyncStorage
} from 'react-native';
import * as Progress from 'react-native-progress';
import CountdownCircle from 'react-native-countdown-circle'

const {width, height} = Dimensions.get('window')



export default class ResumeExam extends React.Component{

    static navigationOptions = {
        title: '                         E-Quiz     ', header: null
    };

    constructor(props){
        super(props)
        this.state={
            questionNumber: 0,
            optionNumber: 0,
            skippedQuestions: false,
            answersArray: [],
            skip:[],
            answeredCount: 0,
            skipped: false,
            option: [{answer: 'Tamil'}],
            Screen : false,
            asyncValues: '',
            unAnsweredOptions: ''
        }
    }

    componentWillMount(){
        AsyncStorage.getItem("selection")
            .then(value=>this.unAnsweredQuestions(value))
            .then(value=>this.setState({asyncValues: value}))
            .then(value=>alert(value))
            .catch(error=>console.log(error))

    }

    unAnsweredQuestions(data){
        const { params } =  this.props.navigation.state
        const a = data
        this.state.unAnsweredQuestions = params.data.questions.filter(function(o1){
            return !a.some(function(o2){
                return o1.question === o2.question;          // assumes unique id
            });
        })
        alert(this.state.unAnsweredQuestions)
        return this.state.unAnsweredQuestions
    }

    PreviousQuestion(){
        this.setState({
            questionNumber: this.state.questionNumber-1,
            optionNumber: 0
        })
    }

    SkipQuestion() {
        const {params} = this.props.navigation.state
        let skippedquestions = this.state.skippedQuestions
        let length = params.data.questions.length
        var a = this.state.skip.indexOf(this.state.questionNumber)
        if(a != -1){
            alert("This Question is already Skipped:")
        }
        else {
            this.state.skip.push(this.state.questionNumber)
        }
        if (this.state.questionNumber+1 < length) {
            this.setState({
                questionNumber: this.state.questionNumber + 1,
                optionNumber: 0,
                skippedQuestions: true,
            })
        }
        else{
            this.setState({
                questionNumber: this.state.questionNumber - 1,
                optionNumber: 0,
                skippedQuestions: true,
            })
        }
    }


    NextQuestion(){
        this.setState({
            questionNumber: this.state.questionNumber+1,
            optionNumber: 0
        })
    }

    sendSelectedOption(answer){
        const {params} = this.props.navigation.state
        const answercorrect = params.data.questions[this.state.questionNumber].answer
        const selectedAnswerData = {answer: answer.choice}
        this.state.option.push(selectedAnswerData)
        this.setState({
            answeredCount: this.state.answeredCount+1,
        })
        const a = {
            optionSelected: answer.key,
            optionChoice: params.data.questions[this.state.questionNumber].options[answer.key-1].choice,
            value: params.data.questions[this.state.questionNumber].answer,
            valueChoice: params.data.questions[this.state.questionNumber].options[answercorrect-1].choice,
            questionno: this.state.questionNumber,
            question: params.data.questions[this.state.questionNumber].question,
            options: params.data.questions[this.state.questionNumber].options
        }
        let obj = this.state.answersArray.find(o => o.questionno === this.state.questionNumber);
        if(obj) {
            objIndex = this.state.answersArray.findIndex((obj => obj.questionno === this.state.questionNumber));
            this.state.answersArray[objIndex].optionSelected = answer.key
            this.state.answersArray[objIndex].optionChoice = answer.choice
        }
        else {
            this.state.answersArray.push(a)
        }
    }

    openSkippedQuestion(questionNumber){
        this.setState({
            questionNumber: questionNumber,
            optionNumber: 0,
            skipped: true,
        })
        var index = this.state.skip.indexOf(questionNumber);
        if (index !== -1) this.state.skip.splice(index, 1);
    }

    postOptions(opt, key){
        let obj = this.state.answersArray.find(o => o.questionno === this.state.questionNumber);
        if(obj){
            if(obj.optionChoice===opt.choice){
                return(<Text
                    style={{
                        fontSize: 20, marginLeft: 10,
                        color: 'green',
                    }}>{key+1+')   '+opt.choice}
                </Text>)
            }
            else{
                return(<Text
                    style={{
                        fontSize: 20, marginLeft: 10,
                        color: 'black',
                    }}>{key+1+')   '+opt.choice}
                </Text>)
            }
        }
        else{
            return(<Text
                style={{
                    fontSize: 20, marginLeft: 10,
                    color: 'black',
                }}>{key+1+')   '+opt.choice}
            </Text>)
        }
    }

    render(){
        const { params } = this.props.navigation.state;
        const { navigate } = this.props.navigation;
        const questionsLength = params.data.questions.length-1
        return(
            <View style={{flex: 1, backgroundColor: '#ffffff', paddingTop: 5}}>
                {this.state.asyncValues===null ? <Text>No exam is Present, Please Write a New Exam</Text> :
                    <View>
                <View style={{flexDirection:'row',justifyContent: 'space-between', right: 20}}>
                    <View>
                        <Text style={{color: 'red', left: width/2, fontSize: 25, top: 3}}>
                            Quiz
                        </Text>
                    </View>
                    <View>
                        <Text style={{fontSize: 15,color: 'red', top: 3}}>
                            Timer:
                        </Text>
                        <CountdownCircle
                            seconds={60}
                            radius={30}
                            borderWidth={8}
                            color="#ff003f"
                            bgColor="#fff"
                            textStyle={{ fontSize: 20, color: 'red' }}
                            onTimeElapsed={() => navigate('Answers', {value: this.state.answersArray, data: params.data}, this.setState({Screen: true}))}
                        />
                    </View>
                </View>
                <View style={{borderWidth: 1, borderColor: 'red'}}/>
                <View style={{left: width/2-90}}>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>REVIEWED QUESTIONS</Text>
                </View>
                {!this.state.skippedQuestions ? <View style={{marginBottom: 15}}><Text>No Reviewed Questions</Text></View>:
                    <View style={{borderWidth: 1, borderColor: '#f2f2f2' }}><SectionList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        sections={[ {data: this.state.skip}]}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) => <TouchableOpacity onPress={()=>this.openSkippedQuestion(item)}><View><Text style={{padding: 10, margin: 10, backgroundColor: 'yellow'}}>{item+1}</Text></View></TouchableOpacity>}
                    /></View>}
                    <View style={{marginTop: 10}}>
                            <Text style={{
                                color: 'blue',
                                fontSize: 20, marginLeft: 10, marginBottom: 10
                            }}>{this.state.questionNumber+1+') '+  this.state.asyncValues[this.state.questionNumber].question}</Text>
                        <View style={{marginBottom: 10, flex: 1}}>
                            {this.state.asyncValues[this.state.questionNumber].options.map((opt, key) =>
                                <TouchableOpacity style={{height: 50}} key={key.toString()}
                                                  onPress={() => this.sendSelectedOption(opt)}>
                                    {this.postOptions(opt,key)}
                                    <View style={{borderWidth: 1, borderColor: '#bcbcbc', marginTop: 10}}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View style={{flex: 1,justifyContent: 'flex-end', bottom: 100, margin: 10}}>
                        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            {this.state.questionNumber === 0 ? null :
                                <TouchableOpacity onPress={() => this.PreviousQuestion()} style={{backgroundColor: 'red', borderRadius: 5}}>
                                    <Text style={{color: '#000000', fontSize: 15,padding: 5}}>Previous Question</Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={()=>this.SkipQuestion()} style={{backgroundColor: 'blue', borderRadius: 5}}>
                                <Text style={{color: '#ff1a15', fontSize: 15, padding: 5}}>Review Question</Text>
                            </TouchableOpacity>
                            {this.state.questionNumber === this.state.asyncValues.length ? <TouchableOpacity onPress={() => navigate('Answers', {value: this.state.answersArray, data: params.data}, this.setState({Screen: true}))} style={{backgroundColor: 'green', borderRadius: 5}}>
                                    <Text style={{color: '#000000', fontSize: 13, alignSelf: 'center', padding: 5}}>SUBMIT ANSWERS</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={() => this.NextQuestion()} style={{backgroundColor: 'green', borderRadius: 5}}>
                                    <Text style={{color: '#000000', fontSize: 15, padding: 5}}>Next Question</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{bottom: 70}}>
                        <Progress.Bar progress={(this.state.answersArray.length)/10} width={width} />
                    </View>
                    </View>}
            </View>
        )
    }
}
