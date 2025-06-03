import { useEffect, useState,useRef } from 'react'

const TypingArea=()=>{
  const [typing , setTyping] = useState(false)
  const [startedTyping , setStartedTyping] = useState(false)
  const [text, setText]=useState(null)
  const [typingSpeed, setTypingSpeed]=useState(null)
  const typingTest="Typing is the process of writing or inputting text by pressing keys on a typewriter, computer keyboard, mobile phone, or calculator. It can be distinguished from other means of text input, such as handwriting and speech recognition. Text can be in the form of letters, numbers and other symbols. The world's first typist was Lillian Sholes from Wisconsin in the United States,[1][2] the daughter of Christopher Latham Sholes, who invented the first practical typewriter.[1]"
  const testDuration=60// 1 min test for ease
  const [placeHolder, setPlaceHolder]=useState(typingTest.repeat(10))
  const [elapsedTime, setElapsedTime]=useState(0)
  const typingInterval=useRef(null)
  const textAreaRef=useRef(null)
  const placeholderRef=useRef(null)

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
    setTyping(false)
    setStartedTyping(false)
    setText("")
    setTypingSpeed(null)
    setPlaceHolder(typingTest.repeat(10))
    setElapsedTime(0)
  }

  const keyPressed=()=>{
    if(!startedTyping){
      setStartedTyping(true)
    }
  }

  useEffect(()=>{
    if(startedTyping&&startedTyping==true){
        typingInterval.current=setInterval(()=>{
        var t=elapsedTime
        if(elapsedTime==testDuration){
          setTyping(true)
        }
        setElapsedTime(t+1)
      },1000)
    }
    return(()=>{
      clearInterval(typingInterval.current)
    })
  },[startedTyping,elapsedTime,typing])

  useEffect(()=>{
    setStartedTyping(false)
    calculateTypingSpeed()
  },[typing])

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
        <div className='TypingContainer' >
          <textarea onScroll={handleScroll} ref={textAreaRef} onKeyDown={keyPressed} value={text?text:""} disabled={typing} onChange={typingKeys}  className='TextArea'></textarea>
          <span ref={placeholderRef} className='PlaceholderText'>{placeHolder}</span>
        </div>
        <div className='TypingSpeed'>Gross WPM  {startedTyping?"Calculating...":typingSpeed?.grossWPM?typingSpeed?.grossWPM+" WPM":""}</div>
        <div className='TypingSpeed'>Net WPM  {startedTyping?"Calculating...":typingSpeed?.netWPM?typingSpeed?.netWPM+" WPM":""}</div>
        <div className='TypingSpeed'>Accuracy  {startedTyping?"Calculating...":typingSpeed?.accuracy?typingSpeed?.accuracy+" %":""}</div>
        <div onClick={resestTypingTest}><button>RESET</button></div>
      </div>
   </div>
 </>
  )
}

export default TypingArea;