import React from 'react';
import { validText } from '../Util.js';
import { model, QUESTION_PAGE } from '../globals';

export default class AddCommentQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        //const h1 = model.getUserById(this.state.currentUserid).
        this.handlePostCommentQuestionClick = this.handlePostCommentQuestionClick.bind(this);
        this.handlePostCommentAnswerClick = this.handlePostCommentAnswerClick.bind(this);
    }

    async handlePostCommentAnswerClick() {
        const textTA = document.getElementById('ans-question-text');
        console.log(textTA)
        console.log("hi")
        const isValidText = validText(textTA.value, "ansTextError");

        if (isValidText) {
            try {
                await model.addCommentToAnswerModel(
                    this.props.currentAid,
                    textTA.value,
                    model.getUserById(this.props.currentUserid).username);
                await model.updateModel();
                this.props.onPostAnswer(QUESTION_PAGE);
            } catch (error) {
                console.error("Error handling post comment to answer:", error);
                alert("Error handling post comment to answer:", error);
            }
        }
    }

    async handlePostCommentQuestionClick() {
        const textTA = document.getElementById('ans-question-text');
        console.log(textTA)
        const isValidText = validText(textTA.value, "ansTextError");

        if (isValidText) {
            try {

                await model.addCommentToModel(
                    this.props.currentQid,
                    textTA.value,
                    model.getUserById(this.props.currentUserid).username);
                await model.updateModel();
                this.props.onPostAnswer(QUESTION_PAGE);
            } catch (error) {
                console.error("Error handling post comment:", error);
                alert("Error handling post comment to question:", error);
            }
        }
    }

    render() {
        const { currentIsQuestionComment } = this.props;

        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <div className="answer-text-container">
                            <h2>Comment Text*</h2>
                            <textarea
                                id="ans-question-text"
                                rows="20"
                                cols="50"
                                placeholder="Your Answer..."
                                required
                            ></textarea>
                        </div>
                        <p id="ansTextError" style={{ color: 'red' }}></p>

                        <button
                            className="post-question-answer-button"
                            onClick={
                                currentIsQuestionComment
                                    ? this.handlePostCommentQuestionClick
                                    : this.handlePostCommentAnswerClick
                            }
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
                <p style={{ color: 'red', textAlign: 'right' }}>*indicates mandatory fields</p>
            </div>
        );
    }
}