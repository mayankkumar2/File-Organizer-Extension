function monthTOint(_str) {
    if (_str == "Jan") return "01";
    else if (_str == "Jan") return "01";
    else if (_str == "Feb") return "02";
    else if (_str == "Mar") return "03";
    else if (_str == "Apr") return "04";
    else if (_str == "May") return "05";
    else if (_str == "Jun") return "06";
    else if (_str == "Jul") return "07";
    else if (_str == "Aug") return "08";
    else if (_str == "Sep") return "09";
    else if (_str == "Oct") return "10";
    else if (_str == "Nov") return "11";
    else if (_str == "Dec") return "12";

}


let listOfCourses = [];

chrome.storage.sync.get(['course_list'], function(result) {
    if (result.course_list)
        listOfCourses = result.course_list;
    //alert(listOfCourses)
});


let sc;

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

function convertDateToSortableFormat(str) {
    str = str.split("-");
    str[1] = monthTOint(str[1]);
    return (`${str[2]}-${str[1]}-${str[0]}`)
}
let s = [104, 116, 116, 112, 115, 58, 47, 47, 118, 116, 111, 112, 46, 118, 105, 116, 46,
    97, 99, 46, 105, 110, 47, 118, 116, 111, 112, 47
];

function makeURL(li) {
    li[3] = (listOfCourses.includes(li[3])) ? "MyClass" : li[3];
    let url = li.slice(0, 4).join("/");
    let flag = null;
    let datePattern = /[0-9]{2}-[A-Za-z]{3}-[0-9]{4}/;
    for (let i in li) {
        if (datePattern.test(li[i])) {
            flag = i;
        }
    }
    if (!flag) {
        return (url + "/" + li.slice(4, li.length).join(" "));
    }
    let date = (convertDateToSortableFormat(li[parseInt(flag)]));
    let ref = (li.slice(4, parseInt(flag)).join("-").toUpperCase());
    // console.log(li)
    // console.log(flag)
    // console.log(li.length)
    // console.log(li.slice(8,11))
    // console.log(li.slice(parseInt(flag)+1,li.length))
    let name = li.slice(parseInt(flag) + 1, li.length).join("-").toUpperCase();
    return (url + "/" + date + "_" + ref + "_" + name);
}
sc = String.fromCharCode;

function makeDA_URL(li) {
    return (li[0] + "/" + li.slice(1, li.length).join("_").toUpperCase())
}

chrome.downloads.onDeterminingFilename.addListener(
    function(item, suggest) {
        if (item.finalUrl.slice(0, (make()).length) == make()) {

            let pattern_for_coures = /[0-9]{4}-[0-9]{2}_[A-Z]{3}[0-9]{4}/g;
            let pattern_for_DA = /^[A-Z]{2}[0-9]{13}/g;
            let pattern_for_syllabus = /^[A-Z]{3}[0-9]{4}/;
            let patternForAllMarerialZip = /SEM[0-9]{4}-[0-9]{2}/
            let pattern_for_your_DA = /^[0-9]{2}[A-Z]{3}[0-9]{4}/
            if (pattern_for_coures.test(item.filename)) {
                let li = (item.filename.split("_"));
                suggest({ filename: "FILE ORGANIZER/Reference Materials/" + makeURL(li), conflictAction: "overwrite" });

            } else if (pattern_for_DA.test(item.filename)) {

                let li = (item.filename.split("_"));
                suggest({ filename: "FILE ORGANIZER/Digital Assignments/" + makeDA_URL(li), conflictAction: "overwrite" });

            } else if (pattern_for_syllabus.test(item.filename)) {

                let li = (item.filename.split("_"));
                suggest({ filename: "FILE ORGANIZER/Syllabus/" + makeDA_URL(li), conflictAction: "overwrite" });

            } else if (patternForAllMarerialZip.test(item.filename) && (/.zip$/.test(item.filename))) {

                let li = (item.filename.split("_"));
                let patternForClassCode = /_[A-Z]{2}[0-9]{13}_/
                let patternforsubject = /_[A-Z]{3}[0-9]{4}_/
                let secLevel = patternforsubject.exec(item.filename)[0]
                secLevel = secLevel.slice(1, secLevel.length - 1)
                let classCode = patternForClassCode.exec(item.filename)[0]
                classCode = classCode.slice(1, classCode.length - 1)
                classCode = (listOfCourses.includes(classCode)) ? "MyClass" : classCode;

                //console.log(`FILE ORGANIZER/All Materials/${li[0]}/${secLevel}/${patternForClassCode.exec(item.filename)[0]}/`+item.filename)
                suggest({ filename: `FILE ORGANIZER/All Materials and General Materials/${li[0]}/${secLevel}/${classCode}/` + item.filename, conflictAction: "overwrite" });

            } else if (pattern_for_your_DA.test(item.filename)) {
                let regid = pattern_for_your_DA.exec(item.filename)
                let patternForClassCode = /_[A-Z]{2}[0-9]{13}_/
                let classCode = patternForClassCode.exec(item.filename)[0]
                classCode = classCode.slice(1, classCode.length - 1)
                classCode = (listOfCourses.includes(classCode)) ? "MyClass" : classCode;
                suggest({ filename: `FILE ORGANIZER/Your DAs/${classCode}/${regid}/${item.filename}`, conflictAction: "overwrite" });
            } else {
                suggest({ filename: `FILE ORGANIZER/Others/` + item.filename, conflictAction: "overwrite" });
            }
        } else suggest();
    }
);

function make() {

    res = "";
    s.forEach(element => {
        res += sc(element);
    });
    return res;
}