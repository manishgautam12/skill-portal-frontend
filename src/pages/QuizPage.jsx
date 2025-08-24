import React, { useEffect, useState } from 'react';
import { fetchQuizQuestions, submitQuizAttempt } from '../services/quizService';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function QuizPage() {
  const query = useQuery();
  const skill_id = query.get('skill_id');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!skill_id) {
      navigate('/user/dashboard');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchQuizQuestions(skill_id);
        setQuestions(data.questions || []);
      } catch {
        setError('Failed to load questions');
      }
      setLoading(false);
    };
    load();
  }, [skill_id, navigate]);

  const handleChange = (qid, value) => {
    setAnswers(a => ({ ...a, [qid]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const answerArr = Object.entries(answers).map(([question_id, selected_answer]) => ({ question_id, selected_answer }));
      const res = await submitQuizAttempt(skill_id, answerArr);
      setScore(res.score);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div style={{ color: '#d32f2f' }}>{error}</div>;
  if (!questions.length) return <p>No questions available for this skill.</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>Quiz</h2>
        {submitted ? (
          <div>
            <h3>Quiz Submitted!</h3>
            <p>Your Score: {score} / {questions.length}</p>
            <button onClick={() => navigate('/user/dashboard')}>Back to Dashboard</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '1.5rem' }}>
                <div><b>Q{idx + 1}:</b> {q.question}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <label key={i}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={e => handleChange(q.id, opt)}
                        required
                      /> {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit">Submit Quiz</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
