 /***
 *       _____                    _           _          _     
 *      / ____|                  | |         | |        | |    
 *     | (___  _   _ _ __   ___  | |     __ _| |__   ___| |___ 
 *      \___ \| | | | '_ \ / __| | |    / _` | '_ \ / _ \ / __|
 *      ____) | |_| | | | | (__  | |___| (_| | |_) |  __/ \__ \
 *     |_____/ \__, |_| |_|\___| |______\__,_|_.__/ \___|_|___/
 *              __/ |                                          
 *             |___/                                           
 *
 * 
 * 
 *  rev. 2021-11-17
 * 
 *  https://github.com/CaTeNdrE/gas-gmail-add-parent-of-nested-label
 *
 * 
 */
    


var labelSkipList = [    // Array of labels to exclude
  "Sync Issues/Conflicts",
  "Sync Issues/Server Failures",
  "Sync Issues/Local Failures",
    ]; 

 var logLevel = 1;   //  Choose from: 1 (info [default]), 2 (verbose), 3 (debug) 

// define some arrays

var allUdates = '0';
var namePad = ""; 
var namesList = [];
var nameLogPad = [];
var space = String.fromCharCode(160); // define a non-breaking space for use as needed.

var numPad = 2;          // default number padding
var skipCount = 0;
var skipLog = "";
var padHead = "8";
var skipHead = ("Skipped").padEnd(padHead, space);
var ignoreHead = ("Ignored").padEnd(padHead, space);

// skipPad = getPadding(labelSkipList,1);




/***
 *      _           _          _     
 *     | |         | |        | |    
 *     | |     __ _| |__   ___| |___ 
 *     | |    / _` | '_ \ / _ \ / __|
 *     | |___| (_| | |_) |  __/ \__ \
 *     |______\__,_|_.__/ \___|_|___/
 *                                   
 */


function addParentLabel() {

  Logger.log("Log Level: " + logLevel);

  var gmailLabels = Gmail.Users.Labels.list('me');

  numPad = gmailLabels.labels.length.toString().length;
  
  
  Logger.log(("Fetched").padEnd(padHead, space) + gmailLabels.labels.length.toString().padStart(numPad) + space + "GMAIL" + space + space + "labels");

  if (logLevel > 2) {
    let line = 0;
    gmailLabels.labels.forEach(thisLabel => console.log((++line).toString().padStart(numPad) + space + thisLabel));
  }

  var sysLabelList = gmailLabels.labels.filter(thisLabel => thisLabel.type == "system");    //  is a system label
  Logger.log(skipHead + sysLabelList.length.toString().padStart(numPad) + space + "SYSTEM labels");

  var filteredList = gmailLabels.labels.filter(
    thisLabel => 
      thisLabel.type == "user"                        //  is a user label
      && thisLabel.name.search("/") > 0                 //  has a parent
      && matchFunction(thisLabel.name, labelSkipList, numPad, 1) == 0  //  is not in Label Skip List array
  );


  var orphanLabelList = gmailLabels.labels.filter(thisLabel => (!(thisLabel.name.search("/") > 0) && thisLabel.type == "user" ));    //  is an orphan 
  Logger.log(skipHead + orphanLabelList.length.toString().padStart(numPad) + space + "ORPHAN labels");
 
  var skipLabelList = gmailLabels.labels.filter(thisLabel => (thisLabel.name.search("/") > 0 && matchFunction(thisLabel.name, labelSkipList, numPad) > 0 && thisLabel.type == "user" ));    //  is excluded because on skiplist 
  if (skipLabelList.length > 0) Logger.log(skipHead + skipLabelList.length.toString().padStart(numPad) + space + "on Skip List" + (logLevel > 1 ? '\n' + "----------------------" + '\n' + skipLog : ""));

  var ignoreSkip = gmailLabels.labels.filter(thisLabel => (matchFunction(thisLabel.name, labelSkipList, numPad) > 0 && thisLabel.type == "system"));    //  On skiplist but skipped as system 
  if (ignoreSkip.length > 0) Logger.log(ignoreHead + ignoreSkip.length.toString().padStart(numPad) + space + "on Skip List because" + space + (ignoreSkip.length > 1 ? "they are SYSTEM labels" : "it is a SYSTEM label"));

  var orphanSkip = gmailLabels.labels.filter(thisLabel => (matchFunction(thisLabel.name, labelSkipList, numPad) > 0 && thisLabel.type == "user" && !(thisLabel.name.search("/") > 0)));    //  On skiplist but skipped as orphan  
  if (orphanSkip.length > 0) Logger.log(ignoreHead + orphanSkip.length.toString().padStart(numPad) + space + "on Skip List because " + (orphanSkip.length > 1 ? "they are ORPHANS" : "it is an ORPHAN"));
  
  var labelSys = "";
 
  for (let i = 0; i < ignoreSkip.length; i++) {
    i > 0 ? labelSys += '\n': "";
    labelSys += (i + 1).toString().padStart(numPad) + ignoreSkip[i].name;

  }
        
  filteredList.forEach(thisLabel => namesList.push(thisLabel.name));
  namesList.sort();
  namePad = getPadding(namesList, 1);    // length of longest string plus x spaces (or 1 if omitted);

  Logger.log(("Search").padEnd(padHead, space) + filteredList.length.toString().padStart(numPad) + space + "child labels in Gmail messages" + (logLevel > 1 ? logLabels(namesList, "41") : "")); 



/***
 *      ______                 _ _     
 *     |  ____|               (_) |    
 *     | |__   _ __ ___   __ _ _| |___ 
 *     |  __| | '_ ` _ \ / _` | | / __|
 *     | |____| | | | | | (_| | | \__ \
 *     |______|_| |_| |_|\__,_|_|_|___/
 *                                     
 */
    
    
    for (let i = 0; i < filteredList.length; i++) {
      let thisChild = filteredList[i].name;
      let thisParent = thisChild.replace("/" + thisChild.split("/").pop(), "");
      let thisParentIndex = gmailLabels.labels.findIndex(thisIndex => thisIndex.name == thisParent);  // get Label ID for parent
      let thisParentId = gmailLabels.labels[thisParentIndex].id;  // get Label ID for parent
      let thisQuery = "\-label:" + thisParent + " label:" + thisChild; // this label but not its parent
      
      let msgList = Gmail.Users.Messages.list("me", {"q":thisQuery}).messages;  // list of matching messages
      if (msgList) {
        var allUpdates = +1;        
        let thisLog = "";
        for (let j = 0; j < msgList.length; j++) {  // for each msg in list
          let msgNum = +j + 1;
          let msgId = msgList[j].id;
          let addLabel = thisParentId;
          thisLog += msgNum.toString().padStart(numPad, space) + space + "\"" + thisParent + "\"" + space + "added" + space + "to" + space + "msgID" + space + msgId.padEnd(17, space) +" ";
          Gmail.Users.Messages.modify(
            {
              'addLabelIds': [addLabel]
            },
            'me', msgId
          );
        }

        let thisLogPad = +numPad + 40 + (msgList.length > 1 ? 2 : 0 ) + thisChild.length + thisParent.length;
        Logger.log(msgList.length.toString().padStart(numPad, space) + space + (msgList.length > 1 ? "messages" : "message") + space + "with \"" + thisChild + "\"" + space + (msgList.length > 1 ? "are" : "is") + space + "missing the label \"" + thisParent + "\"" + (logLevel > 1 ? '\n' + "--".padEnd(thisLogPad, "-") + '\n' + thisLog : "")); 
      }        
    }
    if (!allUpdates) Logger.log("No messages found with a nested label and also missing its parent");  
    
}     

function logLabels(labelArr, titleLen) {
    let varOutput = '\n' + ("-").padEnd(titleLen, "-") + '\n'; 
    for (let i = 0; i < labelArr.length; i++) {
      let thisLabel = (i+1).toString().padStart(numPad, space) + space + labelArr[i].padEnd(namePad);
      varOutput += thisLabel;
    }
  return varOutput;
  }




/***
 *      __  __       _       _     
 *     |  \/  |     | |     | |    
 *     | \  / | __ _| |_ ___| |__  
 *     | |\/| |/ _` | __/ __| '_ \ 
 *     | |  | | (_| | || (__| | | |
 *     |_|  |_|\__,_|\__\___|_| |_|
 *                                     
 */


function matchFunction(strVal, matchArr, numPad, logIt) {
  skipPad = getPadding(matchArr, 1);
  for (let i = 0; i < matchArr.length; i++) {
    let matchStr = matchArr[i];
    if (strVal == matchStr) {
      if (logIt == 1) {
        skipCount = +skipCount + 1;
        skipMatch = skipCount.toString().padStart(numPad) + space + strVal.padEnd(skipPad);
        skipCount > 1 ? skipLog += '\n': "";
        skipLog += skipMatch; 
      }
      return 1;
      }
  }
  return 0;
}




/***
 *      _____          _     _ _             
 *     |  __ \        | |   | (_)            
 *     | |__) |_ _  __| | __| |_ _ __   __ _ 
 *     |  ___/ _` |/ _` |/ _` | | '_ \ / _` |
 *     | |  | (_| | (_| | (_| | | | | | (_| |
 *     |_|   \__,_|\__,_|\__,_|_|_| |_|\__, |
 *                                      __/ |
 *                                     |___/ 
 */


function getPadding(list, extra) {     // return length of longest string in array for column padding 
  if (!extra) extra = 1;    // define 'extra' spaces if not set
  if (!Array.isArray(list)) {    // If String recieved, convert to Array
    var oldList = list;
    var newValue = "x";
    var list = [ list, newValue ];   
    Logger.log("**  Type Error: \"" + oldList + "\" was a String. Now converted to Array \"" + list + "\"" );    
  }
  var longest = list.reduce(function (a, b) // determine longest string in the array
    {
      return a.length > b.length ? a : b;
    }
  );
  var padding = longest.length + extra; // set padding as longest string plus 'extra' spaces
  return padding;
}

