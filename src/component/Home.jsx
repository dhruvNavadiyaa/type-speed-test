import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import reloadImage from '../assets/replay-svgrepo-com.png'

export default function Home() {

    let paragraph = ['it', 'was', 'a', 'sunny', 'day', 'in', 'the', 'park', 'with', 'children', 'playing', 'and', 'birds', 'chirping', 'the', 'air', 'was', 'filled', 'with', 'laughter', 'and', 'the', 'scent', 'of', 'fresh', 'flowers', 'wafted', 'through', 'the', 'breeze', 'families', 'gathered', 'for', 'picnics', 'and', 'friends', 'met', 'for', 'leisurely', 'stroll', 'it', 'was', 'the', 'perfect', 'day', 'to', 'relax', 'and', 'enjoy', 'the', 'beauty', 'of', 'nature', 'so', 'we', 'take', 'the', 'rest', 'that', 'beautiful', 'day.']

    const [text, setText] = useState('')
    const [time, setTime] = useState(60)
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [wordStatus, setWordStatus] = useState([])
    const [correctWords, setCorrectWords] = useState(0)
    const [wrongWords, setWrongWords] = useState(0)
    const intervalIdRef = useRef(null);
    const inputRef = useRef(null)

    const timeFunc = () => {
        intervalIdRef.current = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalIdRef.current);
                    inputRef.current.disabled = true;
                    return 0;
                }
                return prev - 1
            })
        }, 1000);
    }

    const handleChange = (e) => {
        const value = e.target.value.trim();
        setText(value)

        // Start the timer if the text is being entered for the first time
        if (value.length === 1 && currentWordIndex === 0) {
            console.log('Timer started');
            timeFunc();
        }
    }

    const handleKeySpace = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (currentWordIndex >= paragraph.length) {
                inputRef.current.disabled = true
            } else {
                if (text === '') return
                const newWordStatus = wordStatus

                if (text.trim() === paragraph[currentWordIndex]) {
                    console.log('space hit, and word is correct!')
                    newWordStatus[currentWordIndex] = 'correct'
                    setCorrectWords(prev => prev + 1)
                } else {
                    console.log('space hit, and word is Incorrect!')
                    newWordStatus[currentWordIndex] = 'incorrect'
                    setWrongWords(prev => prev + 1)
                }
                setText('')
                setCurrentWordIndex(prev => prev + 1)
                setWordStatus(newWordStatus)
            }
        }
    }

    const handleReset = () => {
        setText('')
        setTime(60)
        setCurrentWordIndex(0)
        setWordStatus([])
        setCorrectWords(0)
        setWrongWords(0)
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
        if (inputRef.current) {
            inputRef.current.disabled = false
            inputRef.current.focus()
        }
    }

    // console.log(correctWords, wrongWords)
    useEffect(() => {
        return () => {
            clearInterval(intervalIdRef.current)
        }
    }, [])

    return (
        <>
            <div style={{ backgroundColor: 'rgb(17, 17, 17)' }} className='select-none h-screen'>
                <Navbar />
                <div className="container mx-auto px-64 h-max flex items-center mt-40" >

                    <div className='justify-center'>

                        <div className='p-5 text-3xl font-bold text-justify bg-zinc-900 text-zinc-400  rounded'>
                            <p className='w-full'>
                                {
                                    paragraph.map((item, index) => {
                                        return <span
                                            key={index}
                                            id={index}
                                            className={`me-2 ${wordStatus[index] === 'correct' && 'text-green-500'} ${wordStatus[index] === 'incorrect' && 'text-red-500'} ${currentWordIndex === index && 'text-white'}`}
                                        >
                                            {item}{' '}
                                        </span>

                                    })
                                }
                            </p>
                        </div>

                        <div className='flex mt-12 h-14  text-white'>

                            <input
                                type="text"
                                className='w-full text-xl p-2  bg-zinc-800 rounded focus:outline-none'
                                value={text}
                                onKeyDown={handleKeySpace}
                                onChange={handleChange}
                                ref={inputRef}
                                disabled={false}
                            />
                            <button className='text-xl ms-3 w-40 px-4   bg-zinc-900 rounded'>{time <= 0 && `${correctWords / 1}`} wpm</button>
                            <button className='text-xl ms-3 px-8   bg-zinc-900 rounded'>{time || '0'}</button>
                            <div className='flex justify-center items-center bg-zinc-900 ms-3'>
                                <img
                                    src={reloadImage}
                                    alt=""
                                    className='px-3  rounded w-20 h-10'
                                    onClick={handleReset}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
