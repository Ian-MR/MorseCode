// --------- constantes e elementos html ---------
//html
const titulo = document.querySelector("#titulo")                    // mostrar o código digitado
const inputKeyCode = document.querySelector("#keyCode")             // escolher a tecla
const btnClear = document.querySelector("#btnClear")                // botão para limpar a tela
const btnSequencia = document.querySelector("#btnSequencia")        // botão para iniciar Sequencia
const btnEscrita = document.querySelector("#btnEscrita")            // botão para iniciar Escrita
const inputTimeMorse = document.querySelector("#timeMorse")         // escolher o tempo pressionado
const inputTimeSpace = document.querySelector("#timeSpace")         // escolher tempo de espaço
const checkBoxAudio = document.querySelector("#audio")              // botão ativar/desativar som 
const divLetterCard = document.querySelector("#letterCard")         // cartão com a letra e morse
const divLetterChar = document.querySelector("#letterChar")         // letra
const divLetterMorse = document.querySelector("#letterMorse")       // códgigo morse
const imgConfigIcon = document.querySelector("#config")             // icone de configuração
const menuConfigVariables = document.querySelectorAll(".isClosed")  // meno de configuração
//som
const audio = new Audio("audio/som.wav")                            // arquivo de audio
//constantes de controle
const timeMorse = 10
const timeSpace = 10
const defaultControlSpace = 20
const defaultControlMorse = 10
const defaultKeyCode = "Space"
const defaultIsAudioActive = 1
//funções
const resetCard = () => {
    divLetterChar.innerHTML = ""
    divLetterMorse.innerHTML = ""
}
const getRandomLetter = () => {
    let randomNumber = Math.floor(Math.random()*alphabetLettersArray.length)
    currentLetter.letter = alphabetLettersArray[randomNumber]
    currentLetter.morse = alphabet[currentLetter.letter]
    divLetterChar.innerHTML = currentLetter.letter
    divLetterMorse.innerHTML = currentLetter.morse
}
const isControlSpaceOn = () => {
    if(!controlSpace){
        controlSpace = defaultControlMorse
        inputTimeSpace.value = controlSpace*timeSpace
    }
}
// --------- Dicionario Morse ---------
const alphabet = {
    "A": "._",
    "B": "_...",
    "C": "_._.",
    "D": "_..",
    "E": ".",
    "F": ".._.",
    "G": "__.",
    "H": "....",
    "I": "..",
    "J": ".___",
    "K": "_._",
    "L": "._..",
    "M": "__",
    "N": "_.",
    "O": "___",
    "P": ".__.",
    "Q": "__._",
    "R": "._.",
    "S": "...",
    "T": "_",
    "U": ".._",
    "V": "..._",
    "W": ".__",
    "X": "_.._",
    "Y": "_.__",
    "Z": "__..",
} 
const alphabetLettersArray = Object.keys(alphabet)
const alphabetMorseArray = Object.values(alphabet)

// --------- variaveis de controle do programa --------- 
let controlTime = 0
let timer
let currentLetter= {letter: "", morse: ""}
let isPlayingModeActive = false
let isWriteModeActive = false
// --------- variaveis expostas ---------
let keyCode, controlSpace ,controlMorse, isAudioActive

// --------- carregar variaveis ---------
window.addEventListener("load",()=>{
    keyCode = localStorage.getItem("keyCode") ? localStorage.getItem("keyCode") : defaultKeyCode
    controlSpace = localStorage.getItem("controlSpace") ? localStorage.getItem("controlSpace")*1 : defaultControlSpace
    controlMorse = localStorage.getItem("controlMorse") ? localStorage.getItem("controlMorse")*1 : defaultControlMorse
    isAudioActive = localStorage.getItem("isAudioActive") != null ? localStorage.getItem("isAudioActive")*1 : defaultIsAudioActive
    inputKeyCode.value = keyCode
    inputTimeMorse.value = controlMorse*timeMorse
    inputTimeSpace.value = controlSpace*timeSpace
    checkBoxAudio.checked = isAudioActive
})

// --------- Menu de Configurações ---------
imgConfigIcon.addEventListener("click", () => {
    menuConfigVariables.forEach( field => {field.classList.toggle("isClosed")})
})
// --------- ler mudanças nas variaveis ---------
//armazenar a tecla de ação
inputKeyCode.addEventListener("focusout", e => {
    console.log(e.target.value)
    keyCode = e.target.value
    localStorage.setItem('keyCode', e.target.value);
})

//escrever a tecla apertada
inputKeyCode.addEventListener("keyup", e => {
    inputKeyCode.value = e.code
})

//alterar quanto tempo a tecla sera pressionada
inputTimeMorse.addEventListener("change", e => {
    controlMorse = e.target.value/timeMorse
    localStorage.setItem('controlMorse', controlMorse);
})

//tempo sem fazer nada para dar espaço
inputTimeSpace.addEventListener("change", e => {
    controlSpace = e.target.value/timeSpace
    localStorage.setItem('controlSpace', controlSpace);
    if(isPlayingModeActive){
        isControlSpaceOn()
    }
})

//ativar/desativar o audio
checkBoxAudio.addEventListener("click", e => {
    isAudioActive = e.target.checked
    localStorage.setItem('isAudioActive', isAudioActive? 1:0);
})

//limpar a tela
btnClear.addEventListener("click", () => {
    titulo.innerHTML = ""
})

// --------- funçoes do morse ---------
window.addEventListener("keydown", e => {
    if(e.code === keyCode && !e.repeat){
        if(controlSpace && !isPlayingModeActive && !isWriteModeActive){
            clearInterval(timer)
            titulo.innerHTML += controlTime >= controlSpace ? " ":""
        }else{
            clearTimeout(timer)
        }
        if(isAudioActive) audio.play()
        controlTime = 0
        timer = setInterval(() => {controlTime++}, timeMorse)
    }
})

window.addEventListener("keyup", e =>{
    if(e.code === keyCode){
        clearInterval(timer)
        if(isAudioActive) audio.pause()
        titulo.innerHTML += controlTime >= controlMorse ? "_":"."
        controlTime = 0
        if(controlSpace && !isPlayingModeActive && !isWriteModeActive){
            timer = setInterval(() => {controlTime++}, timeSpace)
        }else if(isPlayingModeActive){
            timer = setTimeout(() => {
                if(titulo.innerHTML === currentLetter.morse){
                    getRandomLetter()
                }
                titulo.innerHTML = ""
            },controlSpace*timeSpace)
        }else if(isWriteModeActive){
            timer = setTimeout(() => {
                let morseIndex = alphabetMorseArray.indexOf(titulo.innerHTML)
                if(morseIndex !== -1){
                    currentLetter.letter = alphabetLettersArray[morseIndex]
                    currentLetter.morse = alphabet[currentLetter.letter]
                    divLetterChar.innerHTML = currentLetter.letter
                    divLetterMorse.innerHTML = currentLetter.morse
                }
                titulo.innerHTML = ""
            },controlSpace*timeSpace)
        } 
    }
})

// --------- Treinar Morse ---------
//escolher uma letra aleatória
divLetterCard.addEventListener("click", () => {
    if (!isPlayingModeActive) getRandomLetter()
})
//modo sequencia
btnSequencia.addEventListener("click", () => {
    isPlayingModeActive = !isPlayingModeActive
    isWriteModeActive = false
    resetCard()
    if(isPlayingModeActive){
        isControlSpaceOn()
        getRandomLetter()
    }
})
// modo escrita
btnEscrita.addEventListener("click", () => {
    isWriteModeActive = !isWriteModeActive
    isPlayingModeActive = false
    resetCard()
    if(isWriteModeActive){
        isControlSpaceOn()
    }
})

