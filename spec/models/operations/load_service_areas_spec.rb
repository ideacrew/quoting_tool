require 'rails_helper'

RSpec.describe Operations::LoadServiceAreas, type: :transaction do
  let!(:county_zip) { FactoryBot.create(:county_zip, zip: '12345', county_name: 'County 1') }
  let!(:subject) { Operations::LoadServiceAreas.new.call(file) }

  context 'succesful' do
    let(:file) { File.join(Rails.root, 'spec/test_data/service_areas.xlsx') }

    it 'should be success' do
      expect(subject.success?).to eq true
    end

    it 'should create new service area' do
      expect(Locations::ServiceArea.all.size).not_to eq 0
    end

    it 'should return success message' do
      expect(subject.success[:message]).to eq 'Successfully created/updated 18 Service Area records'
    end
  end
end
