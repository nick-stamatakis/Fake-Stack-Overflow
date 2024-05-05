// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

// The username and password for an admin user must be
// provided as the first argument to server/init.js. You must use these
// credentials to create a user profile for admin in the database.
let userArgs = process.argv.slice(2);
let adminUsername = userArgs[0];
let adminPassword = userArgs[1];
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')
let Admin = require('./models/admins')
let Comment = require('./models/comments')
var bcrypt = require('bcrypt');
const saltRounds = 10;
let mongoDBUrl = "mongodb://127.0.0.1:27017/fake_so"

let mongoose = require('mongoose');
mongoose.connect(mongoDBUrl);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function encryptPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function adminCreate(users) {
  const email = "admin@gmail.com";
  let hash = await encryptPassword(adminPassword);
  let admin = new Admin({ "username": adminUsername, email, "password": hash });
  if (users != false) admin.users = users;
  return admin.save();
}

async function userCreate(username, email, password, questions, reputation, member_since) {
  const hash = await encryptPassword(password);
  const user = new User({ username, email, "password": hash });
  if (questions != false) user.questions = questions;
  if (reputation != false) user.reputation = reputation;
  if (member_since != false) user.member_since = member_since;
  return await user.save();
}

async function commentCreate(text, commented_by, comment_time, vote) {
  const comment = new Comment({ commented_by, text });
  if (comment_time != false) comment.comment_time = comment_time;
  if (vote != false) comment.vote = vote;
  return await comment.save();
}

async function answerCreate(text, ans_by, comments, ans_date_time, vote) {
  answerdetail = { text: text };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (comments != false) answerdetail.comments = comments;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (vote != false) answerdetail.vote = vote;

  const answer = new Answer(answerdetail);
  return await answer.save();
}

// Tags are not tag id, but instead a string of the tag name.
async function questionCreate(title, summary, text, asked_by, tags, answers, comments, ask_date_time, views, vote) {
  qstndetail = {
    title: title,
    summary: summary,
    text: text,
    asked_by: asked_by,
    tags: tags,
  }
  const tagsIds = await Promise.all(qstndetail.tags.map(tagname => convertTagToTagId(tagname)))
  qstndetail.tags = tagsIds;
  if (answers != false) qstndetail.answers = answers;
  if (comments != false) qstndetail.comments = comments;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if (vote != false) qstndetail.vote = vote;

  const qstn = new Question(qstndetail);
  return await qstn.save();
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

const populate = async () => {
  let c1 = await commentCreate('zxlkcvjalskdjaselkfajd', "Naxy");
  let c2 = await commentCreate('gsedghshbrhrdehdefr', "Nick");
  let c3 = await commentCreate('sfasfhiahepfiuewoluir', "Kane");

  let t1 = 'react';
  let t2 = 'javascript';
  let t3 = 'android-studio';
  let t4 = 'shared-preferences';

  let a1 = await answerCreate(
    /* text= */ 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
    /* ans_by= */ 'Naxy',
    /* comments= */[],
    /* ans_date_time= */false,
    /* vote= */false);
  let a2 = await answerCreate(
    /* text= */ 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
    /* ans_by= */ 'Nick',
    /* comments= */[],
    /* ans_date_time= */false,
    /* vote= */false);
  let a3 = await answerCreate(
    'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
    'Naxy',
    /* comments= */[],
    /* ans_date_time= */false,
    /* vote= */false);
  let a4 = await answerCreate(
    'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
    'Nick',
    /* comments= */[],
    /* ans_date_time= */false,
    /* vote= */false);
  let a5 = await answerCreate(
    'I just found all the above examples just too confusing, so I wrote my own. ',
    'Kane',
    /* comments= */[c3],
    /* ans_date_time= */false,
    /* vote= */false);

  let q1 = await questionCreate(
    /* title= */ 'Programmatically navigate using React router',
    /* summary= */ 'Short summary of this question',
    /* text= */ 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
    /* asked_by= */'Naxy',
    /* tags= */[t1, t2],
    /* answers= */[a1, a2],
    /* comments= */[c1],
    /* ask_date_time= */false,
    /* views= */ false,
    /* vote= */ false);
  let q2 = await questionCreate(
    /* title= */ 'android studio save string shared preference',
    /* summary= */ 'Short summary of this question',
    /* text= */ 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
    /* asked_by= */ 'Nick',
    /* tags= */[t3, t4, t2],
    /* answers= */[a3, a4, a5],
    /* comments= */[c2],
    /* ask_date_time= */ false,
    /* views= */ 121,
    /* vote= */ 12);

  let u1 = await userCreate(
    /* username= */ 'Naxy',
    /* email= */ 'Naxy@gmail.com',
    /* password= */ 'password123',
    /* questions= */[q1],
    /* reputation= */false,
    /* member_since= */false);

  let u2 = await userCreate(
    /* username= */ 'Nick',
    /* email= */ 'Nick@gmail.com',
    /* password= */ 'password123',
    /* questions= */[q2],
    /* reputation= */ 40,
    /* member_since= */false);

  let u3 = await userCreate(
    /* username= */ 'Kane',
    /* email= */ 'Kane@gmail.com',
    /* password= */ 'password123',
    /* questions= */[],
    /* reputation= */ 70,
    /* member_since= */false);

  await adminCreate(u1);

  if (db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if (db) db.close();
  });

console.log('processing ...');
