# AcadX
 
AcadX is an online learning platform that supplements class-room learnings from universities.

# ABOUT THE WEB APP
It contains all the features a student or teacher will optate for their learning and evaluation of the understanding of the subject. This app endeavours to involve every feature for the assignment submission and the corresponding evaluation by the teachers. It even consists of a scheduler to facilitate students and teachers in scheduling their classes either in virtual or in-person mode.

# GOALS
# Scheduler: 
This feature allows students to submit weekly preferences for attending class in-person or remotely. The tool then assigns available seats to students who want to physically attend class and provides the faculty with a roster of who has been cleared to attend. 
# Submission tool:
Using this tool, the faculty can distribute assignments, and upon receiving submissions from the students - analyze, and grade assignments. The tool could have other features such as test case creation, auto graders, and static code analyzer integration. 

# SPECIFICATIONS / MILESTONES

# Application Setup:
In this, the basics of the application along with some technical designing is done. Using Firebase authentication for authentication, and designing REST APIs - only high level. And predictable db-schemas to kick it off.

# Objectives:
●	Setup application with the required layout as per the mockups. 

●	Configure routings to the required pages

●	Authenticating users and their roles.

●	Setting up user state management.

●	Designing initial DB schemas

●	Design API routes

# Admin Panel
An admin panel to maintain accounts, class slots, etc will be needed and developed with AppSmith.
 AppSmith is an open-source/cloud-based tool where  we can create admin tools, which mostly does CRUD based operations without actually building the UI.
 
# Objectives

●	Admin to be able to add teachers

●	Admin to be able to create/modify classes/departments

●	Assign teachers to a class

●	Maintain available time slots

# Scheduler

● Students will be able to go to a dedicated page for the scheduler, which would be named “Class Preferences”, where the student will be selecting time slots which he prefers like: “10-11”, “11-12” along with the mode of the class(virtual or in-person), for every day of the week.

● Teachers will set up classes for every week, they will select time slots similar to the student, along with the subject name, an optional description, mode of class delivery and any attachments required for reading/references can be attached/mentioned for the class. 

● Upon confirming the class, the scheduler will allocate students to the class based on their preferences and the allocated student will get an email notification of the class. Teacher can see the attending students for the class.


# Assignments and Grading

Teacher from their dashboard can create an assignment for a class with the following details:

●	Assignment name

●	A detailed description

●	Any attachments

●	Questions with achievable marks

●	A deadline

Once the teacher submits the form, all the students in the class will be notified about the assignment along with a link to view more about the assignment.

Students can see the pending assignment on their dashboard and in their assignments page as well. Students can directly write the answers to the assignment questions and they can attach documents for the answers.

Teachers, after getting the submissions, can grade them with marks after reading the answers and the attached documents as well.

## Screenshots

Design Diagrams can be found here: https://drive.google.com/file/d/1U8RctqnDBPsOGJwZWdE_F2S7RcpYC93v/view?usp=sharing

Student Dashboard: 

![Screenshot (384)](https://user-images.githubusercontent.com/47274860/143727294-d2daa257-f61f-4c5a-b3ea-1a4fad610938.png)

Weekly Preferences:

![Screenshot (389)](https://user-images.githubusercontent.com/47274860/143727492-634b56cd-e43c-4560-8474-0c9a50d04d67.png)


Assignments:

![Screenshot (387)](https://user-images.githubusercontent.com/47274860/143727444-cc5c6b61-2c04-45cf-b247-0c943266a86b.png)


