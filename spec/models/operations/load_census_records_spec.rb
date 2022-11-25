# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadCensusRecords, type: :transaction do
  let!(:county_zip) { FactoryBot.create(:county_zip, zip: '12345', county_name: 'County 1') }
  let!(:subject) { Operations::LoadCensusRecords.new.call(file) }

  context 'succesful' do
    let(:file) { File.join(Rails.root, 'spec/test_data/roster_upload_template.xlsx') }

    it 'should be success' do
      expect(subject.success?).to eq true
    end

  end
end
