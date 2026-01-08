import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [id, setId] = useState(null); // used for update
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");

  // Load students on page load
  const fetchStudents = () => {
    axios
      .get("http://localhost:5000/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Submit form (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { name, course, subject };

    if (id) {
      // UPDATE student
      axios
        .put(`http://localhost:5000/students/${id}`, data)
        .then(() => {
          alert("Student updated!");
          resetForm();
          fetchStudents();
        })
        .catch((err) => console.log(err));
    } else {
      // CREATE student
      axios
        .post("http://localhost:5000/students", data)
        .then(() => {
          alert("Student added!");
          resetForm();
          fetchStudents();
        })
        .catch((err) => console.log(err));
    }
  };

  // Delete student
  const deleteStudent = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    axios
      .delete(`http://localhost:5000/students/${id}`)
      .then(() => fetchStudents())
      .catch((err) => console.log(err));
  };

  // Fill form for edit
  const editStudent = (student) => {
    setId(student.id);
    setName(student.name);
    setCourse(student.course);
    setSubject(student.subject);
  };

  // Clear form
  const resetForm = () => {
    setId(null);
    setName("");
    setCourse("");
    setSubject("");
  };

  return (
    <div style={{ width: "70%", margin: "auto", marginTop: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Student Management System</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h2>{id ? "Update Student" : "Add Student"}</h2>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={
            { width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "15px"
            }}
        />

        <input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          style={
            { width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "15px"
            }}
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={
            { width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "15px"
            }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: id ? "#0275d8" : "green",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
            borderRadius: "15px",
          }}
        >
          {id ? "Update" : "Add"}
        </button>

        {id && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: "10px 20px",
              background: "gray",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "15px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table Section */}
      <h2>Students List</h2>
      <table
        border="1"
        width="100%"
        cellPadding="10"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Student ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Students Found
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td>{s.subject}</td>
                <td>
                  <button
                    onClick={() => editStudent(s)}
                    style={{
                      marginRight: "10px",
                      background: "orange",
                      padding: "5px 10px",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "15px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(s.id)}
                    style={{
                      background: "red",
                      padding: "5px 10px",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "15px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
