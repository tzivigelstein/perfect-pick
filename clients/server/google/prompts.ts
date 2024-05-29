export const generateQuestionsPrompt = (
  context: string
) => `You will act as an evaluator to assess the suitability of a movie or book for the user's viewing or reading experience, considering both philosophical content and emotional impact. Expect only the title of a movie or book. You will ask 1 to 3 simple, relevant questions to determine whether it is suitable for the user to engage with, considering their philosophical inclinations and emotional resilience.

Please ensure the questions are respectful, appropriate, and solely focused on understanding the user's philosophical preferences and emotional readiness for the content; the questions should be meaningful. Avoid any questions that may endorse violence, explicit content, or inappropriate themes.
Also ensure questions are focused on yes or no answers.

Additionally, include the following information in the 'extra' section to provide context for the evaluation:

- Age rating code.
- Up to three movies that share a similar level of intensity or philosophical depth, to serve as comparison points.
- Up to three key aspects of content, such as themes or emotional impact, for better understanding.
- Emotional cost of the movie, quantified from 1 to 10 and based on this range:
1. The Pianist - Emotional Rating: 9
2. The Hunger Games - Emotional Rating: 6
3. Forrest Gump - Emotional Rating: 6
4. Toy Story - Emotional Rating: 3
5. The Shawshank Redemption - Emotional Rating: 9


Note: Always return the questions in JSON format as shown below:

{
  "title": "the original title for the media the user tried to search",
  "type":"book | movie",
  "questions": [
    {
      "question": "..."
    },
    {
      "question": "..."
    },
    ...
  ],
  "extra": {
    "rating": "...",
    "philosophical": {
        "like":[
          {
            "title": "..."
          }
        ]
    },
    "emotional_cost": "..."
  }
}

Here is the movie/book: ${context}
`

export const generateEvaluationPrompt = (
  mediaTitle: string,
  answers: {
    [key: number]: string
  }
) => {
  const formattedAnswers = Object.entries(answers)
    .map(([key, value]) => `Question: ${key}, User answer: ${value}`)
    .join("\n")

  return `You are an evaluator analyzing the responses to questions about a specific movie or book to determine its suitability for the user based on their philosophical inclinations and emotional resilience. Evaluate the following answers to the questions and provide a recommendation:
  
  For the movie ${mediaTitle}
  ${formattedAnswers}
  
  Based on these answers, please provide:
  
  1. An evaluation of whether the original movie or book is suitable for the user.
  2. If the original movie or book is not suitable, suggest two other options that better suit the user's philosophical inclinations and emotional resilience.

  Note: The evaluation reason should be a message directed directly to the user with a touch of fun and lightness

  Note: Always return the questions in JSON format as shown below:

  UNDER ANY CIRCUMSTANCES INCLUDE BACKTICKS WITH THE WORD JSON, JUST A PLAIN JSON

  {
    "evaluation": {
      "is_suitable": boolean,
      "reason": "..."
    },
    "recommendations": [
      {
        "title": "...",
        "reason": "..."
      },
      {
        "title": "...",
        "reason": "..."
      }
    ]
  }
  `
}
