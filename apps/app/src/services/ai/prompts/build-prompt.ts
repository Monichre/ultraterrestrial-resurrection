export const buildPrompt = ({systemPrompt, structurePrompt, additionalInstructions}) => {
  const prompt = `
  
  <system_research_prompt>
  ${systemPrompt}
  </system_research_prompt>

  ${structurePrompt}

  ${additionalInstructions}
  
  `

  return prompt
}