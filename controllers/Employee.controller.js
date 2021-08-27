const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee.model");
const Attendence = require("../models/Attendence.model");
const jwt = require("jsonwebtoken");
const config = require("config");

//get Employee details
const getAllEmployeesList = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const empList = await Employee.find().select("-password");
    res.json(empList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//get Employee details
const getEmployeeDetails = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const user = await Employee.findById(req.user.id)
      .select("-password")
      .populate({
        path: "projectsList",
        populate: {
          path: "projectManager",
          select: "name",
        },
      })
      .populate({ path: "attendanceList",model:"Attendence" })
      .populate({
        path: "projectsList",
        populate: {
          path: "sprintList",
          match: { isClosed: false }, //filter not closed sprints
          populate: [
            {
              path: "toDoList",
              model: "Issue",
              match: { assignee: req.user.id },
            },
            {
              path: "inProgressList",
              model: "Issue",
              match: { assignee: req.user.id },
            },
            {
              path: "doneList",
              model: "Issue",
              match: { assignee: req.user.id },
            },
          ],
        },
      });
    res.json(user);
  } catch(err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Authenticate User and get token
const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    //See if user Exist
    let user = await Employee.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //match the user email and password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Authenticate User Face Authetication and get token
const loginEmployeeWithFaceAuthetication = async (req, res) => {
  const { persistedFaceId } = req.body;

  try {
    //See if user Exist
    let user = await Employee.findOne({ persistedFaceId });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Register user
const registerEmployee = async (req, res) => {
  const { name, username, email, password, mobileNumber, department, rate } =
    req.body;

  try {
    //See if user Exist
    let user = await Employee.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Employee already exist" }] });
    }

    const profileImg =
      "https://firebasestorage.googleapis.com/v0/b/econnecteee.appspot.com/o/profileImg.jpg?alt=media&token=46df70d2-9365-4a45-af63-b21c44585f9c";

    //create a user instance
    user = new Employee({
      name,
      username,
      email,
      password,
      mobileNumber,
      department,
      rate,
      profileImg,
    });

    //Encrypt Password

    //10 is enogh..if you want more secured.user a value more than 10
    const salt = await bcrypt.genSalt(10);

    //hashing password
    user.password = await bcrypt.hash(password, salt);

    //save user to the database
    await user.save().then((response) => {
      res.json(response);
    });
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Update profile employee
const updateEmployeeProfile = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);

    if (user != null) {
      Employee.findByIdAndUpdate(req.params.id).then(async (userProfile) => {
        userProfile.name = req.body.name;
        if (req.body.profileImg) {
          userProfile.profileImg = req.body.profileImg;
        }
        if (req.body.persistedFaceId) {
          userProfile.persistedFaceId = req.body.persistedFaceId;
        }
        userProfile.username = req.body.username;
        userProfile.mobileNumber = req.body.mobileNumber;
        if (req.body.password) {
          //Encrypt Password
          //10 is enogh..if you want more secured.user a value more than 10
          const salt = await bcrypt.genSalt(10);
          //hashing password
          userProfile.password = await bcrypt.hash(req.body.password, salt);
        }

        userProfile
          .save()
          .then((response) => res.json(response))
          .catch((err) => res.status(400).json("Error: " + err));
      });
    }
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    Employee.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json("Employee Deleted");
      })
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//Confirm Employee Face Authentication
const confirmEmployeeFaceAuthentication = async (req, res) => {
  try {
    const emp = await Employee.findOne({
      persistedFaceId: req.params.persistedFaceId,
    }).select("_id name username persistedFaceId");
    res.json(emp);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Confirm In Time - Attendence
const confirmInTime = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.userid);
    console.log(req.params.userid);
    if (user != null) {
      console.log("confit");
      Employee.findByIdAndUpdate(req.params.userid).then(async () => {
        const { inTime, date } = req.body;
        try {
          const newAttendenceObj = new Attendence({
            inTime,
            date,
          });

          //save Issue to the database
          await newAttendenceObj
            .save()
            .then(async (createdAttendenceObj) => {
              user.attendanceList.unshift(createdAttendenceObj);
              await user.save();
              res.json(user);
            })
            .catch((err) => res.status(400).json("Error: " + err));
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      });
    }
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Confirm Out Time - Attendence
const confirmOutTime = async (req, res) => {
  try {
      Attendence.findByIdAndUpdate(req.params.attendenceId).then(async (attendence) => {
        console.log("click")
        try {
          attendence.outTime = req.body.outTime
          await attendence
            .save()
            .then(async (createdAttendenceObj) => {
              res.json(createdAttendenceObj);
            })
            .catch((err) => res.status(400).json("Error: " + err));
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      });
    }
   catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

module.exports = {
  getEmployeeDetails,
  loginEmployee,
  registerEmployee,
  updateEmployeeProfile,
  deleteEmployee,
  getAllEmployeesList,
  confirmEmployeeFaceAuthentication,
  confirmInTime,
  confirmOutTime,
  loginEmployeeWithFaceAuthetication
};
