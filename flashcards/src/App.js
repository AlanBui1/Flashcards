import React, { useState, useRef } from 'react';

import './App.css';

function App() {
  const [curScreen, setCurScreen] = useState('Home');
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState('Upload file to start');
  const [question, setQuestion] = useState('Upload file to start');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef();

  const [times, setTimes] = useState([]);
  const [answers, setAnswers] = useState([]);

  const changeScreen = () => {
    if (curScreen === 'Home'){
      setCurScreen('Stats');
    }
    else{
      setCurScreen('Home');
    }
  }

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  const textChange = (event) => {
    setText(event.target.value);
  };

  const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

  const setReveal = () => {
    setShow(true);
    const newAnswers = [...answers];
    newAnswers.push(text);
    setAnswers(newAnswers);

    const newTimes = [...times];
    newTimes.push(time);
    setTimes(newTimes);

    if (ans === text){
      setCorrect(correct+1);
    }
    else{
      setWrong(wrong+1);
    }
  }

  const handleSubmission = () => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target.result;
      const jsonData = JSON.parse(contents);

      const newQuestions = [];
      
      for (const i in jsonData){
        newQuestions.push(jsonData[i]);
      }

      for (let i = newQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQuestions[i], newQuestions[j]] = [newQuestions[j], newQuestions[i]];
      }

      setQuestions(newQuestions);
      setCorrect(0);
      setWrong(0);
      setAnswers([]);
      setTimes([]);
    };

    reader.readAsText(selectedFile);
  };

  const nextProblem = () => {
    var ind = (correct+wrong) >= questions.length ? Math.round(Math.random() * (questions.length - 1)) : correct+wrong;

    setQuestion(questions[ind]['question']);
    setAns(questions[ind]['answer']);
    setShow(false);
    setText('');
  }

  function Answer(){
    if (show === true){
      return (
        <h3 class={'text ' + (ans === text ? 'green' : 'red')}>
          {ans}
        </h3>
      );
    }
    
    return (
      <button class='glass' onClick={setReveal}>
        Click to Reveal                
      </button>
    );
  }

  function Main(){
    return (
      <div>
        <div class='full-screen'>
          <div class='card-section glass'>
            <div>
              <h1 class='title'>
                Flashcards Quizzer
              </h1>
            </div>
            
            <div>
              <h2 class='subtitle'>
                Question: 
              </h2>
              <h3 class='text'>
                {question}
              </h3>
            </div>
            
            <div>
              <h2 class='subtitle'>
                Your Answer: 
              </h2>
              <input
                class = "glass text-box text"
                type="text"
                value={text}
                onChange={textChange}
                placeholder=""
              />
            </div>

            <div>
              <h2 class='subtitle'>
                Correct Answer: 
              </h2>
              {Answer()}
            </div>
            
            <div>
              <button class='glass btn' onClick={nextProblem}>
                Click for Next
              </button>
            </div>
          </div>
        </div>
        
        <div class='upload-section'>
          <input class='glass' type="file" onChange={fileChangeHandler} />
          <button class='glass' onClick={handleSubmission}>Upload</button>
        </div>

        <div class='stat-section glass'>
          <h1>
            {correct+ '  |  ' +wrong}
          </h1>
        </div>
        <div class='timer-section glass'>
          <p>{time} seconds</p>
          <div>
          <button class='glass' onClick={startStopwatch}>{isRunning ? 'Stop' : 'Start'}</button>
          <button class='glass' onClick={resetStopwatch}>Reset</button>
          </div>
        </div>

        
      </div>
    );
  }

  function Stats(){
    return (
      <div class='stats-section'>
        {answers.map((item, index) => (
          <div className='glass'>
            <h2 class='question'>{questions[index]['question']}</h2>
            <h3>{'The answer: '+questions[index]['answer']}</h3>
            <h3 class={questions[index]['answer'] === item ? 'green' : 'red'}>{'You answer: '+ item}</h3>
            <h3>{'Time took: '+ (index === 0 ? times[index] : times[index] - times[index-1])}</h3>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      <div id='background'></div>
      {curScreen === 'Home' ? Main() : Stats()}
      <button class='glass btn' onClick={changeScreen}>{curScreen} </button>
    </>
    
  );
}

export default App;
