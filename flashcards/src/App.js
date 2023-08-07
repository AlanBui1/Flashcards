import React, { useState } from 'react';

import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState('Upload file to start');
  const [question, setQuestion] = useState('Upload file to start');
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const textChange = (event) => {
    setText(event.target.value);
  };

  const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

  const setReveal = () => {
    setShow(true);
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

      setQuestions(newQuestions);
      setCorrect(0);
      setWrong(0);
    };

    reader.readAsText(selectedFile);
  };

  const nextProblem = () => {
    var ind = Math.round(Math.random() * (questions.length - 1));

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
        <div id='background'></div>
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
        
      </div>
    );
  }
  return (
    <>
      {Main()}
    </>
    
  );
}

export default App;
