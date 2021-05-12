// Handle form submission
document.querySelector("form").addEventListener("submit", e => {
    // Cancel default behavior of sending a synchronous POST request
    document.getElementById("result").innerHTML = `<br><h3>Wait for results</h3>`;
    e.preventDefault();
    // Create a FormData object, passing the form as a parameter
    const formData = new FormData(e.target);
    // Send form data to the server with an asynchronous POST request
    fetch("/import", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(parsedData => {
          //var parsedData = JSON.parse(data);
          //console.log("Data in EJS", parsedData);
          console.log("Data in Errorcount", parsedData.errorCount);
          //display import Summary
          const resultElement = document.getElementById("result");
          resultElement.innerHTML = "";
          resultElement.innerHTML = "<br><h4>Import Summary</h4>";

          const initialrecord = document.createElement("p");
          initialrecord.textContent = `Initial Number of books in the database: ${parsedData.initialRec}`;
          resultElement.appendChild(initialrecord);
          //create p element and display record summary
          //processed info
          const inserted = document.createElement("p");
          inserted.textContent = `Books inserted successfully: ${ parsedData.successCount}`;
          resultElement.appendChild(inserted);

          //inserted info
          const total = document.createElement("p");
          total.innerHTML = `Resulting number of books in the database:<b> ${ parsedData.successCount + parsedData.initialRec}</b>`; 
          resultElement.appendChild(total);
          

          //display Errors
          const errorDivElement = document.createElement("div");
          const errorHeaderElement = document.createElement("p");
          errorHeaderElement.textContent = "Error Summary:";
          errorHeaderElement.style.fontWeight = "bold";
          errorDivElement.appendChild(errorHeaderElement);

          const processed = document.createElement("p");
          processed.textContent = `Total book records processed: ${ parsedData.successCount + parsedData.errorCount}`;
          errorDivElement.appendChild(processed);

          const notInserted = document.createElement("p");
          notInserted.innerHTML = `Number of books not inserted:<b> ${ parsedData.errorCount}</b>`; 
          errorDivElement.appendChild(notInserted);

          const errorDetails = document.createElement("p");
          errorDetails.textContent = "Detailed Errors:";
          errorDetails.style.fontWeight = "bold";
          errorDivElement.appendChild(errorDetails);

          console.log("error array",parsedData.errorArray);
          for(error of parsedData.errorArray){
              const errorElement = document.createElement("p");
              errorElement.textContent = error;
              errorDivElement.appendChild(errorElement);
              error = "";
          }
          resultElement.appendChild(errorDivElement);

      })
      .catch(err => {
          document.getElementById("message").textContent = `Error: ${err.message}`;
      });
  });