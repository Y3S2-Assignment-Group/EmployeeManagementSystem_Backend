const Issue = require("../models/Issue.model");

//Delete Issues
const deleteIssue = async (req, res) => {
    try {
      Issue.findByIdAndDelete(req.params.id)
        .then(() => {
          res.json("Issue Deleted");
        })
        .catch((err) => res.status(400).json("Error: " + err));
    } catch (err) {
      res.status(500).send("Server Error");
    }
};
  
//Edit issue
const editIssue = async (req, res) => {
    try {
      const issue = await Issue.findById(req.params.id);
  
      if (issue != null) {
        Issue.findByIdAndUpdate(req.params.id).then(async (updatedIssue) => {
            updatedIssue.issueName = req.body.issueName;
            updatedIssue.description = req.body.description;
            updatedIssue.points = req.body.points;
            updatedIssue.estimatedTime = req.body.estimatedTime;
  
            updatedIssue
            .save()
            .then(() => res.json("Issue Updated!"))
            .catch((err) => res.status(400).json("Error: " + err));
        });
      }
    } catch (err) {
      //Something wrong with the server
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  };
module.exports = { deleteIssue, editIssue };
