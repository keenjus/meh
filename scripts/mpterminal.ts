class MPTerminal {
    public user: User;
    private mainWindow: HTMLDivElement;
    private messagesWindow: HTMLDivElement;
    private textboxWindow: HTMLDivElement;
    private textInput: HTMLInputElement;
    private commands: Map<string, string>;

    constructor(selector: string) {
        this.user = new User("hackerman", "desktop");
        this.setupCommands();
        this.setupElements(document.querySelector(selector) as HTMLDivElement);
    }

    private handleInput = (event: KeyboardEvent) => {
        if(event.keyCode === 13) {
            var input: HTMLInputElement = event.target as HTMLInputElement;
            this.printToConsole(input.value);
            input.value = "";
        }
    }

    private handleCommand(text: string) {
        var split = text.split(" ");
        var cmd = split[0];
        var params = split.slice(1);
        switch(cmd) {
            case "help":
                this.printHelp();
                break;
            case "go":
                if(params.length > 0) {
                    if(params[0].indexOf("://") === -1){
                        params[0] = "http://" + params[0];
                    }
                    window.open(params[0], "_blank");
                }
                break;
            default:
                break;
        }
    }

    printToConsole(text: string) {
        this.messagesWindow.innerHTML += "<div class=\"message\"><span class=\"username\">"+this.user.name+"</span>@<span class=\"domain\">"+this.user.domain+"</span>$: " + text + "</div>";
        this.handleCommand(text);
    }

    printHelp() {
        var helpMessage = "\
             MPTerminal, version 0.0.1<br/>\
             Available commands:<br/>";
        for(var cmd in this.commands) {
            helpMessage += cmd + "&nbsp;&nbsp;&nbsp;&nbsp;" + this.commands[cmd] + "<br/>";
        }
        this.messagesWindow.innerHTML += helpMessage;
    }

    private setupCommands() {
        this.commands = new Map<string, string>();
        this.commands["help"] = "display this help page";
        this.commands["go"] = "open a new webpage";
    }

    private setupElements(target: HTMLDivElement) {
        target.innerHTML = "<div id=\"terminal\"><div id=\"messages\"></div><div id=\"textbox\"><input id=\"terminalTextInput\" type=\"text\" placeholder=\"type 'help' for a list of commands\"/></div></div>";
        this.mainWindow = target.querySelector("#terminal") as HTMLDivElement;
        this.messagesWindow = target.querySelector("#messages") as HTMLDivElement;
        this.textboxWindow = target.querySelector("#textbox") as HTMLDivElement;
        this.textInput = this.textboxWindow.querySelector("#terminalTextInput") as HTMLInputElement;

        this.textInput.onkeyup = this.handleInput;
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