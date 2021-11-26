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
	  res.send(jRes.getResponse(0, "Could not load meter_billing list"));
	  return;
	}

	con.query(
	`SELECT MeterBillingID, UnitsPurchased, AmountUsed, DateOfPurchase, DateOfUsage, VoucherNo, MeterID 
	 FROM meter_billing `,
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
	  res.send(jRes.getResponse(0, "Could not load meter_billing list"));
	  return;
	}

	con.query(
	`SELECT MeterBillingID, UnitsPurchased, AmountUsed, DateOfPurchase, DateOfUsage, VoucherNo, MeterID 
	 FROM meter_billing `,
	  function (err, result, fields) {
		if (err) {
		  res.send({ key:"", show: {}, data: [] });
		} else {
		  res.send({
		  key: "MeterBillingID",
		  show: { UnitsPurchased: "Units Purchased", AmountUsed: "Amount Used", DateOfPurchase: "Date Of Purchase", DateOfUsage: "Date Of Usage", VoucherNo: "Voucher No", MeterID: "Meter ID", },
		  data: result,
		  });
		}
		con.end();
	  }
	);
  });
});


// Select Record 
router.get("/:MeterBillingID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  MeterBillingID:req.params.MeterBillingID };
  let scheme = Joi.object({
	MeterBillingID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not load meter_billing record");
	  return;
	}

	con.query(
	`SELECT MeterBillingID, UnitsPurchased, AmountUsed, DateOfPurchase, DateOfUsage, VoucherNo, MeterID 
	 FROM meter_billing WHERE MeterBillingID = ? `,
	 [ iObject.MeterBillingID ],
	  function (err, result, fields) {
		if (err || result.length<1) {
		  res.status(400).send("Could not load meter_billing record");
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
UnitsPurchased : 	Joi.number().required(), 
AmountUsed : 	Joi.number().required(), 
DateOfPurchase : 	Joi.date().required(), 
DateOfUsage : 	Joi.date().required(), 
VoucherNo : 	Joi.string().min(1).required(), 
MeterID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
UnitsPurchased : req.body.UnitsPurchased.trim(),
AmountUsed : req.body.AmountUsed.trim(),
DateOfPurchase : req.body.DateOfPurchase.trim(),
DateOfUsage : req.body.DateOfUsage.trim(),
VoucherNo : req.body.VoucherNo.trim(),
MeterID : req.body.MeterID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not save meter_billing");
		return;
	  }
  
	  con.query(
		`INSERT INTO meter_billing(UnitsPurchased, AmountUsed, DateOfPurchase, DateOfUsage, VoucherNo, MeterID) 
		VALUES(?, ?, ?, ?, ?, ?);`,
		[iObject.UnitsPurchased,iObject.AmountUsed,iObject.DateOfPurchase,iObject.DateOfUsage,iObject.VoucherNo,iObject.MeterID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not save meter_billing");
		  } else {
			res.send(jRes.getResponse(1,"meter_billing saved"));
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
MeterBillingID : 	Joi.number().integer().required(), 
UnitsPurchased : 	Joi.number().required(), 
AmountUsed : 	Joi.number().required(), 
DateOfPurchase : 	Joi.date().required(), 
DateOfUsage : 	Joi.date().required(), 
VoucherNo : 	Joi.string().min(1).required(), 
MeterID : 	Joi.number().integer().required(), 
	});
  
	let sResult = scheme.validate(req.body);
  
	if (sResult.error !== undefined) {
	  res.status(400).send(sResult.error.details[0].message);
	  return;
	}
	let iObject = { 
MeterBillingID : req.body.MeterBillingID.trim(),
UnitsPurchased : req.body.UnitsPurchased.trim(),
AmountUsed : req.body.AmountUsed.trim(),
DateOfPurchase : req.body.DateOfPurchase.trim(),
DateOfUsage : req.body.DateOfUsage.trim(),
VoucherNo : req.body.VoucherNo.trim(),
MeterID : req.body.MeterID.trim(),
	};
  
	con.connect(function (err) {
	  if (err) {
		res.status(400).send("Could not update meter_billing");
		return;
	  }
  
	  con.query(
		`UPDATE meter_billing SET UnitsPurchased = ?, AmountUsed = ?, DateOfPurchase = ?, DateOfUsage = ?, VoucherNo = ?, MeterID = ? WHERE MeterBillingID = ?`, 
		[iObject.UnitsPurchased,iObject.AmountUsed,iObject.DateOfPurchase,iObject.DateOfUsage,iObject.VoucherNo,iObject.MeterID , iObject.MeterBillingID],
		function (err, result, fields) {
		  if (err) {
			res.status(400).send("Could not update meter_billing");
		  } else {
			res.send(jRes.getResponse(1,"meter_billing Updated"));
		  }
		  con.end();
		}
	  );
	});
  });

// Delete Record 
router.delete("/:MeterBillingID", (req, res) => 
{
  let con = Connection.NewConnection();
  let iObject = {  MeterBillingID:req.params.MeterBillingID };
  let scheme = Joi.object({
	MeterBillingID: 	Joi.number().integer().required(), 
  });

  let sResult = scheme.validate(iObject);

  if (sResult.error !== undefined) {
	res.status(400).send(sResult.error.details[0].message);
	return;
  }

  con.connect(function (err) {
	if (err) {
	  res.status(400).send("Could not delete meter_billing record");
	  return;
	}

	con.query(
	`DELETE FROM meter_billing WHERE MeterBillingID = ? `,
	 [ iObject.MeterBillingID ],
	  function (err, result, fields) {
		if (err || result.affectedRows<1) {
		  res.status(400).send("Could not delete meter_billing record");
		} else {
		  res.send(jRes.getResponse(1,"Record Deleted"));
		}
		con.end();
	  }
	);
  });
});
module.exports = router;

