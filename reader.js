/* ------Variables Start------ */
var variables = {
    mangaPageElem: document.getElementById("mangaPage"),
    pageZoomLevel: 95
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
    variables.pageZoomLevel = variables.pageZoomLevel + 5;
    variables.mangaPageElem.style.height = `${variables.pageZoomLevel}%`;
}
function zoomOut(){
    variables.pageZoomLevel = variables.pageZoomLevel - 5;
    variables.mangaPageElem.style.height = `${variables.pageZoomLevel}%`;
}

// Cursor Follow
window.addEventListener("keydown", (keyData)=>{
    if(keyData.code=="ShiftLeft"){
        window.addEventListener("mousemove", setPosOnCursor);
    }
});
window.addEventListener("keyup", (keyData)=>{
    if(keyData.code=="ShiftLeft"){
        window.removeEventListener("mousemove", setPosOnCursor);
    }
});
function setPosOnCursor(cursorData){
    variables.mangaPageElem.style.left = `${cursorData.clientX-(variables.mangaPageElem.offsetWidth/2)}px`;
    variables.mangaPageElem.style.top = `${cursorData.clientY-(variables.mangaPageElem.offsetHeight/2)}px`;
}
/* ------Module End------ */



/* ------Event Listeners Start------ */
window.addEventListener("resize", centerLegend);
window.addEventListener("load", ()=>{centerLegend();loadPage("/TestMangaPage.png")});
/* ------Event Listeners End------ */



/* ------Functions Start------ */
function centerLegend(){document.getElementById("legend").style.left = `${(window.innerWidth/2)-(document.getElementById("legend").offsetWidth/2)}px`;}

function loadPage(imgLoc){
    variables.mangaPageElem.src = imgLoc;
}
/* ------Functions End------ */