import '../stylesheets/MainContent.css';
import '../stylesheets/Header.css';
import Sidebar from './Sidebar.js';
import MainContentHeader from './MainContentHeader.js';
import Header from './Header.js';
import React from 'react';
import Question from './Question.js'
import Answer from './Answer.js'
import Comment from './Comment.js'
import AnswerQuestionPage from './AnswerQuestionPage.js';
import AskQuestionPage from './AskQuestionPage.js';
import RegisterUserPage from "./RegisterUserPage.js";
import UserProfile from "./UserProfile";
import LoginPage from "./LoginPage.js";
import WelcomePage from './WelcomePage.js';
import AddCommentQuestionPage from "./AddCommentQuestionPage";
import AddCommentAnswerPage from "./AddCommentAnswerPage"
import EditTagPage from './EditTagPage.js';
import axios from 'axios';
import { model, WELCOME_PAGE, HOME_PAGE, TAGS_PAGE, QUESTION_PAGE, ASK_QUESTION_PAGE, ANS_QUESTION_PAGE, COMMENT_QUESTION_PAGE, COMMENT_ANSWER, REGISTER_PAGE, USERS, USER_PROFILE_PAGE, LOGIN_PAGE, NEWEST, ACTIVE, UNANSWERED, EDIT_TAG_PAGE } from '../globals.js';

class FakeStackOverflow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: WELCOME_PAGE,
            currentQuestionIndex: 0,
            currentAnswerIndex: 0,
            currentQuestionCommentIndex: 0,
            currentAnswerCommentIndex: 0,
            sortOption: NEWEST,
            currentQid: null,
            currentAid: null,
            currentTid: null,
            currentUserid: null,
            clickedUserid: null,
            searchQuery: '',
            isQuestionComment: true,
            loggedIn: false,
            isAdmin: false,
            editMode: false,
            questionsPerPage: 5,
        };

        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.setTid = this.setTid.bind(this);
        this.setSortingOption = this.setSortingOption.bind(this);
        this.setCurrentQid = this.setCurrentQid.bind(this);
        this.setCurrentUserid = this.setCurrentUserid.bind(this);
        this.handleSearchbar = this.handleSearchbar.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
        this.handleNextQuestionPage = this.handleNextQuestionPage.bind(this);
        this.handlePrevQuestionPage = this.handlePrevQuestionPage.bind(this);
        this.handleNextAnswerPage = this.handleNextAnswerPage.bind(this);
        this.handlePrevAnswerPage = this.handlePrevAnswerPage.bind(this);
        this.handleNextQuestionCommentPage = this.handleNextQuestionCommentPage.bind(this);
        this.handlePrevQuestionCommentPage = this.handlePrevQuestionCommentPage.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
    }

    async componentDidMount() {
        await model.updateModel()
        console.log(model);

        const token = sessionStorage.getItem('token');
        const requestData = {
            headers: {
                Authorization: token
            }
        }
        let currentPage = WELCOME_PAGE;
        let isLoggedIn = false;
        let userId = null;
        let isAdmin = false;
        axios.post('http://localhost:8000/decodeToken', null, requestData)
            .then(async res => {
                userId = res.data.userId;
                isAdmin = res.data.isAdmin;
                console.log(isAdmin)
                const isAuthenticated = !!userId;

                if (isAuthenticated) {
                    currentPage = HOME_PAGE;
                    isLoggedIn = true;
                    console.log(`the user is authenticated with id ${userId}, redirect to the home page`);
                }
            }).catch(err => {
                console.log("The user is not logged in");
            }).finally(
                () => this.setState({
                    currentPage: currentPage,
                    currentQid: null,
                    currentUserid: userId,
                    searchQuery: '',
                    loggedIn: isLoggedIn,
                    isAdmin: isAdmin
                }))
    }

    handleNextQuestionPage() {
        const totalQuestions = model.data.questions.length;
        console.log("totalQuestions", totalQuestions);

        if (totalQuestions > this.state.currentQuestionIndex + 5) {
            this.setCurrentQuestionIndex(this.state.currentQuestionIndex + 5);
        }
    }

    handlePrevQuestionPage() {
        if (this.state.currentQuestionIndex - 5 >= 0) {
            this.setCurrentQuestionIndex(this.state.currentQuestionIndex - 5);
        }
    }

    handleNextAnswerPage() {
        const totalAnswers = model.getQuestionById(this.state.currentQid).answers.length;
        console.log("totalQuestions", totalAnswers);

        if (totalAnswers > this.state.currentAnswerIndex + 5) {
            this.setCurrentAnswerIndex(this.state.currentAnswerIndex + 5);
        }
    }

    handlePrevAnswerPage() {
        if (this.state.currentAnswerIndex - 5 >= 0) {
            this.setCurrentAnswerIndex(this.state.currentAnswerIndex - 5);
        }
    }

    handleNextQuestionCommentPage() {
        const question = model.getQuestionById(this.state.currentQid);
        const QuestionComments = question.comments;

        if (QuestionComments.length > this.state.currentAnswerIndex + 3) {
            this.setCurrentAnswerIndex(this.state.currentAnswerIndex + 3);
        }
    }

    handlePrevQuestionCommentPage() {
        const question = model.getQuestionById(this.state.currentQid);
        const QuestionComments = question.comments;

        if (QuestionComments.length > this.state.currentAnswerIndex - 3) {
            this.setCurrentAnswerIndex(this.state.currentAnswerIndex - 3);
        }
    }

    setTid(id) {
        this.setState({ currentTid: id });
    }

    setAdmin(isAdmin) {
        this.setState({ isAdmin: isAdmin });
    }

    setIsQuestionComment(isQuestionComment) {
        this.setState({ isQuestionComment: isQuestionComment });
    }

    setEditMode(editMode) {
        this.setState({ editMode: editMode });
    }

    setClickedUserId(userId) {
        this.setState({ clickedUserId: userId });
    }

    setLoggedIn(newStatus) {
        if (!newStatus) {
            this.setAdmin(false);
            sessionStorage.removeItem('token');
        }
        this.setState({ loggedIn: newStatus });
    }

    handleSearchbar(query) {
        this.setSearchQuery(query);
        this.setCurrentPage(HOME_PAGE);
    }

    handleTagClick(tagName) {
        this.setSearchQuery(`[${tagName}]`);
        this.setCurrentPage(HOME_PAGE);
    }

    handleUserNameClick(userId, userName) {
        this.setClickedUserId(userId);
        this.setCurrentPage(USER_PROFILE_PAGE);
    }

    setSearchQuery(query) {
        this.setState({ searchQuery: query });
    }

    setCurrentPage(page) {
        this.setState({ currentPage: page });
    }

    setCurrentAnswerIndex(num) {
        this.setState({ currentAnswerIndex: num });
    }
    setCurrentQuestionIndex(num) {
        this.setState({ currentQuestionIndex: num });
    }

    setCurrentQuestionCommentIndex(num) {
        this.setState({ currentQuestionCommentIndex: num });
    }
    setCurrentAnswerCommentIndex(num) {
        this.setState({ currentAnswerCommentIndex: num });
    }

    setSortingOption(option) {
        this.setState({ sortOption: option });
    }

    setCurrentQid(qid) {
        this.setState({ currentQid: qid });
    }

    setCurrentAid = (aid) => {
        this.setState({ currentAid: aid });
    };

    setCurrentUserid(userid) {
        this.setState({ currentUserid: userid });
    }

    generateTagList(tags, editMode) {
        const tagList = [];
        let currentRow = [];

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            const questionsWithTag = model.getQuestionsByTag(tag);
            const questionCount = questionsWithTag.length;
            let tagBox;
            if (editMode) {
                tagBox = (
                    <div className="tag-box" key={tag._id}>
                        <span className="tag-name" onClick={() => this.handleTagClick(tag.name)}>
                            {tag.name}
                        </span>
                        <div className="question-count">{questionCount} questions</div>
                        <button onClick={() => {
                            this.setTid(tag._id);
                            this.setCurrentPage(EDIT_TAG_PAGE);
                        }}>Edit</button>
                        <button onClick={async () => {
                            await model.deleteTag(tag._id);
                            await model.updateModel();
                            this.setTid(tag._id);
                        }}>Delete</button>
                    </div>
                );
            } else {
                tagBox = (
                    <div className="tag-box" key={tag._id}>
                        <span className="tag-name" onClick={() => this.handleTagClick(tag.name)}>
                            {tag.name}
                        </span>
                        <div className="question-count">{questionCount} questions</div>
                    </div>
                );
            }

            currentRow.push(tagBox);

            // Check if it's time to start a new row (every 3 tags)
            if ((i + 1) % 3 === 0 || i === tags.length - 1) {
                tagList.push(
                    <div className="tag-row" key={`row-${i}`}>
                        {currentRow}
                    </div>
                );
                currentRow = []; // Clear the currentRow array
            }
        }

        return tagList;
    }

    generateTagListForUser(username) {
        // Get all questions by the user
        const userQuestions = model.getAllQuestionsByUser(username);

        // Extract tag IDs from user's questions
        const tagIds = [];
        userQuestions.forEach((question) => {
            const questionTags = question.tags || [];
            questionTags.forEach((tag) => {
                // Add tag ID to the list
                tagIds.push(tag);
            });
        });
        console.log(tagIds);

        // Filter tags based on tag IDs
        const userTags = model.data.tags.filter((tag) => tagIds.includes(tag._id));

        // Now use the existing generateTagList function to display the tags
        return this.generateTagList(userTags, /**EditMode= */ true);
    }


    generateUserList(users) {
        if (users.length === 1) {
            return <h1>No users in the system</h1>
        }
        const userList = [];
        let currentRow = [];
        const length = users.length - 1;
        for (let i = 0; i < length; i++) {
            const user = users[i];

            const userBox = (
                <div className="tag-box" key={user._id}>
                    <span className="tag-name" onClick={() => this.handleUserNameClick(user._id, user.username)}>
                        {user.username}
                    </span>
                    <button className="question-count"
                        onClick={async () => {
                            await model.deleteUser(user._id);
                            await model.updateModel();
                            this.setClickedUserId(user._id);
                        }}>
                        delete
                    </button>
                </div>
            );

            currentRow.push(userBox);

            // Check if it's time to start a new row (every 3 tags)
            if ((i + 1) % 3 === 0 || i === length - 1) {
                userList.push(
                    <div className="tag-row" key={`row-${i}`}>
                        {currentRow}
                    </div>
                );
                currentRow = []; // Clear the currentRow array
            }
        }

        return userList;
    }

    getUsernameFromClick(userId) {
        const user = model.getUserById(userId)
        return user.username;
    }

    renderContent(currentPage, sortOption) {
        const questions = model.getQuestions(sortOption);
        const users = model.data.users;
        const filteredQuestions = model.filterQuestionsBySearchTerm(questions, this.state.searchQuery);
        const startIndex = this.state.currentQuestionIndex;
        const endIndex = startIndex + this.state.questionsPerPage;
        const displayedQuestions = filteredQuestions.slice(startIndex, endIndex);
        const tags = model.data.tags;
        const tagCount = tags.length;
        const userCount = users.length;

        switch (currentPage) {
            case WELCOME_PAGE:
                return (<WelcomePage onPostQuestionClick={this.setCurrentPage}
                    onAuthentication={() => {
                        this.setCurrentPage(HOME_PAGE);
                        this.setLoggedIn(true)
                    }} />);
            case REGISTER_PAGE:
                return (<RegisterUserPage onPostQuestionClick={(page, isLoggin) => { this.setCurrentPage(LOGIN_PAGE); this.setLoggedIn(isLoggin) }} />);
            case LOGIN_PAGE:
                return (<LoginPage onLoginClick={(page, isLoggin, isAdmin, userId) => {
                    this.setCurrentPage(page);
                    this.setLoggedIn(isLoggin);
                    this.setAdmin(isAdmin);
                    this.setCurrentUserid(userId);
                }} />);
            case USER_PROFILE_PAGE:
                return (
                    <UserProfile
                        currentUserid={!!this.state.clickedUserId ? this.state.clickedUserId : this.state.currentUserid}
                        generateTags={() => this.generateTagListForUser(model.getUserById(this.state.clickedUserId ? this.state.clickedUserId : this.state.currentUserid).username)}
                        onPostQuestionClick={(page, isLoggin) => { this.setCurrentPage(page); this.setLoggedIn(isLoggin) }}
                        setCurrentPage={this.setCurrentPage}
                        setCurrentQid={this.setCurrentQid}
                        setEditMode={this.setEditMode}
                        generateUserList={(users) => this.generateUserList(users)}
                        isAdmin={this.state.isAdmin}
                        isLoggedIn={this.state.loggedIn}
                        currentTid={this.state.currentTid}
                    />
                );
            case HOME_PAGE:
                if (displayedQuestions.length === 0) {
                    return (
                        <div>
                            <MainContentHeader onAskQtnBtnChange={this.setCurrentPage} onSortingOptionChange={this.setSortingOption} headerString="All Questions" questions={displayedQuestions} />
                            <span style={{ fontWeight: "bold", fontSize: "larger" }}>No Questions Found</span>
                        </div>
                    );
                } else {
                    return (
                        <>
                            <MainContentHeader loggedIn={this.state.loggedIn}
                                onAskQtnBtnChange={this.setCurrentPage}
                                onSortingOptionChange={this.setSortingOption}
                                headerString="All Questions"
                                questions={filteredQuestions} />
                            <div className="scrollBar-container">
                                {displayedQuestions.map(q => (
                                    <Question currentUserid={this.state.currentUserid}
                                        isLoggedIn={this.state.loggedIn}
                                        key={q._id}
                                        question={q}
                                        onQuestionClick={() => this.setCurrentPage(QUESTION_PAGE)} onCurrentQidChange={this.setCurrentQid} />
                                ))}
                                <div className="pagination-container">
                                    <button className="ask-question-btn ans-question-btn" onClick={this.handlePrevQuestionPage}>
                                        Prev
                                    </button>
                                    <button className="ask-question-btn ans-question-btn" onClick={this.handleNextQuestionPage}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    );
                }
            case TAGS_PAGE:
                return (
                    <>
                        <div className="generic-header-container generic-flex-container">
                            <span className="question-header"><h1>{tagCount} Tags</h1></span>
                            <span className="question-header"><h1>All Tags</h1></span>
                            {this.state.loggedIn && (
                                <button className="ask-question-btn" onClick={() => this.setCurrentPage(ASK_QUESTION_PAGE)}>
                                    Ask Questions
                                </button>
                            )}
                        </div>
                        <div>
                            {<ul>
                                {this.generateTagList(model.data.tags)}
                            </ul>}
                        </div>
                    </>
                );
            case ASK_QUESTION_PAGE:
                return (<AskQuestionPage setEditMode={this.setEditMode} editMode={this.state.editMode} onPostQuestionClick={(page) => { this.setCurrentPage(page); this.setCurrentQid(null) }} currentQuestionId={this.state.currentQid} currentUserid={this.state.currentUserid} />)
            case ANS_QUESTION_PAGE:
                return (<AnswerQuestionPage currentQid={this.state.currentQid} onPostAnswer={this.setCurrentPage} currentUserid={this.state.currentUserid} />);
            case COMMENT_QUESTION_PAGE:
                return (<AddCommentQuestionPage currentIsQuestionComment={this.state.isQuestionComment}
                    currentAid={this.state.currentAid}
                    currentQid={this.state.currentQid} onPostAnswer={this.setCurrentPage}
                    currentUserid={this.state.currentUserid} />);
            case EDIT_TAG_PAGE:
                return (<EditTagPage tid={this.state.currentTid} onEditTagClick={this.setCurrentPage} />)
            // case COMMENT_ANSWER:
            //     return (<AddCommentAnswerPage currentQid={this.state.currentQid} onPostAnswer={this.setCurrentPage} currentUserid={this.state.currentUserid} />);
            case QUESTION_PAGE:
                const question = model.getQuestionById(this.state.currentQid);
                if (!question) {
                    return
                }
                const answersLenHTML = question.answers.length;
                const sortedAnswers = model.getAnswerListSortedFromQuestion(question);
                const sortedQuestionComments = model.getCommentListSortedFromQuestion(question);
                console.log(sortedAnswers)

                // Calculate the start and end indices based on the current page for Answers
                const startIndexAnswers = this.state.currentAnswerIndex;
                const endIndexAnswers = startIndexAnswers + this.state.questionsPerPage;
                const displayedAnswers = sortedAnswers.slice(startIndexAnswers, endIndexAnswers);

                // Calculate the start and end indices based on the current page for Question Comments
                const startIndexQuestionComments = this.state.currentAnswerIndex;
                const endIndexQuestionComments = startIndexQuestionComments + this.state.questionsPerPage;
                const displayedQuestionComments = sortedQuestionComments.slice(startIndexQuestionComments, endIndexQuestionComments);
                console.log(displayedAnswers);

                return (
                    <>
                        <div className="generic-header-container generic-flex-container">
                            <div className="question-answers-container">
                                <h4 className="black-text">{answersLenHTML} answers</h4>
                            </div>
                            <h4>{question.title}</h4>

                            {this.state.loggedIn && (
                                <button className="ask-question-btn" onClick={() => this.setCurrentPage(ASK_QUESTION_PAGE)}>
                                    Ask Questions
                                </button>
                            )}

                        </div>

                        <div className="generic-header-container generic-flex-container question-detail-container">
                            <div className="question-views">{question.views} views</div>
                            <div dangerouslySetInnerHTML={{ __html: model.parseHyperlinks(question.text) }}></div>
                            <p>
                                <span className="question-asked-by">{question.asked_by}</span>
                                <span> asked </span>
                                <span className="question-ask-date">{model.getTimeDifferenceFromDate(new Date(question.ask_date_time))}</span>
                            </p>
                        </div>
                        <div className="vote-container">
                            {this.state.loggedIn && (
                                <button onClick={() => {
                                    this.setIsQuestionComment(true);
                                    this.setCurrentPage(COMMENT_QUESTION_PAGE);
                            }} className="vote-button">
                            Add Comment {/* Comment button */}
                            </button>
                        )}
                        </div>
                        <hr className="question-hr" />
                        <div className="scrollBar-container3">
                            <h2>Comments</h2>
                            {sortedQuestionComments.map(c => (
                                <Comment isLoggedIn={this.state.loggedIn} key={c._id} comment={c} />
                            ))}
                            <div className="pagination-container">
                                <button className="ask-question-btn ans-question-btn" onClick={this.handlePrevQuestionCommentPage}>
                                    Prev Comment
                                </button>
                                <button className="ask-question-btn ans-question-btn" onClick={this.handleNextQuestionCommentPage}>
                                    Next Comment
                                </button>
                            </div>
                        </div>
                        <div className="scrollBar-container2">
                            <h2>Answers</h2>
                            {displayedAnswers.map(a => (
                                <Answer
                                    key={a._id}
                                    isLoggedIn={this.state.loggedIn}
                                    currentAnswerCommentIndex = {this.state.currentAnswerCommentIndex}
                                    questionsPerPage = {this.state.questionsPerPage}
                                    currentAid={a._id}
                                    answer={a}
                                    setCurrentAnswerid={(aid) => this.setCurrentAid(aid)}
                                    onClick={() => this.setCurrentPage(COMMENT_QUESTION_PAGE)}
                                    currentUserid={this.state.currentUserid}
                                    setIsQuestionCommentFalse={() => this.setIsQuestionComment(false)}
                                />
                            ))}
                        </div>

                        <div>
                            {this.state.loggedIn && (
                                <button className="ask-question-btn ans-question-btn" onClick={() => this.setCurrentPage(ANS_QUESTION_PAGE)}>
                                    Answer Questions
                                </button>
                            )}
                        </div>
                        <div className="pagination-container">
                            <button className="ask-question-btn ans-question-btn" onClick={this.handlePrevAnswerPage}>
                                Prev
                            </button>
                            <button className="ask-question-btn ans-question-btn" onClick={this.handleNextAnswerPage}>
                                Next
                            </button>
                        </div>
                    </>
                )
            default:
                return <div>Page not found.</div>;
        }
    }

    render() {
        const currentPage = this.state.currentPage;
        return (
            <>
                <Header
                    handleSearchbarChange={this.handleSearchbar}
                    onAskQtnBtnChange={this.setCurrentPage}
                    onLoginChange={() => {
                        this.setState({
                            loggedIn: false,
                            isAdmin: false,
                            editMode: false,
                            currentUserid: null,
                            currentPage: WELCOME_PAGE,
                            currentQuestionIndex: 0,
                            currentAnswerIndex: 0,
                            sortOption: NEWEST,
                            currentQid: null,
                            currentAid: null,
                            clickedUserid: null,
                            searchQuery: '',
                            isQuestionComment: true,
                            questionsPerPage: 5,
                        });
                    }}
                    isLoggedIn={this.state.loggedIn}
                    currentPage={currentPage} />
                <main id="main" className="main">
                    {currentPage !== WELCOME_PAGE &&
                        currentPage !== LOGIN_PAGE &&
                        currentPage !== REGISTER_PAGE &&
                        (<Sidebar onSidebarChange={(str) => {
                            this.setSearchQuery("");
                            this.setCurrentPage(str);
                        }} />)
                    }

                    <div id="main-content">{this.renderContent(currentPage, this.state.sortOption)}</div>
                </main>
            </>
        );
    }
}

export { FakeStackOverflow, model, HOME_PAGE, TAGS_PAGE, QUESTION_PAGE, ASK_QUESTION_PAGE, ANS_QUESTION_PAGE, REGISTER_PAGE, USER_PROFILE_PAGE, LOGIN_PAGE, NEWEST, ACTIVE, UNANSWERED };