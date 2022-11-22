# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Operations::LoadRates do
  let(:xml_files) { Dir.glob(File.join(Rails.root, 'spec/test_data/rates', '*.xml')) }
  context 'succesful' do
    let!(:subject) do
      Operations::LoadRates.new.call(xml_files: xml_files)
    end

    it 'should be success' do
      expect(subject.success?).to eq true
    end

    it 'should return success message' do
      expect(subject.success[:message]).to eq 'Rates Succesfully Loaded'
    end
  end
end
