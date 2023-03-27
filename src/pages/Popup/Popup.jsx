import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import './Popup.css';

const DEFAULT_PARAMS = {
  "model": "text-davinci-003",
  "temperature": 0.6,
  "max_tokens": 500,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

const openai_api_key = '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'

const Popup = () => {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [gptloading, setGptLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [gptAnswer, setGptAnswer] = useState('')

  useEffect(() => {
    if (answer !== '') {
      setGptAnswer(answer)
      setLoading(false)
    }
  }, [answer])

  const handleChange = (e) => {
    setQuestion(e.target.value)
  }

  // text-davinci-003 model
  const davinciAnswer = async () => {
    setLoading(true)
    const prompt = question
    const params = {
      "prompt": prompt
    }
    const params_ = { ...DEFAULT_PARAMS, ...params };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(openai_api_key)
      },
      body: JSON.stringify(params_)
    }
    const response = await fetch('https://api.openai.com/v1/completions', requestOptions)
    const data = await response.json()
    setAnswer(data.choices[0].text)
  }

  //gpt-3.5-turbo model
  const gptTurboAnswer = async () => {
    setGptLoading(true)
    console.log('gpt-3.5-turbo-prompt', question)
    const response = await fetch(`https://api.openai.com/v1/chat/completions`,
      {
        body: JSON.stringify({
          'model': 'gpt-3.5-turbo',
          'messages': [
            // { role: 'system', content: 'You are the chatbot to assit the users' },
            // { role: 'user', content: 'What is your name?' },
            // { role: 'assistant', content: 'My name is Gpt-3.5-turbo Chatbot.' },
            { role: 'user', content: question }
          ],
          'temperature': 0.3,
          'max_tokens': 2000
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(openai_api_key)
        }
      })
    setGptLoading(false)
    const data = await response.json()
    console.log("gpt-3.5-turbo", data)
    setAnswer(data.choices[0].message.content)
  }

  return (
    <div className="App">
      <header className="App-header">
        <label for="question">Question</label>
        <textarea id="question" name="question" rows="3" cols="33" onChange={handleChange} />

        <label for="answer">Answer</label>
        <textarea id="answer" name="answer" rows="10" cols="33" value={gptAnswer}></textarea>
        <div className='button-group'>
          <Button type='primary' className='answer-button' loading={loading} onClick={davinciAnswer}>Davinci</Button>
          <Button type='primary' className='answer-button' loading={gptloading} onClick={gptTurboAnswer}>Gpt-3.5-turbo</Button>
        </div>
      </header>
    </div>
  );
};

export default Popup;
