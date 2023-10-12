function on(){
    let inputs = document.getElementsByClassName('input'); 
    let btn = document.querySelector('input[type="submit"]');
    let isValid = true;

    for (var i = 0; i < inputs.length; i++) {
        let changedInput = inputs[i];
        if (changedInput.value.trim() === "" || changedInput.value === null) {
            isValid = false;
            break;
        }
    }

    btn.disabled = !isValid;
}

function selectionPage() {
    window.location.href = "selection.html";
}