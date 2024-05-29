import { MagicWand } from "@/components/Icons"

interface Props {
  reset: () => void
}

export default function Header({ reset }: Props) {
  return (
    <header className="flex w-full justify-between items-center">
      <h1 className="w-full" style={{ fontFamily: "var(--font-dm-sans)" }}>
        <button className="font-semibold text-xl" onClick={reset}>
          Perfect pick 😉
        </button>
      </h1>
      <span className="text-purple-900 px-4 py-2 rounded-lg flex gap-1 items-center whitespace-nowrap text-sm font-semibold">
        AI Powered
        <MagicWand fill="rgb(88 28 135 / var(--tw-text-opacity))" width={21} />
      </span>
    </header>
  )
}
