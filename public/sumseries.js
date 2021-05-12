const sum = (start, end, increment) => {
    let sumSeries = 0;
    for (i = start; i <= end; i=increment+i) { 
         sumSeries += i;  
    }
    return sumSeries;
}
// Handle form submission
document.querySelector("form").addEventListener("submit", e => {
    // Cancel default behavior of sending a synchronous POST request
    e.preventDefault();
    console.log("create page");

    // Create a FormData object, passing the form as a parameter
    const formData = new FormData(e.target);
    const startNo = parseInt(formData.get("startno"));
    const endNo = parseInt(formData.get("endno"));
    const increment = parseInt(formData.get("increment"));

    if(endNo < startNo) {
        const error = document.createElement("h6");
        error.style.color = "RED";
        error.style.fontWeight = "bold";
        error.textContent = "Starting number must be less than ending number";
        document.getElementById("output").innerHTML ="";
        document.getElementById("output").appendChild(error);
        return;
    }
    const sumSeries = sum(startNo, endNo, increment);
    const innerHtml = `<br>The sum of the numbers from ${startNo} to ${endNo} incremented by ${increment} is <b>${sumSeries}</b>`;
    document.getElementById("output").innerHTML = "";
    document.getElementById("output").innerHTML = innerHtml;
});