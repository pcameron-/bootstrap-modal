# Modal
## Usage
[Bootstrap Modal Reference](http://getbootstrap.com/javascript/#modals)

### Via data attributes

### Via JavaScript
```javascript
$.bootstrap.modal(options);
```

### Options
| Name | Type | Default | Description |
|------|------|---------|-------------|
| id | string |  | d
| title | string |  | d
| body | string |  | d
| footer | string |  | d
| ajax.type | string | get | d
| ajax.cache | boolean | false | d
| a | b | c | d

### Methods
#### .modal.alert(message, callback)
```javascript
$.bootstrap.modal.alert('Test message', function() {
  alert('Alert was closed');
});
```

### Events
| Event Type | Description |
|------------|-------------|
| ajax.completed.bs.modal | jQuery ajax method completed.
| ajax.failed.bs.modal | jQuery ajax failed to return data.
| ajax.success.bs.modal | jQuery ajax successfully returned data.

# Alert
A wrapper/helper around bootstrap-modal for ease of use.

## Usage

### Via JavaScript
Open an alert dialog with a single line of JavaScript.

```javascript
$.bootstrap.modal.alert('Test message', function() {
  alert('Alert was closed');
});
```
