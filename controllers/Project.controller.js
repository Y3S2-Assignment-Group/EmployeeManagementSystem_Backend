const Employee = require("../models/Employee.model");
const Project = require("../models/Project.model");
const Sprint = require("../models/Sprint.model");
const ProjectManager = require("../models/ProjectManager.model");

//get All Projects details
const getAllProjects = async (req, res) => {
  try {
    const project = await Project.find()
      .populate("projectManager", "_id name")
      .populate("employeeList", "_id name")
      .populate(
        "sprintList",
        "_id fromDate toDate isClosed toDoList inProgressList doneList"
      );
    res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//get Project details
const getProjectDetails = async (req, res) => {
  try {
    //const project = await Project.findById(req.params.id).populate('projectManager', '_id name').populate('employeeList', '_id name').populate('sprintList', '_id fromDate toDate isClosed toDoList inProgressList doneList');
    const project = await Project.findById(req.params.id)
      .populate("projectManager", "_id name")
      .populate("employeeList", "_id name")
      .populate("sprintList", "_id fromDate toDate isClosed")
      .populate({
        path: "sprintList",
        populate: [
          {
            path: "toDoList",
            model: "Issue",
          },
          {
            path: "inProgressList",
            model: "Issue",
          },
          {
            path: "doneList",
            model: "Issue",
          },
        ],
      });
    res.json(project);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Create a Project
const createProject = async (req, res) => {
  const { projectName, descripton, projectManager } = req.body;

  try {
    //create a user instance
    const project = new Project({
      projectName,
      descripton,
      projectManager,
    });

    //save user to the database
    await project
      .save()
      .then(async (createdProject) => {
        const projectManager = await ProjectManager.findById(
          createdProject.projectManager._id
        );
        projectManager.projectsList.unshift(createdProject);
        await projectManager.save();
        res.json(createdProject);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    //Something wrong with the server
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
};

//Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project != null) {
      Project.findByIdAndUpdate(req.params.id).then(
        async (projectExistingProject) => {
          projectExistingProject.projectName = req.body.projectName;
          projectExistingProject.descripton = req.body.descripton;

          projectExistingProject
            .save()
            .then(() => res.json("Project Updated!"))
            .catch((err) => res.status(400).json("Error: " + err));
        }
      );
    }
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Add Team Members To Project
const addEmployeeToProject = async (req, res) => {
  const { employee } = req.body;
  try {
    const project = await Project.findById(req.params.id);

    project.employeeList.unshift(employee);

    await project
      .save()
      .then(async (assignedProject) => {
        const employee = await Employee.findById(req.body.employee._id);
        employee.projectsList.unshift(assignedProject);
        await employee.save();
        res.json(assignedProject);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//Add Sprint To Project
const addSprintToProject = async (req, res) => {
  const { fromDate, toDate } = req.body;
  try {
    const newSprint = new Sprint({
      fromDate,
      toDate,
      isClosed: false,
    });

    //save user to the database
    await newSprint
      .save()
      .then(async (createdSprint) => {
        const project = await Project.findById(req.params.id);
        project.sprintList.unshift(createdSprint);
        await project.save();
        res.json(project);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

//Delete Project
const deleteProject = async (req, res) => {
  try {
    const projToDelete = await Project.findById(req.params.id);
    const projectManager = await ProjectManager.findById(
      projToDelete.projectManager._id
    );

    //Remove Project from Project Manager's Project List
    //GET remove index
    const removeIndex = projectManager.projectsList
      .map((item) => item._id)
      .indexOf(req.params.id);

    projectManager.projectsList.splice(removeIndex, 1);

    await projectManager.save();

    //Remove all employees assigned to the project
    await projToDelete.employeeList.forEach(async (singleEmployee) => {
      const employee = await Employee.findById(singleEmployee._id);
      //Remove Employee from Employee's Project List
      //GET remove index
      const removeIndex = employee.projectsList
        .map((item) => item._id)
        .indexOf(req.params.id);

      employee.projectsList.splice(removeIndex, 1);

      await employee.save();
    });

    //Remove all sprints assigned to the project
    await projToDelete.sprintList.forEach(async (singleSprint) => {
      await Sprint.findByIdAndDelete(singleSprint._id);
    });

    Project.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json("Project Deleted");
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getProjectDetails,
  createProject,
  getAllProjects,
  updateProject,
  addEmployeeToProject,
  addSprintToProject,
  deleteProject,
};
