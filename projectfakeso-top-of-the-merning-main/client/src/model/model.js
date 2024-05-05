import { WELCOME_PAGE, NEWEST, ACTIVE, UNANSWERED, model } from "../globals.js";
import axios from "axios";

export default class Model {
  constructor() {
    this.data = {
      questions: [],
      tags: [],
      answers: [],
      comments: [],
      users: [],
    };
  }

  async updateModel() {
    const res = await axios.get("http://localhost:8000/posts/question");
    const { allQuestions, allTags, allAnswers, allComments, allUsers, admin } = res.data;
    this.data.questions = allQuestions;
    this.data.tags = allTags;
    this.data.answers = allAnswers;
    this.data.comments = allComments;
    this.data.users = allUsers;
    this.data.users.push(...admin);
    console.log(this.data);
  }

  async updateUsers() {
    const res = await axios.get("http://localhost:8000/admin");
    const { admin, allUsers } = res.data;
    this.data.users = allUsers;
    console.log(this.data);
  }

  //filter questions by term
  filterQuestionsBySearchTerm(questions, searchTerm) {
    return searchTerm
      ? questions.filter((q) => {
        searchTerm = searchTerm.trim();
        const tagRegex = /\[[^\[\]]+\]/g; // Matches anything enclosed in square brackets
        const filteringTags = searchTerm.match(tagRegex) || [];
        const nonTagTerms = searchTerm
          .split(tagRegex)
          .filter((term) => term.trim() !== "")
          .map((term) => term.trim().toLowerCase());

        return (
          filteringTags.some((tagTerm) => {
            const tag = tagTerm.slice(1, -1);
            return q.tags.some((tagId) => {
              const tagObj = this.data.tags.find((t) => t._id === tagId);
              return (
                tagObj && tagObj.name.toLowerCase() === tag.toLowerCase()
              );
            });
          }) ||
          nonTagTerms.some(
            (term) =>
              q.title.toLowerCase().includes(term) ||
              q.text.toLowerCase().includes(term)
          )
        );
      })
      : questions;
  }

  // Planning to add optional parameter sortOrder, filterBy
  getQuestions(sortOrder) {
    let questions = this.data.questions;
    let answers = this.data.answers;

    switch (sortOrder) {
      case NEWEST:
        questions.sort(
          (q1, q2) => new Date(q2.ask_date_time) - new Date(q1.ask_date_time)
        );
        break;
      case ACTIVE:
        questions.sort((q1, q2) => {
          if (q1.answers.length !== 0 && q2.answers.length !== 0) {
            // get all the answers for both questions
            const q1Ans = q1.answers.map((ansId) =>
              answers.find((answer) => answer._id === ansId)
            );
            const q2Ans = q2.answers.map((ansId) =>
              answers.find((answer) => answer._id === ansId)
            );
            // find the most recent answer for both questions
            const a1 = q1Ans.reduce((acc, curr) =>
              new Date(acc.ans_date_time) < new Date(curr.ans_date_time)
                ? curr
                : acc
            );
            const a2 = q2Ans.reduce((acc, curr) =>
              new Date(acc.ans_date_time) < new Date(curr.ans_date_time)
                ? curr
                : acc
            );

            return a2.ans_date_time - a1.ans_date_time;
          }
          return q2.answers.length - q1.answers.length;
        });
        break;
      case UNANSWERED:
        questions = questions.filter((q) => q.answers.length === 0);
        break;
      default:
        questions.sort(
          (q1, q2) => new Date(q2.ask_date_time) - new Date(q1.ask_date_time)
        );
    }
    return questions;
  }

  getQuestionById(qid) {
    return this.data.questions.find((q) => q._id === qid);
  }
  getAllQuestionsByUser(username) {
    return this.data.questions.filter((question) => question.asked_by === username);
  }

  getAllQuestionsAnsweredByUser(username) {
    const answerIds = [];
    // Iterate through each answer and check if ans_by equals the username
    for (const answer of this.data.answers) {
      if (answer.ans_by.localeCompare(username) === 0) {
        answerIds.push(answer._id);
      }
    }
    console.log(answerIds)

    // Manually filter questions based on answer IDs
    const answeredQuestions = [];
    for (const question of this.data.questions) {
      // Check if any answer ID from answerIds array is present in question's answers array
      let hasMatchingAnswer = false;
      for (const answerId of question.answers) {
        if (answerIds.includes(answerId)) {
          hasMatchingAnswer = true;
          break; // No need to check further if a match is found
        }
      }

      // If a matching answer is found, add the question to answeredQuestions
      if (hasMatchingAnswer) {
        answeredQuestions.push(question._id);
      }
    }
    console.log(answeredQuestions)

    return answeredQuestions;
  }

  getAnswerById(aid) {
    return this.data.answers.find((a) => a._id === aid);
  }

  getCommentById(cid) {
    return this.data.comments.find((c) => c._id === cid);
  }

  getUserById(userid) {
    return this.data.users.find((user) => user._id === userid);
  }

  getQuestionsByTag(tag) {
    return this.data.questions.filter((q) => q.tags.includes(tag._id));
  }

  getTagsByUsername(username) {
    const userTags = this.data.tags.filter(tag => tag.username === username);
    return userTags;
  }

  getAnswers() {
    return this.data.answers;
  }

  getTags() {
    return this.data.tags;
  }

  getComments() {
    return this.data.comments;
  }

  getUsers() {
    return this.data.users;
  }

  getAnswerListSortedFromQuestion(question) {
    const answerList = question.answers.map((aid) =>
      this.getAnswers().find((answer) => answer._id === aid)
    );
    answerList.sort((a1, a2) => {
      return new Date(a2.ans_date_time) - new Date(a1.ans_date_time);
    });
    return answerList;
  }

  getCommentListSortedFromQuestion(question) {
    const commentList = question.comments.map((cid) =>
      this.getComments().find((comment) => comment._id === cid)
    );
    commentList.sort((c1, c2) => {
      return new Date(c2.comment_time) - new Date(c1.ans_date_time);
    });
    return commentList;
  }
  
  getCommentListSortedFromAnswer(answer) {
    const commentList = answer.comments.map((cid) =>
      this.getComments().find((comment) => comment._id === cid)
    );
    commentList.sort((c1, c2) => {
      return new Date(c2.comment_time) - new Date(c1.ans_date_time);
    });
    return commentList;
  }
  getCommentListSortedFromAnswer(answer) {
    const commentList = answer.comments.map((cid) =>
        this.getComments().find((comment) => comment._id === cid)
    );
    commentList.sort((c1, c2) => {
      return new Date(c2.comment_time) - new Date(c1.ans_date_time);
    });
    return commentList;
  }

  getTagListByQuestion(question) {
    return question.tags.map((tagid) => {
      return this.getTags().find((tag) => tag._id === tagid);
    });
  }

  getTagStringFromTagList(question) {
    const tagList = this.getTagListByQuestion(question);
    return tagList.map(tag => tag?.name).join(' ');
  }

  async incrementView(qid) {
    try {
      this.getQuestionById(qid).views++;
      const response = await axios.put(`http://localhost:8000/views/question/${qid}`);
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to increment view question')
    }
  }

  async deleteUser(uid) {
    const userInput = prompt("Are you sure you want to delete this user? (Y/N)");
    if (userInput === "Y" || userInput === "y") {
      return await axios.delete(`http://localhost:8000/user/${uid}`);
    }
  }

  async deleteQuestion(qid) {
    return await axios.delete(`http://localhost:8000/posts/question/${qid}`);
  }

  async updateTag(id, name) {
    return await axios.put(`http://localhost:8000/posts/tag/${id}`, {name: name});
  }

  async deleteTag(id) {
    return await axios.delete(`http://localhost:8000/posts/tag/${id}`);
  }

  async upvoteQuestion(qid) {
    try {
      this.getQuestionById(qid).vote++;
      const response = await axios.put(`http://localhost:8000/upvote/question/${qid}`);
      await this.updateModel();
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to upvote question')
    }
  }

  async downvoteQuestion(qid) {
    try {
      this.getQuestionById(qid).vote--;
      const response = await axios.put(`http://localhost:8000/downvote/question/${qid}`);
      await this.updateModel();
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to downvote question')
    }
  }

  async upvoteAnswer(aid) {
    try {
      this.getAnswerById(aid).vote++;
      const response = await axios.put(`http://localhost:8000/upvote/answer/${aid}`);
      await this.updateModel();
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to upvote answer')
    }
  }

  async downvoteAnswer(aid) {
    try {
      this.getAnswerById(aid).vote--;
      const response = await axios.put(`http://localhost:8000/downvote/answer/${aid}`);
      await this.updateModel();
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to downvote answer')
    }
  }

  async upvoteComment(cid) {
    try {
      this.getCommentById(cid).vote++;
      const response = await axios.put(`http://localhost:8000/upvote/comment/${cid}`);
      await this.updateModel();
      return response.data; // Assuming the updated question is sent in the response
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      alert('Failed to upvote comments')
    }
  }

  // If tags already exists, then append the corresponding tid. Otherwise, make a new tag with a new tid.
  parseTags(tags) {
    if (tags === "") {
      return [];
    }
    const tagArr = tags.trim().split(/\s+/).filter(this.onlyUnique);
    return tagArr;
  }

  onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  // asked_by is now the user id
  async addQuestionToModel(
    userId,
    title,
    summary,
    text,
    tags,
    asked_by,
    ask_date_time,
    answers,
    views
  ) {
    // Parse the tags into an array
    const tagsarr = this.parseTags(tags);
    if (!ask_date_time) ask_date_time = new Date(Date.now());
    if (!answers) answers = [];
    if (!views) views = 0;

    const newQuestion = {
      title: title,
      summary: summary,
      text: text,
      tags: tagsarr,
      asked_by: asked_by,
      ask_date_time: ask_date_time,
      answers: answers,
      views: views,
    };
    const requestData = {
      newQuestion,
      userId,
    }
    const token = sessionStorage.getItem("token");
    const requestHeader = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.post(
        "http://localhost:8000/posts/question",
        requestData,
        requestHeader
      );
      console.log("Question added successfully.");
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Error adding questions", error);
    }
  }

  async editQuestion(
    userId,
    qid,
    title,
    summary,
    text,
    tags,
  ) {
    // Parse the tags into an array
    const tagsarr = this.parseTags(tags);
    const newQuestion = {
      title: title,
      summary: summary,
      text: text,
      tags: tagsarr,
    };
    const requestData = {
      newQuestion,
      userId,
    }
    const token = sessionStorage.getItem("token");
    const requestHeader = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.put(
        `http://localhost:8000/posts/question/${qid}`,
        requestData,
        requestHeader
      );
      console.log("Question edited successfully.");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Error edit questions", error);
    }
  }

  async addAnswerToModel(qid, text, ansBy, ansDate) {
    if (!ansDate) ansDate = new Date(Date.now());
    const newAnswer = {
      text: text,
      ans_by: ansBy,
      ans_date_time: ansDate,
      qid: qid,
    };
    try {
      await axios.post("http://localhost:8000/posts/answer", newAnswer);
      console.log("Answer added successfully.");
    } catch (error) {
      console.error("Error adding answer:", error);
      alert('Error adding answer', error)
    }
  }

  async addCommentToModel(qid, text, commented_by, comment_time) {
    if (!comment_time) comment_time = new Date(Date.now());
    const newCommentQuestion = {
      text: text,
      commented_by: commented_by,
      comment_time: comment_time,
      qid: qid,
    };
    try {
      await axios.post(`http://localhost:8000/posts/comment`, newCommentQuestion);
      console.log("Comment added successfully.");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment", error)
    }
  }

  async addCommentToAnswerModel(aid, text, commented_by, comment_time) {
    if (!comment_time) comment_time = new Date(Date.now());
    const newCommentQuestion = {
      text: text,
      commented_by: commented_by,
      comment_time: comment_time,
      aid: aid,
    };
    try {
      await axios.post(`http://localhost:8000/posts/answer/comment`, newCommentQuestion);
      console.log("Comment added successfully.");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment", error);
    }
  }

  async addUserToModel(
    username,
    email,
    password,
    questions,
    reputation,
    member_since
  ) {
    if (!member_since) member_since = new Date(Date.now());
    if (!questions) questions = [];
    if (!reputation) reputation = 0;

    const newUser = {
      username: username,
      email: email,
      password: password,
      questions: questions,
      member_since: member_since,
      reputation: reputation,
    };
    return await axios.post("http://localhost:8000/user", newUser);
  }

  async login(email, password) {
    const credentials = { email, password };
    return await axios.post("http://localhost:8000/login", credentials);
  }

  parseHyperlinks(text) {
    const pattern = /\[([^\]]{1,})\((https?:\/\/[^\s\]]+)\)/g;
    return text.replace(pattern, (match, websiteName, url) => {
      return `<a href="${url}" target="_blank">${websiteName}</a> `;
    });
  }

  // Function to calculate and format the time difference based on guidelines
  getTimeDifferenceFromDate(date) {
    const currentDate = new Date();
    const timeDifference = currentDate - date;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return `${seconds} seconds ago`;
        } else {
          return `${minutes} minutes ago`;
        }
      } else {
        return `${hours} hours ago`;
      }
    } else if (days < 365) {
      return `${date.toLocaleString("default", {
        month: "short",
        day: "numeric",
      })} at 
      ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })}`;
    } else {
      return `${date.toLocaleString("default", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} at 
      ${date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })}`;
    }
  }
}
