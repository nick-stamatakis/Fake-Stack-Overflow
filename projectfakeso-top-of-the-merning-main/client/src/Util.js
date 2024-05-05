function validTitle(title, errorId) {
    const titleError = document.getElementById(errorId);
    titleError.textContent = title.length > 50 || title.length === 0 ? "title can't be empty or more than 50 characters.\n" : '';
    return !(title.length > 50 || title.length === 0);
}

function validSummary(summary, errorId) {
    const summaryError = document.getElementById(errorId);
    summaryError.textContent = summary.length > 140 || summary.length === 0 ? "summary can't be empty or more than 140 characters.\n" : '';
    return !(summary.length > 140 || summary.length === 0);
}

function validText(text, errorId) {
    const initialCheckPattern = /\[([^\]]*?)\]\(([^)]*?)\)/g; // Updated regex pattern
    const textError = document.getElementById(errorId);
    let isValid = true; // Initialize a variable to track text validity

    if (text.length === 0) {
        isValid = false;
    }

    const matches = text.match(initialCheckPattern);

    if (matches) {
        for (const match of matches) {
            const [, websiteName, url] = match.match(/\[([^\]]*?)\]\(([^)]*?)\)/);
            console.log(url);
            if (url.length === 0 || !/^https?:\/\//.test(url) || websiteName.trim() === '') {
                isValid = false; // Set isValid to false if validation fails
            }
        }
    }

    if (!isValid) {
        textError.textContent = "Text is empty or URL is invalid";
    }

    return isValid; // Return whether the text is valid
}

function validUsername(username, errorId) {
    const usernameError = document.getElementById(errorId);
    usernameError.textContent = username.length === 0 ? "username can't be empty.\n" : "";
    return username.length !== 0;
}

function validTags(tags, errorId) {
    const tagsError = document.getElementById(errorId);
    tagsError.textContent = '';
    const words = tags.trim().split(/\s+/);

    if (words.length > 5) {
        tagsError.textContent += 'Maximum 5 words allowed.\n';
        return false;
    }

    for (let w of words) {
        if (w.length > 10) {
            tagsError.textContent += "words can't be more than 10 characters long.\n";
            return false;
        }
    }

    tagsError.textContent = '';
    return true;
}

function validEditTags(tags, errorId) {
    const tagsError = document.getElementById(errorId);
    tagsError.textContent = '';
    const words = tags.trim().split(/\s+/);

    if (words.length > 1) {
        tagsError.textContent += 'Maximum 1 words allowed.\n';
        return false;
    }

    for (let w of words) {
        if (w.length > 10) {
            tagsError.textContent += "words can't be more than 10 characters long.\n";
            return false;
        }
    }

    tagsError.textContent = '';
    return true;
}


function validEmail(email, errorId) {
    const emailError = document.getElementById(errorId);
    // Define a regular expression pattern for a valid email address
    var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (pattern.test(email)) {
        return true;
    }
    else {
        emailError.textContent = "Email must have a valid address";
        return false;
    }
}
function validPassword(password, errorId, username, email) {
    const passwordError = document.getElementById(errorId);

    // Check if the password is empty or does not meet the basic requirements
    if (password.length < 8 || password.length === 0 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        passwordError.textContent = "Password must be at least 8 characters long, contain at least one letter, and at least one number.";
        return false;
    }

    // Check if the password contains the username or the part of the email before the @ sign
    if (username != null && email != null) {
        const emailPrefix = email.split('@')[0]; // Get the part before the @ sign
        if (password.includes(username) || password.includes(emailPrefix)) {
            passwordError.textContent = "Password must not contain your username or the part of your email before the @ sign.";
            return false;
        }
    }

    // Reset the error message if the password is valid
    passwordError.textContent = '';
    return true;
}

export { validTags, validEditTags, validSummary, validText, validUsername, validTitle, validEmail, validPassword }