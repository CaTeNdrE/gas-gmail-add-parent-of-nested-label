# gas-gmail-add-parent-of-nested-label

Google Action Script that searches Gmail for emails labeled with a nested user label and applies the parent label if missing.

The intent of this script is to create a Gmail search experience more akin to a directory search. 

Gmail's custom user labels can be nested below one another and Gmail displays labels in the menu in a way that closely mimics a computer's directory structure. Unlike a search on a computer though, Gmail does not have the option of including sub-labels without specifically adding them all one by one.

My preferred search within labels would by default 'include' rather than 'exclude' labels nested below the label I search (descendcents).

     ------------
     Example Menu
     ------------
     Sent
     All Mail 
     Spam
     Drafts
     foo 
        > bar
             > toto
        > not
        > some
     dot       
    ------------   

Note in the example menu that the Gmail User Label 'foo' has 4 descendents (3 children & 1 grandchild):
  
     3 Children:   'bar' ('foo-bar'), 'not' (foo-not'), and 'some' (foo-some')
     1 Grandchild: 'toto' ('foo-bar-toto') 

     'bar' is the parent of 'toto' in addition to being a child of 'foo'  
     'toto' is a child of 'bar' in addition to being a grandchild of 'foo'
     'bar' , 'not', and 'some' are all sibblings
     

If you don't apply parent labels to emails labeled with their descendents, a search in label 'foo' that also includes its descendents ('bar', 'not', 'some', and 'toto') would look something like:

          'label:foo' OR 'label:foo-bar OR label:foo-bar-toto OR label:foo-not OR label:foo-some'
                 
     or   'label:({foo foo-bar foo-bar-toto foo-not foo-some})'
               
     or   'label:(foo || foo-bar || foo-bar-toto || foo-not || foo-some)'
   
This script enables using 'label:foo' to do that same search, which is my preferred approach.  

      
### Contributing

This is my first Google Apop Script and also my first Git which is likely reflected in odd and/or choices in both spaces.

Constructive feedback is welcomed and of course please advise of any issues/bugs encountered.  
