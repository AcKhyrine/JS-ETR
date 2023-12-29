const express = require("express");
const session = require("express-session");
const argon2 = require("argon2");
const con = require("./db/connection");
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;
app.use(express.static("upload"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
const util = require('util'); 

app.use(session({
    secret: "abc",
    resave: false,
    saveUninitialized:false
}))
app.listen(port, (err)=>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log("connected");
})
app.set("view engine", "ejs");

const isloginAdmin = (req, res, next) =>{
    if(!req.session.admin){
        res.redirect("/login")
    }else{
        next();
    }
};

const renderView = (res, view, options = {})=> res.render(view, {...options})

const queryHandler = (res, sql, params, successMessage, redirectPath)=>{
    con.query(sql, params, (err, results)=>{
        if(err){
            console.log(err.message);
            return;
        }
        console.log(successMessage);
        res.redirect(redirectPath)
    })
};

const getPost = (req, res) => {
    const bookSql = "SELECT * FROM books";
    const userSql = "SELECT * FROM user";

    con.query(bookSql, (err, books) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server Error");
        }
        con.query(userSql, (err, users) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }

            if (req.session.admin) {
                renderView(res, "index", { title: "Index", user: req.session.admin, books, users });
            } else {
                renderView(res, "index", { title: "Index", user: null, books, users });
            }
        });
    });
};

const profile = (req, res) => {
    const id = req.params.id;
    const userSql = "SELECT * FROM user WHERE id = ?";
        con.query(userSql, [id], (err, users) => {  
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }
            if (req.session.admin) {
                renderView(res, "profile", { title: "profile", user: req.session.admin, user: users[0] });

            } else {
                renderView(res, "profile", { title: "profile", user: req.session.admin, user: users[0] });

            }
        });
};

const profileUpdate = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.send('Error uploading file.' + err);
            return;
        }

        const { id, fullname, username, email } = req.body;
        const photo = req.file ? req.file.filename : null;

        if (!fullname || !username || !email || !id) {
            return res.status(400).send('Missing required fields.');
        }

        if(photo == null){
            const sql = "UPDATE user SET fullname = ?, username = ?, email = ? WHERE id = ?";

            con.query(sql, [fullname, username, email, id], (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send("Internal Server Error");
                }

                console.log("Updated successfully");
                res.redirect(`/profile/${id}?success=Updated%20successfully`);
            });
        }else{
            const sql = "UPDATE user SET fullname = ?, username = ?, email = ?, image=? WHERE id = ?";

        con.query(sql, [fullname, username, email, photo, id], (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }

            console.log("Updated successfully");
            res.redirect(`/profile/${id}?success=Updated%20successfully`);
        });
        }
    });
};

const PostUpdate = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.send('Error uploading file.' + err);
            return;
        }

        const { id, title, genre, publication_date, author, description, userid} = req.body;
        const photo = req.file ? req.file.filename : null;

        if (!title || !genre || !publication_date || !id || !author || !description) {
            return res.status(400).send('Missing required fields.');
        }

        if(photo == null){
            const sql = "UPDATE books SET title = ?, genre = ?, publication_date = ?, author = ?, description = ? WHERE id = ?";
            con.query(sql, [title, genre, publication_date, author, description, id], (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send("Internal Server Error");
                }
    
                console.log("Updated successfully");
                res.redirect(`/update/${id}/${userid}?success=Updated%20successfully`);
            });
        }else{
            const sql = "UPDATE books SET title = ?, genre = ?, publication_date = ?, author = ?, description = ?, image=? WHERE id = ?";
            con.query(sql, [title, genre, publication_date, author, description, photo, id], (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send("Internal Server Error");
                }
    
                console.log("Updated successfully");
                res.redirect(`/update/${id}/${userid}?success=Updated%20successfully`);
            });
        }
    });
};

const getMyPost = (req, res) => {
    const bookSql = "SELECT * FROM books";
    const userSql = "SELECT * FROM user";

    con.query(bookSql, (err, books) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server Error");
        }
        con.query(userSql, (err, users) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }

            if (req.session.admin) {
                renderView(res, "post", { title: "Mypost", user: req.session.admin, books, users });
            } else {
                renderView(res, "post", { title: "Mypost", user: null, books, users });
            }
        });
    });
};

  const addBlog = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading file.');
        }

        const { title, genre, publication_date, author, description, id } = req.body;
        const photo = req.file ? req.file.filename : null;

        if (!title || !genre || !publication_date || !author || !description || !id) {
            return res.status(400).send('Missing required fields.');
        }

        const sql = "INSERT INTO books (title, genre, publication_date, author, description, user_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)";

        con.query(sql, [title, genre, publication_date, author, description, id, photo], (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }

            console.log("Added successfully");
            res.redirect("/UserPage");
        });
    });
};


const aadd = (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).send("Invalid user ID");
        return;
    }

    const sql = "SELECT * FROM user WHERE id = ?";
    con.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("Internal Server Error");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("User not found");
            return;
        }
        const user = results[0];
        renderView(res, "add", { title: "Add", user });
    });
};

const viewPost = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;

    if (isNaN(id)) {
        res.status(400).send("Invalid book ID");
        return;
    }

    const sqlBook = "SELECT * FROM books WHERE id = ?";
    const sqlUser = "SELECT * FROM user";
    const sqlComments = "SELECT * FROM comment WHERE book_id = ?";

    con.query(sqlBook, [id], (err, bookResults) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("Internal Server Error");
            return;
        }

        if (bookResults.length === 0) {
            res.status(404).send("Book not found");
            return;
        }

        const book = bookResults[0];

        con.query(sqlUser, (err, userResults) => {
            if (err) {
                console.log(err.message);
                res.status(500).send("Internal Server Error");
                return;
            }

            const user = userResults.find(user => user.id === book.user_id);

            con.query(sqlComments, [id], (err, commentsResults) => {
                if (err) {
                    console.log(err.message);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                renderView(res, "view", { title: "View Post", book, users: userResults, comments: commentsResults, me: id2, books: bookResults });

            });
        });
    });
};

const updatePost = (req, res) => {
    const bookID = req.params.id;
    const userID = req.params.id2;
    const bookSql = "SELECT * FROM books WHERE id = ?";
    const userSql = "SELECT * FROM user WHERE id = ?";
    
    con.query(bookSql, [bookID], (err, bookResults) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server Error");
        }

        const book = bookResults[0]; 

        con.query(userSql, [userID], (err, users) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Internal Server Error");
            }

            if (req.session.admin) {
                renderView(res, "update", { title: "Index", user: req.session.admin, book, users });
            } else {
                renderView(res, "update", { title: "Index", user: null, book, users });
            }
        });
    });
};



const addComment = (req, res) => {
    const { user_id, book_id, comment } = req.body;
    const sql = "INSERT INTO comment (user_id, book_id, comment) VALUES (?, ?, ?)";
    
    con.query(sql, [user_id, book_id, comment], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Internal Server Error");
        }

        console.log("Added successfully");
        res.redirect(`/view/${book_id}/${user_id}`);
    });
};


const editComment = (req, res) => {
    const commentId = req.params.commentId;
    const updatedComment = req.params.edited;
    console.log(`Received Comment Data: ${updatedComment}`);

    const sql = "UPDATE comment SET comment = ? WHERE id = ?";

    con.query(sql, [updatedComment, commentId], (err, results) => {
        if (err) {
            console.error(`Error updating comment with ID ${commentId}: ${err.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
        }

        if (results.affectedRows === 0) {
            console.log(`Comment with ID ${commentId} not found`);
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        console.log(`Comment with ID ${commentId} updated successfully`);
        res.json({ success: true, message: "Comment updated successfully" });
    });
};


const deleteComment = (req, res) => {
    const commentId = req.params.commentId;
    const sql = "DELETE FROM comment WHERE id = ?";
    con.query(sql, [commentId], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        console.log(`Comment with ID ${commentId} deleted successfully`);
        res.json({ success: true, message: "Comment deleted successfully" });
    });
};

const deletePost= (req, res) => {
    const postId = req.params.postId;
    const sql = "DELETE FROM books WHERE id = ?";
    con.query(sql, [postId], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        console.log(`Post with ID ${postId} deleted successfully`);
        res.json({ success: true, message: "Post deleted successfully" });
    });
};

const postregister = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.send('Error uploading file.');
            return;
        }

        const { fullname, username, email, password } = req.body;
        const hashpass = await argon2.hash(password);
        const photo = req.file ? req.file.filename : null; 

        const sql = "INSERT INTO user(fullname, username, email, password, image) VALUES (?, ?, ?, ?, ?)";

        con.query(sql, [fullname, username, email, hashpass, photo], (err, results) => {
            if (err) {
                console.log(err.message);
                const errorMessage = "Registration failed. Please try again.";
                res.render('register', { alert: errorMessage });
                return;
            }

            console.log("Registered successfully");
            res.render('register', { success: "Registered successfully" });
        });
    });
};

const storage = multer.diskStorage({
    destination: './upload/images/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
}).single('photo');

const postlogin = (req, res)=>{
    const {email, password} = req.body;
    const sql = "SELECT * FROM user WHERE email = ?";
    con.query(sql, [email], async(err, results)=>{
        if(err){
            console.log(err.message);
        }
        if(results.length > 0){
            const hashpass = results[0].password;
            if(await argon2.verify(hashpass, password)){
                req.session.admin = results[0];
                res.redirect("/UserPage")
            }else{
                renderView(res, "login", {title: "login page", alert:"The password is incorrect"})
            }
        }else{
            renderView(res, "login", {title: "login page", alert:"email does not exist"})
        }
    })
}

app.get("/", (req, res) => renderView(res, "login"));
app.get("/login", (req, res) => res.redirect("/"));
app.get("/login", (req, res) => renderView(res, "login"));
app.post("/login", postlogin);
app.get("/register", (req, res) => renderView(res, "register"));
app.post("/register", postregister);
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.use("/UserPage", isloginAdmin);
app.get("/UserPage", getPost);
app.get("/add/:id", aadd);
app.post("/add", addBlog);
app.get("/view/:id/:id2", viewPost);
app.post("/view", addComment);
app.post('/edit-comment/:commentId/:edited', editComment);
app.post('/delete-comment/:commentId', deleteComment);
app.get("/post", getMyPost);
app.get("/profile/:id", profile);
app.post("/profile", profileUpdate);
app.post('/delete-post/:postId', deletePost);
app.get("/update/:id/:id2", updatePost);
app.post("/update", PostUpdate);
app.use((req, res) => {
    res.redirect("/");
});









