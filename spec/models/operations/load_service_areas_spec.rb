# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadServiceAreas, type: :transaction do
  let!(:county_zip) { create(:county_zip, zip: '12345', county_name: 'County 1') }
  let!(:subject) { described_class.new.call(file) }

  context 'succesful' do
    let(:file) { Rails.root.join('spec/test_data/service_areas.xlsx') }

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new service area' do
      expect(Locations::ServiceArea.all.size).not_to eq 0
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Successfully created/updated 18 Service Area records'
    end
  end
end
