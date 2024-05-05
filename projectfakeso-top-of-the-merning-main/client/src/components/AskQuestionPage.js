import '../stylesheets/MainContent.css';
import React from 'react';
import { model, HOME_PAGE, USER_PROFILE_PAGE } from '../globals.js'
import { validTitle, validSummary, validText, validTags } from '../Util.js'
import UserProfile from './UserProfile.js';

export default class AskQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make 'this' work in the callback
        this.handlePostQuestionClick = this.handlePostQuestionClick.bind(this);
        const { currentQuestionId, currentUserid, editMode } = this.props;
        this.editMode = editMode;
        this.currentUserid = currentUserid;
        this.currentQuestionId = currentQuestionId;

        console.log(this.editMode, this.currentUserid, this.currentQuestionId)
        this.question = model.getQuestionById(currentQuestionId);
        if (this.question) {
            this.tagNames = model.getTagStringFromTagList(this.question);
        }
        console.log(this.question);
    }

    async handlePostQuestionClick(uid) {
        const titleTA = document.getElementById('ask-question-title');
        const summaryTA = document.getElementById('ask-question-summary');
        const textTA = document.getElementById('ask-question-text');
        const tagsTA = document.getElementById('ask-question-tags');

        // Check if user's reputation is greater than 50
        const userReputation = model.getUserById(uid).reputation;
        if (userReputation < 50) {
            // Display an error message or take appropriate action
            console.error("User reputation is not sufficient to add tags.");
            return;
        }
        // perform the function first to avoid short-circuiting
        const isValidTitle = validTitle(titleTA.value, "titleError");
        const isValidSummary = validSummary(summaryTA.value, "summaryError");
        const isValidText = validText(textTA.value, "textError");
        const isValidTags = validTags(tagsTA.value, "tagsError");
        if (isValidTags && isValidSummary && isValidText && isValidTitle) {
            try{
                await model.addQuestionToModel(
                    uid,
                    titleTA.value,
                    summaryTA.value,
                    textTA.value,
                    tagsTA.value,
                    model.getUserById(uid).username)
                await model.updateModel();
                this.props.onPostQuestionClick(HOME_PAGE);
            }catch(e){
                alert("adding question failed")
            }
        }
    }

    async handleEditQuestionClick(uid, qid) {
        const titleTA = document.getElementById('ask-question-title');
        const summaryTA = document.getElementById('ask-question-summary');
        const textTA = document.getElementById('ask-question-text');
        const tagsTA = document.getElementById('ask-question-tags');
        // Check if user's reputation is greater than 50
        const userReputation = model.getUserById(uid).reputation;
        if (userReputation < 50) {
            // Display an error message or take appropriate action
            console.error("User reputation is not sufficient to add tags.");
            return;
        }
        // perform the function first to avoid short-circuiting
        const isValidTitle = validTitle(titleTA.value, "titleError");
        const isValidSummary = validSummary(summaryTA.value, "summaryError");
        const isValidText = validText(textTA.value, "textError");
        const isValidTags = validTags(tagsTA.value, "tagsError");
        if (isValidTags && isValidSummary && isValidText && isValidTitle) {
            try{
                await model.editQuestion(
                    uid,
                    qid,
                    titleTA.value,
                    summaryTA.value,
                    textTA.value,
                    tagsTA.value,
                )
                await model.updateModel();
                this.props.onPostQuestionClick(USER_PROFILE_PAGE);
                this.props.setEditMode(false);
            }catch(e){
                alert("edit question failed")
            }
            
        }
    }

    render() {
        console.log(this.currentUserid)
        const user = model.getUserById(this.currentUserid)

        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <h2>Question Title*</h2>
                        <p>Limit title to 50 characters or less</p>
                        <textarea id="ask-question-title" rows="4" cols="50" defaultValue={this.question?.title || ''} placeholder="Your Answer..." maxLength="50" required></textarea>
                        <p id="titleError" style={{ color: "red" }}></p>

                        <h2>Question Summary*</h2>
                        <p>Limit summary to 140 characters or less</p>
                        <textarea id="ask-question-summary" rows="4" cols="50" defaultValue={this.question?.summary || ''} placeholder="Your Answer..." maxLength="140" required></textarea>
                        <p id="summaryError" style={{ color: "red" }}></p>

                        <h2>Question Text*</h2>
                        <p>Add details</p>
                        <textarea id="ask-question-text" rows="4" cols="50" defaultValue={this.question?.text || ''} placeholder="Your Answer..." required></textarea>
                        <p id="textError" style={{ color: "red" }}></p>

                        <h2>Tags*</h2>
                        <p>Add keywords separated by whitespace (5 words maximum)</p>
                        <textarea id="ask-question-tags" rows="4" cols="50" defaultValue={this.tagNames || ''} placeholder="Your Answer..." required></textarea>
                        <p id="tagsError" style={{ color: "red" }}></p>

                        <button className="post-question-answer-container-button"
                            onClick={() => this.editMode ? this.handleEditQuestionClick(this.currentUserid, this.currentQuestionId) : this.handlePostQuestionClick(this.currentUserid)}>
                            {this.editMode ? "Edit" : "Post"} Question
                        </button>
                    </div>
                </div>
                <p style={{ color: "red", textAlign: "right" }}>*indicates mandatory fields</p>
            </div>
        )
    }
}