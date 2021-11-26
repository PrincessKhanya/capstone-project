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
	  res.send(jRes.getResponse(0, "Could not load users list"));
	  return;
	}

	con.query(
	`SELECT UserID, UserGUID, FullName, UserCellNo, UserPassword, DateRegistered, UserTypeID 
	 FROM users `,
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
	  res.send(jRes.getResponse(0, "Could not load users list"));
	  return;
	}

	con.query(
	`SELECT UserID, UserGUID, FullName, UserCellNo, UserPassword, DateRegistered, UserTypeID 
	 FROM users `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "UserID",
		  show: { UserGUID: "User GUID", FullName: "Full Name", UserCellNo: "User Cell No", UserPassword: "User Password", DateRegistered: "Date Registered", UserTypeID: "User Type ID", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:UserID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  UserID:req.params.UserID };
  let scheme = Joi.object({
	UserID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load users record");
	  return;
	}

	con.query(
	`SELECT UserID, UserGUID, FullName, UserCellNo, UserPassword, DateRegistered, UserTypeID 
	 FROM users WHERE UserID = ? `,
	 [ iObject.UserID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load users record");
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
UserGUID : 	Joi.string().guid().required(), 
FullName : 	Joi.string().min(1).required(), 
UserCellNo : 	Joi.string().min(1).required(), 
UserPassword : 	Joi.string().min(1).required(), 
DateRegistered : 	Joi.date().required(), 
UserTypeID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
UserGUID : req.body.UserGUID.trim(),
FullName : req.body.FullName.trim(),
UserCellNo : req.body.UserCellNo.trim(),
UserPassword : req.body.UserPassword.trim(),
DateRegistered : req.body.DateRegistered.trim(),
UserTypeID : req.body.UserTypeID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save users");
		return;
	  }
  
	  con.query(
		`INSERT INTO users(UserGUID, FullName, UserCellNo, UserPassword, DateRegistered, UserTypeID) 
		VALUES(?, ?, ?, ?, ?, ?);`,
		[iObject.UserGUID,iObject.FullName,iObject.UserCellNo,iObject.UserPassword,iObject.DateRegistered,iObject.UserTypeID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save users");
		  } else {
			res.send(jRes.getResponse(1,"users saved"));
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
UserID : 	Joi.number().integer().required(), 
UserGUID : 	Joi.string().guid().required(), 
FullName : 	Joi.string().min(1).required(), 
UserCellNo : 	Joi.string().min(1).required(), 
UserPassword : 	Joi.string().min(1).required(), 
DateRegistered : 	Joi.date().required(), 
UserTypeID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
UserID : req.body.UserID.trim(),
UserGUID : req.body.UserGUID.trim(),
FullName : req.body.FullName.trim(),
UserCellNo : req.body.UserCellNo.trim(),
UserPassword : req.body.UserPassword.trim(),
DateRegistered : req.body.DateRegistered.trim(),
UserTypeID : req.body.UserTypeID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update users");
		return;
	  }
  
	  con.query(
		`UPDATE users SET UserGUID = ?, FullName = ?, UserCellNo = ?, UserPassword = ?, DateRegistered = ?, UserTypeID = ? WHERE UserID = ?`, 
		[iObject.UserGUID,iObject.FullName,iObject.UserCellNo,iObject.UserPassword,iObject.DateRegistered,iObject.UserTypeID , iObject.UserID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update users");
		  } else {
			res.send(jRes.getResponse(1,"users Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:UserID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  UserID:req.params.UserID };
  let scheme = Joi.object({
	UserID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete users record");
	  return;
	}

	con.query(
	`DELETE FROM users WHERE UserID = ? `,
	 [ iObject.UserID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete users record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;

