var MPTerminal = (function () {
    function MPTerminal(selector) {
        var _this = this;
        this.handleInput = function (event) {
            if (event.keyCode === 13) {
                var input = event.target;
                _this.printToConsole(input.value);
                input.value = "";
            }
        };
        this.user = new User("hackerman", "desktop");
        this.setupCommands();
        this.setupElements(document.querySelector(selector));
    }
    MPTerminal.prototype.handleCommand = function (text) {
        var split = text.split(" ");
        var cmd = split[0];
        var params = split.slice(1);
        switch (cmd) {
            case "help":
                this.printHelp();
                break;
            case "go":
                if (params.length > 0) {
                    if (params[0].indexOf("://") === -1) {
                        params[0] = "http://" + params[0];
                    }
                    window.open(params[0], "_blank");
                }
                break;
            default:
                break;
        }
    };
    MPTerminal.prototype.printToConsole = function (text) {
        this.messagesWindow.innerHTML += "<div class=\"message\"><span class=\"username\">" + this.user.name + "</span>@<span class=\"domain\">" + this.user.domain + "</span>$: " + text + "</div>";
        this.handleCommand(text);
    };
    MPTerminal.prototype.printHelp = function () {
        var helpMessage = "\
             MPTerminal, version 0.0.1<br/>\
             Available commands:<br/>";
        for (var cmd in this.commands) {
            helpMessage += cmd + "<pre>" + this.calculateWhitespace(cmd) + "</pre>" + this.commands[cmd] + "<br/>";
        }
        this.messagesWindow.innerHTML += helpMessage;
    };
    MPTerminal.prototype.setupCommands = function () {
        this.commands = new Map();
        this.commands["help"] = "display this help page";
        this.commands["go"] = "open a new webpage";
    };
    MPTerminal.prototype.setupElements = function (target) {
        target.innerHTML = "<div id=\"terminal\"><div id=\"messages\"></div><div id=\"textbox\"><input id=\"terminalTextInput\" type=\"text\" placeholder=\"type 'help' for a list of commands\"/></div></div>";
        this.mainWindow = target.querySelector("#terminal");
        this.messagesWindow = target.querySelector("#messages");
        this.textboxWindow = target.querySelector("#textbox");
        this.textInput = this.textboxWindow.querySelector("#terminalTextInput");
        this.textInput.onkeyup = this.handleInput;
    };
    MPTerminal.prototype.calculateWhitespace = function (text) {
        return " ".repeat(20 - text.length);
    };
    return MPTerminal;
}());
var User = (function () {
    function User(name, domain) {
        this.name = name;
        this.domain = domain;
    }
    return User;
}());
