function addMessage(author, message, dt) {
    chatbox.append('<p style="-webkit-margin-before: 0em; -webkit-margin-after:0em">' + author + '</span> [' +
         + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
         + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
         + ']: ' + message + '</p>');
    $(chatbox.prop({scrollTop: content.prop("scrollHeight") }));
}