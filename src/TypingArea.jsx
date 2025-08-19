import './App.css'
import { useEffect, useState,useRef } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { finished, inProgress, notStarted } from './assets/typingslice'
import test from './assets/test.json'

const TypingArea=()=>{
  const [text, setText]=useState(null)
  const [typingSpeed, setTypingSpeed]=useState(null)
  const typingTest=test.text
  const testDuration=test.duration// 1 min test for ease
  const [placeHolder, setPlaceHolder]=useState(typingTest.repeat(10))
  const [elapsedTime, setElapsedTime]=useState(0)
  const typingInterval=useRef(null)
  const textAreaRef=useRef(null)
  const placeholderRef=useRef(null)
  const testStatus=useSelector(state=>state.status)
  const dispatch=useDispatch()

  const typingKeys=(event)=>{
    setText(event.target.value)
  }

  const calculateTypingSpeed=()=>{
    var   grossWPM=Math.floor((text?.length/5)/(testDuration/60))
    
    var typingTestToBeMatched=typingTest?.split('').slice(0,text?.length)
    var numberOfMatchedCharacters=text?.split('').filter((character,index)=>{
      return typingTestToBeMatched[index]==text[index]
    })?.length
    if (numberOfMatchedCharacters==0){
      var accuracy=0
      var netWPM=0
    }else{
      var accuracy=Math.floor((numberOfMatchedCharacters/text?.length)*100)
      var netWPM=Math.floor((numberOfMatchedCharacters/5)/(testDuration/60))
    }

    setTypingSpeed({grossWPM,netWPM,accuracy})
  }

  const resestTypingTest=()=>{
    dispatch(notStarted())
    setText("")
    setTypingSpeed(null)
    setPlaceHolder(typingTest.repeat(10))
    setElapsedTime(0)
  }

  const keyPressed=()=>{
    if(testStatus=="not_started"){
      dispatch(inProgress())
    }
  }

  useEffect(()=>{
    if(testStatus=="in_progress"){
        typingInterval.current=setInterval(()=>{
        var t=elapsedTime
        if(elapsedTime==testDuration){
          dispatch(finished())
        }
        setElapsedTime(t+1)
      },1000)
    }else if(testStatus=="finished"){
      calculateTypingSpeed()
    }
    return(()=>{
      clearInterval(typingInterval.current)
    })
  },[testStatus,elapsedTime])

  const handleScroll=()=>{
    if(placeholderRef.current&&textAreaRef.current){
      placeholderRef.current.scrollTop=textAreaRef.current.scrollTop
    }
  }

  return (
    <>
      <progress className='ProgressBar' value={elapsedTime} max={testDuration}></progress>
      <div className='Container'>
        <div>
          <div className='Heading'>Start typing to calculate typing speed</div>
          <div className='TypingContainer'>
            <span
              ref={placeholderRef}
              className='PlaceholderText'
            >
              {placeHolder}
            </span>
            <textarea
              onScroll={handleScroll}
              ref={textAreaRef}
              onKeyDown={keyPressed}
              value={text ? text : ""}
              disabled={testStatus == "finished"}
              onChange={typingKeys}
              className='TextArea'
            ></textarea>
          </div>
          <div className='TypingSpeed'>Gross WPM  {testStatus=="in_progress"?"Calculating...":testStatus=="finished"?typingSpeed?.grossWPM+" WPM":""}</div>
          <div className='TypingSpeed'>Net WPM  {testStatus=="in_progress"?"Calculating...":testStatus=="finished"?typingSpeed?.netWPM+" WPM":""}</div>
          <div className='TypingSpeed'>Accuracy  {testStatus=="in_progress"?"Calculating...":testStatus=="finished"?typingSpeed?.accuracy+" %":""}</div>
          <div onClick={resestTypingTest}><button>RESET</button></div>
        </div>
      </div>
    </>
  )
}

export default TypingArea;