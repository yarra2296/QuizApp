import React from 'react';
import { StackNavigator } from 'react-navigation';
import QuizExam from './QuizExam';
import QuestionsDisplay from './QuestionsDisplay';
import AnswersDisplay from './AnswersDisplay';
import ResumeExam from './ResumeExam'

export const SimpleApp = StackNavigator({
    Quiz: { screen: QuizExam},
    Questions: { screen: QuestionsDisplay },
    Answers: { screen : AnswersDisplay },
    Resume: {screen: ResumeExam}
});


export default class App extends React.Component {
    render() {
        return <SimpleApp />;
    }
}
