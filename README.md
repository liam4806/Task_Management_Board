# Task Management Board

## Task Management Board web app that enables task tracking, collaboration, and progress monitoring with the users using Express.js.

#### Tech Stacks: Express.js, HTML, CSS, JavaScript, MongoDB, Socket.io, and Passport.js

Feature: A user(Signed up with Google ID) can create a Team with users. 

The team, can edit the users and create a Project with start&due dates. 

Inside the project, they can assign tasks to the users who were in the team with the start&due dates. 

Passport.js is used for User Authentication and Socket.io is used for friend linking feature.

# Task Management Feature
## Login Page

<img width="1433" alt="TMB_FirstLogin" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/0e18ee99-9347-4f31-a521-ed251b27d74f">

Users must log in through their Google ID to use this board. When they log in, it will take a username, email, and google ID to create a new profile in the Database.
Passport.js is used.

<img width="496" alt="TMB_GoogleLog" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/1554fdcf-6a20-4037-a908-6a178f4ec1d8">


## Home Page

<img width="1430" alt="TMB_Home" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/3c748f2c-eaf6-4736-8855-67dd6ae4c5ca">

This is the Home page that does not have any team. Users can create a team.

### Create Team

<img width="359" alt="TMB_CreateTeam" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/2b2856e0-097c-4e4f-982d-dd16fc81f054">

Users can decide the name and select the member of the team. Users who are NOT on the team cannot view the team board. They can only view the team board that they are in.

When they create a Team, they can create a Project inside the Team in the same way.

### Create Project

<img width="244" alt="TMB_CreateProj" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/a68c2560-9178-4648-b0ac-b1e3381186eb">

For the Project, users can set the start and due date. 

When users create a project, they can create a task inside the project in the same way. 

### Create Task

<img width="289" alt="TMB_Add_Task" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/2ac84d73-ad32-4582-b168-07150187c666">

For tasks, users can select the progress by To do, In progress, and Done. Also, they can assign users tasks individually.

### Team Dashboard

<img width="757" alt="TMB_TeamDash" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/6b777fa3-5d65-4f24-88a9-eb7978902768">

This is the dashboard after the user creates a team and project. They can edit the content or users of the team directly in this dashboard.

### Project Dashboard

<img width="1427" alt="TMB_ProjDash" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/3dec7eb7-dfd3-46a6-8093-2984d741cfbc">

This is the project dashboard after users add the tasks inside. The dashboard will show the tasks that are sorted by the progress for intuitive view and productivity. 

# Friend Request Feature

Feature to link users by friend request to create a team with their friends only for privacy. Socket.io is used.

## Profile

<img width="398" alt="TMB_Profile" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/209268bf-165b-420d-833c-0425e9a42025">

On the profile page, users can see their information and can search for other users.

### Friend Searching

<img width="393" alt="TMB_Friend_Search" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/6467dc52-55d9-48d8-9584-1d652eaae1c4">

They can search for users and send a friend request.

### Accepting Friend Request

<img width="356" alt="TMB_Accept" src="https://github.com/liam4806/Task_Management_Board/assets/95008167/e4085b7c-6042-4a16-b941-74c91487b2b5">

This is the view of another user who got the friend request. They can decide to accept or decline. When they accept, both of them will be added to the friend list array. 
