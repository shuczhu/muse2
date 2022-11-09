var generateBtn = document.getElementById('generate');
var saveBtn = document.getElementById('save');
var renameBtn = document.getElementById('rename');
var deleteBtn = document.getElementById('delete');
var makePrivateBtn = document.getElementById('make-private');
var makePublicBtn = document.getElementById('make-public');

//Make Private
const makePrivate = async () => {
  console.log('test1')
  const dataPath = window.location.pathname;
  const saveData = await fetch(`/api/${dataPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_public: "false" })
  });

  if (saveData.ok) {
    console.log("success");
    location.reload();
  } else {
    console.log("nope")
  }
};

//Make public
const makePublic = async () => {
  console.log('test1')
  const dataPath = window.location.pathname;
  const saveData = await fetch(`/api/${dataPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_public: "true" })
  });

  if (saveData.ok) {
    console.log("success");
    location.reload();
  } else {
    console.log("nope")
  }
};
//Retrieve document from database and insert into Quill. 
const displayDocument = async () => {

  const dataPath = window.location.pathname;
  const documentData = await fetch(`/api${dataPath}`, {
    method: "GET"
  });

  const document = await documentData.json();
  quill.insertText(0, document.content);

  return;

};

//Rename the document title.
const renameDocument = async () => {

  saveDocument();

  const newname = await window.prompt("What would you like to change the title to?")

  const dataPath = window.location.pathname;

  const rename = await fetch(`/api${dataPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newname })
  })

  location.reload();

}

//Save the document into database
const saveDocument = async () => {

  var length = await quill.getLength();
  var documentData = await quill.getText(0, length);

  const dataPath = window.location.pathname;

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

  console.log(now)

  const saveData = await fetch(`/api${dataPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: documentData, last_updated: now })
  });

  if (saveData.ok) {
    console.log("autosaved")
  } else { console.log("error") }

};

// Autosave progress from Quill every 2 seconds
setInterval(saveDocument, 2000)


// Save button handler with a window alert
const saveBtnHandler = () => {
  saveDocument();
  window.alert("Document saved successfully.");
}

// Delete document from database
const deleteDocument = async () => {
  const prompt = confirm("Are you sure you want to delete this document? This will be permanent.");

  const dataPath = window.location.pathname;

  if (prompt === true) {
    const deleteDoc = await fetch(`/api${dataPath}`, {
      method: "DELETE"
    });

    if (deleteDoc.ok) {
      document.location.replace('/');
    } else { console.log("error") }
  }

};

// Generate based on user selection 
const generateHandler = async (event) => {
  event.preventDefault();

  const range = await quill.getSelection();
  const textSelectedInput = await quill.getText(range.index, range.length);

  if (range !== null) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textSelected: textSelectedInput }),
    });

    const data = await response.json();

    console.log(data);

    const responseRecord = await fetch("/api/editor/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: textSelectedInput, response: data.checkresult})
    })

    var length = await quill.getLength();

    quill.insertText(length, data.checkresult);

  } else {

  window.alert("Please highlight a passage as prompt to generate");
  
};


};


displayDocument();


generateBtn.addEventListener('click', generateHandler);
saveBtn.addEventListener('click', saveBtnHandler);
renameBtn.addEventListener("click", renameDocument);
deleteBtn.addEventListener("click", deleteDocument);
if(makePrivateBtn){
  makePrivateBtn.addEventListener("click", makePrivate);
}

if(makePublicBtn){
  makePublicBtn.addEventListener('click', makePublic);
}


// Make the DIV element draggable:
dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}