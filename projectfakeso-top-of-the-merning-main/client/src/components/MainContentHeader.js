import '../stylesheets/MainContent.css';
import React from 'react';
import { ASK_QUESTION_PAGE, NEWEST, ACTIVE, UNANSWERED } from '../globals.js';

export default class MainContentHeader extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make 'this' work in the callback
        this.handleAskQtnBtnClick = this.handleAskQtnBtnClick.bind(this);
    }

    handleAskQtnBtnClick() {
        this.props.onAskQtnBtnChange(ASK_QUESTION_PAGE);
    }

    handleSortingOptionClick(option) {
        this.props.onSortingOptionChange(option);
    }

    render() {
        if (!this.props.questions) {
            return null;
        }
        return (
            <>
                {this.props.loggedIn &&
                    <div className="generic-header-container generic-flex-container">
                        <h1 className="question-header">{this.props.headerString}</h1>
                        <button className="ask-question-btn" onClick={this.handleAskQtnBtnClick}>Ask Questions</button>
                    </div>}

                <div className="generic-header-container generic-flex-container">
                    <div className="question-header" id=" question-num"><span id="numQs">{this.props.questions.length}</span> Questions</div>
                    <div className="horizontal-button">
                        <button onClick={() => this.handleSortingOptionClick(NEWEST)}>Newest</button>
                        <button onClick={() => this.handleSortingOptionClick(ACTIVE)}>Active</button>
                        <button onClick={() => this.handleSortingOptionClick(UNANSWERED)}>Unanswered</button>
                    </div>
                </div>
                <hr className="question-hr" />
            </>
        );
    }
}