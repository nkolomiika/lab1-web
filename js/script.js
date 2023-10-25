"use strict";
// @ts-ignore
Object.defineProperty(exports, "__esModule", { value: true });
var x, y, r;
class Storage {
    constructor(key, storageType = 'localStorage') {
        this.key = key;
        this.storageType = storageType;
    }
    get() {
        var _a;
        try {
            const value = (_a = window[this.storageType].getItem(this.key)) !== null && _a !== void 0 ? _a : '';
            return JSON.parse(value);
        }
        catch (_b) {
            return null;
        }
    }
    set(value) {
        const strValue = JSON.stringify(value);
        window[this.storageType].setItem(this.key, strValue);
    }
    remove() {
        window[this.storageType].removeItem(this.key);
    }
}
window.onload = function () {
    var _a;
    function setOnClick(element) {
        element.onclick = function () {
            r = Number(element.value);
            buttons.forEach(function (element) {
                element.style.boxShadow = "";
                element.style.transform = "";
            });
            element.style.boxShadow = "0 0 40px 5px var(--blue)";
            element.style.transform = "scale(1.05)";
        };
    }
    let buttons = document.querySelectorAll("input[name=X-radio-group]");
    buttons.forEach(setOnClick);
    document.getElementById('outputContainer').innerHTML = (_a = new Storage("session").get()) !== null && _a !== void 0 ? _a : "";
};
function validate() {
    console.log("до валидации");
    if (validateX() && validateY() && validateR()) {
        console.log(true);
        const coords = "x=" + encodeURIComponent(x)
            + "&y=" + encodeURIComponent(y.toString())
            + "&r=" + encodeURIComponent(r)
            + "&timezone=" + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
        fetch("./php/script.php?" + coords, {
            method: "GET",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
        }).then(response => response.text()).then(function (serverAnswer) {
            localStorage.setItem("session", serverAnswer);
            document.getElementById("outputContainer").innerHTML = serverAnswer;
        }).catch(err => createNotification("Ошибка HTTP " + err.status + ". Повторите попытку позже." + err));
    }
    console.log("после валидации");
}
function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    }
    else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}
function validateX() {
    try {
        x = Number(document.querySelector("input[type=radio]:checked").value);
        console.log(x);
        return true;
    }
    catch (err) {
        console.log(err);
        createNotification("Значение X не выбрано");
        return false;
    }
}
function validateY() {
    console.log(y);
    y = Number(document
        .querySelector("input[name=Y-input]")
        .value
        .replace(",", "."));
    if (y === undefined) {
        createNotification("Y не введён");
        return false;
    }
    else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    }
    else if (!((y > -5) && (y < 3))) {
        createNotification("Y не входит в область допустимых значений");
        return false;
    }
    else
        return true;
}
function validateR() {
    console.log(r);
    r = Number(document.getElementsByName("R-value")[0].value);
    //alert(r)
    if (isNumeric(r))
        return true;
    else {
        createNotification("Значение R не выбрано");
        return false;
    }
}
function setR(r) {
    let setter = document.getElementsByName("R-value")[0].value;
    if (setter === "")
        document.getElementsByName("R-value")[0].value = r;
    //alert(document.getElementsByName("R-value")[0].value)
}
function setY(y) {
    document.getElementById("Y").value = y.toString();
}
function setX(x) {
    document.getElementById("X").value = x;
}
function isNumeric(n) {
    return typeof n === "number" && !isNaN(n);
}
function getValueFromHTMLElement(name) {
    return document.getElementById(name).value;
}
function scroll() {
    document.querySelector('#target')
        .scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: "nearest"
    });
}
//# sourceMappingURL=script.js.map