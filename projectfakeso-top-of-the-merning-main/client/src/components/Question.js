import '../stylesheets/MainContent.css';
import { model } from '../globals.js'
import React from 'react';

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.question = this.props.question;
        this.handleQuestionClick = this.handleQuestionClick.bind(this);
        this.handleUpvote = this.handleUpvote.bind(this);
        this.handleDownvote = this.handleDownvote.bind(this);
        this.hasDeleteButton = this.props.hasDeleteButton;
        this.deleteButtonFunc = this.props.deleteButtonFunc;

        this.state = {
            vote: this.question?.vote || 0,
            view: this.question?.view || 0,
        };

    }

    async handleQuestionClick() {
        try {
            await model.updateModel();
            console.log(model)
            const id = this.question._id;
            await model.incrementView(id);
            this.setState({ view: this.state.view + 1 });
            this.props.onCurrentQidChange(id);
            this.props.onQuestionClick();
        } catch (e) {
            alert("handle Question failed")
        }
    }

    async handleUpvote() {
        try {
            const id = this.question._id;
            await model.upvoteQuestion(id);
            this.setState({ vote: this.state.vote + 1 });
        } catch (e) {
            alert("upvote failed")
        }
    }

    async handleDownvote() {
        try {
            const id = this.question._id;
            await model.downvoteQuestion(id);
            this.setState({ vote: this.state.vote - 1 });
        } catch (e) {
            alert("downvote failed")
        }
    }

    render() {
        const { isLoggedIn } = this.props;
        //const userReputation = model.getUserById(currentUserid).reputation;
        const question = this.question;
        const user = model.getUserById(this.props.currentUserid);
        const userReputation = user?.reputation || 0;
        // // Check if the user is logged in and has a reputation greater than or equal to 50
        const canVote = isLoggedIn && userReputation >= 50;
        const tagsLabelList = model.getTagListByQuestion(question)
            .map(tag => tag ? (<button key={tag._id} className="tags">{tag.name}</button>) : "");
        const answersHTML = question.answers.length;
        return (
            <>
                <div className="question-container generic-flex-container">
                    <div className="question generic-flex-container">
                        <div className="vote-container">
                            <button onClick={(canVote) ? this.handleUpvote : () => alert("not signed in or do not have enough reputation point")} className="vote-button">
                                &#9650; {/* Up arrow */}
                            </button>
                            <span className="vote-count">{this.state.vote}</span>
                            <button onClick={(canVote) ? this.handleDownvote : () => alert("not signed in or do not have enough reputation point")} className="vote-button">
                                &#9660; {/* Down arrow */}
                            </button>
                        </div>
                        <div>
                            <div className="gray-text">{answersHTML} answers</div>
                            <div className="gray-text">{question.views} views</div>
                        </div>

                        <div>
                            <h3 className="question-title" onClick={this.handleQuestionClick}>{question.title}</h3>
                            <p className="question-tags">{tagsLabelList}</p>
                        </div>
                    </div>

                    <p>
                        <span className="question-asked-by">{question.asked_by}</span>
                        <span> asked </span>

                        <span className="question-ask-date">{model.getTimeDifferenceFromDate(new Date(question.ask_date_time))}</span>
                    </p>
                </div>
                {this.hasDeleteButton && (
                    <button className="question-count"
                        onClick={this.deleteButtonFunc}>
                        delete
                    </button>
                )}
                <hr className="question-hr" />
            </>
        )
    }
}