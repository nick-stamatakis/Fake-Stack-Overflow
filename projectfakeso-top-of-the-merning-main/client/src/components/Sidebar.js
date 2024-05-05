import '../stylesheets/Sidebar.css';
import '../stylesheets/MainContent.css';
import React from 'react';
import { HOME_PAGE, TAGS_PAGE, USERS, USER_PROFILE_PAGE } from "../globals";

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isQuestionsSelected: true, isTagsSelected: false, isUserProfileSelected: false };
        // This binding is necessary to make 'this' work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(str) {
        this.setState({
            isQuestionsSelected: str === HOME_PAGE,
            isTagsSelected: str === TAGS_PAGE,
            isUserProfileSelected: str === USER_PROFILE_PAGE,
        })
        this.props.onSidebarChange(str);
    }

    render() {
        return (
            <div className="sidebar">
                <p
                    href="#"
                    id="question-link"
                    className={this.state.isQuestionsSelected ? "sideBar-selected" : ""}
                    onClick={() => { this.handleClick(HOME_PAGE) }}>
                    Questions
                </p>
                <p
                    href="#"
                    id="tags-link"
                    className={this.state.isTagsSelected ? "sideBar-selected" : ""}
                    onClick={() => { this.handleClick(TAGS_PAGE) }}>
                    Tags
                </p>
                <p
                    href="#"
                    id="user-profile-link"
                    className={this.state.isUserProfileSelected ? "sideBar-selected" : ""}
                    onClick={() => { this.handleClick(USER_PROFILE_PAGE) }}>
                    User Profile
                </p>
            </div>
        )
    }
}