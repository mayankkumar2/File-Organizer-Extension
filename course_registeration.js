document.getElementById("btn2").addEventListener("click", () => {
    let all = document.getElementById("timetablecopy_text_voto").value;
    let arrayOfElements = getAllClassNumbersFromString(all);
    let HTMLCode = `<h2>Your classes:</h2><ul>`;

    for (x of arrayOfElements) {
        HTMLCode += `<li>` + x + `</li>`;
    }
    HTMLCode += `</ul>`
    listOfCourses = arrayOfElements;
    document.getElementById("list_of_classes").innerHTML = HTMLCode;
    document.getElementById("procced").removeAttribute("hidden");
    document.getElementById("procced").addEventListener("click", () => {
        chrome.storage.sync.set({ 'course_list': JSON.stringify(arrayOfElements) }, function() {
            alert("Added the following courses: " + arrayOfElements.toString());
        });
    })
})

function getAllClassNumbersFromString(data) {
    let mypattr = /[A-Z]{2}[0-9]{13}/g;
    let vars = []
    let m
    do {
        m = mypattr.exec(data);
        if (m)
            if (m.length != 0)
                vars.push(m[0])
    } while (m);
    return vars;
}