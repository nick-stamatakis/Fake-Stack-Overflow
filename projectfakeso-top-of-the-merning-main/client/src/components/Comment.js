import '../stylesheets/MainContent.css';
import { model } from '../globals.js'
import React from "react";


export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.comment = this.props.comment;
        this.user = this.props.user;
        this.handleUpvoteComment = this.handleUpvoteComment.bind(this);

        this.state = {
            vote: this.comment.vote, // Fix here
        };
    }

    async handleUpvoteComment() {
        const id = this.comment._id; // Fix here
        try {
            await model.upvoteComment(id); // Fix here
            this.setState({ vote: this.state.vote + 1 });
        } catch (e) {
            alert("upvote comments failed")
        }
    }

    render() { // Fix here
        const { isLoggedIn } = this.props;
        return (
            <>
                <div className="generic-header-container generic-flex-container ans-container">
                    <div className="vote-container">
                        <button onClick={isLoggedIn ? this.handleUpvoteComment : () => alert("you're not logged in")} className="vote-button" >
                            &#9650; {/* Up arrow */}
                        </button>
                        <span className="vote-count">{this.state.vote}</span>

                    </div>
                    <div dangerouslySetInnerHTML={{ __html: model.parseHyperlinks(this.comment.text) }}></div>
                    <p>
                        <span className="question-ans-by">{this.comment.commented_by}</span>
                        <span> commented </span>
                        <span className="question-ask-date">{model.getTimeDifferenceFromDate(new Date(this.comment.comment_time))}</span>
                    </p>
                </div>
                <hr className="question-hr" />
            </>
        );
    }
}