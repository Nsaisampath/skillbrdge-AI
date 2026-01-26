import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: 'test-key'
})

console.log('Groq object keys:', Object.getOwnPropertyNames(groq))
console.log('Groq object:', groq)
