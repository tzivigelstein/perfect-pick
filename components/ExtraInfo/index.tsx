import { Extra } from "@/clients/server/google/types"

interface ExtraInfoProps {
  extraInfo: Extra
  type: string | null
}

const renderEmotionalCostEmojis = (emotionalCost: number) => {
  const emojis = ["😊", "😄", "😐", "😢", "😔"]
  return emojis.map((emoji, index) => (
    <span
      key={index}
      className={
        index === Math.floor(emotionalCost / 2) ? "" : "filter grayscale"
      }
    >
      {emoji}
    </span>
  ))
}

const basePosterUrl = "http://image.tmdb.org/t/p/w500/"
const baseUrl = "https://www.themoviedb.org/movie/"

export default function ExtraInfo({ extraInfo, type }: ExtraInfoProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 w-full">
      <h3 className="text-xl font-bold">Extra</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white aspect-video p-3 flex flex-col gap-3">
          <p className="font-bold">Age Rating</p>
          <p className="text-center font-semibold text-2xl">
            {extraInfo.rating}
          </p>
        </div>
        <div className="rounded-2xl bg-white aspect-video p-3 flex flex-col gap-3">
          <p className="font-bold">Emotional cost</p>
          <p className="text-center font-semibold text-xl">
            {renderEmotionalCostEmojis(extraInfo.emotional_cost)}
          </p>
        </div>
      </div>
      {extraInfo.philosophical.like.length > 0 && (
        <div>
          <p className="font-bold">Simila media</p>
          <div className="overflow-x-auto whitespace-nowrap">
            {extraInfo.philosophical.like.map((movie, index) => (
              <a
                href={baseUrl + movie.id}
                key={index}
                className="inline-block mr-4"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="block w-44 overflow-ellipsis overflow-hidden">
                  {movie.title}
                </span>
                {movie.poster_path && (
                  <img
                    src={basePosterUrl + movie.poster_path}
                    alt={`Poster of the movie ${movie.title}`}
                    className="rounded w-52"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
