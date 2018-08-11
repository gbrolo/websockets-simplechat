var socket = io.connect('http://localhost:8080', { 'forceNew': true });

socket.on('refresh', function(data) {
    render(data);
});

function render(data) {
    // render data
    var chat = document.getElementById("chat-area");
            
    while (chat.firstChild) {
        chat.removeChild(chat.firstChild);
    }

    for (var i = 0; i < data.length; i++) {
        var div = document.createElement("div");
        div.style.width = "50%";
        div.style.height = "auto";
        div.style.background = "#043644";
        div.style.color = "#fff";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.marginBottom = "10px";
        div.style.fontFamily = "Arial";
        div.style.fontSize = "15px";

        var node = document.createTextNode(data[i].nick + ": " + data[i].text);

        div.appendChild(node);

        // check if text has urls
        var urls = getUrls(data[i].text);

        if (urls.length > 0) {
            for (var j = 0; j < urls.length; j++) {
                var url = urls[j];
                var frame = document.createElement("iframe");
                frame.setAttribute("id", url);
                frame.setAttribute("src", url);
                frame.style.marginTop = "10px";
                frame.style.borderRadius = "5px";

                div.appendChild(frame);
            }
        }

        chat.appendChild(div);
    }
}

// checks if there are any urls inside text. Returns an array of found urls.
function getUrls(text) {
    var regex = /(https?:\/\/[^\s]+)/g;
    var rawtext = (text || '').toString();
    var urls = [];
    var url;
    var matches = [];

    while ((matches = regex.exec(rawtext)) !== null) {
        var matchUrl = matches[0];
        urls.push(matchUrl);
    }

    return urls;
}

function addMessage() {
    var student_id = document.getElementById("id-box").value;
    var text = document.getElementById("text-box").value;
    var nick = document.getElementById("nick-box").value;

    // verify fields

    if (student_id === "" || nick === "" || text === "") {
        // empty fields
        alert("One or more fields are emtpy. Please fill all fields.");
    } else {
        // non empty fields
        // check for text < 140 chars
        if (text.length <= 140) {
            // continue
            console.log('preparing to send message');
            
            // POST request
            var fd = new FormData();

            fd.append("student_id", student_id);
            fd.append("text", text);
            fd.append("nick", nick);

            var request = new XMLHttpRequest();
            request.open("POST", "http://34.210.35.174:7000");
            request.send(fd);

            socket.emit('new');
        } else {
            // more than 140 chars
            alert("Text field with more than 140 characters.")
        }
    }    
}