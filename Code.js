/**
 * 
 *   +----------------------------------------+
 *   |  GAS Gmail Add Parent of Nested Label  |
 *   +----------------------------------------+ 
 *   
 *   rev. 2023-06-27
 *   rev. 2021-11-17
 *   
 *   https://github.com/CaTeNdrE/gas-gmail-add-parent-of-nested-label
 *   
 *  
 *   Google Action Script (GAS) that searches Gmail messages in nested
 *   user labels and applies their parent label if it is missing.
 * 
 *   Ensures that a Gmail labeled with:
 *     
 *   "sport/hockey"     is also in "sport"
 *   "sport/basketball" is also in "sport"
 *   "sport/lax/field"  is also in "sport" as well as "sport/lax"
 * 
 *   Skip Lists are used to exclude labels from this behavior.  
 *   A label can be excluded by both lists without causing any issues.
 */

//    Offsprint Skip List
//  +-----------------------------------------------------------------
//  | Array of labels whose offspring (children, grandchildren, etc.) 
//  | will be excluded from syncing. To also exclude the actual labels 
//  | in this list, they must also be added to the "Labels Skip List". 
//  +----------------------------------------------------------------- 
      const offspring = [
 //       "Sync Issues",
 //       "mymessages",
 //       "theOffspring",    // eg. Non-existent Ancestor  
 //       "INBOX"            // eg. System Label
      ];

//    Labels Skip List
//  +------------------------------------------------------ 
//  | Array of individual labels to exclude from syncing to 
//  | their parents, grandparents, great-grandparents, etc.
//  +------------------------------------------------------
      const skiplabel = [
//        "SENT",               // eg. System Label
//        "noLabelsPlease",     // eg. Non-existent label       
//        "notReal/andWrong"    // eg. Non-existent label
      ];

//    Log Level (loglevel) 
//  +--------------------------------------------- 
//  | 1 = info [default], 2 = verbose,  3 - debug)
//  +---------------------------------------------  
      const loglevel = 1; 


/**
 *    +---------------------------------+
 *    |                                 | 
 *    |  Be careful editing below here  |
 *    |                                 | 
 *    +---------------------------------+ 
 */

const logs = {};
const pad = {};
const list = {};
const len = {};
// const namesList = [];
const names = { All: [], System: [], List: []  };
const sp = String.fromCharCode(160); // define a non-breaking space for use as needed.
const padDef = 3;          // default number padding
const skiplog = { 
  Name: [], Type: [], Output: [], Count: 0
};

/** 
 *    +------------------+
 *    |  addParentLabel  |
 *    +------------------+
 */

function addParentLabel() {

  if (!([1, 2, 3].indexOf(loglevel) > -1)) {
    loglevel = 1;
  }

  mylabels = Gmail.Users.Labels.list('me').labels;
  mylabels.forEach(thisLabel => names.All.push(thisLabel.name));

  let labelcount = names.All.length.toString();
  let padnum = labelcount.length;
  
  let fetchlog = labelcount.padStart(padnum) + " GMAIL labels retrieved";
  let uline = '\n' + "-".padEnd(fetchlog.length, "-");
  fetchlog +=  uline;

  if (loglevel > 2) {
    let line = 0;
    mylabels.forEach(thisLabel => console.log((++line).toString().padStart(padDef)
      + sp + thisLabel));
  }
  
  //  System labels
  list.System = mylabels.filter(thisLabel => thisLabel.type == "system");
  list.System.forEach(thisLabel => names.System.push(thisLabel.name));
  
  fetchlog += '\n' + list.System.length.toString().padStart(padnum) + " are system labels";

  //  User labels with no parent
  len.orphan = (list.orphan = mylabels.filter(
    thisLabel => (!(thisLabel.name.search("/") > 0) && thisLabel.type == "user")
    )).length.toString();    

  fetchlog += '\n' + len.orphan.padStart(padnum) + " have no parent";

  //  In a skip list and match a valid label 
  const relevant = mylabels.filter(
    thisLabel => thisLabel.name.search("/") > 0
      && thisLabel.type == "user"
      && matchLabel(thisLabel.name, skiplabel, offspring, padDef) > 0
  );    

  if (relevant.length) {
    fetchlog += '\n' + relevant.length.toString().padStart(padnum)
    + " match skip lists"
  };

  //  User label has parent and not excluded by a skip list  
  const valid = mylabels.filter(
    thisLabel => thisLabel.type == "user" 
      && thisLabel.name.search("/") > 0 
      && matchLabel(thisLabel.name, skiplabel, offspring, padDef, 1) == 0
      );
  len.Valid = valid.length.toString();
  

  fetchlog += uline + '\n' + len.Valid.padStart(padnum)
    + " user labels to search";
 
  Logger.log(fetchlog);

  if (skiplog.Name.length) { thisPad = getPadding(skiplog.Name, 3)};  
    
  
  
  // validate skip lists 
  if (offspring.length) validate(offspring, "Offspring", padnum);  
  if (skiplabel.length) validate(skiplabel, "Labels", padnum);

  // List  matching user labels if loglevel > 1 
  if (loglevel > 1) {

    for (let i = 0; i < skiplog.Name.length; i++) {
    skiplog.Output += (skiplog.Name[i].padEnd(thisPad, sp) + skiplog.Type[i] + '\n'); 
  };

    let txt = "Gmail User Labels that matched a Skip List";
    Logger.log(txt + '\n' + "-".padEnd(txt.length, "-") + '\n' + skiplog.Output);
  };
   
  valid.forEach(thisLabel => names.List.push(thisLabel.name));
  names.List.sort();
  let padname = getPadding(names.List, 1);    // length of longest string plus x sps (or 1 if omitted);
  checking = "Checking messages in " + len.Valid + " labels"; 
  Logger.log(checking + (loglevel > 1 ? logLabels(names.List, checking.length, padname) : ""));

/**
 *    +-----------------+
 *    |  Search Emails  |
 *    +-----------------+
 */

  for (let i = 0; i < len.Valid; i++) {
    
    let label = valid[i].name;

    // Parent label's Gmail ID (retrieve using index from name)
    let thisParent = label.replace("/" + label.split("/").pop(), "");
    let thisParentIndex = mylabels.findIndex(thisIndex => thisIndex.name == thisParent); 
    let thisParentId = mylabels[thisParentIndex].id;

    
    let thisQuery = "\-label:" + thisParent + " label:" + label; // this label but not its parent

    let msgList = Gmail.Users.Messages.list("me", { "q": thisQuery }).messages;  // list of matching messages
  
    if (msgList) {
      var allUpdates = +1;
      let thisLog = "";
    
      for (let j = 0; j < msgList.length; j++) {  // for each msg in list
        let msgNum = +j + 1;
        let msgId = msgList[j].id;
        let addLabel = thisParentId;
        thisLog += msgNum.toString().padStart(padDef, sp) + sp + "\"" + thisParent + "\"" + sp + "added" + sp + "to" + sp + "msgID" + sp + msgId.padEnd(17, sp) + " ";
      
        Gmail.Users.Messages.modify(
          {
            'addLabelIds': [addLabel]
          },
            'me', msgId
        );
      };

      let thisLogPad = + padDef + 40 + (msgList.length > 1 ? 2 : 0) + label.length + thisParent.length;
      Logger.log(msgList.length.toString().padStart(padDef, sp) + sp + (msgList.length > 1 ? "messages" : "message") + sp + "with \"" + label + "\"" + sp + (msgList.length > 1 ? "were" : "was") + sp + "missing the label \"" + thisParent + "\"" + (loglevel > 1 ? '\n' + "--".padEnd(thisLogPad, "-") + '\n' + thisLog : ""));
    
    }; 

  };

  if (!allUpdates) Logger.log("All labelled messages included the labels of their ancestors");  

}



/**
 *    +--------------+
 *    |  Log Labels  |
 *    +--------------+
 */

function logLabels(arr, num, pad) {
  let log = '\n' + ("-").padEnd(num, "-") + '\n';
  for (let i = 0; i < arr.length; i++) {
    let label = (i + 1).toString().padStart(padDef, sp) + sp + 
    arr[i].replaceAll(' ', sp).padEnd(pad);
    log += label;
  }
  return log;
}


/**
 *    +-----------------------+
 *    |  Skip List Validation |
 *    +-----------------------+
 */

function validate(list, name, pad) {
  
  let len = list.length;
  let log = len.toString().padStart(pad) + (len == 1 ? " entry" : " entries")  + " in " + name + " skip list"

  let nomatch = list.filter(thisLabel => names.All.indexOf(thisLabel) == -1);
  let system = list.filter(thisLabel => names.System.includes(thisLabel));
  let nl = nomatch.length, sl = system.length;

  (nl || sl) && (log += '\n' + "-".padEnd(log.length, "-")); 
    
  if (nl) {

    log +=  '\n' + nl.toString().padStart(pad) + (nl > 1 ? " don't" : " doesn't") + " exist:";

    for (let i = 0; i < nl; i++) {
      
      ([i] < 1) && (log += ("[").padStart(pad, sp));
      log += sp + nomatch[i];
      (([i] == (nl - 1)) && (log += " ]")) || (log += ","); 

    };

  };

  if (sl) {

    log +=  '\n' + sl.toString().padStart(pad) + (sl > 1 ? " are system labels" : " is a system label") + " and ignored:";

    for (let i = 0; i < sl; i++) {
      
      ([i] < 1) && (log += ("[").padStart(pad, sp));
      log += sp + system[i];
      (([i] == (sl - 1)) && (log += " ]")) || (log += ","); 

    };

  };

  Logger.log(log);

}


/**
 *    +-----------------------+
 *    |  matchLabel Function  |
 *    +-----------------------+
 */

function matchLabel(strVal, arrVal, arrDes, padDef, log, pad) {

  for (let i = 0; i < arrDes.length; i++) {

    if (strVal.startsWith(arrDes[i] + "/")) {

      if (log == 1) {
        skiplog.Count += 1;
        skiplog.Name.push(skiplog.Count.toString().padStart(padDef) + sp + strVal);
        skiplog.Type.push(("Ancestor:" + sp + arrDes[i]).replaceAll(' ', sp));
      }
      return 1;
    }

    for (let i = 0; i < arrVal.length; i++) {
      if (strVal == arrVal[i]) {
        if (log == 1) {
          skiplog.Count += 1;
          skiplog.Name.push(skiplog.Count.toString().padStart(padDef) + sp + strVal.replaceAll(' ', sp));
          skiplog.Type.push("Labels Skip List".replaceAll(' ', sp));
        }
        return 1;
      }
    }
  }
  return 0;
}

/**
 *    +--------------------+
 *    |  Padding Function  |
 *    +--------------------+
 */

// returns length of longest string in array for column padding 
function getPadding(list, extra) {     
  if (!extra) extra = 1;         // define 'extra' spaces if not set
  if (!Array.isArray(list)) {    // if string, convert to array
    var oldList = list;
    var newValue = "x";
    var list = [list, newValue];
    Logger.log("**  Type Error: \"" + oldList + "\" was a String. Now converted to Array \"" + list + "\"");
  }

  if (list.length) {
      var longest = list.reduce(function (a, b) // determine longest string in the array
        { return a.length > b.length ? a : b; });
  };

  var padding = longest.length + extra; // set padding as longest string plus 'extra' spaces
  return padding;
}
