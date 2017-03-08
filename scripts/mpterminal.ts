class MPTerminal {
    public user: User;
    private commands: Map<string, string>;
    private history: Array<string>;
    private version: string;

    private mainWindow: HTMLDivElement;
    private messagesWindow: HTMLDivElement;
    private textboxWindow: HTMLDivElement;
    private textInput: HTMLInputElement;

    constructor(selector: string) {
        this.version = "0.0.2";
        this.history = new Array<string>();
        this.user = new User("hackerman", "desktop");
        this.setupCommands();
        this.setupElements(document.querySelector(selector) as HTMLDivElement);
    }

    private handleInput = (event: KeyboardEvent) => {
        var input: HTMLInputElement = event.target as HTMLInputElement;
        switch (event.keyCode) {
            case 13:
                var scrolledToBottom: boolean = this.messagesWindow.scrollTop === (this.messagesWindow.scrollHeight - this.messagesWindow.offsetHeight);
                this.history.push(input.value);
                this.printToConsole(input.value);
                input.value = "";
                if (scrolledToBottom) {
                    this.messagesWindow.scrollTop = this.messagesWindow.scrollHeight;
                }
                break;
            case 38:
                if (this.history.length === 0) return;
                input.value = this.history[this.history.length - 1];
                break;
        }
    }

    private handleCommand(text: string) {
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
            case "bg":
                if (params.length > 0) {
                    if (/^#[0-9A-F]{3,6}$/i.test(params[0])) {
                        this.mainWindow.style.backgroundColor = params[0];
                    }
                }
                break;
            default:
                break;
        }
    }

    printToConsole(text: string) {
        this.messagesWindow.innerHTML += "<div class=\"message\"><span class=\"username\">" + this.user.name + "</span>@<span class=\"domain\">" + this.user.domain + "</span>$: " + text + "</div>";
        this.handleCommand(text);
    }

    printHelp() {
        var helpMessage = "\
             MPTerminal, version "+ this.version + "<br/>\
             Available commands:<br/>";
        for (var cmd in this.commands) {
            helpMessage += cmd + "<pre>" + this.calculateWhitespace(cmd) + "</pre>" + this.commands[cmd] + "<br/>";
        }
        this.messagesWindow.innerHTML += helpMessage;
    }

    private setupCommands() {
        this.commands = new Map<string, string>();
        this.commands["help"] = "display this help page";
        this.commands["go"] = "open a new webpage";
        this.commands["bg"] = "change the background color(hex)";
    }

    private setupElements(target: HTMLDivElement) {
        target.innerHTML = "<div id=\"terminal\"><div id=\"messages\"></div><div id=\"textbox\"><input id=\"terminalTextInput\" type=\"text\" placeholder=\"type 'help' for a list of commands\"/></div></div>";
        this.mainWindow = target.querySelector("#terminal") as HTMLDivElement;
        this.messagesWindow = target.querySelector("#messages") as HTMLDivElement;
        this.textboxWindow = target.querySelector("#textbox") as HTMLDivElement;
        this.textInput = this.textboxWindow.querySelector("#terminalTextInput") as HTMLInputElement;

        this.textInput.onkeyup = this.handleInput;
    }

    private calculateWhitespace(text: string) {
        return " ".repeat(20 - text.length);
    }
}

class User {
    public name: string;
    public domain: string;

    constructor(name: string, domain: string) {
        this.name = name;
        this.domain = domain;
    }
}