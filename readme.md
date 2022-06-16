Express service to parse html, get some metadata, and try to guess the main and secondary colors, just pass a website or a mail.

It is slow because it does not only extract the `head` of a page, but also the CSS, etc.
  
## Some obvious limitations
- does not work on some websites that seem to protect themselves against bots/scrappers (leboncoin.fr)
- the colors extractor is obviously not always right

## Why
I wanted to:
- try some basic scrapping
- get a logo and some more information about users/domains when I needed for my app
- try RapidAPI and understand how they limit and monetized APIs
