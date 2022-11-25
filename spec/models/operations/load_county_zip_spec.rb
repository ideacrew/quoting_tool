# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadCountyZip, type: :transaction do
  let!(:subject) { described_class.new.call(file) }

  context 'succesful' do
    let(:file) { Rails.root.join('spec/test_data/zip_counties.xlsx') }

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new county zip' do
      expect(Locations::CountyZip.all.size).not_to eq 0
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Successfully created 5 County Zip records'
    end
  end

  context 'failures' do
    let(:file) { Rails.root.join('spec/test_data/zip_counties_invalid.xlsx') }

    it 'returns failure message' do
      expect(subject.failure[:message]).to eq 'Zip/County headers not found when loading County Zip'
    end

    it 'does not create new service county zip' do
      expect(Locations::CountyZip.all.size).to eq 0
    end
  end
end
