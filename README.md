# Structure
They are two servers http.js and xmpp.js respectively serving, well, the http and xmpp bot.
You can run both of them at the same time with running server.js

if you want to improve or add more commands, it's in the command/cmd.*.js file that the magic happen.

# Configuration

create a config/conf.js file containing a
{
 "user": "botname@domain.org",
 "password": "topsecret",
 "server": "xmpp.example.org",
 "port": "5222",
}

# TODO
## Testing
We need unit tests. They are quite a few solutions for testing node projects but we don't have any experience in any of them. We would love to have some advice about it.

## Better commands (dialog)
To be really useful, the bot has to dialog with the user, eg. in case of error, instead of stopping, providing useful suggestions to fix.

eg: 
> start
< start expert the task id or the name of the task. What do you want to start?
< 0 First item in the todo
< 1 Second task
< ...
< 8 the last task
< Type a number between 0 an 8

Without testing, will soon be a mess.

## Interface with a CRM/Invoice
We are working with civicrm in trunk, not sure how to make it flexible


