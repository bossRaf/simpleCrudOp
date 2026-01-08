import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db",
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// CRUD Operations

// CREATE 
app.post("/students", (req, res) => {
    const { name, course, subject } = req.body;

    // Input validation
    if (!name || !course || !subject) {
        return res.status(400).json({ error: "Name, course, and subject are required." });
    }

    const sql = "INSERT INTO students (name, course, subject) VALUES (?, ?, ?)";
    const values = [name.trim(), course.trim(), subject.trim()];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            message: "Student added!",
            insertedId: result.insertId
        });
    });
});


// READ students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


app.get("/students/:id", (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a valid number." });
    }

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (rows.length === 0) {
            return res.status(404).json({ error: "Student with this ID does not exist." });
        }

        res.json(rows[0]);
    });
});

// UPDATE student
app.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { name, course, subject } = req.body;

    // Input validation
    if (!name || !course || !subject) {
        return res.status(400).json({ error: "Name, course, and subject are required." });
    }

    const sql = "UPDATE students SET name = ?, course = ?, subject = ? WHERE id = ?";
    const values = [name.trim(), course.trim(), subject.trim(), id];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.json({ message: "Student updated!" });
    });
});


// DELETE student
app.delete("/students/:id", (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a valid number." });
    }

    const checkSql = "SELECT * FROM students WHERE id = ?";

    db.query(checkSql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (rows.length === 0) {
            return res.status(404).json({ error: "Student with this ID does not exist." });
        }

        const deleteSql = "DELETE FROM students WHERE id = ?";
        db.query(deleteSql, [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Student deleted successfully!" });
        });
    });
});


// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
