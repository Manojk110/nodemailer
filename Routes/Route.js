const express = require('express');
const router = express.Router();
const User = require("../Models/User");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./Uploads")
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }

})
const upload=multer({storage})


// Get Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        const message = req.session.message;
        delete req.session.message; // Empty Session

        res.render('index_user', {
            title: 'Home Page',
            users: users,
            message: message,
        });
    } catch (err) {
        console.log(err);
        req.session.message = {
            type: 'danger',
            message: "Failed to Fetch Users"
        };
        res.redirect('/');
    }
});

// Add User
router.get("/add_user", async (req, res) => {
    res.render("add_user")

});
router.post("/add_user", upload.single('image'), async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            city: req.body.city,
            email: req.body.email,
            contact: req.body.contact,
            image: req.file ? req.file.filename : null // Handle cases where no file is uploaded
        });
        await user.save();
        req.session.message = {
            type: "success",
            message: "Added successfully"
        };
        res.redirect("/");
    } catch (err) {
        console.log("Error:", err);
        req.session.message = {
            type: "danger",
            message: "User not added"
        };
        res.status(500).redirect("/");
    }
});


// Edit User
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();
        if (!user) {
            console.log('error');
            res.redirect('/');
        }

        res.render('edit_user', {
            title: "Edit User",
            user: user,
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Delete User
router.get("/delete/:id", async (req, res) => {
    const delete_id = req.params.id;
  try{
    User.findOneAndDelete({ _id: delete_id }).exec()
        .then((result) => {
            if (result && result.image !== "") {
                fs.unlinkSync("./Uploads/" + result.image);
                console.log("Your image deleted");
            }
            req.session.message = {
                type: 'success',
                message: "User deleted successfully"
            };
          })
          res.redirect('/');
      }
        catch (err) {
            console.error("Error:", err);
            req.session.message = {
                type: 'danger',
                message: "Failed to delete user"
            };
            res.redirect('/');
        };
});

// Update User
router.post("/update/:id", upload.single('image'), async (req, res) => {
 
    const save_id = req.params.id;
    const new_file = req.file ? req.file.filename : req.body.old_name;
    try{

    User.findByIdAndUpdate(save_id, {
        name: req.body.name,
        city: req.body.city,
        email: req.body.email,
        contact: req.body.contact,
        image: new_file
    }, { new: true })

    .then(() => {
        req.session.message = {
            type: 'success',
            message: "User updated successfully"
        };
        res.redirect('/');
    })}
    catch(err) {
        console.error("Error:", err);
        req.session.message = {
            type: 'danger',
            message: "Failed to update user"
        };
        res.redirect('/');
    };
});




module.exports = router;
