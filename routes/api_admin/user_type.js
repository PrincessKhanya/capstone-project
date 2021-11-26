const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Connection = require("../../modules/DataConnect");
const jRes = require("../../modules/JResponse");




// Select Records 
router.get("/", (req, res) => {
  let con = Connection.NewConnection();

  con.connect(function (err) {
	if (err) {
	  res.send(jRes.getResponse(0, "Could not load user_type list"));
	  return;
	}

	con.query(
	`SELECT UserTypeID, UserTypeName 
	 FROM user_type `,
	  function (err, result, fields) {
		if (err) {
		  res.send([]);
		} else {
		  res.send(result);
		}
		con.end();
	  }
	);
  });
});


// List Records 
router.get("/list", (req, res) => {
  let con = Connection.NewConnection();

  con.connect(function (err) {
	if (err) {
	  res.send(jRes.getResponse(0, "Could not load user_type list"));
	  return;
	}

	con.query(
	`SELECT UserTypeID, UserTypeName 
	 FROM user_type `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "UserTypeID",
		  show: { UserTypeName: "User Type Name", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:UserTypeID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  UserTypeID:req.params.UserTypeID };
  let scheme = Joi.object({
	UserTypeID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load user_type record");
	  return;
	}

	con.query(
	`SELECT UserTypeID, UserTypeName 
	 FROM user_type WHERE UserTypeID = ? `,
	 [ iObject.UserTypeID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load user_type record");
		} else {
		  res.send(result[0]);
		}
		con.end();
	  }
	);
  });
});

// Insert Record 
router.post("/", (req, res) => {
	let con = Connection.NewConnection();
	let scheme = Joi.object({
UserTypeName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
UserTypeName : req.body.UserTypeName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save user_type");
		return;
	  }
  
	  con.query(
		`INSERT INTO user_type(UserTypeName) 
		VALUES(?);`,
		[iObject.UserTypeName],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save user_type");
		  } else {
			res.send(jRes.getResponse(1,"user_type saved"));
		  }
		  con.end();
		}
	  );
	});
  });

// Update Record 
router.put("/", (req, res) => {
	let con = Connection.NewConnection();
	let scheme = Joi.object({
UserTypeID : 	Joi.number().integer().required(), 
UserTypeName : 	Joi.string().min(1).required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
UserTypeID : req.body.UserTypeID.trim(),
UserTypeName : req.body.UserTypeName.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update user_type");
		return;
	  }
  
	  con.query(
		`UPDATE user_type SET UserTypeName = ? WHERE UserTypeID = ?`, 
		[iObject.UserTypeName , iObject.UserTypeID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update user_type");
		  } else {
			res.send(jRes.getResponse(1,"user_type Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:UserTypeID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  UserTypeID:req.params.UserTypeID };
  let scheme = Joi.object({
	UserTypeID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete user_type record");
	  return;
	}

	con.query(
	`DELETE FROM user_type WHERE UserTypeID = ? `,
	 [ iObject.UserTypeID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete user_type record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;

