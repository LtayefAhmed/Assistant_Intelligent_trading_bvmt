import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Brain, CheckCircle } from 'lucide-react';

const questions = [
    {
        id: 1,
        text: "What is your primary goal for investing?",
        options: [
            { text: "Preserve my capital (Safety)", score: 1 },
            { text: "Growth over a long period (Balanced)", score: 2 },
            { text: "Maximum profit, even with high risk (Aggressive)", score: 3 }
        ]
    },
    {
        id: 2,
        text: "How long do you plan to hold your investments?",
        options: [
            { text: "Less than 1 year", score: 1 },
            { text: "1 - 5 years", score: 2 },
            { text: "More than 5 years", score: 3 }
        ]
    },
    {
        id: 3,
        text: "If your portfolio drops 20% in a week, what do you do?",
        options: [
            { text: "Sell everything immediately", score: 1 },
            { text: "Wait it out / Do nothing", score: 2 },
            { text: "Buy more (Buy the dip)", score: 3 }
        ]
    }
];

const RiskQuestionnaire = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [result, setResult] = useState(null);

    const handleAnswer = (score) => {
        const newScore = totalScore + score;
        if (step < questions.length - 1) {
            setTotalScore(newScore);
            setStep(step + 1);
        } else {
            // Calculate Result
            let profile = "Moderate";
            if (newScore <= 4) profile = "Conservative";
            else if (newScore >= 8) profile = "Aggressive";

            setResult(profile);
            localStorage.setItem('userProfile', profile);
            if (onComplete) onComplete(profile);
        }
    };

    if (result) {
        return (
            <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <Brain size={48} className="text-green-600" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Profile Detected: {result}</h3>
                    <p className="text-gray-500 mt-2">
                        Based on your answers, we have tailored the AI Agent to match your {result.toLowerCase()} risk tolerance.
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Start Trading
                </button>
            </div>
        );
    }

    const q = questions[step];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(((step) / questions.length) * 100)}% Completed</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">{q.text}</h3>

            <div className="space-y-3">
                {q.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(opt.score)}
                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex justify-between group"
                    >
                        <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt.text}</span>
                        <CheckCircle size={20} className="text-transparent group-hover:text-indigo-600 transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RiskQuestionnaire;
