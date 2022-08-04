// menu buttons
const newFolderBtn = document.getElementById("newFolderBtn");
const settingBtn = document.getElementById("settingBtn");
const selectBtn = document.getElementById("selectBtn");
const trashBinBtn = document.getElementById("trashBinBtn");
const editNoteBtn = document.getElementById("editNoteBtn");
const searchBtn = document.getElementById("searchBtn");

// big area
const main = document.querySelector("main");
const folderArea = document.getElementById("folderArea");
const listArea = document.getElementById("listArea");
const textArea = document.getElementById("textArea");

// search area
const searchInput = document.getElementById("searchInput");

// detail select
const folder = document.querySelector('.folderItem');
const darkThemeBtn = document.getElementById("darkThemeBtn");
const autoDateTime = document.getElementById("autoDateTime");

// folder Items
const newFolder = document.getElementById("newFolder");
const folderItems = document.getElementById('folderItems');
const folderItem = document.getElementsByClassName('folderItem');
const ctxMenu = document.getElementById('ctxMenu');

// listItems
const listItems = document.getElementById('listItems');

// Note CRUD select
const noteTitle = document.getElementById('noteTitle');
const mainNote = document.getElementById('mainNote');
const submitBtn = document.getElementById('submitBtn');

// create db

if (!window.indexedDB) {
	window.alert("this browser doesn't support indexedDB");
}

let db;

let dbReq = indexedDB.open("MOMO", 2);

dbReq.onerror = function(event) {
	alert('database error: ' + event.target.errorCode);
}

dbReq.onsuccess = function(event) {
	let db = dbReq.result;
}

dbReq.onupgradeneeded = function(event) {
	let db = dbReq.result;

	let folderStore = db.createObjectStore("folders", {keyPath:"id", autoIncrement:true});
	let noteStore = db.createObjectStore("notes", {keyPath:"id", autoIncrement:true});

	folderStore.createIndex("folderName", "folderName", {unique:false});

	noteStore.createIndex("folderName", "folderName", {unique: false});
	noteStore.createIndex("title", "title", {unique: false});
	noteStore.createIndex("main", "main", {unique: false});
	
}

// create new folder

newFolderBtn.addEventListener('click', () => {
	newFolder.innerHTML = `
		<div class="folderItem" onkeypress="inputFolderName()">
		<i class="fa-solid fa-folder"></i>
		<input type="text" id="folderName">
		</div>
		`;
	newFolder.onload = () => {
		let folderName = document.getElementById("folderName");
	}
	if(newFolder.style.visibility = "hidden"){
		newFolder.style.visibility = "visible";
	}
});

// submit folder with Enter key


let inputFolderName = () => {
	if (folderName.value != "" && event.key === 'Enter'){
		acceptFolder();

		newFolder.style.visibility = "hidden";
	}
}

// accept folder data


let acceptFolder = () => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database error', event.target.errorCode);
	}
		
	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['folders'], 'readwrite');

		transaction.oncomplete = (event) => {
			console.log('success');
		}
		transaction.onerror = (event) => {
			console.log('failed');
		}

		let objStore = transaction.objectStore('folders');


		let addReq = objStore.add({
			folderName: folderName.value
		})
	}

	createFolder();
};

// create folder view

let createFolder = () => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database error', event.target.errorCode);
	}

	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['folders'], 'readonly');
		transaction.onerror = (event) => {console.log('error')};
		transaction.oncomplete = (event) => {console.log('success')};

		let objStore = transaction.objectStore('folders');
		let cursorReq = objStore.openCursor();

		folderItems.innerHTML = "";

		cursorReq.onsuccess = (event) => {
			let cursor = event.target.result;

			if(cursor){
				let value = objStore.get(cursor.key);

				value.onsuccess = (event) => {
					console.log(event.target.result);
					return(folderItems.innerHTML += `
						<div oncontextmenu="contextMenu(event)" id=${value.result.id}>
							<div class="folderItem" onclick="loadFolder(this)" id=${value.result.folderName}>
								<i class="fa-solid fa-folder"></i>
								<span class="folderName">${value.result.folderName}</span>
							</div>
						</div>
					`);
				}
				cursor.continue();
			}
		}
	}
	console.log(folderItem)
};

let loadFolder = (event) => {
	main.setAttribute('id', event.id);
	createFolder();
	createNote();
}

// prevent default contextmenu

let contextMenu = (event) => {
	event.preventDefault();

	let x = event.pageX + 'px';
	let y = event.pageY + 'px';

	ctxMenu.style.display = "block";
	ctxMenu.style.left = x;
	ctxMenu.style.top = y;

	ctxMenu.setAttribute('id', event.currentTarget.id)
}


// remove contextMenu with click document area

let removeCtxMenu = (event) => {

	ctxMenu.style.display = 'none';
}

document.addEventListener('click', removeCtxMenu, false);

// show confirm message when ctxBtn clicked

let ctxConfirm = (event) => {
	let ctxConfirm = confirm("폴더를 삭제하시겠습니까?");

	if(ctxConfirm == true){
		console.log("yes delete")
		let folderName = event.currentTarget.id;
		deleteFolder(folderName);
	} else {
		console.log("no")
	}
}

ctxMenu.addEventListener('click', ctxConfirm)

// delete folder and notes

let deleteFolder = (folderName) => {
	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		console.log(event.target.errorCode);
	}

	let folderId = folderName;

	request.onsuccess = () => {
		let db = request.result;
		let transaction = db.transaction('folders', 'readwrite');
		transaction.onerror = (event) => {console.log('failed')};
		transaction.oncomplete = (event) => {console.log('success')};

		let objStore = transaction.objectStore('folders');
		let deleteFolderReq = objStore.delete(Number(folderName));
		deleteFolderReq.onsuccess = (event) => {
			console.log('deleteFolderReq');
		}

	}
	createFolder();
}

//restore the folder when you refresh the page

(() => {
	createFolder();
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

let acceptData = () => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database error', event.target.errroCode);
	}
	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['notes'], 'readwrite');

		transaction.oncomplete = (event) => {
			console.log('success');
		}
		transaction.onerror = (event) => {
			console.log('failed');
		}
		let objStore = transaction.objectStore('notes');

		let addReq = objStore.add({
			date: autoDateTime.innerHTML,
			title: noteTitle.value,
			main: mainNote.value,
			folderName: main.id
		})
	}
	createNote();
};

// create note

let createNote = () => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database error', event.target.errorCode);
	}

	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['notes'], 'readonly');
		transaction.onerror = (event) => {console.log('error')};
		transaction.oncomplete = (event) => {console.log('success')};

		let objStore = transaction.objectStore('notes');

		let folderNameIndex = objStore.index('folderName');
		let keyRng = IDBKeyRange.only(main.id);

		listItems.innerHTML = "";

		folderNameIndex.openCursor(keyRng).onsuccess = function(event) {
			let cursor = event.target.result;

			if(cursor){
				let value = objStore.get(cursor.key);

				value.onsuccess = (event) => {
					return (listItems.innerHTML += `
						<div class="listItem" id=${cursor.value.id}>
							<div class="checkboxDiv hidden">
								<input type="checkbox" name="checkNotes" value="checked" id="checkbox${cursor.value.id}">
							</div>
							<div onclick="loadNote(this)">
								<label for="checkbox${cursor.value.id}">
									<div class="title">${cursor.value.title}</div>
									<div class="textContents">${cursor.value.main}</div>
									<span class="editDate">${cursor.value.date}</span>
								</label>
									<span class="folderItem"><i class="fa-solid fa-folder"></i>${cursor.key}</span>
									<i class="fa-solid fa-delete-left" onclick="deleteNote(this)"></i>
							</div>
						</div>
						`);
				}
				cursor.continue();
			}

		}
	}
};

// after user input, reset the text field

let resetForm = () => {
	noteTitle.value = '';
	mainNote.value = '';
	textId.id = '';
}

// delete note

let deleteNote = (event) => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		console.log(event.target.errorCode);
	}

	request.onsuccess = () => {
		let db = request.result;
		let transaction = db.transaction('notes', 'readwrite');
		transaction.onerror = (event) => {console.log('failed')};
		transaction.oncomplete = (event) => {console.log('success')};
		
		let objStore = transaction.objectStore('notes');
		let deleteReq = objStore.delete(Number(event.parentElement.parentElement.id));
		deleteReq.onsuccess = (event) => {
			console.log('deleted');
		}
	}

	createNote();
};

// load note

let textId = document.getElementsByClassName("textId")[0];


let loadNote = (e) => {
	noteTitle.value = e.childNodes[1].childNodes[1].innerHTML;
	mainNote.value = e.childNodes[1].childNodes[3].innerHTML;
	textId.setAttribute('id', e.parentElement.id);
	console.log(e.parentElement.id);
	console.log(e.childNodes);
};

// restore the note when you refresh the page

(() => {
	createNote();
})();

// update note

const listItem = document.getElementsByClassName("listItem");

let updateNote = () => {

	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database error', event.target.errorCode);
	}

	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['notes'], 'readwrite');
		transaction.onerror = (event) => {console.log('failed')};
		transaction.oncomplete = (event) => {console.log('success')};

		let objStore = transaction.objectStore('notes');
		let objStoreReq = objStore.get(Number(textId.id));

		objStoreReq.onsuccess = (event) => {
			let noteData = objStoreReq.result;

			noteData.date = autoDateTime.innerHTML;
			noteData.title = noteTitle.value;
			noteData.main = mainNote.value;

			let updateNoteReq = objStore.put(noteData);
			
			updateNoteReq.onerror = (event) => {
				console.log('update error');
			};
			updateNoteReq.onsuccess = (event) => {
				console.log('update success');
			};
		};
	};

	createNote();

}


// change focus to mainNote with enter

noteTitle.addEventListener('keypress', ({ key }) => {
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

// search

searchBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if(searchInput.value != ""){
		searchByTitle(searchByMain);
	}
})

// search by enter

let searchByEnter = () => {
	if(searchInput.value != "" && event.key === 'Enter'){
		searchByTitle(searchByMain);
	}
}

// search by title

let searchByTitle = (callback) => {
	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database Error', event.target.errorCode);
	}

	console.log("search by title start")
	
	let searchId = [];

	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['notes'], 'readonly');

		transaction.onerror = (event) => {console.log('failed')};
		transaction.oncomplete = (event) => {console.log('success')}

		let objStore = transaction.objectStore('notes');

		let titleIndex = objStore.index('title');
		let titleRng = IDBKeyRange.bound(searchInput.value, searchInput.value + '\uffff');

		listItems.innerHTML = "";

		titleIndex.openCursor(titleRng).onsuccess = function(event) {
			let titleCursor = event.target.result;

			if(titleCursor){
				let titleValue = objStore.get(titleCursor.key);

				titleValue.onsuccess = (event) => {
					return (listItems.innerHTML += `
						<div class="listItem" id=${titleCursor.value.id}>
							<div class="checkboxDiv hidden">
								<input type="checkbox" name="checkNotes" value="checked" id="checkbox${titleCursor.value.id}">
							</div>
							<div onclick="loadNote(this)">
								<label for="checkbox${titleCursor.value.id}">
									<div class="title">${titleCursor.value.title}</div>
									<div class="textContents">${titleCursor.value.main}</div>
									<span class="editDate">${titleCursor.value.date}</span>
								</label>
								<span class="folderItem"><i class="fa-solid fa-folder"></i>${titleCursor.value.folderName}</span>
								<i class="fa-solid fa-delete-left" onclick="deleteNote(this)"></i>
							</div>
						</div>
						`);
				};
				titleCursor.continue();
				searchId.push(titleCursor.value.id);
			}
		}
	}
	callback(searchId);
	console.log('search by title end')
}

let searchByMain = (searchId) => {
	let request = window.indexedDB.open('MOMO', 2);
	request.onerror = (event) => {
		alert('Database Error', event.target.errorCode);
	}

	console.log("main search", searchId);
	request.onsuccess = (event) => {
		let db = request.result;
		let transaction = db.transaction(['notes'], 'readonly');

		transaction.onerror = (event) => {console.log('failed')};
		transaction.oncomplete = (event) => {console.log('success')}

		let objStore = transaction.objectStore('notes');

		let mainIndex = objStore.index('main');
		let mainRng = IDBKeyRange.bound(searchInput.value, searchInput.value + '\uffff');

		listItems.innerHTML = "";

		mainIndex.openCursor(mainRng).onsuccess = function(event) {
			let mainCursor = event.target.result;

			if(mainCursor){
				let mainValue = objStore.get(mainCursor.key);

				mainValue.onsuccess = (event) => {
					if(searchId.includes(mainCursor.value.id)){
						console.log("repeated note");
					} else {
						return (listItems.innerHTML += `
							<div class="listItem" id=${mainCursor.value.id}>
							<div class="checkboxDiv hidden">
							<input type="checkbox" name="checkNotes" value="checked" id="checkbox${mainCursor.value.id}">
							</div>
							<div onclick="loadNote(this)">
							<label for="checkbox${mainCursor.value.id}">
							<div class="title">${mainCursor.value.title}</div>
							<div class="textContents">${mainCursor.value.main}</div>
							<span class="editDate">${mainCursor.value.date}</span>
							</label>
							<span class="folderItem"><i class="fa-solid fa-folder"></i>${mainCursor.value.folderName}</span>
							<i class="fa-solid fa-delete-left" onclick="deleteNote(this)"></i>
							</div>
							</div>
							`);
					}
				};
				mainCursor.continue();
			}
		}
	}
	console.log("search by main end")
}

// dark mode change
document.addEventListener("DOMContentLoaded", function(event) {
	document.documentElement.setAttribute("data-theme", "light");
	
	darkThemeBtn.onclick = function() {
		let currentTheme = document.documentElement.getAttribute("data-theme");

		let switchTheme = currentTheme === "dark" ? "light" : "dark"

		document.documentElement.setAttribute("data-theme", switchTheme);
	}
});

// submit with S-Enter
textArea.addEventListener('keypress', (event) => {
	if(event.shiftKey && event.key == 'Enter'){

		event.preventDefault();

		formValidation();
	}
})

// show and hide listItem checkbox
let checkboxes = document.getElementsByName('checkNotes');

selectBtn.addEventListener('click', (event) => {
	let checkbox = document.querySelectorAll(".checkboxDiv");

	for(let i = 0; i < listItems.childElementCount; i++){
		if( checkbox[i].classList.contains('hidden') ){
			checkbox[i].classList.remove("hidden");
		} else {
			checkbox[i].classList.add("hidden");
			checkboxes.forEach((checkbox) => {
				checkbox.checked = false;
			})
		}
	}
})

// delete checked notes

trashBinBtn.addEventListener('click', () => {

	checkboxes.forEach((checkbox) => {
		
		if(checkbox.checked == true) {

			let request = window.indexedDB.open('MOMO', 2);
			request.onerror = (event) => {
			console.log(event.target.errorCode);
			}

			request.onsuccess = () => {
				let db = request.result;
				let transaction = db.transaction('notes', 'readwrite');
				transaction.onerror = (event) => {console.log('failed')};
				transaction.oncomplete = (event) => {console.log('success')};
		
				let objStore = transaction.objectStore('notes');
				let deleteReq = objStore.delete(Number(checkbox.parentElement.parentElement.id));
				deleteReq.onsuccess = (event) => {
					console.log('deleted');
				}
			}
		}
	})
	createNote();
})
