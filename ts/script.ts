// @ts-ignore

export type StorageType = 'localStorage' | 'sessionStorage'

var x: number, y: number, r: number

class Storage<T = string> {
    private readonly key: string
    private readonly storageType: StorageType

    constructor(key: string, storageType: StorageType = 'localStorage') {
        this.key = key
        this.storageType = storageType
    }

    get(): T | null {
        try {
            const value = window[this.storageType].getItem(this.key) ?? ''
            return JSON.parse(value)
        } catch {
            return null
        }
    }

    set(value: T): void {
        const strValue = JSON.stringify(value)
        window[this.storageType].setItem(this.key, strValue)
    }

    remove(): void {
        window[this.storageType].removeItem(this.key)
    }
}

window.onload = function () {
    function setOnClick(element: HTMLInputElement) {
        element.onclick = function () {
            r = Number(element.value);
            buttons.forEach(function (element: HTMLInputElement) {
                element.style.boxShadow = "";
                element.style.transform = "";
            });
            element.style.boxShadow = "0 0 40px 5px var(--blue)";
            element.style.transform = "scale(1.05)";
        }
    }

    let buttons: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[name=X-radio-group]");
    buttons.forEach(setOnClick);

    document.getElementById('outputContainer')!.innerHTML = new Storage("session").get() ?? "";
};

function validate() {
    console.log("до валидации")
    if (validateX() && validateY() && validateR()) {
        console.log(true)
        const coords: string = "x=" + encodeURIComponent(x)
            + "&y=" + encodeURIComponent(y.toString())
            + "&r=" + encodeURIComponent(r)
            + "&timezone=" + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

        fetch("./php/script.php?" + coords, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        }).then(response => response.text()).then(function (serverAnswer: string) {
            localStorage.setItem("session", serverAnswer);
            document.getElementById("outputContainer")!.innerHTML = serverAnswer;
        }).catch(err => createNotification("Ошибка HTTP " + err.status + ". Повторите попытку позже." + err));
    }
    console.log("после валидации")
}

function createNotification(message: string) {
    let outputContainer: HTMLElement = document.getElementById("outputContainer")!;
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub: HTMLElement = document.querySelector(".notification")!;
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow: HTMLElement = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span: HTMLElement = document.querySelector(".notification")!;
        span.textContent = message;
    }
}

function validateX(): boolean {
    try {
        x = Number((<HTMLInputElement>document.querySelector("input[type=radio]:checked")).value);
        console.log(x)
        return true;
    } catch (err) {
        console.log(err)
        createNotification("Значение X не выбрано");
        return false;
    }
}

function validateY(): boolean {

    console.log(y)

    y = Number((<HTMLInputElement>document
        .querySelector("input[name=Y-input]"))
        .value
        .replace(",", "."));

    if (y === undefined) {
        createNotification("Y не введён");
        return false;
    } else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    } else if (!((y > -5) && (y < 3))) {
        createNotification("Y не входит в область допустимых значений");
        return false;
    } else return true;
}

function validateR(): boolean {
    console.log(r)
    r = Number((<HTMLInputElement>document.getElementsByName("R-value")[0]).value);
    //alert(r)
    if (isNumeric(r)) return true;
    else {
        createNotification("Значение R не выбрано");
        return false;
    }
}

function setR(r: string) {
    let setter: string = (<HTMLInputElement>document.getElementsByName("R-value")[0]).value;
    if (setter === "")
        (<HTMLInputElement>document.getElementsByName("R-value")[0]).value = r;
    //alert(document.getElementsByName("R-value")[0].value)
}

function setY(y: number) {
    (<HTMLInputElement>document.getElementById("Y")).value = y.toString();
}

function setX(x: string) {
    (<HTMLInputElement>document.getElementById("X")).value = x;
}

function isNumeric(n: any): boolean {
    return typeof n === "number" && !isNaN(n);
}

function getValueFromHTMLElement(name: string): Object {
    return (<HTMLInputElement>document.getElementById(name)).value;
}

function scroll() {
    document.querySelector('#target')!
        .scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: "nearest"
        });
}