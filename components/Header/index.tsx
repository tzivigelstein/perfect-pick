import { CurvyArrowBack, MagicWand } from "@/components/Icons"

interface Props {
  reset: () => void
  hasData: boolean
}

export default function Header({ reset, hasData }: Props) {
  return (
    <header className="flex w-full justify-between items-center">
      <h1
        className="w-full flex gap-1"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <button className="font-semibold text-xl" onClick={reset}>
          Perfect pick 😉
        </button>
        <span className="text-teal-100 px-4 py-2 rounded-lg flex gap-1 items-center whitespace-nowrap text-sm font-semibold">
          AI Powered
          <MagicWand
            svg={{ width: 21 }}
            path={{ className: "fill-teal-100" }}
          />
        </span>
      </h1>
      {hasData && (
        <button
          onClick={() => reset()}
          className="whitespace-nowrap flex gap-2 items-center border-transparent border-2 p-2 rounded-xl hover:border-white"
        >
          Try another one
          <CurvyArrowBack fill="white" />
        </button>
      )}
    </header>
  )
}
