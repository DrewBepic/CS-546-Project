# CS-546-Project
CS-546 Project

Authors:
- Andrew Baker (DrewBepic)
- Elijah Joseph (Elijahjoseph23, ejoseph11)
- Riley Stewart (rileyastewart)
- Aleksey Vinogradov (alekseyvinogradovPM)

Google Doc: https://docs.google.com/document/d/1vMipfN2svlTh9WD0XxHTStYlvAltfi0Nt3Q2NLHpaoE/edit?tab=t.0

Database layout: https://docs.google.com/document/d/1N4uxNlEhrT5tHPj6MMm4d4onbZR8HpR37sq58wfSN-o/edit?tab=t.0

Instruction to install dependencies: npm i

Instruction to populate database: npm run seed (Running this will delete all prior data in the database)

Instruction to run: npm start

Github Issues: One of our group members, Elijah Joseph, was incorrectly logged in with the wrong github account for the first part of the project. This was due to the final DevSecOps (SSW590) project that we did as a team, where Elijah has his Github in terminal
logged in as ejoseph11. He did not realize this until later on in the project, switching his account to Elijahjoseph23 when he realized. As such, if you are unable to see the ejoseph11 commits and would like to see them, please reach out to us and we can show you the commits. 

Application Walk Through: 

Core feature number is determined by the order we listed the core feature in our proposal. 

Initial Page: Gives option to login and register

Register: Only allow users to register if their email matches the format of a known school email. (Core Feature 1)

Find Items Page: First page user sees after logging in. Displays the items that other users have listed as currently available to borrow on their school campus (Core Feature 2). If there are any available items, a search bar appears, allowing you to search by name or description (Core Feature 3). 

Add Item: Page that allow user to create an item, asking the user to fill out the item's name, description, and availability. (Core Features 4 and 5). After creating an item that is "available" this item can be seen by anyone within the same school as the user (Core Feature 6). After creating an item, you will be brought to the page of that specific item, which can be accessed through the "Read More" button in User Profile. 

Individual items Page 1: Can be accessed through "Read More" in User Profile. Shows the item name, owner, description, item history, and comments  (Core Feature 10). Gives the user the ability to make a comment  (Core Feature 11). Also provides a button "Edit Item" which brings the user to the item edit page. Also allows the user to delete this item, which removes the item from everyone else's view, stopping them from being borrowed  (Core Features 9 & 19)

Item Edit Page: Allows the user to edit the name and description of the page (Core Feature 7).

Individual Items Page 2: Can be access through "Read More" in Find Items. Shows the item name, owner, description, item history  (Core Feature 10), and comments  (Core Feature 11). Gives the user the ability to make a comment or add to their Wishlist (Core Feature 24). Also has a "Request" option, which allows the user to request the item by bringing them to the Request page. If an item is already on the user's wishlist, they will not have the ability to add it again, simply seeing the message "This item is on your wishlist" instead. 

Request Page: Contains item name, owner and description. Allows the user to make an optional comment and submit a request to borrow said item to the owner  (Core Features 12 & 13). After submitting a request, user is brought to the individual request page, which contains the status of the request, the lender name, borrower name, request date, and request comment. 

User Profile: Page that displays the user's name, their school, and their current karma. Also shows the users owned items, items they are currently borrowing, and items they are currently loaning, with the owned items "Read More" button which redirects you to individual items page 1. (Core Feature 18, 21, 22). Has a button to bring you to the incoming requests and a button to bring you to outgoing requests. For items that are currently loaned, the user will see an option to complete the request, bringing them to the request page, which is the same as the previous request page but now shows the borrowers email (Core Feature 15) and gives the lender the ability to mark a request as complete (Core Feature 16). This brings you to the Karma Rate Page, which lets you rate the experience (Core Feature 17). 

Incoming Request: Shows you incoming pending requests and accepted incoming requests (Core Feature 23). Also gives you the option to accept or reject incoming pending requests (Core Features 8). After accepting a request, you are brought to the individual request page, which shows the previous request info as well as the lenders email (Core Feature 14)

Outgoing Requests: Shows you outgoing pending requests and accepted outgoing requests (Core Feature 23). 

Wish List: Contains the user's wishlist (Core Feature 20), containing the item name, owner, description, and availability. Has the "Read More" button, and gives the user the option to remove said item from their wishlist (Core Feature 24). 

Leaderboard: Contains a Karma leaderboard which shows a list of the top 10 users with the most karma. Also has a button "Karma" that brings you to a page that allows you to rate Karma for completed Requests. (Core Feature 28)

Karma Rate Page:  Can be accessed after completing a request as a lender or through the "Karma" button in the leaderboard page. Shows a list of completed requests, showing the item name, lender name, borrower name, the date requested, and allows the user to rate the transaction from 1 to 10, displaying how pleased they are with the transaction (Core Feature 25). If the user is satisfied with the request, they give a score over 5, which increases the respective party's karma score (Core Feature 26).  If the user is dissatisfied with the request, they give a score under 5, which decreases the respective party's karma score (Core Feature 27).

Log Out: Lets the user log out
