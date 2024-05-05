### Quick copy pasting
node server/init.js admin password123

## To make sure everything is in the database
use fake_so
db.answers.find({})
db.comments.find({})
db.questions.find({})
db.tags.find({})
db.admins.find({})
db.users.find({})

## Delete everything
use fake_so
db.admins.deleteMany({}) 
db.answers.deleteMany({}) 
db.comments.deleteMany({}) 
db.tags.deleteMany({}) 
db.users.deleteMany({}) 
db.questions.deleteMany({}) 

## Curl commands
### get request
curl http://localhost:8000/posts/question
curl http://localhost:8000/posts/question/6567dd00f9149a7d26d993eb

### Post request
curl -X POST -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","username":"admin","password":"password"}' http://localhost:8000/verifyCredential

curl -X POST -H "Content-Type: application/json" -d '{"email":"Naxy@gmail.com","username":"Naxy","password":"password"}' http://localhost:8000/verifyCredential

### PUT Request
curl -X PUT -H "Content-Type: application/json" -d '{"text": "I've changed"}' http://localhost:8000/posts/question/6567dd00f9149a7d26d993eb

### Delete Request
curl -X DELETE http://localhost:8000/posts/question/6567dd00f9149a7d26d993eb

curl -X DELETE http://localhost:8000/user/6567e0c650b0115641f77514
