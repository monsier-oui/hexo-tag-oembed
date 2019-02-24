# hexo-tag-oembed
oEmbed tag plugin for Hexo.

* Twitter
* Youtube
* Vimeo
* Flickr
* Instagram
* Gyazo
* Codepen
* RunKik

## Install
```
npm install hexo-tag-oembed --save
```

## Config
```_config.yml
oembed:
  noimage: {path/to/noimage.png}
```

## Usage
```
{%oembed [permalink] %}
```

## Embed RunKik

Please add the following code in the footer section of the theme:

My theme is next, so modify the _layout.swig file.

```html
<script>
window.addEventListener('message', function(e) {
  if (e.origin !== "https://runkit.com")
    return;

  try {
    var data = JSON.parse(e.data);
  } catch (e) {
    return false;
  }

  if (data.context !== 'iframe.resize') {
    return false;
  }

  var iframe = document.querySelector('iframe[src="' + data.src + '"]');

  if (!iframe) {
    return false;
  }

  if (data.height) {
    iframe.height = data.height;
  }
});
</script>
```
