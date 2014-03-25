/**
 * External Link Alert - ProBoards Plugin
 * Version 1.0.3
 * Keys Used: None
 *
 * Written by Bob Hensley (bob@bobbyhensley.com)
 *
 * Licensed under GNU General Public (GPL) Version 2
 * See http://choosealicense.com/licenses/gpl-v2/ for license details
 */

var ExternalLinkAlert = {
  forum_url: window.location.host,
  s: pb.plugin.get('external_link_alert').settings,

  init: function () {
    $('.message > a').each(function () {
      $(this).click(function (e) {
        if (!this.is_acceptable($(this).attr('href'))) {
          e.preventDefault();
          this.prevent_redirect($(this).attr('href'));
        }
      });
    });
  },

  is_acceptable: function (url) {
    var safe_domains  = this.s.safe_domains.replace(/http:\/\/|www\./ig, '').split("\n"),
      safe_users      = this.s.never_alert_users,
      safe_groups     = this.s.never_alert_groups;

    // Get rid of junk we don't care about...
    url = url.replace(/http:\/\/|www\./i, '');

    // Is the user whitelisted?
    if ($.inArray(pb.data('user').id.toString(), safe_users) > -1) {
      return true;
    }

    // Is the given domain whitelisted?
    var matches = url.match(/([a-z0-9]+\.)*([a-z0-9][a-z0-9-]+\.[a-z]{2,6})/);
    if (matches.length > 0 && ($.inArray(matches[0], safe_domains) > -1 || matches[0] === this.forum_url)) {
      return true;
    }

    // Are they in a whitelisted group?
    for (var i = 0; i < pb.data('user').group_ids.length; i++) {
      if($.inArray(pb.data('user').group_ids[i].toString(), safe_groups) > -1) {
        console.log('Group whitelisted; pass.');
        return true;
      }
    }

    return false;
  },

  prevent_redirect: function (url) {
    var msg = this.s.modal_body,
      title = this.s.modal_title;

    pb.window.confirm(msg + '<hr><em>URL: ' + url + '</em>', 
      function () { this.redirect(url) },
      { 'title': title, 'overlay': true }
    );
  },

  redirect: function (url) {
    window.open(url, '_blank');
  }
};

$(document).ready (function () {
  if (pb.data('route').name === 'thread') {
    ExternalLinkAlert.init();
  }
});