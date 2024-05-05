[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project
### setup server
cd [path-to]/server && npm i && npm i nodemon -g && nodemon server
#### Note: Do cd to server before when trying execute to nodemon. nodemon server/server.js will mess up the path to the .env file. Thanks <3

### setup database
cd [path-to]/server && node init.js
### setup client
cd [path-to]/client && npm i && npm start

admin username: admin 
admin email: admin@gmail.com 
admin password: password123

## Team Member 1 Contribution - Yuxiang Dong
- Moved the files from hw#3
- Installed initial packages
### Initial Packages installed
```
    Client packages:
        npm i axios 
    Server packages:
        npm i express mongoose nodemon cors jsonwebtoken express-session dotenv
```
- Helped create Schemas for new parts of uml
- Programmed init.js to help create initial data in mongoDB.
- Updated constraints on:
   - the question schema
   - the comments schema
   - frontend for creating a new question
- Add boilerplate endpoint route for the backend
- Did password hashing using the bcrypt library
- Update the backend routes so that it handles CRUD functionality for questions, answers, comments, tags, and users.
- Tested backend routes using curl and make sure the deletion propagates.
  - Deleting users would delete all of its questions
  - Deleting question would delete all of its comments, tags and answers
  - Deleting answers would delete all of its comments
  - Only delete tags when the reference count = 0
- Added routes to update the votes of comments answers, and question and the reputation of user.
- Added env file for the secret key for the session cookie
- Refactored global variables into global.js
- output error if user sign up with an existing email
- output error if user login with incorrect password or email
- Stores the JWT into session storage as user's primary way of authentication
- Made the website go to the home page if the user is logged in after refreshing 
- Detect if a tag are used by the multiple users or not.
- Making adding questions work after adding a summary section and deleting the username.
- search bar only shows when it's in the home page;
- Finding the username when adding questions after we removed the username section for ask question page
- Finding the username when adding answer after we removed the username section for answer question page
- Log out button fails when the server is down
- guests can't view the user profile page
- Clicking question on the user profile would direct the user to the edit question page with info populated.
- Clickin 
## Team Member 2 Contribution - Nick Stamatakis
- Helped create Schemas for new parts of uml
- Created initial functionality Login and Sign Up buttons
 - Included checks to see whether displayName, email, and password were valid
- Fixed syntax error in sidebar
- Added WelcomePage.js
- Added UserProfile.js
- Modulated functions in Util.js
- Binded an excessive amount of functions
- Added initial functionality of Comment.js
- Added initial functionality for User Profile Page (in similar fashion to Tags Page)
- Added users [] to model.js in addition to some boiler place for users
- Added functionality for next/prev button for questions
- Added functionality for next/prev button for answers
- fixed bug with total questions and added initial functionality for voting --it still needs more work.
- fixed error making incrementing views persistent
- mades views for questions, answers, comments
- made comments for questions
- made user profile page work with relevant details -- editing and deleting to be done.


## Todo list (tentatively):
Script should take admin credentials as arguments as described in the requirements doc.

- ensuring have at least 1 tag
Should read into usecase more sepecifically for more details. I'm just listing some key differences.
0. UML diagrams! this should be done after reading all of the specification in the doc.
1. Welcome page (use case #1&2)
   <!-- -  Frontend
      -  We need forms to register (new user), login (existing user), guest user
   - Error handling: more detail in specs -->
2. Log out btn (use case #3)
   <!-- -  A page would have a log out button if the user is logged in -->
3. Home page
   - Key difference: question summary, next and prev buttons, voting system
   <!-- - guest: no add question button -->
   <!-- - registered: has add question button -->
   - go to welcome page if there's an error
   - 5 Questions max per page
     - next, prev button are displyaed at the bottom of the list in the case of overflow (>5 qs)
4. Searching
   - has to be on the home page
   <!-- - Search result need to be compatible with the sorting options -->
5. Tags page
   - has to be switched from the home page
   - A new tag name
can only be created by a user with at least 50
reputation points.
6. Creating new question
   - Something about reputation points?
7. Answers page
   - need to display sets of tags + number of votes
   - the addition of comments underneath answers
   - Answers have votes too
   - guest: no add answers button
   - registered: has add answers button
     <!-- - Upvoting increases the vote by 1 and downvoting decreases the vote by 1.
     - Upvoting a question/answer increases the reputation of the corresponding user by 5.
     - Downvoting a question/answer decreases the reputation of the corresponding user by 10. -->
     - A user can vote if their reputation is 50 or higher.
8. Voting system
   - Upvote increase vote by 1 and reputation by 5
   - Downvote decrease vote by 1 and reputation by 10
   - can vote if reputation is 50 or higher
9. Comment
   - A question or an answer has comments.
   - Registered user
     - has input field to capture a new comment by pressing enter
     - has the ability to vote
   - Upvoting is allowed, downvoting is NOT allowed
   - Noticiable constraints
     - Voting on comments has no reputation constraints
     - Adding comments has a constraint of minimum of 50 reputation
10. Creating new answer
    - It will take the user back to the questions page
11. User profile page
    - displays a menu
    - main section displays length of time of being a member + reputation
    - Set of questions asked by the user. When clicked goes to the new questions page
      - Can modify (put request) or delete (delete request) a question
      <!-- - Deleting a question will delete all answers and comments associated with it. (Might wanna use references similar to SQL?) -->
    - links to view all tags created and all questions answered by the user.
    - Can modify or delete tags. However, a tag can be edited or deleted only if it is not being used by any other user.
    - Can modify or delete answers.
12. Admin user profile page:
    - Main section lists all of the users in the system. 
    - Clicking the users will direct to that users page
    - Can delete users
    - A warning message before deletion
