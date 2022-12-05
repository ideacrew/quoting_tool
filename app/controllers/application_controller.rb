# frozen_string_literal: true

require 'application_responder'
# application controller
class ApplicationController < ActionController::API
  self.responder = ApplicationResponder
  respond_to :html
end
