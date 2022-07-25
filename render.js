// menu buttons
const newFolderBtn = document.getElementById("newFolderBtn");
const settingBtn = document.getElementById("settingBtn");
const selectBtn = document.getElementById("selectBtn");
const trashBinBtn = document.getElementById("trashBinBtn");
const editNoteBtn = document.getElementById("editNoteBtn");
const searchBtn = document.getElementById("searchBtn");

// three big area
const folderArea = document.getElementById("folderArea");
const listArea = document.getElementById("listArea");
const textArea = document.getElementById("textArea");


// detail select
const folder = document.querySelector('.folderItem');
const darkThemeBtn = document.getElementById("darkThemeBtn");
const autoDateTime = document.getElementById("autoDateTime");

// folder Items
const newFolder = document.getElementById("newFolder");
const folderItems = document.getElementById('folderItems');
const folderItem = document.getElementsByClassName('folderItem');

// listItems
const listItems = document.getElementById('listItems');

// Note CRUD select
const noteTitle = document.getElementById('noteTitle');
const mainNote = document.getElementById('mainNote');
const submitBtn = document.getElementById('submitBtn');


// create new folder

newFolderBtn.addEventListener('click', () => {
	newFolder.innerHTML = `
		<div class="folderItem" onkeydown="inputFolderName()">
		<i class="fa-solid fa-folder"></i>
		<input type="text" id="folderName">
		</div>
		`;
	newFolder.onload = () => {
		let folderName = document.getElementById("folderName");
	}
});

// submit folder with Enter key


let inputFolderName = () => {
	if (event.key === 'Enter'){
		acceptFolder();
	} else {
		console.log('failure');
	}
}

let folderData = [];

let acceptFolder = () => {
	folderData.push({
		folderName: folderName.value,
		index: new Date().getTime() + Math.random()
	});
	console.log("accept folder");
	console.log(folderData);

	localStorage.setItem("folderData", JSON.stringify(folderData));

	createFolder();
};

let createFolder = () => {
	folderItems.innerHTML = "";
	folderData.map((x, y) => {
		return (folderItems.innerHTML += `
			<div class="folderItem" id=${y} onclick="loadFolder(this)">
				<i class="fa-solid fa-folder"></i>
				<span class="folderName">${x.folderName}</span>
				<div class="numberOfNotes"></div>
			</div>
			`);
	});
};

let loadFolder = () => {
	createNote();
	loadNote(listItems);
}

//restore the folder when you refresh the page

(() => {
	folderData = JSON.parse(localStorage.getItem("folderData")) || [];
	createFolder();
	console.log(folderData);
})();

// form validation

submitBtn.addEventListener('click', (e) => {
	e.preventDefault();
	console.log("button clicked");

	formValidation();
});

let formValidation = () => {
	if (noteTitle.value === ""){
		autoDateTime.innerHTML = "post cannot be blank";
		console.log("failure");
	} else {
			if (textId.id !== "" && listItems.childElementCount !== 0) {
				updateNote();
			} else {
				acceptData();
			}
		}
	};


// accept data

let data = [];

let acceptData = () => {
	data.push({
		date: autoDateTime.innerHTML,
		title: noteTitle.value,
		main: mainNote.value,
		index: new Date().getTime() + Math.random(),
		folder: "normal"
	});
	console.log(data);

	localStorage.setItem("data", JSON.stringify(data));

	createNote();
};

// create note

let createNote = () => {
	listItems.innerHTML = "";
	data.map((x, y) => {
		return (listItems.innerHTML += `
			<div class="listItem" id=${y}>
				<div onclick="loadNote(this)" id=${x.index}>
					<div class="title">${x.title}</div>
					<div class="textContents">${x.main}</div>
					<span class="editDate">${x.date}</span>
				</div>
				<span class="folderItem"><i class="fa-solid fa-folder"></i>foldername</span>
				<i class="fa-solid fa-delete-left" onclick="deleteNote(this)"></i>
			</div>
			`);
	});

	resetForm();
};

// after user input, reset the text field

let resetForm = () => {
	noteTitle.value = '';
	mainNote.value = '';
	textId.id = '';
}

// delete note

let deleteNote = (e) => {
	console.log(e.parentElement.id);
	e.parentElement.remove();

	data.splice(e.parentElement.id, 1);

	localStorage.setItem("data", JSON.stringify(data));

	createNote();

	resetForm();

	console.log(data);

};

// load note

const textId = document.getElementsByClassName("textId")[0];


let loadNote = (e) => {
	noteTitle.value = e.childNodes[1].innerHTML;
	mainNote.value = e.childNodes[3].innerHTML;
	textId.setAttribute('id', e.id);
	console.log(e.parentElement.id);
};

// restore the note when you refresh the page

(() => {
	data = JSON.parse(localStorage.getItem("data")) || [];
	console.log(data);
	createNote();
})();

// update note

const listItem = document.getElementsByClassName("listItem");

let updateNote = () => {
	for (let i = 0; i < listItem.length; i++){
		if ( data[i].index == textId.id ) {
			data[i].date = autoDateTime.innerHTML;
			data[i].title = noteTitle.value;
			data[i].main = mainNote.value;
			localStorage.setItem("data", JSON.stringify(data));
			
			createNote();
		}
	}
	console.log("update note");
}


// change focus to mainNote with enter

noteTitle.addEventListener('keydown', ({ key }) => {
	if (key == 'Enter') {
		mainNote.focus();
		};
	});


// focus on the text edit erea and reset the form
editNoteBtn.addEventListener('click', () => { 
	noteTitle.focus();
	resetForm();
});

// auto date and time

let getTime = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const days = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
	autoDateTime.innerHTML = `${year}/${month}/${days}/ ${hour}:${minute}:${second}`
};

getTime();
setInterval(getTime, 1000);

// pop-up menu
settingBtn.addEventListener('click', () => {
	const settingContent = document.querySelector('.settingContent');
	if ( settingContent.style.display === "none" ){
		settingContent.style.display = "block";
	} else {
		settingContent.style.display = "none";
	}
});

// dark mode change
document.addEventListener("DOMContentLoaded", function(event) {
	document.documentElement.setAttribute("data-theme", "light");
	
	darkThemeBtn.onclick = function() {
		let currentTheme = document.documentElement.getAttribute("data-theme");

		let switchTheme = currentTheme === "dark" ? "light" : "dark"

		document.documentElement.setAttribute("data-theme", switchTheme);
	}
});

