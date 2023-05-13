const AppUser = require("../model/UserModel");

const registerUser = (req, res) => {
  let {firstName,lastName,email,password } = req.body;

  AppUser.create({firstName,lastName,email,password}, (err, data) => {
    if (err) res.status(500).json({ error: err });
    res.status(201).json(data);
  });
};

const loginUser = (req, res) => {
  console.log(req.body);

  if (
    !req.body.email ||
    !req.body.password ||
    req.body.password === null ||
    req.body.email === null
  ) {
    res.status(401).json({ error: "Email or Password doesn't match" });
  }

  AppUser.findOne({email: req.body.email }, function (err, doc) {
    if (err) {
      res.status(401).json({ error: "Email or Password doesn't match" });
    } else {
      if (req.body.password === doc.password) {
        req.session.user = doc;
        res.status(200).json(doc);
      } else {
        res.status(401).json({ error: "Password doesn't match" });
      }
    }
  });
};
//update
const updateUser = async (req, res) => {
	const userId = req.params.id;
	console.log(req.params.id);

	try {
		const cRs = await AppUser.findById(userId);

		if (!cRs) {
			return res.status(404).json("There is a no user");
		}

		const {
			userId,
      firstName,
      lastName,
      email,
      password,
		} = req.body;

		await AppUser.findByIdAndUpdate(userId, {
			userId,
      firstName,
      lastName,
      email,
      password,
		});
	} catch (error) {
		res.status(400).json(error.message);
	}
};


//delete
const removeUser = async (req, res) => {
	const userId = req.params.id;

	try {
		const crs = await AppUser.findById(userId);
		if (!crs) {
			return res.status(404).json("There is no userto remove");
		}

		const removeUser = await AppUser.findByIdAndDelete(userId);
		res.status(200).json(removeUser);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const currentUser = (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ error: "User not found" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  removeUser,
  updateUser,

};