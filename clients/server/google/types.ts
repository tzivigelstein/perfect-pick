export interface Question {
  question: string
}

export interface Media {
  title: string
}

export interface Poster {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

type MediaWithPoster = Media & Poster

export interface Philosophical {
  like: MediaWithPoster[]
}

export interface Extra {
  rating: string
  philosophical: Philosophical
  emotional_cost: number
}

export interface QuestionsAndExtras {
  title: string | null,
  type: "book" | "movie"
  questions: Question[]
  extra: Extra
}
