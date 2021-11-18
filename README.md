# gas-gmail-add-parent-of-nested-label

Google Apps Script that adds ancestors' labels to Gmail messages labelled with one of their descendants.

The goal of this script is to create a Gmail label search experience more akin to a directory search without having to duplicate and combine filter rules. 

Gmail's custom user labels can be nested below one another and Gmail displays labels in the menu in a way that closely mimics a computer's directory structure. Unlike a search on a computer, when searching a label Gmail does not automatically include its descendants. 

This script was developed because my preferred default approach to searching within labels is to 'include' rather than 'exclude' their descendants.

## Example  
**Ancestor**  
Label located in the same branch as another but at least one level higher up (e.g. parent, grandparent, etc.)  
   
**Descendent**  
Label located in the same branch as another but at least one level lower down (e.g. child, grandchild, etc.)  

In this menu, the label 'eriador' has 4 descendants:  

     ------------
     Sent
     All Mail 
     Spam
     Drafts
     eriador
        > shire
             > westfarthing
        > rivendell
        > breeland
     ------------   

  
**4 Descendants of 'eriador'**  

     3 Children:   'shire' ('eriador-shire'), 'rivendell' ('eriador-rivendell'), and 'breeland' ('eriador-breeland')
     1 Grandchild: 'westfarthing' ('eriador-shire-westfarthing') 
     
**Also note**

     'shire' is an ancestor of 'westfarthing'  
     'westfarthing' is a descendent of both 'shire' and 'eriador'
     

**Search Eriador for Isildur's Bane**  
  
To search for "Isildur's Bane" in 'eriador' including its descendants ('shire', 'westfarthing', 'rivendell', and 'breeland') the Gmail search needs to be a variation of:

     Search:  "Isildur's Bane" label:({eriador eriador-shire eriador-shire-westfarthing eriador-rivendell eriador-breeland})
   
   
### One Label to Bind them All  
Using this script you are able to find Isildur's Bane wherever it is in Eriador using:  

     Search:  "Isildur's Bane" label:eriador  

## Installation  
   
A.  Create a Google Apps Script (GAS) Project  
B.  Paste the Code.gs file contents into your GAS Project's Code.gs file.  
C.  Add the dependency Advanced Gmail API Service to your GAS Project. 
D.  Create Trigger

  
### A. Create Google Apps Script Project
1. Sign in to your Google Account in Chrome web browser.
2. Navigate to script.google.com  *If this is the first time you've been to script.google.com, click View Dashboard.*
3. At the top left, click 'New project'.
5. Name the project by clicking on 'Untitled project'. 

### B. Paste the Code
6. Delete any pre-populated code from the script editor (e.g. function myFunction(), etc.)
7. Using a text editor copy the contents the Code.gs file in this Git and paste it into the script editor.
8. Click the Save button.

### C. Add dependency
9. Click on the plus (+) symbol on 'Services  +' to open the 'Add a service' dialog.
10. Type 'Gmail' in the 'Identifier' field.
11. Click 'Add'

### D. Create Trigger
12. Click on the 'Trigger' menu button (alarm clock image) in the left menu.
13. Click the '+  Add Trigger' button at the bottom right of the Triggers page.
14. Configure Trigger:  

Trigger Settings:  

     Choose which function to run:       addParentLabel  
     Choose which deployment should run: Head  
     Select event source:                Time-driven  

Set the following to your preference.  Here are my settings:  
    
     Select type of time based trigger:  Minutes timer  
     Select minute interval:             Every 5 minutes   
     Failure notification settings:      Notify me immediately   

## Feedback
This is my first Google Apps Script as well as my first Git.  This may be reflected in poor and/or odd choices in both spaces. Constructive feedback is welcomed and, of course, please advise of any issues/bugs encountered.  

