// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './.env' })
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const port = 8000;
const saltRounds = 10;

const Comment = require('./models/comments')
const Admin = require('./models/admins')
const User = require('./models/users')
const Tag = require('./models/tags')
const Answer = require('./models/answers')
const Question = require('./models/questions')

const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log('Connected to MongoDB'); });

// Middleware
app.use(cors({ credentials: true }))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// JWT middleware
const authenticationToken = (req, res, next) => {
    // const token = req.cookies.token;
    const token = req.headers.authorization;
    // console.log(token);
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Access denied. Invalid token.");
        }
        req.user = decoded;
        next();
    });
};

app.post("/decodeToken", authenticationToken, async (req, res) => {
    // check if the user still exist in the database and has not been deleted
    const id = req.user._id;
    const adminUser = await Admin.findOne({ _id: id });
    const normalUser = await User.findOne({ _id: id });
    const user = normalUser || adminUser;

    res.send({ userId: user?._id, isAdmin: !!adminUser });
});

// Most likely going to probe this route and see if the server is alive or not
app.get("/logout", (req, res) => {
    res.send('Logout successful');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, success, isAdmin } = await verifyCredential(email, password);
        if (success) {
            const userData = user.toJSON()
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ token, userData, isAdmin });
        } else {
            res.json({ error: 'Invalid email or password' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'server error' });
    }
})

async function verifyCredential(email, password) {
    let user = await Admin.findOne({ email: email })
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        return { user, success: !!match, isAdmin: !!match };
    }
    user = await User.findOne({ email: email })
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        return { user, success: !!match, isAdmin: false };
    }
    else {
        return { user: null, success: false, isAdmin: false };
    }
}

app.put('/upvote/question/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        let question = await Question.findById(questionId);
        let user = await findUserByQuestionId(questionId);
        user = await User.findByIdAndUpdate(user._id, { reputation: user.reputation + 5 }, { returnDocument: 'after' });
        res.send(await Question.findByIdAndUpdate(questionId, { vote: question.vote + 1 }, { returnDocument: 'after' }));
    } catch (error) {
        // console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/downvote/question/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId);
        const user = await findUserByQuestionId(questionId);
        await User.findByIdAndUpdate(user._id, { reputation: user.reputation - 10 });
        res.send(await Question.findByIdAndUpdate(questionId, { vote: question.vote - 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/upvote/answer/:id', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId);
        const user = await findUserByAnswerId(answerId);
        console.log(user)
        await User.findByIdAndUpdate(user._id, { reputation: user.reputation + 5 });
        res.send(await Answer.findByIdAndUpdate(answerId, { vote: answer.vote + 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/downvote/answer/:id', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId);
        const user = await findUserByAnswerId(answerId);
        console.log(user)
        await User.findByIdAndUpdate(user._id, { reputation: user.reputation - 10 });
        res.send(await Answer.findByIdAndUpdate(answerId, { vote: answer.vote - 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Updates the votes of a comment. (no reputation constraints.)
app.put('/upvote/comment/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        res.send(await Comment.findByIdAndUpdate(commentId, { vote: comment.vote + 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/downvote/comment/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        res.send(await Comment.findByIdAndUpdate(commentId, { vote: comment.vote - 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/posts/question/:id', async (req, res) => {
    try {
        const { newQuestion } = req.body;
        const qid = req.params.id;
        const currQuestion = await Question.findById(qid);
        await Promise.all(currQuestion.tags.map(tagId => deleteTag(tagId)))
        const tagsIds = await Promise.all(newQuestion.tags.map(tagname => convertTagToTagId(tagname)))
        newQuestion.tags = tagsIds;

        res.send(await Question.findByIdAndUpdate(qid, newQuestion, { returnDocument: 'after' }));
    } catch (e) {
        console.log("It failed to update a question");
        console.log(e);
    }
})

app.delete('/posts/question/:id', async (req, res) => {
    try {
        const qid = req.params.id;
        res.send(await deleteQuestion(qid));
    } catch (e) {
        console.log("It failed to delete a question");
    }
})

// Gets ALL the questions in the database
app.get('/posts/question', async (req, res) => {
    try {
        const allQuestions = await Question.find({});
        const allTags = await Tag.find({});
        const allAnswers = await Answer.find({});
        const allComments = await Comment.find({});
        const allUsers = await User.find({});
        const admin = await Admin.find({});

        res.send({ allQuestions, allTags, allAnswers, allComments, allUsers, admin });
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//Adding Question endpoints
app.post('/posts/question', authenticationToken, async (req, res) => {
    try {
        const { newQuestion, userId } = req.body;
        // Change from tagname to tagid while creating tags as needed
        const tagsIds = await Promise.all(newQuestion.tags.map(tagname => convertTagToTagId(tagname)))
        newQuestion.tags = tagsIds;
        // console.log(newQuestion)
        let qstn = new Question(newQuestion);
        qstn = await qstn.save()
        await addQuestionToUser(qstn, userId);
        res.send();
    } catch (e) {
        console.log(e.message);
        res.send(e.message);
    }
})

app.get('/posts/answer/:id', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId);

        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/posts/answer/:id', async (req, res) => {
    try {
        const newAnswer = req.body;
        const aid = req.params.id;
        res.send(await Answer.findByIdAndUpdate(aid, newAnswer, { returnDocument: 'after' }));
    } catch (e) {
        console.log("It failed to update a question");
    }
});

app.delete('/posts/answer/:id', async (req, res) => {
    try {
        const aid = req.params.id;
        res.send(await deleteQuestion(aid));
    } catch (e) {
        console.log("It failed to delete findUserById question");
    }
});

// POST endpoint to add a new answer
app.post('/posts/answer', async (req, res) => {
    const newAnswerData = req.body;
    const qid = newAnswerData.qid;

    // Create a new Answer document
    const newAnswer = new Answer(newAnswerData);
    const savedAnswer = await newAnswer.save();

    // Find the corresponding question using the Question model
    // Replace 'Question' with the actual name of your Question model
    const question = await Question.findById(qid);

    if (!question) {
        // If the question is not found, delete the saved answer and return a 404 response
        await Answer.findByIdAndDelete(savedAnswer._id);
        return res.status(404).send("Question not found");
    }

    // Update the question to include the answer's ID in its list of answers
    question.answers.push(savedAnswer._id);
    await question.save();

    res.status(201).send(savedAnswer); // 201 Created status for successful creation
});

app.post('/posts/comment', async (req, res) => {
    const newCommentData = req.body;
    const qid = newCommentData.qid;

    // Create a new Answer document
    const newComment = new Comment(newCommentData);
    const savedComment = await newComment.save();

    // Find the corresponding question using the Question model
    // Replace 'Question' with the actual name of your Question model
    const question = await Question.findById(qid);

    if (!question) {
        // If the question is not found, delete the saved answer and return a 404 response
        await Comment.findByIdAndDelete(savedComment._id);
        return res.status(404).send("Question not found");
    }

    // Update the question to include the answer's ID in its list of answers
    question.comments.push(savedComment._id);
    await question.save();

    res.status(201).send(savedComment); // 201 Created status for successful creation
});

app.post('/posts/answer/comment', async (req, res) => {
    const newCommentData = req.body;
    const aid = newCommentData.aid;

    // Create a new Answer document
    const newComment = new Comment(newCommentData);
    const savedComment = await newComment.save();

    // Find the corresponding question using the Question model
    // Replace 'Question' with the actual name of your Question model
    const answer = await Answer.findById(aid);

    if (!answer) {
        // If the question is not found, delete the saved answer and return a 404 response
        await Comment.findByIdAndDelete(savedComment._id);
        return res.status(404).send("Answer not found");
    }

    // Update the question to include the answer's ID in its list of answers
    answer.comments.push(savedComment._id);
    await answer.save();

    res.status(201).send(savedComment); // 201 Created status for successful creation
});

app.get('/posts/tag/:id', async (req, res) => {
    try {
        const tagId = req.params.id;
        const tag = await Tag.findById(tagId);

        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        const questions = await Question.find({ tags: tagId });

        res.json({ tag, questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/posts/tag/:id', async (req, res) => {
    try {
        const { name } = req.body;
        console.log(req.body);
        const tid = req.params.id;
        const tag = await Tag.findById(tid);
        // if (await isTagUsedByMultipleUser(tid)) {
        //     return res.status(409).send(`Tag ${tag?.name} is used by multiple users`);
        // }
        res.send(await Tag.findByIdAndUpdate(tid, { name: name }, { returnDocument: 'after' }));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

app.delete('/posts/tag/:id', async (req, res) => {
    try {
        const tid = req.params.id;
        const tag = await Tag.findById(tid);
        // if (await isTagUsedByMultipleUser(tid)) {
        //     return res.status(409).send(`Tag ${tag?.name} is used by other multiple users`);
        // }
        res.send(await deleteTag(tid));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

// Get info from a specific user
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const questions = await Question.find({ _id: { $in: user.questions } });
        const tags = await Tag.find({ _id: { $in: questions.tags } });
        res.send({ user, questions, tags });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Deletes a user by id
app.delete('/user/:id', async (req, res) => {
    try {
        res.send(await deleteUser(req.params.id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ONLY Admin: Get all users and their info.
app.get('/admin', async (req, res) => {
    try {
        const admin = await Admin.find({});
        const allUsers = await User.find({});
        res.send({ admin, allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST endpoint to add a new answer
app.post('/user', async (req, res) => {
    const newUserData = req.body;
    User.find({ email: newUserData.email })
        .then(async (user) => {
            if (user.length > 0) {
                console.log("User already exists with the same email");
                res.status(409).send("User already exists with the same email");
            } else {
                newUserData.password = await encryptPassword(newUserData.password);
                const user = new User(newUserData);
                console.log("User registered");
                res.status(201).send(await user.save()); // 201 Created status for successful creation
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        })
});

//Increment views
app.put('/views/question/:id', async (req, res) => {
    // Extract the dynamic key (question ID)
    // const dynamicKey = Object.keys(req.body)[0];
    // const extractedId = dynamicKey || null;
    try {
        const questionId = req.params.id;
        let question = await Question.findById(questionId);

        // Ensure that the 'views' property exists before incrementing
        if (!question) {
            // If the question is not found, return a 404 response
            return res.status(404).send("Question not found");
        }

        //question.view++;
        // console.log('Question after increment:', question);

        // await question.save();
        res.send(await Question.findByIdAndUpdate(questionId, { views: question.views + 1 }, { returnDocument: 'after' }));
    } catch (error) {
        console.error("Error incrementing view:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

async function addQuestionToUser(question, uid) {
    const user = await findUserById(uid);
    user.questions.push(question._id);
    await user.save();
}

async function deleteComment(id) {
    return await Comment.findByIdAndDelete(id);
}

async function deleteAnswer(id) {
    const answer = await Answer.findById(id);
    if (answer) {
        answer.comments.map(async (commentId) => deleteComment(commentId))
        return await Answer.findByIdAndDelete(id);
    }
}

async function deleteQuestion(id) {
    const question = await Question.findById(id);
    if (question) {
        question.comments.map(async (commentId) => deleteComment(commentId))
        question.tags.map(async (tagId) => deleteTag(tagId))
        question.answers.map(async (answerId) => deleteAnswer(answerId))
        return await Question.findByIdAndDelete(id);
    }
}

// only delete tags if no more questions are associated with it
async function deleteTag(id) {
    const tag = await Tag.findById(id);
    if (tag) {
        if (tag.referenceCount > 1) {
            tag.referenceCount--;
            return await tag.save();
        } else {
            return await Tag.deleteOne(tag);
        }
    }
}

async function deleteUser(id) {
    const user = await User.findById(id);
    if (user) {
        user.questions.map(async (questionId) => deleteQuestion(questionId));
        return await User.findByIdAndDelete(id);
    }
}

async function convertTagToTagId(tagName) {
    let tag = await Tag.findOne({ name: tagName });
    if (!tag) {
        tag = new Tag({ name: tagName });
    }
    tag.referenceCount++;
    await tag.save();
    return tag._id;
}

async function encryptPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function findUserById(id) {
    const adminUser = await Admin.findById(id);
    const normalUser = await User.findById(id);
    return normalUser || adminUser;
}

async function findUserByQuestionId(qid) {
    const normalUser = await User.findOne({ questions: { $in: [qid] } });
    const adminUser = await Admin.findOne({ questions: { $in: [qid] } });
    return normalUser || adminUser;
}

async function findUserByAnswerId(aid) {
    const normalUser = await User.findOne({ answers: { $in: [aid] } });
    const adminUser = await Admin.findOne({ answers: { $in: [aid] } });
    return normalUser || adminUser;
}

async function findUserByAnswerId(aid) {
    const question = await Question.findOne({ answers: { $in: [aid] } });
    if (!question) {
        return null; // Handle the case where the answer is not found in any question
    }
    const normalUser = await User.findOne({ questions: question._id });
    const adminUser = await Admin.findOne({ questions: question._id });
    return normalUser || adminUser;
}

async function isTagUsedByMultipleUser(tid) {
    const userCount = await User.countDocuments(
        {
            'questions': { $elemMatch: { 'tags': { $in: [tid] } } }
        });

    const adminCount = await Admin.countDocuments(
        {
            'questions': { $elemMatch: { 'tags': { $in: [tid] } } }
        });
    console.log(userCount + adminCount)
    return userCount + adminCount >= 2;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})