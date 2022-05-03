const fileInput = document.getElementById("file");
const inputContainer = document.getElementById("file-container");

fileInput.onchange = (e) => {
    const files = e.target.files;
    inputContainer.innerHTML = "";
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileContainer = document.createElement("div");
        fileContainer.classList.add("form-component");

        const fileName = document.createElement("h3");
        fileName.innerText = file.name;
        fileContainer.appendChild(fileName);


        const runNameContainer = document.createElement("div");
        runNameContainer.classList.add("label-component");

        const runNameLabel = document.createElement("label");
        runNameLabel.innerText = "Run Name: ";
        runNameLabel.for = `run-name-${file.name}`;
        runNameContainer.appendChild(runNameLabel);

        const runName = document.createElement("input");
        runName.type = "text";
        runName.placeholder = "Run name";
        runName.id = `run-name-${file.name}`;
        runName.value = `Run ${i + 1}`;
        runName.maxLength = "255";

        runNameContainer.appendChild(runName);

        fileContainer.appendChild(runNameContainer);

        const now = new Date();
        now.setMilliseconds(0);
        const dateInputeContainer = document.createElement("div");
        dateInputeContainer.classList.add("label-component");

        const dateLabel = document.createElement("label");
        dateLabel.innerText = "Run Date/Time: ";
        dateInputeContainer.appendChild(dateLabel);

        const runDate = document.createElement("input");
        runDate.type = "date";
        runDate.id = `run-date-${file.name}`;
        runDate.valueAsDate = now;
        dateInputeContainer.appendChild(runDate);

        const runTime = document.createElement("input");
        runTime.type = "time";
        runTime.id = `run-time-${file.name}`;
        runTime.valueAsNumber = now - now.getTimezoneOffset() * 60 * 1000;
        dateInputeContainer.appendChild(runTime);

        fileContainer.appendChild(dateInputeContainer);

        inputContainer.appendChild(fileContainer);
    }
}