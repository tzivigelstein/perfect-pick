"use client"

import { useState } from "react"
import { CurvyArrowUp } from "@/components/Icons"

interface Props {
  onSubmit: (input: string) => void
  loading: boolean
}

export default function InputForm({ onSubmit, loading }: Props) {
  const [input, setInput] = useState("")

  const examples = [
    "The Hunger Games, movie",
    "Percy Jackson the first book",
    "The night circus, book",
  ]

  const handleSubmit = () => {
    onSubmit(input)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the name of a book or a movie"
          className="p-3 border border-gray-300 rounded-xl w-full text-black"
        />
        <button
          onClick={handleSubmit}
          className={`bg-teal-400 px-4 py-2 rounded-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      <ul className="flex flex-col gap-2 p-2">
        {examples.map((example) => (
          <li key={example}>
            <button
              className="flex items-center gap-2 hover:font-semibold"
              onClick={() => setInput(example)}
            >
              {example}
              <CurvyArrowUp width={18} stroke="#eee" />
            </button>
          </li>
        ))}
      </ul>
      <p className="text-gray-300 text-left mb-6 w-4/5 p-2">
        Simply enter the name of a book or a movie in the input field above to
        get started. We will provide you with personalized recommendations based
        on your input.
      </p>
    </div>
  )
}
