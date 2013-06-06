/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["util", "ui", "jquery", "windowing", "templates", "templating", "session"], function (util, ui, $, windowing, templates, templating, session) {
  var assert = util.assert;
  var walkthrough = util.Module("walkthrough");
  var onHideAll = null;
  var container = null;

  var slides = null;

  walkthrough.start = function (doneCallback) {
    if (! container) {
      container = $(templates.walkthrough);
      container.hide();
      ui.container.append(container);
      slides = container.find(".towtruck-walkthrough-slide");
      slides.hide();
      var progress = $("#towtruck-walkthrough-progress");
      slides.each(function (index) {
        var bullet = templating.sub("walkthrough-slide-progress");
        progress.append(bullet);
        bullet.click(function () {
          show(index);
        });
      });
      container.find("#towtruck-walkthrough-previous").click(previous);
      container.find("#towtruck-walkthrough-next").click(next);
      session.emit("new-element", container);
    }
    onHideAll = doneCallback;
    show(0);
    windowing.show(container);
  };

  function show(index) {
    slides.hide();
    $(slides[index]).show();
    var bullets = container.find("#towtruck-walkthrough-progress .towtruck-walkthrough-slide-progress");
    bullets.removeClass("towtruck-active");
    $(bullets[index]).addClass("towtruck-active");
  }

  function previous() {
    var index = getIndex();
    index--;
    if (index < 0) {
      index = 0;
    }
    show(index);
  }

  function next() {
    var index = getIndex();
    index++;
    if (index >= slides.length) {
      index = slides.length-1;
    }
    show(index);
  }

  function getIndex() {
    var active = slides.filter(":visible");
    if (! active.length) {
      return 0;
    }
    for (var i=0; i<slides.length; i++) {
      if (slides[i] == active[0]) {
        return i;
      }
    }
    return 0;
  }

  walkthrough.stop = function () {
    windowing.hide(container);
    if (onHideAll) {
      onHideAll();
      onHideAll = null;
    }
  };

  session.on("hide-window", function () {
    if (onHideAll) {
      onHideAll();
      onHideAll = null;
    }
  });

  return walkthrough;
});
