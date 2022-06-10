const fs = require("fs");

/* ------Variables Start------ */
var variables = {
    mangaPageElem: document.getElementById("mangaPage"),
    pageZoomLevel: 95,
    movingPower: 10,
    totalPages: 0,
    currentPageIndex: 0,
    currentChapterIndex: 0,
    chapterName: "",
    seriesName: "",
    isLibraryOpen: false,
    mangaLibrary: __dirname+"\\MangymeLibrary",
    seriesList: [],
    chapterList: [],
    pageList: [],
    allowedPageFormats: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"],
}
/* ------Variables End------ */


/* ------Module Start------ */
// Zoom
window.addEventListener("wheel", (wheelData)=>{
    if (wheelData.deltaY == -100){zoomIn()}
    else if (wheelData.deltaY == 100){zoomOut()}
    setPosOnCursor(wheelData);
});
function zoomIn(){
    if (variables.pageZoomLevel < 300){
        variables.pageZoomLevel = variables.pageZoomLevel + 5;
        variables.mangaPageElem.style.height = `${variables.pageZoomLevel}%`;
    }
}
function zoomOut(){
    if (variables.pageZoomLevel > 5){
        variables.pageZoomLevel = variables.pageZoomLevel - 5;
        variables.mangaPageElem.style.height = `${variables.pageZoomLevel}%`;
    }
}
// Cursor Follow
window.addEventListener("keydown", (keyData)=>{
    if(keyData.code=="ShiftLeft"||keyData.code=="ShiftRight"||keyData.code=="Space"){
        window.addEventListener("mousemove", setPosOnCursor);
    }
});
window.addEventListener("keyup", (keyData)=>{
    if(keyData.code=="ShiftLeft"||keyData.code=="ShiftRight"||keyData.code=="Space"){
        window.removeEventListener("mousemove", setPosOnCursor);
    }
});
function setPosOnCursor(cursorData){
    variables.mangaPageElem.style.left = `${cursorData.clientX-(variables.mangaPageElem.offsetWidth/2)}px`;
    variables.mangaPageElem.style.top = `${cursorData.clientY-(variables.mangaPageElem.offsetHeight/2)}px`;
}
/* ------Module End------ */



/* ------Event Listeners Start------ */
window.addEventListener("load", ()=>{
    if (fs.existsSync(variables.mangaLibrary)==false){fs.mkdirSync(variables.mangaLibrary)}
    openLibraryBrowser();
});
window.addEventListener("keypress", (keyData)=>{
    if (keyData.code=="KeyQ"){loadPage(variables.currentPageIndex + 1);}
    else if (keyData.code=="KeyE"){loadPage(variables.currentPageIndex - 1);}
    else if (keyData.code=="KeyW"){moveImage("up")}
    else if (keyData.code=="KeyS"){moveImage("down")}
    else if (keyData.code=="KeyD"){moveImage("right")}
    else if (keyData.code=="KeyA"){moveImage("left")}
    else if (keyData.code=="NumpadAdd"||keyData.code=="Equal"){zoomIn();}
    else if (keyData.code=="NumpadSubtract"||keyData.code=="Minus"){zoomOut();}
    else if (keyData.code=="KeyB"){variables.isLibraryOpen == false ? openLibraryBrowser() : closeLibraryBrowser();}
});
/* ------Event Listeners End------ */


/* ------Functions Start------ */
function updateLegend(){
    document.getElementById("legend").innerText = `${variables.seriesName} ➡️ ${variables.chapterName} ➡️ ${variables.currentPageIndex+1}/${variables.totalPages}`;
    document.getElementById("progressBar").style.background = `linear-gradient(90deg, rgba(60, 60, 60, 0.5) ${(1-(variables.currentPageIndex/(variables.totalPages-1)))*100}%, white ${(1-(variables.currentPageIndex/(variables.totalPages-1)))*100}%)`
}

function moveImage(direction){
    if (direction=="up"){
        variables.mangaPageElem.style.top = `${variables.mangaPageElem.getBoundingClientRect().top-variables.movingPower}px`;
    }
    if (direction=="down"){
        variables.mangaPageElem.style.top = `${variables.mangaPageElem.getBoundingClientRect().top+variables.movingPower}px`;
    }
    if (direction=="left"){
        variables.mangaPageElem.style.left = `${variables.mangaPageElem.getBoundingClientRect().left-variables.movingPower}px`;
    }
    if (direction=="right"){
        variables.mangaPageElem.style.left = `${variables.mangaPageElem.getBoundingClientRect().left+variables.movingPower}px`;
    }
}

function openLibraryBrowser(){populateSeries();document.getElementById("libraryBrowser").style.display = "block";variables.isLibraryOpen = true;}
function closeLibraryBrowser(){document.getElementById("libraryBrowser").style.display = "none";variables.isLibraryOpen = false;}

function populateSeries(){
    variables.seriesList = fs.readdirSync(variables.mangaLibrary).sort();
    document.getElementById("libraryTitle").innerText = "Library - Mangas";
    document.getElementById("libraryItems").innerHTML = "";
    for (let index in variables.seriesList){
        let item = document.createElement("div");
        item.innerText = variables.seriesList[index];
        item.addEventListener("click", populateChapter);
        item.arg = variables.seriesList[index];
        document.getElementById("libraryItems").append(item);
    }
}
function populateChapter(series){
    variables.seriesName = series.currentTarget.arg;
    variables.chapterList = fs.readdirSync(variables.mangaLibrary+"\\"+variables.seriesName).sort();
    document.getElementById("libraryTitle").innerText = "Library - Chapters";
    document.getElementById("libraryItems").innerHTML = "";
    for (let index in variables.chapterList){
        let item = document.createElement("div");
        item.innerText = variables.chapterList[index];
        item.addEventListener("click", loadChapter);
        item.arg = variables.chapterList[index];
        document.getElementById("libraryItems").append(item);
    }
}
function loadChapter(chapter){
    let lastPageFirst = false
    if (typeof(chapter) == "string"){
        if (variables.chapterList.indexOf(chapter) == variables.currentChapterIndex-1){
            lastPageFirst = true
        }
        variables.chapterName = chapter
    }else{
        variables.chapterName = chapter.currentTarget.arg;
    }
    variables.pageList = fs.readdirSync(variables.mangaLibrary+"\\"+variables.seriesName+"\\"+variables.chapterName);
    for (let index in variables.pageList){
        let nameSplit = variables.pageList[index].split(".")
        if (variables.allowedPageFormats.includes(nameSplit[nameSplit.length - 1]) == false){variables.pageList.splice(index, 1);}
    }
    variables.pageList.sort()
    variables.totalPages = variables.pageList.length;
    lastPageFirst? variables.currentPageIndex = variables.totalPages-1 : variables.currentPageIndex = 0;
    variables.currentChapterIndex = variables.chapterList.indexOf(variables.chapterName);
    loadPage(variables.currentPageIndex);
    closeLibraryBrowser();
}
function loadPage(index){
    if (index <= variables.totalPages-1 && index >= 0){
        variables.currentPageIndex = index;
        updateLegend();
        variables.mangaPageElem.src = variables.mangaLibrary+"\\"+variables.seriesName+"\\"+variables.chapterName+"\\"+variables.pageList[index];
    }else if(index > variables.totalPages-1){
        if (variables.currentChapterIndex+1 <= variables.chapterList.length-1){
            loadChapter(variables.chapterList[variables.currentChapterIndex+1])
        }
    }else if(index < 0){
        if (variables.currentChapterIndex-1 >= 0){
            loadChapter(variables.chapterList[variables.currentChapterIndex-1])
        }
    }
}
/* ------Functions End------ */