export const buildPrompt = ({systemPrompt, structurePrompt}) => {
  const prompt = `
  
  <system_research_prompt>
  ${systemPrompt}
  </system_research_prompt>

  ${structurePrompt}  
  `

return prompt
}
