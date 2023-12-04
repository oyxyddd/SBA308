function getLearnerData(CourseInfo, AssignmentGroup,LearnerSubmissions){
    //check the data to make sure the arguments are correct datatype
    if (CourseInfo.id != AssignmentGroup.course_id){
        throw new DataError("Course and Assignment id don't match.");
    }

    const LearnerResult = [];
    const AllAssignments = AssignmentGroup.assignments;

    LearnerSubmissions.forEach((submission) => {
    // step 1: get the corresponding assignment for this submission  
    const assignment = findAssignment(submission,AllAssignments);

    // Setp 2: check whether this assignment is aldready due, if yes then add the assigent to learner's result object
    const today = new Date();
    //only include assignments whoes due date has past
    if(new Date(assignment.due_at) < today){
        submittedDate = submission.submission.submitted_at;
        // check if the submitted date is past the due date, if yest then modify the score by substracting 10% of possible score from it
        if (new Date(submittedDate) > new Date(assignment.due_at)){
            submission.submission.score -= 0.1 * assignment.points_possible;
        }
       
        // check wether learner object already exists, if not creat a new one
        const learner = findLearner(submission.learner_id, LearnerResult);

        // calculate the score for each submission, return error if the possible score is 0
        if(assignment.points_possible <= 0){
            throw new Error("Assignement possible score is 0")
        }else{
            if( typeof submission.submission.score === 'number' && typeof assignment.points_possible === 'number'){
            learner[submission.assignment_id] = (submission.submission.score / assignment.points_possible).toFixed(2);
            learner.total_score += submission.submission.score;
            learner.total_possible += assignment.points_possible;
        }else{
            throw new Error("Submission score or possible points data are not number")
        }
        }
    }
});

LearnerResult.forEach((learner) =>{
    learner.avg = (learner.total_score / learner.total_possible).toFixed(2);
    delete learner.total_score;
    delete learner.total_possible;
}) ;

return LearnerResult;


// Helper function for finding the corresponding assignment of each submission 
function findAssignment(submission,AllAssignments) {
     for (const assignment of AllAssignments) {
        // console.log(assignment.id)
        // console.log(submission.assignment_id)
        if (assignment.id == submission.assignment_id){
            return assignment;
        }
     }
        throw new Error("Learner submission assignment id doesn't match assignment id in assignment group.")
   } 

function findLearner(id,LearnerArray){

        for (const learner of LearnerArray){
            if(id == learner.id){
                return learner;
        }}
        const newLearner = new Object;
        newLearner.id = id;
        newLearner.total_score = 0;
        newLearner.total_possible = 0;
        LearnerArray.push(newLearner);
        return newLearner; 
}

}


// Function Test Part
// Load test data 
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
};
  
// The provided learner submission data.
 const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];

  try{
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  }catch(error){
    console.log(error.message);
  }