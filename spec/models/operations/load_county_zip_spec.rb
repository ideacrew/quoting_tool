require 'rails_helper'

RSpec.describe Operations::LoadCountyZip, type: :transaction do

  let!(:subject) {Operations::LoadCountyZip.new.call({state: 'MA'}, file)}

  context "succesful" do

    let(:file) {File.join(Rails.root, "spec/test_data/zip_counties.xlsx")}

    it "should be success" do
      expect(subject.success?).to eq true
    end

    it "should create new county zip" do
      expect(Locations::CountyZip.all.size).not_to eq 0
    end

    it "should return success message" do
      expect(subject.success[:message]).to eq "Successfully created 5 County Zip records"
    end
  end

  context "failures" do
    let(:file) {File.join(Rails.root, "spec/test_data/zip_counties_invalid.xlsx")}

    it "should return failure message" do
      expect(subject.failure[:message]).to eq "Zip/County headers not found when loading County Zip"
    end

    it 'should not create new service county zip' do
      expect(Locations::CountyZip.all.size).to eq 0
    end
  end
end
