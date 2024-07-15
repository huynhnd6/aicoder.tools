class Notification {
    static send(message) {
        const notifyDiv = document.getElementById('page-notification')
        notifyDiv.innerHTML = message
        notifyDiv.classList.add('show')
        setTimeout(() => {
            notifyDiv.classList.remove('show')
        }, 3000)
    }
}

module.exports = Notification