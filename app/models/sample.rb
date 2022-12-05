# frozen_string_literal: true

# Sample Class?
class Sample
  include Mongoid::Document
  include Mongoid::Timestamps
  field :message, type: String
end
