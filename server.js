/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Miracle Uchime Student ID: 133177238 Date: Dec 15, 2024
*
* Online (Vercel) Link: https://vercel.com/miracle-uchimes-projects/assignment-5
*
********************************************************************************/
/*
PGHOST='ep-patient-cell-a526rgqp.us-east-2.aws.neon.tech'
PGDATABASE='Mirax'
PGUSER='Mirax_owner'
PGPASSWORD='4yLFP6NcdeEK'
*/

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
const sequelize = new Sequelize('Mirax', 'Mirax_owner', '4yLFP6NcdeEK', {
  host: 'ep-patient-cell-a526rgqp.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

const express = require("express");
const path = require("path");
const collegeData = require("./collegeData");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const ly = require("express-ejs-layouts");
app.use(ly);
app.set("layout", "layouts/main");

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Middleware for active route highlighting
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" + (isNaN(route.split("/")[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
});

// ------------------------ Routes -------------------------

// Home route
app.get("/", (req, res) => res.render("home"));

// About route
app.get("/about", (req, res) => res.render("about"));

// Students route (handles optional course filtering)
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData
      .getStudentsByCourse(req.query.course)
      .then((students) => res.render("students", { students, message: null }))
      .catch(() => res.render("students", { students: [], message: "No results found" }));
  } else {
    collegeData
      .getAllStudents()
      .then((students) => res.render("students", { students, message: null }))
      .catch(() => res.render("students", { students: [], message: "No results found" }));
  }
});

// Individual student route (by studentNum)
// GET Students
// app.get("/students", (req,res)=> {
//   // get course value
//   const course_id = req.query.course;
//   if (course_id == undefined){
//       get_function = collegeData.getAllStudents();
//   }
//   else {
//       get_function = collegeData.getStudentsByCourse(course_id);
//   }
//
//   get_function.then(
//       function(student_results) {
//           if (student_results.length > 0){
//               res.render('students', { students: student_results });
//           }
//           else {
//               res.render('students', { message: 'no results' }) ;
//           }
//
//       }
//       // (student_results) =>res.render('students', { students: student_results })
//   )
//   .catch(
//       () =>res.render('students', { message: 'no results' })
//   );
// });

 

// GET /courses
app.get("/courses", (req,res)=> {

  collegeData.getCourses()
  .then(
      //(course_data) => res.send(course_data.length) 
       function(course_data) {
          if (course_data.length > 0){
              res.render('courses', { courses: course_data }) 
          }
          else {
              res.render('courses', { message: 'no results', courses:course_data })
          }
          
      } 
  )
  .catch(
      () =>res.render('courses', { message: 'no results', courses:course_data })  
  );
});

//Get /course/courseId
app.get("/course/:id", (req,res)=> {
  const courseNo = req.params.id;
  collegeData.getCourseById(courseNo)
  .then(
      function(course_data) {
          // console.log(course_data);
          res.render('course',{ course: course_data[0]  });
      }
  )
  .catch(
      () =>{ res.render('course', { message: 'query returned 0 results' }) }
  );
});

// GET /student/num
app.get("/student/:num", (req,res)=> {

  let viewData = {};
  const studentNo = req.params.num;

  collegeData.getStudentByNum(studentNo) 
  .then((student_data) => {
      if (student_data) {
          viewData.student = student_data[0];
      } else {
          viewData.student = null;
          console.log(viewData);
      }

  })
  .catch(
      () =>{
          // res.render('student', { message : 'no results' })
          viewData.student = null;
      }
  )
  .then(collegeData.getCourses)
  .then((courseData) => {
      viewData.courses = courseData;

      for (let i=0; i < viewData.courses.length; i++) {
          if (viewData.courses[i].courseId == viewData.student.course) {
              viewData.courses[i]['selected'] = true;
              // break;
          }
      }
  })
  .catch(() => { viewData.courses = [] })
  .then(() => {
      if(viewData.student == null ){
          res.status(404).send('Student Not Found!');
      } else {
          // console.log(viewData);
          res.render('student', {student: viewData.student, courses:viewData.courses });
      }
  });
});

// delete course
app.get("/course/delete/:id", (req,res)=> {
  const courseNo = req.params.id;
  collegeData.deleteCourse(courseNo)
  .then(
      // (course_data) => res.send(course_data) 
      (course_data) =>res.redirect('/courses')  
  )
  .catch(
      () =>res.render('course', { message: 'Unable to Remove Course / Course not found' }) 
  );
});

//delete student
app.get("/student/delete/:studentNum", (req,res)=> {
  const student_no = req.params.studentNum;
  collegeData.deleteStudentByNum(student_no)
  .then(
      // (course_data) => res.send(course_data) 
      (course_data) =>res.redirect('/students')  
  )
  .catch(
      () =>res.render('course', { message: 'Unable to Remove Student / Student not found' }) 
  );
});

//courses add
app.get("/courses", (req, res) => {
  collegeData.getCourses()
      .then((courses) => {
          if (courses.length > 0) {
              res.render("courses", { courses });
          } else {
              res.render("courses", { courses: [], message: "No courses available" });
          }
      })
      .catch(() => res.render("courses", { courses: [], message: "Error retrieving courses" }));
});


//student add
app.get("/students/add", (req,res)=> {
  collegeData.getCourses()
  .then(
      function(course_data) {
          res.render('addStudent', {courses: course_data})
      }
  )
  .catch(
      ()=>res.render('addStudent', {courses: [] })
  )
});

// posting form
app.post("/students/add", (req, res) => {
    // console.log(req.body)
  collegeData.addStudent(req.body) 
  .then(
      () => res.redirect('/students')
  )
  .catch(
      ()=>res.redirect('/students')
  );
});

// creating course
app.get("/courses/add", (req, res) => res.render("addCourse"));
app.post("/courses/add", (req, res) => {
  collegeData.addCourse(req.body) 
  .then(
      () => res.redirect('/courses')
  )
  .catch(
      ()=>res.redirect('/courses')
  );
});

//updating the form
app.post("/students/update", (req, res) => { 
  console.log(req.body); 
  // res.redirect("/students"); 
  collegeData.updateStudent(req.body) 
  .then(
      () => res.redirect('/students')
  )
  .catch(
      () => res.redirect('/students')
  );
});

// updating course
app.post("/course/update", (req, res) => {
  collegeData.updateCourse(req.body) 
  .then(
      () => res.redirect('/courses')
  )
  .catch(
      ()=>res.render('courses') 
  );
});


// HTML Demo route
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));

// 404 Error handling route
app.use((req, res) => res.status(404).send("Page Not Found"));

// ------------------------ Initialize and Start Server -------------------------

collegeData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize data: ${err}`);
  });
