# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Operations::LoadRatingAreas, type: :transaction do
  let!(:county_zip) { create(:county_zip, zip: '12345', county_name: 'County 1') }
  let!(:subject) { described_class.new.call(file) }

  context 'succesful' do
    let(:file) { Rails.root.join('spec/test_data/rating_areas.xlsx') }

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'creates new rating area' do
      expect(Locations::RatingArea.all.size).not_to eq 0
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Successfully created/updated 1 Rating Area records'
    end
  end

  context 'failure' do
    let(:file) { Rails.root.join('spec/test_data/invalid_rating_areas.xlsx') }

    it 'is failure' do
      expect(subject.failure?).to be true
    end

    it 'does not create new county zip' do
      expect(Locations::RatingArea.all.size).to eq 0
    end

    it 'returns failure message' do
      expect(subject.failure[:message]).to match 'Failed to Create Rating Area record'
    end
  end
end
