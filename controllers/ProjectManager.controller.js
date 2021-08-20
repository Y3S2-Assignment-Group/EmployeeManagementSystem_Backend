const bcrypt = require("bcryptjs");
const ProjectManager = require("../models/ProjectManager.model");
const jwt = require("jsonwebtoken");
const config = require("config");

//get ProjectManager details
const getProjectManagerDetails = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const user = await ProjectManager.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Authenticate ProjectManager and get token
const loginProjectManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    //See if user Exist
    let user = await ProjectManager.findOne({ email });

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

//Register ProjectManager
const registerProjectManager = async (req, res) => {
  const { name, username, email, password, mobileNumber, rate } = req.body;

  try {
    //See if user Exist
    let user = await ProjectManager.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "ProjectManager already exist" }] });
    }

    //create a user instance
    user = new ProjectManager({
      name,
      username,
      email,
      password,
      mobileNumber,
      rate,
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

//Update ProjectManager ProfileDetails
const updateProjectManagerProfile = async (req, res) => {
  try {
    const user = await ProjectManager.findById(req.params.id);

    if (user != null) {
      ProjectManager.findByIdAndUpdate(req.params.id).then(async (userProfile) => {
        userProfile.name = req.body.name;
        userProfile.profileImg = req.body.profileImg;
        userProfile.username = req.body.username;
        userProfile.mobileNumber = req.body.mobileNumber;
        userProfile.address = req.body.address;
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

module.exports = {
  getProjectManagerDetails,
  loginProjectManager,
  registerProjectManager,
  updateProjectManagerProfile,
};
