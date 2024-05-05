import React from 'react';
import { validText } from '../Util.js';
import { model, QUESTION_PAGE } from '../globals';

export default class AnswerQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.handlePostAnswerClick = this.handlePostAnswerClick.bind(this);
    }

    async handlePostAnswerClick() {
        const textTA = document.getElementById('ans-question-text');
        console.log(textTA)
        const isValidText = validText(textTA.value, "ansTextError");

        if (isValidText) {
            try {
                await model.addAnswerToModel(
                    this.props.currentQid,
                    textTA.value,
                    model.getUserById(this.props.currentUserid).username);
                await model.updateModel();
                this.props.onPostAnswer(QUESTION_PAGE);
            } catch (error) {
                console.error("Error handling post answer:", error);
                alert("Error handling post answer:")
            }
        }
    }

    render() {
        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <div className="answer-text-container">
                            <h2>Answer Text*</h2>
                            <textarea
                                id="ans-question-text"
                                rows="20"
                                cols="50"
                                placeholder="Your Answer..."
                                required
                            ></textarea>
                        </div>
                        <p id="ansTextError" style={{ color: 'red' }}></p>

                        <button className="post-question-answer-button" onClick={this.handlePostAnswerClick}>Post Answer</button>
                    </div>
                </div>
                <p style={{ color: 'red', textAlign: 'right' }}>*indicates mandatory fields</p>
            </div>
        );
    }
}