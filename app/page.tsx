"use client"

import { useEffect, useState, KeyboardEvent, MouseEvent, useMemo } from "react"
import { getEvaluation, getQuestions } from "@/clients/server/google/googleai"
import { Extra, Poster, Question } from "@/clients/server/google/types"
import Header from "@/components/Header"
import InputForm from "@/components/InputForm"
import Questionnaire from "@/components/Questionnaire"
import EvaluationResult from "@/components/EvaluationResult"
import ExtraInfo from "@/components/ExtraInfo"
import { CurvyArrowBack, External } from "@/components/Icons"

const DEFAULT_DATA = {
  title: null,
  type: null,
  questions: null,
  extraInfo: null,
  answers: {},
  currentQuestionIndex: 0,
  loading: false,
  error: false,
  movieId: null,
}

export interface Answers {
  [key: number]: string
}

export interface IEvaluationResult {
  evaluation: {
    is_suitable: boolean
    reason: string
  }
  recommendations: {
    title: string
    reason: string
  }[]
}

export default function Home() {
  const [input, setInput] = useState("")
  const [data, setData] = useState<{
    type: string | null
    title: string | null
    questions: Question[] | null
    extraInfo: Extra | null
    answers: Answers
    currentQuestionIndex: number
    loading: boolean
    error: boolean
    movieId: number | null
  }>(DEFAULT_DATA)
  const [evaluation, setEvaluation] = useState<null | IEvaluationResult>(null)

  useEffect(() => {
    if (data.extraInfo) {
      let apiUrl = process.env.NEXT_PUBLIC_POSTERS_API
      apiUrl += `?api_key=${process.env.NEXT_PUBLIC_POSTERS_API_KEY}`
      const postersPromises = data.extraInfo.philosophical.like.map((movie) =>
        fetch(`${apiUrl}&query=${movie.title}`)
          .then((r) => r.json())
          .then((r) => ({ ...r.results.at(0) }))
      )

      Promise.all(postersPromises).then((results: Poster[]) => {
        const filteredResults = results.filter((r) => !!r?.poster_path)

        setData((prev) => {
          return {
            ...prev,
            extraInfo: {
              ...prev.extraInfo,
              philosophical: {
                ...prev.extraInfo?.philosophical,
                like: filteredResults,
              },
            },
          }
        })
      })
    }
  }, [data.questions])

  const handleSubmit = async (input: string) => {
    setInput(input)
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const generatedQuestions = await getQuestions(input)
      if (generatedQuestions) {
        let apiUrl = process.env.NEXT_PUBLIC_POSTERS_API
        apiUrl += `?api_key=${process.env.NEXT_PUBLIC_POSTERS_API_KEY}`

        const movieId = await fetch(
          `${apiUrl}&query=${generatedQuestions.title}`
        )
          .then((r) => r.json())
          .then((r) => (r.results.at(0).id || null) as unknown as number | null)
          .catch((error) => {
            console.log(error)
            return null
          })

        setData((prev) => ({
          ...prev,
          title: generatedQuestions.title,
          type: generatedQuestions.type,
          questions: generatedQuestions.questions,
          extraInfo: generatedQuestions.extra,
          currentQuestionIndex: 0,
          answers: {},
          loading: false,
          movieId,
        }))
      } else {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: true,
        }))
      }
    } catch (error) {
      console.error(error)
      setData((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleQuestionSubmit = (questionIndex: number, answer: string) => {
    setData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answer },
    }))
  }

  const handleNextQuestion = async (
    event: KeyboardEvent<HTMLInputElement> & MouseEvent<HTMLButtonElement>
  ) => {
    const keyWasEnter = event.type === "keydown" && event.key === "Enter"
    const hasClicked = event.type === "click"

    if (hasClicked || keyWasEnter) {
      if (data.currentQuestionIndex === (data.questions?.length ?? 0) - 1) {
        await handleSend()
      } else if (data.answers[data.currentQuestionIndex]) {
        setData((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        }))
      }
    }
  }

  const handleSend = async () => {
    setData((prev) => ({ ...prev, loading: true }))
    try {
      const questionsAndAnswers = data.questions?.reduce(
        (acc, question, index) => {
          acc[question.question] = data.answers[index]
          return acc
        },
        {} as { [key: string]: string }
      )

      const evaluationResult = await getEvaluation(input, questionsAndAnswers!)

      setEvaluation(evaluationResult)
    } catch (error) {
      console.error(error)
    } finally {
      setData((prev) => ({ ...prev, loading: false }))
    }
  }

  const handlePrevQuestion = () => {
    setData((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex - 1,
    }))
  }

  const leadMessages = [
    "🌟 You should see this one!",
    "🎬 This one's definitely worth your time",
    "🍿 Looks like a great choice for you!",
    "👀 You're in for a treat with this one!",
    "🎉 Don't miss out on this gem!",
  ]

  const leadMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * leadMessages.length)
    return leadMessages[randomIndex]
  }, [data.title])

  const baseUrl = "https://www.themoviedb.org/movie/"

  return (
    <>
      <Header
        reset={() => {
          setData(DEFAULT_DATA)
          setEvaluation(null)
        }}
      />
      {!data.questions && (
        <InputForm onSubmit={handleSubmit} loading={data.loading} />
      )}
      {!data.questions && data.extraInfo === null && data.error && (
        <div className="w-full flex flex-col items-center gap-4 mt-8">
          <p className="text-black text-xl">
            Oops! We&apos;re experiencing difficulty finding the media you
            requested. Hang tight and give it another go in a bit! If the issue
            persists, feel free to try a different search query or check back
            later. Thanks for your patience!
          </p>
        </div>
      )}
      {data.questions && (
        <>
          <div className="flex justify-between w-full items-center">
            <p className="w-full">For &quot;{input}&quot;</p>
            <button
              onClick={() => {
                setData(DEFAULT_DATA)
                setEvaluation(null)
              }}
              className="whitespace-nowrap flex gap-2 items-center border-transparent border-2 p-2 rounded-xl hover:border-black"
            >
              Try another one
              <CurvyArrowBack />
            </button>
          </div>
          <h2 className="w-full mb-2">
            {data.movieId && (
              <a
                className="text-5xl font-bold flex items-end gap-3 md:text-black md:hover:text-blue-700 underline md:hover:underline transition-all text-blue-900 md:no-underline"
                href={baseUrl + data.movieId}
                target="_blank"
                rel="noreferrer noopener"
              >
                {data.title}
                <External fill="rgb(29 78 216 / var(--tw-text-opacity))" />
              </a>
            )}
            {!data.movieId && (
              <span className="text-5xl font-bold">{data.title}</span>
            )}
          </h2>
        </>
      )}
      {data.questions && data.questions.length > 0 && !evaluation && (
        <Questionnaire
          questions={data.questions}
          currentQuestionIndex={data.currentQuestionIndex}
          answers={data.answers}
          loading={data.loading}
          onAnswerSubmit={handleQuestionSubmit}
          onNext={handleNextQuestion}
          onPrev={handlePrevQuestion}
          onSend={handleSend}
        />
      )}
      {evaluation && (
        <EvaluationResult
          evaluation={evaluation}
          questions={data.questions!}
          answers={data.answers}
          leadMessage={leadMessage}
        />
      )}
      {data.extraInfo && (
        <ExtraInfo extraInfo={data.extraInfo} type={data.type} />
      )}
    </>
  )
}
