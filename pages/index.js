import React, { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [resumeInput, setResumeInput] = useState(""); // Add state for resume input
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  async function onCoverLetterGenerate(event) {
    event.preventDefault();
    try {
      if (!resumeInput) {
        alert("Please provide a resume.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resumeInput);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setCoverLetter(data.coverLetter);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <main className={styles.main}>
        <h3>Generate Cover Letter</h3>
        <label htmlFor="resume">Provide your resume:</label>
        <textarea
          name="resumeInput"
          rows="8"
          cols="50"
          value={resumeInput}
          onChange={(e) => setResumeInput(e.target.value)}
        ></textarea>
        <br />
        <label htmlFor="jobDescription">Enter the job description:</label>
        <textarea
          name="jobDescription"
          rows="4"
          cols="50"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        <br />
        <button onClick={onCoverLetterGenerate}>Generate Cover Letter</button>
        <div className={styles.result}>{coverLetter}</div>
      </main>
    </div>
  );
}
