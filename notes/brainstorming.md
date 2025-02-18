# Brainstorming

A problem with web applications is dealing with the distinction between front-end and back-end. 

The back-end can be written in any language. 

The front-end (at least at this point in time) must be written in JavaScript, using the Web APIs provided by browsers. 

The back-end is essentially responsible for providing the documents that make the web application run--meaning, when a client sends an HTTP request for a given resource to the server, the server replies with an HTTP response, which is, generally, just text. 

The back-end cannot interact with the document in the same way that the front-end can. There is not a browser on the back-end that allows the server to use the same DOM APIs that the front-end can use. 

In the same way, the front-end cannot directly interface with external services (such as databases) in the same way that the back-end can. 

I think these problems can be mitigated by encoding as much data as is needed directly into the HTML document, which allows the JavaScript to interact with the web page without needing to make any extra network requests. 

What does this look like?
Storing as much data as possible in the HTML
```html
<div class="calendar"
  data-px-per-minute="3"
  data-minutes-per-row="15"
  data-start-time="07:00"
  data-end-time="22:00"
>
  ...
</div>
```
And using the plain-old-DOM-APIs to access and manipulate the data as needed. 
```js
class Calendar {
  constructor(calendarEl) {
    this.calendarEl = calendarEl
  }

  get pxPerMinute() {
    // Feel free to provide some sort of default value;
    return this.calendarEl.dataset.pxPerMinute ?? 3;
  }

  set pxPerMinute(value) {
    // validate the value here...
    if (value < 1 || value > 20) {
      // Feel free to provide some type of error message here. 
      return;
    }

    this.calendarEl.dataset.pxPerMinute = value;
  }
}
```