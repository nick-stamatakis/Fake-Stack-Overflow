import React from 'react';
import { HOME_PAGE, cookieStore } from "../globals";
import axios from "axios"

export default class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
        this.handleContinueAsGuest = this.handleContinueAsGuest.bind(this);
    }

    async handleContinueAsGuest() {
        //set page to home page
        this.props.onPostQuestionClick(HOME_PAGE);
    }

    render() {
        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <h1>Welcome to fakestackoverflow!</h1>
                        <button className="post-question-answer-container-button" onClick={this.handleContinueAsGuest}>Continue As Guest</button>
                    </div>
                </div>
            </div>
        )
    }
}