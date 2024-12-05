require('pg');
const Sequelize = require('sequelize');

var sequelize = new Sequelize('Mirax', 'Mirax_owner', '4yLFP6NcdeEK', {
    host: 'ep-patient-cell-a526rgqp.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});


var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

// defining the model for Course
var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});

// creating relationship
Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        sequelize.sync()
        .then( function() {
            resolve('connection successful!!'); return;
        })
        .catch(function() {
            reject('unable to sync the database !!'); return;
        });
    });
}


// Initialize function to load students and courses
module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        sequelize.sync()
        .then( function() {
            resolve('connection successful!!'); return;
        })
        .catch(function() {
            reject('unable to sync the database !!'); return;
        });
    });
}

// Helper to check if data is initialized
function ensureInitialized() {
    if (!dataCollection) {
        throw new Error("Data not initialized");
    }
}

// Get all students
module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        Student.findAll()
        .then( function(data) {
            resolve(data); return;
        })
        .catch(function() {
            reject('no results returned !!');
        })
    });
} 

// Get all TAs
module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        reject();
});

};

// Get all courses
module.exports.getCourses = function(){
    return new Promise((resolve,reject)=>{
        Course.findAll()
        .then( function(data) {
            resolve(data); return;
        })
        .catch(function() {
            reject('no results returned !!');
        });
    });
};

module.exports.getStudentByNum = function (studentNum) {
    return new Promise((resolve,reject)=>{
        Student.findAll({
            where: {
                studentNum: studentNum
            }
        })
        .then( function(data) {
            resolve(data); return;
        })
        .catch(function() {
            reject('no results returned !!'); return;
        });
    });
};

// Get a course by ID
module.exports.getCourseById = function (num) {
    return new Promise((resolve,reject)=>{
        Course.findAll({
            where: {
                courseId: num,
            }
        })
        .then( function(data) {
            console.log('found');
            resolve(data); return;
        })
        .catch(function() {
            console.log('no found');
            reject('no results returned !!'); return;
        });
    });
};


// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve,reject)=>{
        Student.findAll({
            where: {
                course: course
            }
        })
        .then( function(data) {
            resolve(data); return;
        })
        .catch(function() {
            reject('no results returned !!');
        });
    });
};


// Add a student
module.exports.addStudent = function (studentData) {
    return new Promise( function (resolve, reject) {
        studentData.TA = (studentData.TA)? true: false;
        var studentListCount = 0;
        for(let i =0; i < studentData.length; i++){
            if (studentData[i] == "") {
                studentListCount = studentListCount+1;
            }
        }

        if (studentListCount > 0) {
            reject('All form fields are required '); return;
        }
        Student.create(studentData)
        .then(function(){
            console.log('create');
            resolve(); return;
        })
        .catch(function(){
            console.log('node create');
            reject('unable to create student. '); return;
        });
    } );
}


// Update a student
module.exports.updateStudent = function (studentData) {
    return new Promise( function (resolve, reject) {
        studentData.TA = (studentData.TA)? true: false;
        var studentListCount = 0;
        for(let i =0; i < studentData.length; i++){
            if (studentData[i] == "") {
                studentData = studentData+1;
            }
        }

        if (studentListCount > 0) {
            reject('All form fields are required '); return;
        }

        Student.update(studentData, {
            where: {
                studentNum: studentData.studentNum
            }
        })
        .then(function(){
            resolve(); return;
        })
        .catch(function(){
            reject('unable to create student. '); return;
        });
    } );
}

module.exports.addCourse = function (courseData) {
    return new Promise( function (resolve, reject) {
        var courseListCount = 0;
        for(let i =0; i < courseData.length; i++){
            if (courseData[i] == "") {
                courseListCount = courseListCount+1;
            }
        }

        if (courseListCount > 0) {
            reject('All form fields are required '); return;
        }

        Course.create(courseData)
        .then(function(){
            resolve(); return;
        })
        .catch(function(){
            reject('unable to create course. '); return;
        });
    } );
}

module.exports.updateCourse = function (courseData) {
    return new Promise( function (resolve, reject) {
        var courseListCount = 0;
        for(let i =0; i < courseData.length; i++){
            if (courseData[i] == "") {
                courseListCount = courseListCount+1;
            }
        }

        if (courseListCount > 0) {
            reject('All form fields are required '); return;
        }

        Course.update(courseData, {
            where: {
                courseId: courseData.courseId
            }
        })
        .then(function(){
            resolve(); return;
        })
        .catch(function(){
            reject('unable to update course. '); return;
        });
    } );
}

module.exports.deleteCourse = function (courseID) {
    return new Promise( function (resolve, reject) {
        Course.destroy( {
            where: {
                courseId: courseID
            }
        })
        .then(function(){
            resolve(); return;
        })
        .catch(function(){
            reject('unable to delete course. '); return;
        });
    } );
}

module.exports.deleteStudentByNum = function (student_no) {
    return new Promise( function (resolve, reject) {
        Student.destroy( {
            where: {
                studentNum: student_no
            }
        })
        .then(function(){
            resolve(); return;
        })
        .catch(function(){
            reject('unable to delete student. '); return;
        });
    } );
}


