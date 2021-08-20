const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee.model");
const jwt = require("jsonwebtoken");
const config = require("config");

//get Employee details
const getEmployeeDetails = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const user = await Employee.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
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

//Register user
const registerEmployee = async (req, res) => {
  const { name, username, email, password, mobileNumber,department,rate } = req.body;

  try {
    //See if user Exist
    let user = await Employee.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "Employee already exist" }] });
    }

    //create a user instance
    user = new Employee({
        name, username, email, password, mobileNumber,department,rate
    });

    //Encrypt Password

    //10 is enogh..if you want more secured.user a value more than 10
    const salt = await bcrypt.genSalt(10);

    //hashing password
    user.password = await bcrypt.hash(password, salt);

    //save user to the database
    await user.save();

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


//Update profile employee
const updateEmployeeProfile = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);

    if (user != null) {
      Employee.findByIdAndUpdate(req.params.id).then(async (userProfile) => {
        userProfile.name = req.body.name;
        userProfile.profileImg = req.body.profileImg;
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
          .then(() => res.json("User Profile Updated!"))
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

module.exports = { getEmployeeDetails, loginEmployee , registerEmployee,updateEmployeeProfile, deleteEmployee};
