import '../stylesheets/MainContent.css';
import { COMMENT_QUESTION_PAGE, COMMENT_ANSWER_PAGE, model, ASK_QUESTION_PAGE } from '../globals.js';
import React from 'react';
import Comment from "./Comment";

export default class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.answer = this.props.answer;
        this.user = this.props.user;
        this.handleUpvoteAnswer = this.handleUpvoteAnswer.bind(this);
        this.handleDownvoteAnswer = this.handleDownvoteAnswer.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleNextAnswerCommentPage = this.handleNextAnswerCommentPage.bind(this);
        this.handlePrevAnswerCommentPage = this.handlePrevAnswerCommentPage.bind(this);

        this.state = {
            vote: this.answer.vote, // Fix here
        };
    }

    handleNextAnswerCommentPage() {
        const answer = model.getQuestionById(this.props.currentAid);
        const AnswerComments = answer.comments;

        if (AnswerComments.length > this.props.currentAnswerCommentIndex + 3) {
            this.setCurrentAnswerIndex(this.state.currentAnswerCommentIndex + 3);
        }
    }

    handlePrevAnswerCommentPage() {
        const question = model.getQuestionById(this.state.currentQid);
        const QuestionComments = question.comments;

        if (QuestionComments.length > this.state.currentAnswerCommentIndex - 3) {
            this.setCurrentAnswerIndex(this.state.currentAnswerCommentIndex - 3);
        }
    }

    async handleAddComment() {
        const aid = this.answer._id; // Fix here
        const { onClick, setCurrentAnswerid, setIsQuestionCommentFalse } = this.props;
        setCurrentAnswerid(aid);
        setIsQuestionCommentFalse();
        onClick();
    }

    async handleUpvoteAnswer() {
        const id = this.answer._id; // Fix here
        await model.upvoteAnswer(id); // Fix here
        this.setState({ vote: this.state.vote + 1 });
    }

    async handleDownvoteAnswer() {
        const id = this.answer._id; // Fix here
        await model.downvoteAnswer(id); // Fix here
        this.setState({ vote: this.state.vote - 1 });
    }

    render() { // Fix here
        const { currentAid, isLoggedIn } = this.props;
        //console.log(currentAid);
        const answer = model.getAnswerById(currentAid);
        //console.log(answer);
        const sortedAnswerComments = model.getCommentListSortedFromAnswer(answer);

        const user = model.getUserById(this.props.currentUserid);
        const userReputation = user?.reputation || 0;
        // Check if the user is logged in and has a reputation greater than or equal to 50
        const canVote = isLoggedIn && userReputation >= 50;

        // // Calculate the start and end indices based on the current page for Question Comments
        // const startIndexAnswerComments = this.props.currentAnswerCommentIndex;
        // const endIndexAnswerComments = startIndexAnswerComments + this.pr.questionsPerPage;
        // const displayedQuestionComments = sortedQuestionComments.slice(startIndexAnswerComments, endIndexAnswerComments);
        // console.log(displayedAnswers);
        return (
            <>
                <div className="generic-header-container generic-flex-container ans-container">
                    <div className="vote-container">
                        <button onClick={canVote ? this.handleUpvoteAnswer : () => alert("not signed in or do not have enough reputation point")} className="vote-button" >
                            &#9650; {/* Up arrow */}
                        </button>
                        <span className="vote-count">{this.state.vote}</span>
                        <button onClick={canVote ? this.handleDownvoteAnswer : () => alert("not signed in or do not have enough reputation point")} className="vote-button" >
                            &#9660; {/* Down arrow */}
                        </button>

                    </div>
                    <div dangerouslySetInnerHTML={{ __html: model.parseHyperlinks(this.answer.text) }}></div>
                    <p>
                        <span className="question-ans-by">{this.answer.ans_by}</span>
                        <span> answered </span>
                        <span className="question-ask-date">{model.getTimeDifferenceFromDate(new Date(this.answer.ans_date_time))}</span>
                    </p>
                </div>
                <div className="scrollBar-container3">
                    <h2>Comments For {answer.ans_by} Response</h2>
                    {sortedAnswerComments.map(c => (
                        <Comment key={c._id} comment={c} />
                    ))}
                </div>
                <div className="vote-container">
                {isLoggedIn && (
                    <button onClick={this.handleAddComment} className="vote-button">
                        Add comment for Answer{/* add comment */}
                    </button>
                )}
                </div>
                <hr className="question-hr" />
            </>
        );
    }
}
