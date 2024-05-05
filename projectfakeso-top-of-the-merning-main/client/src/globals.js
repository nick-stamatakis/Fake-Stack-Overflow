import Model from './model/model'

const HOME_PAGE = "home";
const TAGS_PAGE = "tags";
const QUESTION_PAGE = "question";
const ASK_QUESTION_PAGE = "ask question";
const ANS_QUESTION_PAGE = "ans question";
const COMMENT_QUESTION_PAGE = "com question"
const COMMENT_ANSWER = "ans question"
const WELCOME_PAGE = "welcome page";
const REGISTER_PAGE = "register";
const LOGIN_PAGE = "login";
const USERS = "users";
const EDIT_TAG_PAGE = "edit tag";
const USER_PROFILE_PAGE = "user profile";

// sorting options, if you change this, you need to change the model.js as well.
const NEWEST = "newest";
const ACTIVE = "active";
const UNANSWERED = "unanswered";

const model = new Model();
const cookieStore = window.cookieStore;

export { HOME_PAGE, EDIT_TAG_PAGE, TAGS_PAGE, QUESTION_PAGE, ASK_QUESTION_PAGE, ANS_QUESTION_PAGE, COMMENT_QUESTION_PAGE, COMMENT_ANSWER, WELCOME_PAGE, REGISTER_PAGE, LOGIN_PAGE, USERS, USER_PROFILE_PAGE, NEWEST, ACTIVE, UNANSWERED, model, cookieStore };