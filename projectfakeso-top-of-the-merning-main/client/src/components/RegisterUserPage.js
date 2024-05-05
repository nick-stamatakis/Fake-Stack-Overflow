import React from 'react';
import { validUsername, validEmail, validPassword } from '../Util.js';
import { model, HOME_PAGE } from "../globals";

export default class RegisterUserPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegisterUser = this.handleRegisterUser.bind(this);
    }

    async handleRegisterUser() {
        const displayName = document.getElementById('ask-question-title');
        const email = document.getElementById('ask-question-text');
        const password = document.getElementById('ask-question-tags');
        const reEnterPassword = document.getElementById('re-enter-password'); // Add an id to the re-enter password textarea

        const isValidName = validUsername(displayName.value, "nameError");
        const isValidEmail = validEmail(email.value, "emailError");
        const isValidPassword = validPassword(password.value, "passwordError", displayName.value, email.value);
        const passwordsMatch = this.checkPasswordMatch(password.value, reEnterPassword.value, "reEnterPasswordError");

        if (isValidName && isValidEmail && isValidPassword && passwordsMatch) {
            model.addUserToModel(displayName.value, email.value, password.value)
                .then(async () => {
                    console.log("User added successfully.");
                    await model.updateUsers();
                    this.props.onPostQuestionClick(HOME_PAGE);
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        document.getElementById("emailError").innerHTML = "Email already in use";
                    }
                    console.error("Error adding the user:", error);
                    alert("Error adding the user")
                })
        }
    }

    // Function to check whether the Password and Re-Enter Password boxes are the same
    checkPasswordMatch(password, reEnterPassword, errorId) {
        const passwordMatch = password === reEnterPassword;
        const errorElement = document.getElementById(errorId);

        if (!passwordMatch) {
            errorElement.innerText = "Passwords do not match";
        } else {
            errorElement.innerText = "";
        }

        return passwordMatch;
    }

    render() {
        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">
                        <h2>Display Name*</h2>
                        <p>Limit title to 50 characters or less</p>
                        <textarea id="ask-question-title" rows="4" cols="50" placeholder="Your Answer..." maxLength="50" required></textarea>
                        <p id="nameError" style={{ color: "red" }}></p>

                        <h2>Email*</h2>
                        <p>Make sure it is a valid email address.</p>
                        <textarea id="ask-question-text" rows="4" cols="50" placeholder="Your Answer..." required></textarea>
                        <p id="emailError" style={{ color: "red" }}></p>

                        <h2>Password*</h2>
                        <p>Passwords must contain at least eight characters, including at least 1 letter and 1 number.</p>
                        <textarea id="ask-question-tags" rows="4" cols="50" placeholder="Your Answer..." required></textarea>
                        <p id="passwordError" style={{ color: "red" }}></p>

                        <h2>Re-Enter Password*</h2>
                        <p>Passwords must contain at least eight characters, including at least 1 letter and 1 number.</p>
                        <textarea id="re-enter-password" rows="4" cols="50" placeholder="Your Answer..." required></textarea>
                        <p id="reEnterPasswordError" style={{ color: "red" }}></p>

                        <button className="post-question-answer-container-button" onClick={this.handleRegisterUser}>Create My Account</button>
                    </div>
                </div>
                <p style={{ color: "red", textAlign: "right" }}>*indicates mandatory fields</p>
            </div>
        )
    }
}
