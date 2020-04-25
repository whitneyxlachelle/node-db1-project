const express = require("express")
const db = require("../data/dbconfig")

const router = express.Router();

// NOTE: All Knex queries return promises.

router.get("/", (req, res) => {
    db('accounts')
        .then(accounts => {
            res.json(accounts);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Failed to get accounts"
            });
        });
});

router.get("/:id", (req, res) => {
    // SELECT * FROM account WHERE id=?
    const { id } = req.params;
    db('accounts').where({ id })
        .then(account => {
            if (account.length) {
                res.json(account);
            } else {
                res.status(404).json({
                    message: "Could not find account with given id."
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Failed to get account"
            });
        });
});

router.post("/", (req, res) => {
    //  INSERT INTO accounts (name, budget) VALUES (?, ?)
    const createAccount = {
        name: req.body.name,
        budget: req.body.budget,
    }
    db('accounts')
        .insert(createAccount)
        .then(() => {
            res.status(201).json({
                message: "New account created!"
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Failed to create account"
            });
        });
});

router.put("/:id", (req, res) => {
    //  UPDATE users SET name=?, budget=? WHERE id=?
    const { id } = req.params;
    const updateAccount = {
        name: req.body.name,
        budget: req.body.budget,
    }
    db('accounts')
        .where({ id })
        .update(updateAccount)
        .then(account => {
            res.status(200).json(account)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Failed to update account"
            });
        });
});

router.delete("/:id", (req, res) => {
    // DELETE FROM accounts WHERE 
    const { id } = req.params;
    db('accounts')
        .where({ id })
        .del()
        .then(() => {
            res.status(200).json({
                message: "Account deleted."
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Failed to delete account"
            });
        });
});

module.exports = router;