class UIcreation {
    static numInput(output, value = 0, required = false) {
        let inputter = document.createElement("input");
        inputter.type = "number";
        inputter.value = value;
        inputter.required = required
        output.appendChild(inputter);

        return inputter;
    }

    static strInput(output, value = "", required = false) {
        let inputter = document.createElement("input");
        inputter.value = value;
        inputter.required = required
        output.appendChild(inputter);

        return inputter;
    }

    static text(text, output) {
        let texter = document.createElement("p");
        texter.textContent = text;
        output.appendChild(texter);

        return texter;
    }

    static button(text, output) {
        let button = document.createElement("button");
        button.textContent = text;
        output.appendChild(button);

        return button;
    }
}



class UI {
    static create = UIcreation;
}