
document.getElementById("chatSendMessage").addEventListener("click", () => {
    const text = document.getElementById("inputTextSpace").innerHTML;
    const mode = document.getElementById("chatModeSelect").value;

    callChatApi(text,mode);
    
})

function callChatApi(msg,mode){
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '92e8b6d801msh3c45a4cadfc2a5fp129240jsn9ba603872649',
            'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
        }
    };

    document.getElementById("botLoading").style.visibility = "visible";
    document.getElementById("outputTextSpace").innerHTML = "";
    
    if(mode == "text"){
        options.body = '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"'+msg+'"}]}';
        fetch('https://openai80.p.rapidapi.com/chat/completions', options)
            .then(response => response.json())
            .then(response => showBotMessage(response))
            .catch(alert("The API Provider seems to be not available"));
    }
    
    if(mode == "image"){
        options.body = '{"prompt":"'+msg+'","size":"1024x1024"}';
        fetch('https://openai80.p.rapidapi.com/images/generations', options)
            .then(response => response.json())
            .then(response => showBotImage(response))
            .catch(alert("The API Provider seems to be not available"));
    }
}

function showBotMessage(response){
    const textArea = document.getElementById("outputTextSpace");

    document.getElementById("chatOutput").style.borderColor = "rgb(74, 135, 72)";
    document.getElementById("chatAvatarB").style.borderColor = "rgb(74, 135, 72)";

    document.getElementById("botLoading").style.visibility = "hidden";
    document.getElementById("botSpeaking").style.visibility = "visible";


    let msg = response.choices[0].message.content
    let i = 0;
    let myInterval = setInterval(typeWriter, 35);

    function typeWriter() {
        if(i == msg.length){
            clearInterval(myInterval);
            document.getElementById("chatOutput").style.borderColor = "black";
            document.getElementById("chatAvatarB").style.borderColor = "black";
            setTimeout(() => {document.getElementById("botSpeaking").style.visibility = "hidden" }, 1000)
            return;
        }
        textArea.innerHTML += msg.charAt(i);
        i++;
        textArea.scrollTop = textArea.scrollHeight;
    }
}

function showBotImage(response){
    const textArea = document.getElementById("outputTextSpace");
    let image = `<img src="${response.data[0].url}" width="280px" height="280px">`
    textArea.innerHTML += image;
    document.getElementById("botLoading").style.visibility = "hidden";
}