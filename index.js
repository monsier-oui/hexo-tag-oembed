'use strict';

var requestpromise = require('request-promise');
var querystring = require('querystring');
var ogs = require('open-graph-scraper');

hexo.extend.tag.register(
  'oembed',
  function(args) {
    if (!args) return;
    var opts = {
      url: args[0],
      format: 'json'
    };

    var endpoint = '';
    if (opts.url.match(/^http(s?):\/\/twitter\.com\/(.*)\/(status|statuses)\/(\d+)$/)) {
      endpoint = 'https://publish.twitter.com/oembed';
      opts['lang'] = hexo.config.language;
    } else if (opts.url.match(/^http(s?):\/\/www\.youtube\.com\/watch\?v=[-\w]{11,}$/)) {
      endpoint = 'http://www.youtube.com/oembed';
    } else if (opts.url.match(/^http(s?):\/\/vimeo\.com\/\d+$/)) {
      endpoint = 'http://vimeo.com/api/oembed.json';
    } else if (opts.url.match(/^http(s?):\/\/www\.flickr\.com\/photos\/[-@\w]+\/\d+\/$/)) {
      endpoint = 'http://www.flickr.com/services/oembed/';
    } else if (opts.url.match(/^http(s?):\/\/(www\.)?instagram\.com\/p\/\w+\/$/)) {
      endpoint = 'http://api.instagram.com/oembed';
    } else if (opts.url.match(/^http(s?):\/\/gyazo\.com\/\w*$/)) {
      endpoint = 'https://api.gyazo.com/api/oembed/';
    } else if (opts.url.match(/^http(s?):\/\/codepen\.io\/[\/\w]*$/)) {
      endpoint = 'http://codepen.io/api/oembed';
    } else if (opts.url.match(/^http(s?):\/\/runkit\.com\/[\/\w]*$/)) {
      endpoint = 'https://embed.runkit.com/oembed';
    }

    if(endpoint.length > 0){
      var getRequest = function(uri) {
        return requestpromise({
          uri: uri,
          transform2xxOnly: true,
          transform: function(body) {
            return JSON.parse(body);
          }
        });
      };
      
      var req = endpoint + '?' + querystring.stringify(opts);
      return getRequest(req)
        .then(function(data) {
          switch (data.type) {
            case 'photo':
            var alt = data.title ? ' alt="' + data.title + '"' : '';
            return '<a href="' + opts['url'] + '"><img src="' + data.url + '"' + alt + '></a>';
            break;
            case 'video':
            case 'rich':
            return data.html;
            break;
            default:
            return;
            break;
          }
        })
        .catch(function(err) {
          console.error(err.statusCode + ': ' + req);
        });
    }else{
      return ogs({ 'url': opts.url })
        .then(function(results){
          var data = results.data;
          var image = null;
          if(hexo.config.oembed){
            if(hexo.config.oembed.noimage){
              if(data.ogImage && data.ogImage.length > 0){
                image = Array.isArray(data.ogImage) ? data.ogImage[0].url : data.ogImage.url;
                image = image.startsWith('http') ? image : null;
              }
              if(!image && hexo.config.oembed.noimage) image = hexo.config.oembed.noimage;
            }
          }
          
          return '<figure class="hexo-tag-oembed">'+
            (image ? '<img src="'+image+'">' : '')+
            '<figcaption>'+
            '<a href="'+(data.ogUrl ? data.ogUrl : opts.url)+'" class="hexo-tag-oembed__title" target="_blank" rel="noopener">'+data.ogTitle+'</a>'+
            (data.ogDescription ? '<span class="hexo-tag-oembed__description">'+data.ogDescription+'</span>' : '')+
            '</figcaption>'+
            '</figure>';
        })
        .catch(function(error){
          console.error(error);
        });
    }
  },
  {
    async: true
  }
);
