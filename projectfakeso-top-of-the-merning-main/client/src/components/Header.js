import '../stylesheets/MainContent.css';
import React from 'react';
import { HOME_PAGE, LOGIN_PAGE, REGISTER_PAGE, TAGS_PAGE, WELCOME_PAGE } from '../globals.js';
import axios from 'axios';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make 'this' work in the callback
        this.handleSearchbarChange = this.handleSearchbarChange.bind(this);
        this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
        this.handleSignUpButtonClick = this.handleSignUpButtonClick.bind(this);
        this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
    }

    handleSearchbarChange(e) {
        if (e.key === "Enter") {
            this.props.handleSearchbarChange(e.target.value);
        }
    }

    handleLoginButtonClick() {
        this.props.onAskQtnBtnChange(LOGIN_PAGE);
    }

    handleSignUpButtonClick() {
        this.props.onAskQtnBtnChange(REGISTER_PAGE);
    }

    async handleLogoutButtonClick() {
        try {
            await axios.get('http://localhost:8000/logout');
            sessionStorage.removeItem('token');
            this.props.onLoginChange(false);
            this.props.onAskQtnBtnChange(WELCOME_PAGE);
        } catch (error) {
            alert("logout failed. Try again later.");
        }
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        const currentPage = this.props.currentPage;
        return (
            <div id="header" className="header generic-flex-container">
                <div className="side-title"></div>
                <b id="title">Fake Stack Overflow</b>
                {isLoggedIn ? (
                    // Render Log Out button if the user is logged in
                    <button className="ask-question-btn" onClick={this.handleLogoutButtonClick}>Log Out</button>
                ) : (
                    // Render Log In and Sign Up buttons if the user is not logged in
                    <>
                        <button className="ask-question-btn" onClick={this.handleLoginButtonClick}>Log In</button>
                        <button className="ask-question-btn" onClick={this.handleSignUpButtonClick}>Sign Up</button>
                    </>
                )}
                {(currentPage === HOME_PAGE || currentPage === TAGS_PAGE) && (
                    <input
                        id="searchbar" className="side-title" name="q" type="text" placeholder="Search . . ."
                        onKeyDown={(e) => this.handleSearchbarChange(e)}
                    />
                )}
            </div>
        );
    }
}