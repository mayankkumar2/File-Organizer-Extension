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

function convertDateToSortableFormat(str) {
    str = str.split("-");
    str[1] = monthTOint(str[1]);
    return (`${str[2]}-${str[1]}-${str[0]}`)
}

function makeURL(li) {
var url = li.slice(0,4).join("/");
var flag  = null;
var datePattern = /[0-9]{2}-[A-Za-z]{3}-[0-9]{4}/;
for (var i in li) { 
    if (datePattern.test(li[i])) {
        flag = i;
    }
}
if (!flag) {
    return(url+"/"+li.slice(4,li.length).join(" "));
}
var date = (convertDateToSortableFormat(li[parseInt(flag)]));
var ref = (li.slice(4,parseInt(flag)).join("-").toUpperCase());
// console.log(li)
// console.log(flag)
// console.log(li.length)
// console.log(li.slice(8,11))
// console.log(li.slice(parseInt(flag)+1,li.length))
var name = li.slice(parseInt(flag)+1,li.length).join("-").toUpperCase();
return(url+"/"+date+"_"+ref+"_"+name);
}

function makeDA_URL(li) {
    return(li[0]+"/"+li.slice(1,li.length).join("_").toUpperCase())
}

chrome.downloads.onDeterminingFilename.addListener( 
  function (item, suggest) {
    if(item.finalUrl.slice(0,("https://vtop.vit.ac.in/vtop/").length)=="https://vtop.vit.ac.in/vtop/"){
        
        var pattern_for_coures = /[0-9]{4}-[0-9]{2}_[A-Z]{3}[0-9]{4}/g;
        var pattern_for_DA = /^[A-Z]{2}[0-9]{13}/g;
        var pattern_for_syllabus = /^[A-Z]{3}[0-9]{4}/;
        var patternForAllMarerialZip = /SEM[0-9]{4}-[0-9]{2}/
        var pattern_for_your_DA = /^[0-9]{2}[A-Z]{3}[0-9]{4}/
        if(pattern_for_coures.test(item.filename)){
            var li = (item.filename.split("_"));
        suggest({filename: "VIT-RM-MANAGER/Reference Materials/"+makeURL(li),conflictAction:"overwrite"});
        
        } else if (pattern_for_DA.test(item.filename)){
        
            var li = (item.filename.split("_"));
        suggest({filename: "VIT-RM-MANAGER/Digital Assignments/"+makeDA_URL(li),conflictAction:"overwrite"});
        
        } else if (pattern_for_syllabus.test(item.filename)) {
        
        var li = (item.filename.split("_"));
        suggest({filename: "VIT-RM-MANAGER/Syllabus/"+makeDA_URL(li),conflictAction:"overwrite"});
        
        } else if (patternForAllMarerialZip.test(item.filename) && (/.zip$/.test(item.filename))){

            var li = (item.filename.split("_"));
            var patternForClassCode = /_[A-Z]{2}[0-9]{13}_/
            var patternforsubject = /_[A-Z]{3}[0-9]{4}_/
            var secLevel = patternforsubject.exec(item.filename)[0]
            secLevel = secLevel.slice(1,secLevel.length-1)
            var classCode = patternForClassCode.exec(item.filename)[0]
            classCode = classCode.slice(1,classCode.length-1)
            //console.log(`VIT-RM-MANAGER/All Materials/${li[0]}/${secLevel}/${patternForClassCode.exec(item.filename)[0]}/`+item.filename)
            suggest({filename: `VIT-RM-MANAGER/All Materials and General Materials/${li[0]}/${secLevel}/${classCode}/`+item.filename,conflictAction:"overwrite"});
        
        } else if (pattern_for_your_DA.test(item.filename)) {
            let regid = pattern_for_your_DA.exec(item.filename)
            let patternForClassCode = /_[A-Z]{2}[0-9]{13}_/ 
            var classCode = patternForClassCode.exec(item.filename)[0]
            classCode = classCode.slice(1,classCode.length-1)

            suggest({filename: `VIT-RM-MANAGER/Your DAs/${classCode}/${regid}/${item.filename}`,conflictAction:"overwrite"});
        } else {
            suggest({filename: `VIT-RM-MANAGER/Others/`+item.filename,conflictAction:"overwrite"});
        }
    } else suggest();
  }
);
