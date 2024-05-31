"use client"

import { KeyboardEvent, MouseEvent } from "react"
import { Question } from "@/clients/server/google/types"
import { Answers } from "@/app/page"

interface Props {
  questions: Question[]
  currentQuestionIndex: number
  answers: Answers
  loading: boolean
  onAnswerSubmit: (questionIndex: number, answer: string) => void
  onNext: (
    event: KeyboardEvent<HTMLInputElement> & MouseEvent<HTMLButtonElement>
  ) => void
  onPrev: () => void
  onSend: () => void
}

export default function Questionnaire({
  questions,
  currentQuestionIndex,
  answers,
  loading,
  onAnswerSubmit,
  onNext,
  onPrev,
  onSend,
}: Props) {
  return (
    <div className="my-4 w-full">
      <span className="text-gray-100 text-sm">
        Question {currentQuestionIndex + 1} of {questions.length}
      </span>
      <p className="text-xl">{questions[currentQuestionIndex]?.question}</p>
      <input
        autoFocus
        type="text"
        value={answers[currentQuestionIndex] || ""}
        onChange={(e) => onAnswerSubmit(currentQuestionIndex, e.target.value)}
        onKeyDown={onNext}
        placeholder="Your answer"
        className="p-2 mt-2 border border-gray-300 rounded-xl w-full text-black"
        disabled={loading}
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={onPrev}
          className={`bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 ${
            currentQuestionIndex === 0 ? "cursor-not-allowed" : ""
          }`}
          disabled={loading || currentQuestionIndex === 0}
        >
          Previous
        </button>
        {currentQuestionIndex != questions.length - 1 ? (
          <button
            onClick={onNext}
            className={`bg-teal-500 text-white px-4 py-2 rounded ${
              currentQuestionIndex === questions.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={loading || currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        ) : (
          <button
            onClick={onSend}
            className={`bg-teal-500 text-white px-4 py-2 rounded ${
              currentQuestionIndex === questions.length - 1
                ? "cursor-not-allowed"
                : ""
            } ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Sending" : "Send"}
          </button>
        )}
      </div>
    </div>
  )
}
