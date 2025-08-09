import React, { useState } from 'react';
import './App.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
    question: "What is your phone number?",
    type: "phone",
    field: "phone"
  },
  {
    id: 3,
    question: "What is your gender?",
    type: "buttons",
    options: ["Male", "Female", "Other"],
    field: "gender"
  },
  {
    id: 4,
    question: "I often doubt my ability to learn new tasks at work.",
    type: "buttons",
    options: ['Not at all true', 'Slightly true', 'Moderately true', 'Mostly true', 'Completely true'],
    field: "q1"
  },
  {
    id: 5,
    question: "I struggle to solve problems that come up in my job.",
    type: "buttons",
    options: ['Not at all true', 'Slightly true', 'Moderately true', 'Mostly true', 'Completely true'],
    field: "q2"
  },
  {
    id: 6,
    question: "I find it difficult to work well as part of a team.",
    type: "buttons",
    options: ['Not at all true', 'Slightly true', 'Moderately true', 'Mostly true', 'Completely true'],
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

    const url = "https://script.google.com/macros/s/AKfycby8GNaGDZ0r3WiC8dAU27dmQ8srMEswWhYYUZ8hm7On3JbtSdVYrOAZeh-chxYVM8g7zg/exec";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          Name: formData.name,
          Age: formData.age,
          Phone: formData.phone,
          Gender: formData.gender,
          Question1: formData.q1,
          Question2: formData.q2,
          Question3: formData.q3
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();

      if (result.status === "success") {
        window.open("https://rzp.io/rzp/onetime-consultation", "_self");

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
      case "text2":
        return (
          <div className="input-container">
            <input
              type={currentQuestion.type === "text2" ? "number" : "text"}
              className="text-input"
              value={formData[currentQuestion.field]}
              onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
              placeholder="Type your answer"
            />
          </div>
        );

      case "phone":
        return (
          <div className="input-container">
            <PhoneInput
              country={'in'}
              value={formData[currentQuestion.field]}
              onChange={(phone) => handleInputChange(currentQuestion.field, phone)}
              inputClass="text-input"
              inputStyle={{ width: '100%' }}
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
