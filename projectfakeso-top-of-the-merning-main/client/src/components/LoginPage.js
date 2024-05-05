import React from 'react';
import { validEmail, validPassword } from '../Util.js';
import { model, HOME_PAGE } from '../globals.js';

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserLogin = this.handleUserLogin.bind(this);
    }

    async handleUserLogin() {
        const email = document.getElementById('ask-question-text');
        const password = document.getElementById('ask-question-tags');
        const isValidEmail = validEmail(email.value, "emailError");
        const isValidPassword = validPassword(password.value, "passwordError");
        if (isValidEmail && isValidPassword) {
            model.login(email.value, password.value)
                .then((res) => {
                    console.log(res.data);
                    const token = res.data.token;
                    const userData = res.data.userData;
                    const isAdmin = res.data.isAdmin;
                    if (token && userData) {
                        console.log(userData);
                        const userId = userData._id;
                        sessionStorage.setItem("token", token);
                        this.props.onLoginClick(HOME_PAGE, true, isAdmin, userId);
                        console.log("User logged in successfully.");
                    } else {
                        document.getElementById("emailError").innerHTML = "Incorrect email or password";
                        document.getElementById("passwordError").innerHTML = "Incorrect email or password";
                    }
                }).catch((error) => {
                    console.error("Error login:", error);
                    alert("Error login", error)
                })
        }
    }

    render() {
        return (
            <div className="centered-div">
                <div className="question-section">
                    <div className="post-question-answer-container">

                        <h2>Email*</h2>
                        <p>Make sure it is a valid email address.</p>
                        <textarea id="ask-question-text" rows="4" cols="50" placeholder="Your Answer..." required></textarea>
                        <p id="emailError" style={{ color: "red" }}></p>

                        <h2>Password*</h2>
                        <p>Passwords must contain at least eight characters, including at least 1 letter and 1 number.</p>
                        <textarea id="ask-question-tags" rows="4" cols="50" placeholder="Your Answer..." required></textarea>
                        <p id="passwordError" style={{ color: "red" }}></p>

                        <button className="post-question-answer-container-button" onClick={this.handleUserLogin}>Log In</button>
                    </div>
                </div>
                <p style={{ color: "red", textAlign: "right" }}>*indicates mandatory fields</p>
            </div>
        )
    }
}