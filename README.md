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
D.  Authorize project to access your Gmail.  
E.  Create Trigger
  
### A. Create Google Apps Script Project
1. Sign in to your Google Account in Chrome web browser.
2. Navigate to script.google.com  *If this is the first time you've been to script.google.com, click View Dashboard.*
3. At the top left, click 'New project'.
4. Name the project by clicking on 'Untitled project'. 

### B. Paste the Code
5. Delete any pre-populated code from the script editor (e.g. function myFunction(), etc.)
6. Using a text editor copy the contents the Code.gs file in this Git and paste it into the script editor.
7. Click the Save button.

### C. Add dependency
8. Click on the plus (+) symbol on 'Services  +' to open the 'Add a service' dialog.
9. Type 'Gmail' in the 'Identifier' field.
10. Click 'Add'

### D. Authorize Project
11. Open Code.gs in the script editor
12. Make sure 'addParentLabel' is the function selected to the right of 'Run' and 'Debug'
13. Click on the 'Run' button beside 'Debug' at the top of the page.
14. Click on 'Review permissions' in the 'Authorization required' dialog that appears.
15. Choose the Google account you'd like to allow the script to access.
16. You will see a warning that 'Google hasn’t verified this app' because... Google Hasn't Verified this App :-)
17. Click on the 'Advanced' link
18. Click on the 'Go to [custom script name here] (unsafe)' link.
19. Read the warning about the fact that this script wants to access your Gmail account.    
20. Click 'Allow' if you'd like to allow this script access.

**Please Note**:

     If you completed steps 11 - 20, but took a too long, that script instance will have timed
     out with a permission-related error.  Don't worry, future instances will succeed.  Simply
     manually run the script again to confirm by repeating steps 12 - 14.  You should no longer
     be prompted for authorization.

### E. Create Trigger
21. Click on the 'Trigger' menu button (alarm clock image) in the left menu.
22. Click the '+  Add Trigger' button at the bottom right of the Triggers page.
23. Configure Trigger:  

**Trigger Settings**:  

     Choose which function to run:       addParentLabel  
     Choose which deployment should run: Head  
     Select event source:                Time-driven  

**Set the following to your preference.  Here are my settings**:  
    
     Select type of time based trigger:  Minutes timer  
     Select minute interval:             Every 5 minutes   
     Failure notification settings:      Notify me immediately   


## Custom Settings  
### Logging
There are 3 log levels depending on the amount of detail you want to display:
Level 1 = info (default)
Level 2 = verbose 
Level 3 = debug

You can change the level by editing the number in Code.gs

## Feedback
This is my first Google Apps Script as well as my first Git.  This may be reflected in poor and/or odd choices in both spaces. Constructive feedback is welcomed and, of course, please advise of any issues/bugs encountered.  



