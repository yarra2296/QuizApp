import React from 'react';
import {
    View,
    Text,
    SectionList,
    ScrollView,
    BackHandler
} from 'react-native';

export default class QuestionsDisplay extends React.Component{

    static navigationOptions = {
        title: '                         E-Quiz     ',
    };

    constructor(props){
        super(props)
        this.state={
            value: '',
            data: '',
            notAnsweredQuestions: ''
        }
    }

    componentWillMount(){
        const { params } = this.props.navigation.state
        this.setState({
            value: params.value,
            data: params.data
        })
    }

    showOptions(values){
        if(values.value===values.optionSelected){
            return(<Text style={{color: 'green'}}>You Selected Right Answer: {values.optionSelected+'.'+values.optionChoice}</Text>)
        }
        else{
            return(<View><Text style={{color: 'green'}}>Correct answer is: {values.value+'.'+values.valueChoice}</Text>
                <Text style={{color: 'red'}}>Your Answer is: {values.optionSelected+'.'+values.optionChoice}</Text></View>)
        }
    }

    ScoreCount(){
        const { params } = this.props.navigation.state
        const length = params.value.length
        let score = 0;
        for(let i=0; i< length; i++){
            if(params.value[i].optionSelected===params.value[i].value){
                score=score+1
            }
            else{
                score=score-params.data.negativemarks
            }
        }
        this.score = score
        scorePercentage = ((this.score/this.state.data.questions.length) * 100);
        return(
            <View style={{backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color:'white'}}>Your Score is: {this.score}</Text>
                <Text style={{color: 'white'}}>Your Percentage is: {scorePercentage}%</Text>
                <Text style={{color: 'red'}}>Review</Text>
                {this.score<8 ?
                    <Text style={{color: 'red'}}>You need to IMPROVE on your General Knowledge</Text>:
                    <Text style={{color: 'violet'}}>You are GOOD at General Knowledge</Text>}
            </View>
        )
    }

    printNotAnsweredQuestions(){
        const a = this.state.value
        this.state.notAnsweredQuestions = this.state.data.questions.filter(function(o1){
            // filter out (!) items in result2
            return !a.some(function(o2){
                return o1.question === o2.question;          // assumes unique id
            });
        })
        return(<View>
            <SectionList
            showsHorizontalScrollIndicator={false}
            sections={[ {data: this.state.notAnsweredQuestions} ]}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) =>
                (<View style={{margin: 10}}><Text style={{color: '#5ea1ff'}}>{'Qn: '+item.question}</Text><Text>Not Answered, Answer is: {item.options[0].choice}</Text><View style={{borderWidth: 1}}/></View>)}
            />
        </View>)
    }

    render(){
        const { params } = this.props.navigation.state
        return(
            <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                <Text style={{color: 'blue', marginLeft: 10}}>Green Coloured options are correct answers</Text>
                <Text style={{color: 'blue', marginLeft: 10}}>Red coloured options are wrong selected selected answers</Text>
                {this.ScoreCount()}
                {params.value.map((queObj, key)=>
                    <View style={{margin:10}} key={key.toString()}>
                        <Text style={{color: '#5ea1ff'}}>{'Qn: '+queObj.question}</Text>
                        {this.showOptions(queObj)}
                        <View style={{borderWidth: 1}}/>
                        {/*{queObj.options.map((opt, indexOpt) =>
                            (queObj.optionSelected === queObj.value ?
                            <Text style={{backgroundColor: 'green'}}>{opt.key+'. '+ opt.choice}</Text> :
                                <Text>{opt.key+'. '+ opt.choice}</Text>)
                        )}*/}
                        {/*<Text>{'Selected Option:' +queObj.optionSelected}</Text>
                        <Text style={{fontSize:16,color:'black'}}>{'Answer is:' +queObj.value}</Text>*/}
                    </View>
                )}
                <View>
                    {this.printNotAnsweredQuestions()}
                </View>
            </View>
            </ScrollView>
        )
    }
}