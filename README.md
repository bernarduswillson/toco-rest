# Rest Service for Toco

## Description
Toco-rest is a web back-end for Toco-spa. It is a service that allows toco to handle logic on the server side, fetch databases, and to communicate with other systems using restful APIs. it is built using expressJs and postgres.

## Features Overview
  - [x] Authentication (JWT)
  - [x] Authentication (Api Key)
  - [x] Exercise API (including Question API and Option API)
  - [x] Merchandise API
  - [x] Admin API
  - [x] Voucher API
  - [x] Language API
  - [x] Progress API

## Database Schema
Toco soap service uses 7 tables in the database, the tables are `admin`, `exercise`, `question`, `option`, `progress`, `merchandise`, and `voucher` . The schema for the tables are as follows
![schema]( img/rest_ERD.png)

## Endpoints
### Admin
- GET / -> get all admin
- GET /search -> search admin
- GET /:id -> get admin by id
- POST /create -> create admin
- PUT /edit/:id -> update admin
- DELETE /delete/:id -> delete admin

### Auth
- POST /login -> login
- POST /check-email -> email validation
- POST /check-username -> username validation
- GET /validate -> token validation

### Exercise
- GET / -> get all exercises
- GET /search -> search exercises
- GET /:id -> get exercise by id
- GET /validate/:id -> validate exercise by id
- POST /create -> create exercise
- POST /result/:exercise_id -> get result of exercise
- PUT /update/:id -> update exercise
- DELETE /delete/:exe_id -> delete exercise

### Image
- GET / -> get all images
- POST /upload -> upload image

### Language
- GET / -> get all languages

### Merch
- GET / -> get all merch
- GET /search -> search merch
- GET /validate/:id -> validate merch
- GET /:id -> get merch by id
- POST /create -> create merch
- POST /buy/:merch_id -> try buying merch (validate to soap)
- PUT /edit/:id -> update merch
- DELETE /delete/:id -> delete merch

### Option
- POST /create -> create option
- PUT /update/:o_id -> update option
- DELETE /delete/:o_id -> delete option
- GET /:q_id -> get option from question id

### Progress
- POST /create -> create progress
- GET /user/:user_id -> get progress from user id
- 

### Question
- POST /create -> create question
- PUT /update/:q_id -> update question
- DELETE /delete/:q_id -> delete question
- GET /:exe_id -> get question from exercise id
- GET /count/:exe_id -> get question count from exercise id
  
### Voucher
- GET / -> get all voucher
- GET /search -> search voucher
- GET /:id -> get voucher by id
- GET /validate/:id -> validate voucher
- POST /create -> create voucher
- PUT /edit/:id -> update voucher
- DELETE /delete/:id -> delete voucher
- POST /use/:code -> use voucher

| Fitur                     | NIM      |
| ------------------------  | -------- |
| Token authentication      |  13521021|
| ApiKey authentication     |  13521019|
| ApiKey database           |  13521019|
| Image API                 |  13521019, 13521021|
| Exercise API              |  13521019, 13521021|
| Exercise database         |  13521021|
| Merchandise API           |  13521019, 13521021|
| Merchandise database      |  13521021|
| Admin API                 |  13521019
| Admin database            |  13521021|
| Voucher API               |  13521019|
| Voucher database          |  13521021|
| Language API              |  13521021|
| Progress API              |  13521021|



