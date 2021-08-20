const Project = require("../models/Project.model");
const Sprint = require("../models/Sprint.model");
const Issue = require("../models/Issue.model");


//Add issue To Sprint
const addIssueToSprint = async (req, res) => {
    const {issueName,description,points,assignee,estimatedTime} = req.body;
    try {

    const newIssue = new Issue({
        issueName,description,points,assignee,progress:"todo",estimatedTime
    });

    //save Issue to the database
    await newIssue.save()
        .then(async (createdIssue) => {
            const sprint = await Sprint.findById(req.params.id);
            sprint.toDoList.unshift(createdIssue);
            await sprint.save();
            res.json(sprint);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
};

//Change issue status from Todo to InProgress
const changeIssueStatusTodoToInProgress = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        //Move Issue from Todo to InProgress Status
        sprint.inProgressList.unshift(req.body.issue);

        //Remove Issue from Todo
        //GET remove index
        const removeIndex = sprint.toDoList
          .map((item) => item.id)
          .indexOf(req.body.issue._id);
  
        sprint.toDoList.splice(removeIndex, 1);
  
        await sprint.save();
  
        res.json(sprint);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
};

//Change issue status from InProgress to Done
const changeIssueStatusInProgressToDone = async (req, res) => {
    try {
        const sprint = await Sprint.findById(req.params.id);

        //Move Issue from InProgress to Done Status
        sprint.doneList.unshift(req.body.issue);

        //Remove Issue from InProgress
        //GET remove index
        const removeIndex = sprint.inProgressList
          .map((item) => item.id)
          .indexOf(req.body.issue._id);
  
        sprint.inProgressList.splice(removeIndex, 1);
  
        await sprint.save();
  
        res.json(sprint);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
};


//Add feedback To Sprint
const addFeedbackSprint = async (req, res) => {
    const feedback = req.body;
    try {

    //save feedback to the sprintt
    await feedback.save()
        .then(async (createdfeedback) => {
            const sprint = await Sprint.findById(req.params.id);
            sprint.feedbackList.unshift(createdfeedback);
            await sprint.save();
            res.json(sprint);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
};

module.exports = { addIssueToSprint , addFeedbackSprint, changeIssueStatusTodoToInProgress, changeIssueStatusInProgressToDone};