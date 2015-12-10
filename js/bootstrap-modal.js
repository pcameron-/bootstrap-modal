/*
 * bootstrap-modal.js
 * https://github.com/pcameron-/bootstrap-modal
 * Patrick Cameron (www.pcameron.com)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('bootstrap-modal.js requires jQuery');
}

if (typeof jQuery.fn.modal === 'undefined') {
  throw new Error('bootstrap-modal.js requires Bootstrap JavaScript.');
}

(function($) {
  "use strict";

  if (!$.bootstrap) {
    $.bootstrap = function() {};
  }

  var BootstrapModal = function(options) {
    var self = this;
    self.options = $.extend(true, {}, BootstrapModal.DEFAULTS, typeof options == 'object' && options);

    self.$dialog = $(self.options.templates.modal);
    self.$modalContent = self.$dialog.find('.modal-content');
    self.$modalBody = self.$dialog.find('.modal-body');
    self.$modalFooter = self.$dialog.find('.modal-footer');

    if (self.options.show) {
      self.$dialog.attr('data-show', self.options.show);
    }

    if (self.options.size) {
      if (self.options.size in self.options.sizeMap) {
        self.$dialog.find('.modal-dialog').addClass(self.options.sizeMap[self.options.size]);
      }
    }

    if (self.options.id) {
      self.$dialog.attr('id', self.options.id);
    }

    if (self.options.backdrop !== undefined) {
      self.$dialog.attr('data-backdrop', self.options.backdrop);
    }

    if (typeof self.options.keyboard === 'boolean') {
      self.$dialog.attr('data-keyboard', self.options.keyboard);
    }

    self.setTitle(self.options.title);
    self.setBody(self.options.body);
    self.setFooter(self.options.footer);

    self.$dialog.on("hidden.bs.modal", function(e) {
      // ensure we don't accidentally intercept hidden events triggered
      // by children of the current dialog. We shouldn't anymore now BS
      // namespaces its events; but still worth doing
      if (e.target === this) {
        self.$dialog.remove();
      }
    });

    self.$dialog.on("shown.bs.modal", function(e) {
      self.refresh();
    });

    self.$dialog.data('pc.bs.modal', self);
  };

  BootstrapModal.DEFAULTS = {
    ajax: {
      type: 'get',
      cache: false
    },
    alert: {
      footer: '<button class="btn btn-primary" data-dismiss="modal">OK</button>',
      title: 'Alert',
      backdrop: false
    },
    closeButton: {
      showOnHeader: true,
      showOnFooter: true
    },
    confirm: {
      backdrop: 'static',
      cancelButton: {
        text: 'Cancel',
        cssClass: 'btn btn-default'
      },
      okayButton: {
        text: 'OK',
        cssClass: 'btn btn-primary'
      }
    },
    notificationPlacement: 'top',
    sizeMap: {
      large: 'modal-lg',
      small: 'modal-sm'
    },
    templates: {
      modal: '<div class="modal fade" tabindex="-1" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content"><div class="modal-body"></div><div class="modal-footer"></div></div>' +
        '</div>' +
        '</div>',
      header: '<div class="modal-header"><h4 class="modal-title"></h4></div>',
      closeButton: {
        header: '<button type="button" class="close" data-dismiss="modal">' +
          '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
          '</button>',
        footer: '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
      },
      clearfix: '<div class="clearfix"></div>',
      ajaxErrorMessage: '<div class="alert alert-danger">{0}</div>'
    }
  };

  BootstrapModal.prototype.refresh = function() {
    var self = this;

    if (self.options.url) {
      self.showSpinner();

      $.ajax({
        url: self.options.url,
        type: self.options.ajax.type,
        cache: self.options.ajax.cache,
        data: self.options.data
      }).always(function() {
        self.hideSpinner();
        self.$dialog.trigger('completed.ajax.bs.modal');
      }).fail(function(jqXHR, textStatus, errorThrown) {
        self.$modalBody.html(self.options.templates.ajaxErrorMessage.replace('{0}', errorThrown));
        self.$dialog.trigger('failed.ajax.bs.modal', errorThrown);
      }).done(function(data) {
        if (data === '') {
          self.$modalBody.html(self.options.templates.ajaxErrorMessage.replace('{0}', 'No data has been returned.'));
        } else {
          self.$modalBody.html(data);
        }
        self.$dialog.trigger('success.ajax.bs.modal');
      });
    }
  };

  BootstrapModal.prototype.showSpinner = function() {
    // TODO
    return this;
  };

  BootstrapModal.prototype.hideSpinner = function() {
    // TODO
    return this;
  };

  BootstrapModal.prototype.show = function() {
    this.$dialog.modal('show');
    return this;
  };

  BootstrapModal.prototype.hide = function() {
    this.$dialog.modal('hide');
    return this;
  };

  BootstrapModal.prototype.element = function() {
    return this.$dialog;
  };

  BootstrapModal.prototype.clearNotification = function(content) {
    var self = this;
    if (content) {
      // TODO: Implement bottom and (top and bottom) placement modes.
      switch (self.options.notificationPlacement) {
        default: self.$dialog.find('.modal-body-top-notification').clear();
        break;
      }
    }

    return self;
  };

  BootstrapModal.prototype.setNotification = function(content) {
    var self = this;
    if (content) {
      // TODO: Implement bottom and (top and bottom) placement modes.
      switch (self.options.notificationPlacement) {
        default: var $topNotification = self.$dialog.find('.modal-body-top-notification');
        if ($topNotification.length < 1) {
          self.$modalBody.prepend('<div class="modal-body-top-notification">' + content + '</div>');
        } else {
          $topNotification.html(content);
        }
        break;
      }
    }

    return self;
  };

  BootstrapModal.prototype.prependToBody = function(content) {
    var self = this;
    if (content) {
      self.$dialog.find('.modal-body').prepend(content);
    }

    return self;
  };

  BootstrapModal.prototype.hideBody = function() {
    var self = this;
    self.$dialog.find('.modal-body').hide();
    return self;
  };

  BootstrapModal.prototype.setBody = function(content) {
    var self = this;
    if (content) {
      self.$dialog.find('.modal-body').html(content);
    }

    return self;
  };

  BootstrapModal.prototype.setTitle = function(title) {
    var self = this;
    // Remove the prior modal header and add fresh version from the template.
    self.$dialog.find('.modal-header').remove();
    if (title) {
      self.$dialog.find('.modal-content').prepend(self.options.templates.header);
      if (self.options.closeButton.showOnHeader) {
        self.$dialog.find('.modal-header').prepend(self.options.templates.closeButton.header);
      }
      self.$dialog.find('.modal-title').html(title);
    } else if (self.options.closeButton.showOnHeader) {
      self.$dialog.find('.modal-content').prepend(self.options.templates.header);
      var $modalHeader = self.$dialog.find('.modal-header');
      $modalHeader.prepend(self.options.templates.closeButton.header);
      $modalHeader.append(self.options.templates.clearfix);
      self.$dialog.find('.modal-title').remove();
    }

    return self;
  };

  BootstrapModal.prototype.setFooter = function(content) {
    var self = this;
    var buttons = self.buildButtons();
    self.$modalFooter.empty();

    if (content) {
      self.$modalFooter.append(content);
      self.$modalFooter.append(buttons);

      if (self.options.closeButton.showOnFooter) {
        self.$modalFooter.append(self.options.templates.closeButton.footer);
      }
    } else if (self.options.closeButton.showOnFooter) {
      self.$modalFooter.append(buttons);
      self.$modalFooter.append(self.options.templates.closeButton.footer);
    } else {
      self.$modalFooter.append(buttons);
    }

    return self;
  };

  BootstrapModal.prototype.buildButtons = function() {
    var self = this;
    var buttons = [];
    if (self.options.buttons) {
      self.options.buttons.forEach(function(obj) {
        var $button = $('<button>').addClass(obj.cssClass).html(obj.label);
        if (obj.attrs) {
          for (var key in obj.attrs) {
            if (obj.attrs.hasOwnProperty(key)) {
              $button.attr(key, obj.attrs[key]);
            }
          }
        }
        if (obj.closeModal) {
          $button.attr('data-dismiss', 'modal');
        }
        if ($.isFunction(obj.clickCallback)) {
          self.$dialog.on("shown.bs.modal", function(e) {
            $button.on('click', function(e) {
              obj.clickCallback.call(this, e);
            });
          });
        }
        buttons.push($button);
      });
    }

    return buttons;
  };

  // PUBLIC METHODS
  // =================

  $.bootstrap.configureModalDefaults = function(options) {
    BootstrapModal.DEFAULTS = $.extend(true, {}, BootstrapModal.DEFAULTS, typeof options == 'object' && options);
  };

  $.bootstrap.findModal = function(selector) {
    return $(selector).data('pc.bs.modal');
  };

  $.bootstrap.modal = function(options) {
    return new BootstrapModal(options);
  };

  $.bootstrap.modal.alert = function(message, callback) {
    return (new BootstrapModal({
        title: BootstrapModal.DEFAULTS.alert.title,
        body: message,
        footer: BootstrapModal.DEFAULTS.alert.footer,
        backdrop: BootstrapModal.DEFAULTS.alert.backdrop,
        closeButton: {
          showOnFooter: false
        }
      }))
      .show()
      .element()
      .on('hidden.bs.modal', function() {
        if ($.isFunction(callback)) {
          callback();
        }
      });
  };

  $.bootstrap.modal.confirm = function(obj, callback) {
    var options = {};
    if (typeof obj === 'object') {
      options = obj;
    } else if (typeof obj === 'string') {
      options.title = obj;
    }

    var defaultOptions = {
      buttons: [{
        label: BootstrapModal.DEFAULTS.confirm.cancelButton.text,
        cssClass: BootstrapModal.DEFAULTS.confirm.cancelButton.cssClass,
        clickCallback: function() {
          if ($.isFunction(callback)) {
            callback(false);
          }
        },
        closeModal: true
      }, {
        label: BootstrapModal.DEFAULTS.confirm.okayButton.text,
        cssClass: BootstrapModal.DEFAULTS.confirm.okayButton.cssClass,
        clickCallback: function() {
          if ($.isFunction(callback)) {
            callback(true);
          }
        },
        closeModal: true
      }],
      backdrop: BootstrapModal.DEFAULTS.confirm.backdrop,
      closeButton: {
        showOnFooter: false,
        showOnHeader: false
      },
      keyboard: false
    };

    var mergedOptions = $.extend(true, {}, defaultOptions, options);
    var modal = (new BootstrapModal(mergedOptions)).show();
    if (!mergedOptions.body || mergedOptions.body === '') {
      modal.hideBody();
    }

    return modal;
  };

  // DATA-API
  // =================

  $(document).on('click.bs.modal.data-api', '[data-toggle="bs.modal"]', function(e) {
    var $this = $(this);
    var options = $this.data();

    e.preventDefault();

    $.bootstrap.modal(options).show();
  });
})(jQuery);
