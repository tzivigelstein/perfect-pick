"use server"

import { TextServiceClient } from "@google-ai/generativelanguage"
import { google } from "@google-ai/generativelanguage/build/protos/protos"
import { GoogleAuth } from "google-auth-library"
import { generateEvaluationPrompt, generateQuestionsPrompt } from "./prompts"
import { QuestionsAndExtras } from "./types"

const baseConfig = {
  model: "models/text-bison-001",
}

const googleai = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLEAI_API_KEY ?? ""),
})

async function generateTextWithErrorHandling(
  config: google.ai.generativelanguage.v1beta.IGenerateTextRequest
) {
  try {
    const response = await googleai.generateText(config)
    if (response) {
      return response
    } else {
      throw new Error("No response received from generateText")
    }
  } catch (error) {
    console.error("Error generating text:", error)
    throw error
  }
}

export async function getQuestions(
  media: string
): Promise<QuestionsAndExtras | undefined> {
  const config = {
    ...baseConfig,
    prompt: {
      text: generateQuestionsPrompt(media),
    },
  }

  const response = await generateTextWithErrorHandling(config)

  if (response) {
    const questions = response[0]

    const candidates = questions?.candidates?.at(0)

    if (!candidates)
      throw Error(
        `No candidates found: ${JSON.stringify(questions.safetyFeedback)}`
      )

    const output = candidates.output

    if (!output) throw Error("No output found")

    try {
      return JSON.parse(output)
    } catch (error) {
      console.log("Couldn't parse questions.")
    }
  }
}

export async function getEvaluation(
  mediaTitle: string,
  answers: {
    [key: string]: string
  }
): Promise<any> {
  const config = {
    ...baseConfig,
    prompt: {
      text: generateEvaluationPrompt(mediaTitle, answers),
    },
  }

  const response = await generateTextWithErrorHandling(config)

  if (response) {
    const evaluation = response[0]

    const candidates = evaluation?.candidates?.at(0)

    if (!candidates)
      throw Error(
        `No candidates found: ${JSON.stringify(evaluation.safetyFeedback)}`
      )

    const output = candidates.output

    if (!output) throw Error("No output found")

    const cleanedOutput = output
      ?.replaceAll("```json", "")
      .replaceAll("```", "")

    if (!cleanedOutput) throw Error("Output failed to parse")

    try {
      return JSON.parse(cleanedOutput)
    } catch (error) {
      console.log("Couldn't parse evaluation.")
    }
  }
}
