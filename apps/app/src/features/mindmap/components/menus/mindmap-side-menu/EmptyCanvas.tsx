"use client"

import { useState } from "react"
import Typer from "./Typer"

export function EmptyCanvas() {
  const [input, setInput] = useState("")

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("Form submitted with:", input)
    // Handle the submission logic here
  }

  return (
    <div className="text-white flex flex-col justify-end items-center gap-6 min-h-[400px] h-screen">
      <div className="w-full max-w-4xl">
        <Typer input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}
