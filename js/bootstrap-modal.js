/*!
* bootstrap-modal.js
* https://github.com/pcameron-/bootstrap-modal
* Patrick Cameron (www.pcameron.com)
*/

(function ($) {
  "use strict";

  if (!$.bootstrap) {
    $.bootstrap = function () {
    };
  }

  var templates = {
    dialog:
    '<div class="modal fade" tabindex="-1" role="dialog">' +
    '<div class="modal-dialog">' +
    '<div class="modal-content">' +
    '<div class="modal-body">' +
    '</div>' +
    '<div class="modal-footer">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>',
    header:
    '<div class="modal-header">' +
    '<h4 class="modal-title"></h4>' +
    '</div>',
    closeButton: {
      header:
      '<button type="button" class="close" data-dismiss="modal">' +
      '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>' +
      '</button>',
      footer: '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
    },
    clearfix: '<div class="clearfix"></div>',
    ajaxErrorMessage: '<div class="alert alert-danger">{0}</div>'
  };

  var BootstrapModal = function (options) {
    var self = this;
    self.options = $.extend(true, {}, BootstrapModal.DEFAULTS, typeof options == 'object' && options);

    self.$dialog = $(templates.dialog);
    self.$modalContent = self.$dialog.find('.modal-content');
    self.$modalBody = self.$dialog.find('.modal-body');
    self.$modalFooter = self.$dialog.find('.modal-footer');

    if (self.options.show) {
      self.$dialog.attr('data-show', self.options.show);
    }

    if (self.options.dialog) {
      if (self.options.dialog.cssClass) {
        self.$dialog.find('.modal-dialog').addClass(self.options.dialog.cssClass);
      }
    }

    if (self.options.id) {
      self.$dialog.attr('id', self.options.id);
    }

    if (!(self.options.backdrop === undefined)) {
      self.$dialog.attr('data-backdrop', self.options.backdrop);
    }

    if (self.options.keyboard) {
      self.$dialog.attr('data-keyboard', self.options.keyboard);
    }

    self.setTitle(self.options.title);

    if (self.options.body) {
      self.$modalBody.html(self.options.body);
    }

    if (self.options.footer) {
      var footer = self.options.footer;
      if (self.options.closeButton.showOnFooter) {
        footer += templates.closeButton.footer;
      }

      self.$modalFooter.html(footer);
    } else if (self.options.closeButton.showOnFooter) {
      self.$modalFooter.html(templates.closeButton.footer);
    }

    self.$dialog.on("hidden.bs.modal", function (e) {
      // ensure we don't accidentally intercept hidden events triggered
      // by children of the current dialog. We shouldn't anymore now BS
      // namespaces its events; but still worth doing
      if (e.target === this) {
        self.$dialog.remove();
      }
    });

    self.$dialog.on("shown.bs.modal", function (e) {
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
      backdrop: false
    },
    closeButton: {
      showOnHeader: true,
      showOnFooter: true
    }
  };

  BootstrapModal.prototype.refresh = function () {
    var self = this;

    if (self.options.url) {
      self.showSpinner();

      $.ajax({
        url: self.options.url,
        type: self.options.ajax.type,
        cache: self.options.ajax.cache,
        data: self.options.data
      }).always(function () {
        self.hideSpinner();
        self.$dialog.trigger('completed.ajax.bs.modal');
      }).fail(function (jqXHR, textStatus, errorThrown) {
        self.$modalBody.html(templates.ajaxErrorMessage.replace('{0}', errorThrown));
        self.$dialog.trigger('failed.ajax.bs.modal', errorThrown);
      }).done(function (data) {
        if (data == "") {
          self.$modalBody.html(templates.ajaxErrorMessage.replace('{0}', 'No data has been returned.'));
        } else {
          self.$modalBody.html(data);
        }
        self.$dialog.trigger('success.ajax.bs.modal');
      });
    }
  };

  BootstrapModal.prototype.showSpinner = function () {
    // TODO
    return this;
  };

  BootstrapModal.prototype.hideSpinner = function () {
    // TODO
    return this;
  };

  BootstrapModal.prototype.show = function () {
    this.$dialog.modal('show');
    return this;
  };

  BootstrapModal.prototype.hide = function () {
    this.$dialog.modal('hide');
    return this;
  };

  BootstrapModal.prototype.element = function () {
    return this.$dialog;
  };

  BootstrapModal.prototype.setTitle = function (title) {
    var self = this;
    // Remove the prior modal header and add fresh version from the template.
    self.$dialog.find('.modal-header').remove();
    if (title) {
      self.$dialog.find('.modal-content').prepend(templates.header);
      if (self.options.closeButton.showOnHeader) {
        self.$dialog.find('.modal-header').prepend(templates.closeButton.header);
      }
      self.$dialog.find('.modal-title').html(title);
    } else if (self.options.closeButton.showOnHeader) {
      self.$dialog.find('.modal-content').prepend(templates.header);
      var $modalHeader = self.$dialog.find('.modal-header');
      $modalHeader.prepend(templates.closeButton.header);
      $modalHeader.append(templates.clearfix);
      self.$dialog.find('.modal-title').remove();
    }

    return this;
  };

  // PUBLIC METHODS
  // =================

  $.bootstrap.configureModalDefaults = function (options) {
    BootstrapModal.DEFAULTS = $.extend({}, BootstrapModal.DEFAULTS, typeof options == 'object' && options);
  };

  $.bootstrap.findModal = function (selector) {
    return $(selector).data('pc.bs.modal');
  };

  $.bootstrap.modal = function (options) {
    return new BootstrapModal(options);
  };

  $.bootstrap.modal.alert = function (message, callback) {
    return (new BootstrapModal({
      title: 'Alert',
      body: message,
      footer: '<button class="btn btn-primary" data-dismiss="modal">OK</button>',
      backdrop: BootstrapModal.DEFAULTS.alert.backdrop,
      closeButton: {
        showOnFooter: false
      }
    }))
    .show()
    .element()
    .on('click', 'button[data-dismiss="modal"]', function () {
      if ($.isFunction(callback)) {
        callback();
      }
    });
  };

  // DATA-API
  // =================

  $(document).on('click.bs.modal.data-api', '[data-toggle="bs.modal"]', function (e) {
    var $this = $(this);
    var options = $this.data();

    e.preventDefault();

    $.bootstrap.modal(options).show();
  });
})(jQuery);
