# Soap Service for Toco


## Introduction
Toco-rest is a rest service for Toco. It is a simple service that allows toco to communicate with other systems using rest. it is built using express and postgres for the database . This service is built to complete IF3110 assignment.

## Features Overview
  - [x] manage exrcise
  - [x] manage merchandise
  - [x] manage voucher


## Installation
there are 2 ways that you can run this server

1. using docker
- make sure you have docker installed
- run `docker compose build`
- run `docker compose up`
- the server will run on port 5000

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
- POST /register
- POST /login
- POST /check-email
- POST /check-username
- GET /validate -> validating token

### Exercise
- GET / -> get all exercise
- GET /search -> search exercise
- GET /:id -> get exercise by id
- GET /validate/:id -> validate exercise by id
- POST /create -> create exercise
- POST /result/:exercise_id -> get result of exercise
- PUT /update/:id -> update exercise
- DELETE /delete/:exe_id -> delete exercise

### Image
- GET / -> get all image
- POST /upload -> upload image

### Language
- GET / -> get all language

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





