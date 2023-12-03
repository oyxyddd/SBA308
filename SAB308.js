function getLearnerData(CourseInfo, AssignmentGroup,[LearnerSubmission]){
    //check the data to make sure the arguments are correct datatype
    if (CourseInfo.id != AssignmentGroup.course_id){
        throw new DataError("Course and Assignment id don't match.");
    }

    const LearnerResult = [];
    const AllAssignments = AssignmentGroup.assignments;

    LearnerSubmission.forEach((submission) => {
    // step 1: get the corresponding assignment for this submission  
    const assignment = findAssignment(submission,AssignmentGroup);

    // Setp 2: check whether this assignment is aldready due, if yes then add the assigent to learner's result object
    const today = new Date();
    //only include assignments whoes due date has past
    if(new Date(assignment.due_at) < today){
        // check if the submitted date is past the due date, if yest then modify the score by substracting 10% of possible score from it
        if (new Date(submission.submission.dumbitted_at) > new Date(assignment.due_at)){
            submission.submission.score -= 0.1 * assignment.points_possible;
        }
       
        // check wether learner object already exists, if not creat a new one
        const learner=findLearner(submission.id, LearnerResult);

        // calculate the score for each submission, return error if the possible score is 0
        if(assignment.points_possible <= 0){
            throw new Error("Assignement possible score is 0")
        }else{
            learner[submission.assignment_id] = submission.submission.score / assignment.points_possible;
            learner.total_score += submission.submission.score;
            learner.total_possible += assignment.points_possible;
        }
    }
});

LearnerResult.forEach((learner) =>{
    learner.avg = learner.total_score / learner.total_possible;
    // delete learner.total_score;
    // delete learner.total_possible;
}) ;

return LearnerResult;


// Helper function for finding the corresponding assignment of each submission 
function findAssignment(submission,AssignmentGroup) {
    const AllAssignments = AssignmentGroup.assignments;
    for (const assignment of AllAssignments) {
       console.log(assignment)
        if (assignment.id == submission.assignment_id){
            return assignment;
        }else{
            throw new Error("Learner submission assignment id doesn't match assignment id in assignment group.")
        }
    }
   } 

function findLearner(id,LearnerArray){
    if (LearnerArray.length > 0){
        for (const learner of LearnerArray){
        if(id == learner.id){
            return learner;
        }else{
            const newLearner = {
                id : id,
                total_score : 0,
                total_possible : 0,
            }
            return newLearner;
        }
    }} else{
        const newLearner = {
            id : id,
            total_score : 0,
            total_possible : 0,
        }
        return newLearner;
    }
}

}


