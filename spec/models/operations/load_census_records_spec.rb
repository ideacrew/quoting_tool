# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadCensusRecords, type: :transaction do
  input = ActionDispatch::Http::UploadedFile.new(filename: 'roster.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', tempfile: File.new("#{Rails.root}/spec/test_data/roster.xlsx"))

  let!(:subject) { Operations::LoadCensusRecords.new.call(input) }

  context 'succesful' do
    it 'should be success' do
      expect(subject.success?).to eq true
    end
  end
end
