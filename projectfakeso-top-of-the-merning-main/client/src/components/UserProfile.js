import '../stylesheets/MainContent.css';
import { ASK_QUESTION_PAGE, model, QUESTION_PAGE } from '../globals.js';
import React, { Fragment } from 'react';
import Question from "./Question";

export default class UserProfile extends React.Component {
    render() {
        const { currentUserid, isAdmin, generateUserList, isLoggedIn } = this.props;

        if (!isLoggedIn) {
            // Optionally handle the case where the user is not found
            return <p>Profile can't be viewed because the user is not logged in.</p>;
        }
        console.log(currentUserid);
        const user = model.getUserById(currentUserid);
        if (!user) {
            // Optionally handle the case where the user is not found
            return <p>User not found</p>;
        }
        const userQuestions = model.getAllQuestionsByUser(user.username);
        const userAnswerQuestionsIds = model.getAllQuestionsAnsweredByUser(user.username);
        const userAnswerQuestions = userAnswerQuestionsIds.map(qid => model.getQuestionById(qid));
        const tags = this.props.generateTags()

        console.log(model.data.tags)
        return (
            <>
                <div className="generic-header-container generic-flex-container ans-container">
                    <h1>{user.username} Profile</h1>
                </div>
                <div className="generic-header-container generic-flex-container ans-container">
                    <h2>You have been a member of fakestackoverflow since {new Date(user.member_since).toLocaleDateString()}</h2>

                </div>
                <div className="generic-header-container generic-flex-container ans-container">
                    <h1>User reputation is {user.reputation} </h1>
                </div>
                {isAdmin && (
                    <>
                        <h2>All Users</h2>
                        <div>
                            <ul>
                                {generateUserList(model.data.users)}
                            </ul>
                        </div>
                    </>
                )}
                {userQuestions.length === 0 ? (<h1>No questions by user</h1>) :
                    (<div className="scrollBar-container2">
                        <h2>Questions By {user.username}</h2>
                        {userQuestions.map(q => (
                            <Fragment key={q._id}>
                                <Question
                                    question={q}
                                    onQuestionClick={() => {
                                        this.props.setCurrentPage(ASK_QUESTION_PAGE);
                                        this.props.setEditMode(true);
                                        this.props.setCurrentQid(q._id);
                                    }}
                                    onCurrentQidChange={this.props.setCurrentQid}
                                    hasDeleteButton={true}
                                    deleteButtonFunc={
                                        async () => {
                                            await model.deleteQuestion(q._id);
                                            await model.updateModel()
                                            this.props.setCurrentQid(q._id);
                                        }
                                    } />
                            </Fragment>
                        ))}
                    </div>)
                }
                {userAnswerQuestions.length === 0 ? (<h1>No answers by user</h1>) :
                    <div className="scrollBar-container2">
                        <h2>Questions Answered By {user.username}</h2>
                        {userAnswerQuestions.map(q => (
                            <Question
                                key={q._id}
                                question={q}
                                onQuestionClick={() => this.props.setCurrentPage(ASK_QUESTION_PAGE)} onCurrentQidChange={this.props.setCurrentQid} />
                        ))}
                    </div>
                }
                {!tags ? (<h1>No tags by user</h1>) :
                    <div className="scrollBar-container2">
                        <h2>Tags by {user.username}</h2>
                        {<ul>
                            {tags}
                        </ul>}
                    </div>
                }
            </>
        );
    }
}
