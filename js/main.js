// Web App Part 4
// Eric Mareth
// Visual Frameworks 1212

window.addEventListener("DOMContentLoaded", function(){
	
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	
	
	// Dynamically creates drop down list for form.
	function whatType(){					
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('selectType'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "type");
		for(i=0, j=charType.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = charType[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}
	
	// Gets the value of the selected Gender button. 
	function getSelectedRadio(){
		var sexChange = document.forms[0].gender;
		for(i=0; i<sexChange.length; i++){
			if (sexChange[i].checked){
				genderVal = sexChange[i].value;
			}
		}
	}
	
	// Switches between form('off') and data('on'). 
	function toggleControls(n){
		switch(n){
			case "on":
				$('charForm').style.display = "none";
				$('clearLink').style.display = "inline";
				$('displayData').style.display = "none";
				$('addChar').style.display = "inline";
				break;
			case "off":
				$('charForm').style.display = "block";
				$('clearLink').style.display = "inline";
				$('displayData').style.display = "inline";
				$('addChar').style.display = "none";			
				$('items').style.display = "none";

				
				// Added to remove "Edit to Display" display echo.
				var body = $('body');
				body.removeChild($('items'));
				break;
			default:
				return false;
		}
	}
	
	// Creates and populates the Data page.
	function getData(){
		// turns on Diplay Data page.
		toggleControls("on");
		
		// Added to refresh the checked status due to "Edit to Display" mis-population.
		var radios = document.forms[0].gender;
		radios[1].removeAttribute("checked","checked");
		radios[2].removeAttribute("checked","checked");
		
		// If there is nothing in local storage, this generates characters for you.
		if (localStorage.length === 0){
			alert("There are no characters lurking in the shadows! So some have been conjured for you...");
			autoFillData();
		}
		// Creates 'div' tag, populates it with 'ul' containing data blocks.
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id","items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "display";
		for( i=0, length=localStorage.length; i<length; i++){
			var makeLi = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);						
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			getImage(obj.type[1], makeSubList);
			for(var n in obj){
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0] + " " + obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
				
				// Added to give value to the hidden input attribute.
				$('charKey').value = key;
			}
			makeItemLinks(localStorage.key(i), linksLi);		// passing key to makeItemLinks function.
		}
	}
	
	// Adds image to display categories.  
	//NOTE: There are only three icons - good, bad, and neutral - but they apply to the sub-categories (i.e. Villain, Sub-Villain, Henchman are all bad.)
	function getImage(typeIcon, makeSubList){					
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "img/" + typeIcon + ".png");
		imageLi.appendChild(newImg);
	} 
	
	function autoFillData(){									// Auto populates a default character.
		for(var n in json){
			var id = Math.floor(Math.random()*10000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}	
	
	// Creates edit and delete links
	function makeItemLinks(key, linksLi){						// KEY is passed from getData function.
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var	editText = "Edit Character";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//var breakTag = document.createElement('br');			// Fashioned my tags with CSS.
		//linksLi.appendChild(breakTag);
		linksLi.setAttribute("id", "charAdjust");
		
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText ="Delete Character";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	function editItem(){
		//Grabs data from item in local storage.
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//Shows the form.
		toggleControls("off");
		
		//populates the form fields with current localStorage values.
		$('charName').value  = item.name[1];
		$('taleName').value  = item.story[1];
		$('land').value  = item.land[1];
		// Checks the field state of 'land' so it knows to populate 'town'.
		if($('land').value !== ""){
			$('town').value  = item.town[1];
			townField();
		}
		//Checks correct radio button for edit.
		var radios = document.forms[0].gender;
		for(i=0; i<radios.length; i++){
			if(radios[i].value == "Male" && item.gender[1] == "Male"){
				radios[i].setAttribute("checked","checked");
			}else if(radios[i].value == "Female" && item.gender[1] == "Female"){
				radios[i].setAttribute("checked","checked");
			}else if(radios[i].value == "It's Complicated" && item.gender[1] == "It's Complicated"){
				radios[i].setAttribute("checked","checked");
			}
		}
		$('age').value  = item.age[1];
		// Resets 'age' value display to current value.
		ageNum();
		$('type').value  = item.type[1];
		$('details').value  = item.details[1];
		$('created').value  = item.created[1];
		$('charKey').value = this.key;
		
		// remove the initial listener from the input 'save contact'
		save.removeEventListener("click", storeData);
		$('saveChar').value = "Edit Character";
		var editSubmit = $('saveChar');
		// Save the key value established in this function as a property of the editSubmit event
		// so we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}
	
	function deleteItem(){
		var ask = confirm("Are you sure you want to banish this character?"); 
		if(ask){
			localStorage.removeItem(this.key);
			alert("That character has been irrevocably thrown into the void!")
			window.location.reload();
		}else{
			alert("This character has been SPARED! For now...");
		}
	}
	
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			var ask = confirm("Are you positive that you want to wipe out your collection?")
			if(ask){
				localStorage.clear();
				alert("All characters have been destroyed!");
				window.location.reload();
				return false;
			}else{
				alert("That was a close one!")
			}
		}
	}
	
	// Validates that the character name and type fileds have been filled out.
	function validate(e){		
		//Define the elements we want to check.
		var getName = $('charName');
		var getType = $('type');
		
		errMsg.innerHTML = "";
		getName.style.border = "1px solid black";
		getType.style.border = "1px solid black";
		
		var messageAry = [];
		
		// If name field is empty, return error.
		if(getName.value === ""){
			var nameError = "Please give your character a name.";
			getName.style.border = "1px solid red";
			messageAry.push(nameError);	
		}
		
		// If type is not selected, returns error.
		if(getType.value === "|-Choose Character Type-|"){
			var typeError = "Please select a character type.";
			getType.style.border = "1px solid red";
			messageAry.push(typeError);	
		}
		
		// if there is an error message in the array, display it!
		if(messageAry.length >= 1){
			for(i=0, j=messageAry.length; i < j; i++){
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			 e.preventDefault();
			return false;
		}else{
			storeData(this.key);
			toggleControls("ready");
		}
	}
	
		
	// Generates random key and attaches it to the data object.
	function storeData(key){
		if(!key){
			var id			= Math.floor(Math.random()*10000001);
		}else{
			id = key;
		};
		getSelectedRadio();
		var item		={};
			item.name		=["Name:", $('charName').value];
			item.story		=["Story:", $('taleName').value];
			item.land		=["Land:", $('land').value];
			item.town		=["Town:", $('town').value];
			item.gender		=["Sex:", genderVal];
			item.age		=["Age:", $('age').value];
			item.type		=["Character Type:", $('type').value];
			item.details	=["Details:", $('details').value];
			item.created	=["Birthdate:", $('created').value];
		
		localStorage.setItem(id, JSON.stringify(item));
		alert("It's ALIVE!!!!!!!! ALIIIIVE!!!!!");
		
	}
	
	// *ADDED: My EXTRA CREDIT function to add a range display.
	function ageNum(){
		var	ageVal = ageData.value,
			field = $('charAge');
		field.innerHTML = ageVal;
	}
	
	// *ADDED: Activates disabled 'Town' field for population.
	function townField(){
		var townFld = $('town'),
			townLbl = $('townTxt'),
			newTxt = "Town?: ",
			dfltText = "Town (disabled): ",
			place = townFld.setAttribute("placeholder", "Oz, Neverland, etc.");			
		if($('land').value !== ""){
			townLbl.style.color = "black";
			townLbl.innerHTML = newTxt;
			townFld.removeAttribute("disabled", "disabled");
		}else{
			// Returns 'town' field to original state if user deletes 'land' field data.
			townLbl.style.color = "gray";
			townLbl.innerHTML = dfltText;
			townFld.setAttribute("disabled", "disabled");
			townFld.value = "";
			place;
		}
	}
	
	
	var charType = ["|-Choose Character Type-|", "Hero", "Side-kick", "Love-Interest", "Mentor", "Villain", "Henchman", "Sub-Villain", "Supporting", "Walk-On", "Off-Screen"];
	var	errMsg  = $('errors');

	whatType();

	var displayData = $('displayData');
	displayData.addEventListener("click", getData);
	var clearLink = $('clearLink');
	clearLink.addEventListener("click", clearLocal);
	var save = $('saveChar');
	save.addEventListener("click", validate);
	
	// *ADDED: My EXTRA CREDIT to add a range display.
	var ageData = $('age');
	ageNum();
	ageData.addEventListener("change", ageNum);	
	
	// *ADDED: Checks 'Land' field to determine active state of townField().
	var askTown = $('land'); 
	var check = askTown.addEventListener("keypress", townField);
	askTown.addEventListener("blur", townField);
});