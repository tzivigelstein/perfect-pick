import { Answers, IEvaluationResult } from "@/app/page"
import { Question } from "@/clients/server/google/types"

interface Props {
  evaluation: IEvaluationResult
  questions: Question[]
  answers: Answers
  leadMessage: string
}

export default function EvaluationResult({
  evaluation,
  questions,
  answers,
  leadMessage,
}: Props) {
  return (
    <div className="mt-4 w-full text-black">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="font-semibold mb-2 text-xl">
          {evaluation.evaluation.is_suitable
            ? leadMessage
            : "Not quite the right fit"}
        </h3>
        <p>{evaluation.evaluation.reason}</p>
        <h3 className="font-semibold mt-4 mb-2 text-xl">Recommendations</h3>
        <p>Here are some cool picks you might like!</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
          {evaluation.recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between"
            >
              <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
              <p>{rec.reason}</p>
            </div>
          ))}
        </div>
        <h3 className="font-semibold mt-4 mb-2">Your Answers</h3>
        <ul className="list-disc pl-5">
          {questions?.map((question, index) => (
            <li key={index} className="mb-2">
              <strong>Q:</strong> {question.question}
              <br />
              <strong>A:</strong> {answers[index]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
