// --------- constantes e elementos html ---------
//html
const titulo = document.querySelector("#titulo")
const inputKeyCode = document.querySelector("#keyCode")
const btnClear = document.querySelector("#btnClear")
const inputTimeMorse = document.querySelector("#timeMorse")
const inputTimeSpace = document.querySelector("#timeSpace")
const checkBoxAudio = document.querySelector("#audio")
//som
const audio = new Audio("som.wav")
//constantes de controle
const timeMorse = 10
const timeSpace = 10
const defaultControlSpace = 20
const defaultControlMorse = 10
const defaultKeyCode = "Space"
const defaultIsAudioActive = 1
// --------- variaveis de controle do programa --------- 
let controlTime = 0
let timer
let controlKey = false 
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
})

//ativar e desativar o audio
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
        if(controlSpace){
            clearInterval(timer)
            titulo.innerHTML += controlTime >= controlSpace ? " ":""
        }
        
        if(isAudioActive) audio.play()
        controlTime = 0
        timer = setInterval(() => {controlTime++}, timeMorse)
        controlKey = true
    }
})
window.addEventListener("keyup", e =>{
    if(e.code === keyCode){
        clearInterval(timer)
        if(isAudioActive) audio.pause()
        controlKey = false
        titulo.innerHTML += controlTime >= controlMorse ? "_":"."
        controlTime = 0
        if(controlSpace){
            timer = setInterval(() => {controlTime++}, timeSpace)
        } 
    }
})

