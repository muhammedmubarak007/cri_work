import React, { useState } from 'react';
import './App.css';

const QUESTIONS = [
  {
    id: 0,
    question: "What is your name?",
    type: "text1",
    field: "name"
  },
  {
    id: 1,
    question: "How old are you?",
    type: "text2",
    field: "age"
  },
  {
    id: 2,
    question: "What is your gender?",
    type: "buttons",
    options: ["Male", "Female", "Other"],
    field: "gender"
  },
  {
    id: 3,
    question: "I often question whether I have the skills to be a good parent. ",
    type: "buttons",
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
    field: "q1"
  },
  {
    id: 4,
    question: "Being a parent rarely makes me feel truly satisfied.  ",
    type: "buttons",
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
    field: "q2"
  },
  {
    id: 5,
    question: "I frequently feel anxious or frustrated about my parenting. ",
    type: "buttons",
    options: ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
    field: "q3"
  }
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState(
    QUESTIONS.reduce((acc, question) => {
      acc[question.field] = '';
      return acc;
    }, {})
  );
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    error: null
  });

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionState({ isSubmitting: true, error: null });

    const url = "https://script.google.com/macros/s/AKfycbzFzazwi05qVef9h1g0h1CSF2ymdpegxSlSL2woPfvgPxww9OJBmyz1YM1ML7fTUU534A/exec";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          Name: formData.name,
          Age: formData.age,
          Gender: formData.gender,
          Question1: formData.q1,
          Question2: formData.q2,
          Question3: formData.q3
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.status === "success") {
        window.open("https://www.crink.app/book-therapy", "_blank");
     
  // Reset form
  setFormData(
    QUESTIONS.reduce((acc, question) => {
      acc[question.field] = '';
      return acc;
    }, {})
  );
  setCurrentQuestionIndex(0);
  setSubmissionState({ isSubmitting: false, error: null });
     
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionState({
        isSubmitting: false,
        error: error.message || "Failed to submit form"
      });
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "text1":
        return (
          <div className="input-container">
            <input
              type="text"
              className="text-input"
              value={formData[currentQuestion.field]}
              onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
              placeholder="Type your answer"
            />
          </div>
        );
         case "text2":
        return (
          <div className="input-container">
            <input
              type="number"
              className="text-input"
              value={formData[currentQuestion.field]}
              onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
              placeholder="Type your answer"
            />
          </div>
        );
      case "buttons":
        return (
          <div className="buttons-container">
            <div className="buttons-group">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`option-button ${formData[currentQuestion.field] === option ? 'selected' : ''}`}
                  onClick={() => handleInputChange(currentQuestion.field, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="progress-indicator">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={`progress-bar ${currentQuestionIndex >= index ? 'active' : ''}`}
          />
        ))}
      </div>

      <header className="header">
        <h1>Help us match you to the right therapist</h1>
        <p className="subheading">
          It's important to have a therapist who you can establish a personal connection with.
          The following questions are designed to match you to a licensed therapist based on
          your therapy needs and personal preferences.
        </p>
      </header>

      <div className="card-container">
        <div className="card">
          <div className="card-content">
            <h2>{currentQuestion.question}</h2>
            {renderQuestion()}
            {submissionState.error && (
              <div className="error-message">{submissionState.error}</div>
            )}
            <div className="button-container dual-buttons">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => navigateQuestion('previous')}
                  className="previous-button"
                  type="button"
                >
                  Back
                </button>
              )}
              {currentQuestionIndex < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => navigateQuestion('next')}
                  disabled={!formData[currentQuestion.field]}
                  className="next-button"
                  type="button"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formData[currentQuestion.field] || submissionState.isSubmitting}
                  className="submit-button"
                >
                  {submissionState.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
