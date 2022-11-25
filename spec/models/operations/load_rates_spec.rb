# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Operations::LoadRates do
  let(:xml_files) { Dir.glob(File.join(Rails.root, 'spec/test_data/rates', '*.xml')) }

  context 'succesful' do
    let!(:subject) do
      described_class.new.call(xml_files)
    end

    it 'is success' do
      expect(subject.success?).to be true
    end

    it 'returns success message' do
      expect(subject.success[:message]).to eq 'Rates Succesfully Loaded'
    end
  end
end
