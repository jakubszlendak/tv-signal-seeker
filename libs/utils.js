const logger = require('tracer').colorConsole({
    format: "[{{timestamp}}] {{title}} ({{file}}:{{line}}): {{message}}",
    dateformat: "dd-mm-yyyy HH:MM:ss.L"
})

module.exports = {
    logger: logger
}